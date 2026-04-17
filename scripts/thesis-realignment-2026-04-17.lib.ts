import { Prisma, type PrismaClient } from "../src/generated/prisma/client";
import {
  DealStatus,
  HistoryEventType,
  PipelineBucket,
} from "../src/generated/prisma/enums";
import { calculateBusinessScenario } from "../src/features/businesses/domain/business-scenario";
import {
  deriveAiResistanceScore,
  deriveOverallScoreFromThesis,
} from "../src/features/businesses/domain/business-score";
import {
  isPublicListingSourceUrl,
  normalizeBusinessCategory,
} from "../src/features/businesses/domain/business-source";
import { normalizeComparableValue } from "./managed-listing-batch.lib";
import {
  demotedBusinessNames,
  intentionallyUnchangedBusinessNames,
  movedOutOfDefaultActiveViewBusinessNames,
  promotedBusinessNames,
  thesisRealignmentOverrides,
  THESIS_REALIGNMENT_DATE,
  THESIS_REALIGNMENT_NOTE_HEADING,
} from "./thesis-realignment-2026-04-17.data";

type LoadedBusiness = Prisma.BusinessGetPayload<{
  include: {
    historyEvents: true;
    noteEntries: true;
  };
}>;

const changedFieldNames = [
  "category",
  "dealStatus",
  "pipelineBucket",
  "publicSourceVerified",
  "aiResistanceScore",
  "overallScore",
  "dataConfidenceScore",
  "beatsCurrentBenchmark",
  "benchmarkNotes",
  "whyItMayFit",
  "risks",
  "notes",
  "tags",
] as const;

const managedRealignmentTags = new Set([
  "watchlist",
  "comp-only",
  "source-unverified",
  "top-tier-fit",
  "promoted-fit",
  "off-thesis-comp",
  "route-comp",
  "small-scale",
  "low-confidence",
  "brother-local-best-fit",
  "capital-heavy",
  "platform-risk",
]);

export type ThesisRealignmentSummary = {
  updatedNames: string[];
  promotedNames: string[];
  demotedNames: string[];
  movedOutOfDefaultActiveViewNames: string[];
  markedUnverifiedNames: string[];
  intentionallyUnchangedNames: string[];
  pipelineCounts: {
    active: number;
    watchlist: number;
    compOnly: number;
    unverified: number;
  };
};

function toNullableNumber(value: Prisma.Decimal | number | null | undefined) {
  if (value === null || value === undefined) {
    return null;
  }

  if (value instanceof Prisma.Decimal) {
    return value.toNumber();
  }

  return value;
}

function appendUniqueSentence(value: string, sentence?: string) {
  const trimmed = value.trim();

  if (!sentence || trimmed.includes(sentence)) {
    return trimmed;
  }

  return trimmed ? `${trimmed} ${sentence}` : sentence;
}

function upsertNotesBlock(existingNotes: string | null, block: string) {
  const trimmed = existingNotes?.trim() ?? "";
  const existingIndex = trimmed.indexOf(THESIS_REALIGNMENT_NOTE_HEADING);

  if (existingIndex >= 0) {
    const prefix = trimmed.slice(0, existingIndex).trimEnd();
    return prefix ? `${prefix}\n\n${block}` : block;
  }

  return trimmed ? `${trimmed}\n\n${block}` : block;
}

function normalizeTags(
  existingTags: string[],
  bucket: PipelineBucket,
  extraTags: string[] = [],
) {
  const normalizedExisting = existingTags
    .map((tag) => tag.trim().toLowerCase())
    .filter(Boolean)
    .filter((tag) => !managedRealignmentTags.has(tag));

  const next = new Set(normalizedExisting);

  if (bucket === PipelineBucket.WATCHLIST) {
    next.add("watchlist");
  }

  if (bucket === PipelineBucket.COMP_ONLY) {
    next.add("comp-only");
  }

  if (bucket === PipelineBucket.UNVERIFIED) {
    next.add("source-unverified");
  }

  for (const tag of extraTags) {
    next.add(tag.trim().toLowerCase());
  }

  return [...next].sort();
}

function defaultWhyAppend(bucket: PipelineBucket) {
  switch (bucket) {
    case PipelineBucket.WATCHLIST:
      return "It remains worth monitoring, but now as a watchlist candidate rather than a default active contender.";
    case PipelineBucket.COMP_ONLY:
      return "It is retained mainly as a comparable or historical reference rather than as a current target.";
    case PipelineBucket.UNVERIFIED:
      return "It is retained only as an unverified reference until a real public listing source is attached.";
    default:
      return undefined;
  }
}

function defaultRisksAppend(bucket: PipelineBucket) {
  switch (bucket) {
    case PipelineBucket.WATCHLIST:
      return "The current thesis discounts it relative to cleaner brother-local / buyer-remote fits.";
    case PipelineBucket.COMP_ONLY:
      return "Even if some economics are interesting, it no longer belongs in the default active pipeline under the current thesis.";
    case PipelineBucket.UNVERIFIED:
      return "The current source is not a live public listing URL, so ranking confidence is intentionally capped.";
    default:
      return undefined;
  }
}

function getDefaultPipelineBucket(
  business: Pick<LoadedBusiness, "dealStatus">,
  publicSourceVerified: boolean,
) {
  if (!publicSourceVerified) {
    return PipelineBucket.UNVERIFIED;
  }

  if (
    business.dealStatus === DealStatus.PASSED ||
    business.dealStatus === DealStatus.CLOSED
  ) {
    return PipelineBucket.COMP_ONLY;
  }

  if (business.dealStatus === DealStatus.WATCHLIST) {
    return PipelineBucket.WATCHLIST;
  }

  return PipelineBucket.ACTIVE;
}

function buildRealignmentNoteBlock({
  business,
  nextBucket,
  nextScore,
  publicSourceVerified,
  noteReason,
}: {
  business: LoadedBusiness;
  nextBucket: PipelineBucket;
  nextScore: number | null;
  publicSourceVerified: boolean;
  noteReason: string;
}) {
  const scoreLine =
    business.overallScore === nextScore
      ? `${nextScore ?? "unknown"}`
      : `${business.overallScore ?? "unknown"} -> ${nextScore ?? "unknown"}`;

  const bucketLine =
    business.pipelineBucket === nextBucket
      ? nextBucket
      : `${business.pipelineBucket} -> ${nextBucket}`;

  const sourceLine =
    business.publicSourceVerified === publicSourceVerified
      ? publicSourceVerified
        ? "verified"
        : "unverified"
      : `${business.publicSourceVerified ? "verified" : "unverified"} -> ${
          publicSourceVerified ? "verified" : "unverified"
        }`;

  return [
    THESIS_REALIGNMENT_NOTE_HEADING,
    `- Pipeline bucket: ${bucketLine}`,
    `- Public source status: ${sourceLine}`,
    `- Overall score: ${scoreLine}`,
    `- Rationale: ${noteReason}`,
  ].join("\n");
}

async function loadBusinesses(prisma: PrismaClient) {
  return prisma.business.findMany({
    include: {
      historyEvents: {
        orderBy: {
          createdAt: "asc",
        },
      },
      noteEntries: {
        orderBy: {
          createdAt: "asc",
        },
      },
    },
  });
}

function getChangedFields(
  business: LoadedBusiness,
  data: Prisma.BusinessUpdateInput,
) {
  const existingRecord = business as Record<string, unknown>;
  const nextRecord = data as Record<string, unknown>;

  return changedFieldNames.filter((fieldName) => {
    if (!(fieldName in nextRecord)) {
      return false;
    }

    return (
      normalizeComparableValue(existingRecord[fieldName]) !==
      normalizeComparableValue(nextRecord[fieldName])
    );
  });
}

export async function runThesisRealignment20260417(
  prisma: PrismaClient,
): Promise<ThesisRealignmentSummary> {
  const businesses = await loadBusinesses(prisma);
  const updatedNames: string[] = [];

  for (const business of businesses) {
    const override = thesisRealignmentOverrides[business.businessName];
    const publicSourceVerified = isPublicListingSourceUrl(business.sourceUrl);
    const nextBucket =
      override?.pipelineBucket ??
      getDefaultPipelineBucket(business, publicSourceVerified);
    const askingPrice = toNullableNumber(business.askingPrice);
    const sde = toNullableNumber(business.sde);
    const scenario = calculateBusinessScenario({
      askingPrice,
      sde,
    });
    const aiResistanceScore = deriveAiResistanceScore({
      businessName: business.businessName,
      category: business.category,
      subcategory: business.subcategory,
      summary: business.summary,
      whyItMayFit: business.whyItMayFit,
      risks: business.risks,
      notes: business.notes,
    });
    const derivedScore = deriveOverallScoreFromThesis({
      ownerDependenceRating: business.ownerDependenceRating,
      recurringRevenueRating: business.recurringRevenueRating,
      transferabilityRating: business.transferabilityRating,
      scheduleControlFitRating: business.scheduleControlFitRating,
      brotherOperatorFitRating: business.brotherOperatorFitRating,
      financeabilityRating: business.financeabilityRating,
      operatorSkillDependency: business.operatorSkillDependency,
      licenseDependency: business.licenseDependency,
      afterHoursBurden: business.afterHoursBurden,
      capexRisk: business.capexRisk,
      staleListingRisk: business.staleListingRisk,
      keyPersonRisk: business.keyPersonRisk,
      aiResistanceScore,
      keepDayJobFit: business.keepDayJobFit,
      quitDayJobFit: business.quitDayJobFit,
      dataConfidenceScore:
        override?.dataConfidenceScore ??
        (publicSourceVerified ? business.dataConfidenceScore : 2),
      opsManagerExists: business.opsManagerExists,
      conservativeCashAfterBrother: scenario.conservativeCashAfterBrother,
      cashToCloseHigh: scenario.cashToCloseHigh,
      sde,
      publicSourceVerified,
    });
    const nextOverallScore = override?.overallScore ?? derivedScore ?? business.overallScore;
    const noteReason =
      override?.noteReason ??
      (nextBucket === PipelineBucket.UNVERIFIED
        ? "Moved out of the default active view because the current source is not a real public listing page."
        : nextBucket === PipelineBucket.COMP_ONLY
          ? "Retained mainly as a comparable or historical reference rather than as a current default-pipeline target."
          : nextBucket === PipelineBucket.WATCHLIST
            ? "Demoted into the watchlist so the default active pipeline stays focused on the best current fits."
            : "Reconfirmed as an active contender under the revised brother-local / buyer-remote thesis.");
    const materialNoteChange =
      Boolean(override) ||
      business.pipelineBucket !== nextBucket ||
      business.publicSourceVerified !== publicSourceVerified;
    const noteBlock = buildRealignmentNoteBlock({
      business,
      nextBucket,
      nextScore: nextOverallScore,
      publicSourceVerified,
      noteReason,
    });
    const notes = materialNoteChange
      ? upsertNotesBlock(business.notes, noteBlock)
      : business.notes;
    const whyItMayFit = appendUniqueSentence(
      business.whyItMayFit,
      override?.whyItMayFitAppend ?? (materialNoteChange ? defaultWhyAppend(nextBucket) : undefined),
    );
    const risks = appendUniqueSentence(
      business.risks,
      override?.risksAppend ?? (materialNoteChange ? defaultRisksAppend(nextBucket) : undefined),
    );
    const nextTags = normalizeTags(business.tags, nextBucket, override?.tagAdditions);
    const nextDealStatus = override?.dealStatus ?? business.dealStatus;
    const nextCategory = normalizeBusinessCategory(business.category);
    const nextDataConfidenceScore =
      override?.dataConfidenceScore ??
      (publicSourceVerified ? business.dataConfidenceScore : 2);
    const data: Prisma.BusinessUpdateInput = {
      category: nextCategory,
      dealStatus: nextDealStatus,
      pipelineBucket: nextBucket,
      publicSourceVerified,
      aiResistanceScore,
      overallScore: nextOverallScore,
      dataConfidenceScore: nextDataConfidenceScore,
      beatsCurrentBenchmark:
        override?.beatsCurrentBenchmark ?? business.beatsCurrentBenchmark,
      benchmarkNotes: override?.benchmarkNotes ?? business.benchmarkNotes,
      whyItMayFit,
      risks,
      notes,
      tags: nextTags,
    };
    const changedFields = getChangedFields(business, data);

    if (changedFields.length === 0) {
      continue;
    }

    const historyEvents: Prisma.BusinessHistoryEventCreateWithoutBusinessInput[] = [
      {
        eventType: HistoryEventType.UPDATED,
        description:
          "Applied the 2026-04-17 conservative thesis realignment for pipeline bucket, source quality, and scoring.",
        metadata: {
          realignmentDate: THESIS_REALIGNMENT_DATE,
          changedFields,
          noteReason,
        },
      },
    ];

    if (business.dealStatus !== nextDealStatus) {
      historyEvents.push({
        eventType: HistoryEventType.STATUS_CHANGED,
        description: `Status changed from ${business.dealStatus} to ${nextDealStatus} during thesis realignment.`,
        metadata: {
          realignmentDate: THESIS_REALIGNMENT_DATE,
          from: business.dealStatus,
          to: nextDealStatus,
        },
      });
    }

    const hasRealignmentNoteEntry = business.noteEntries.some((entry) =>
      entry.body.includes(THESIS_REALIGNMENT_NOTE_HEADING),
    );

    await prisma.business.update({
      where: {
        id: business.id,
      },
      data: {
        ...data,
        historyEvents: {
          create: historyEvents,
        },
        noteEntries: hasRealignmentNoteEntry
          ? undefined
          : {
              create: {
                body: noteBlock,
              },
            },
      },
    });

    updatedNames.push(business.businessName);
  }

  const refreshedBusinesses = await prisma.business.findMany({
    select: {
      businessName: true,
      pipelineBucket: true,
    },
  });

  return {
    updatedNames,
    promotedNames: promotedBusinessNames.filter((name) => updatedNames.includes(name)),
    demotedNames: demotedBusinessNames.filter((name) => updatedNames.includes(name)),
    movedOutOfDefaultActiveViewNames: movedOutOfDefaultActiveViewBusinessNames.filter((name) =>
      refreshedBusinesses.some(
        (business) =>
          business.businessName === name && business.pipelineBucket !== PipelineBucket.ACTIVE,
      ),
    ),
    markedUnverifiedNames: refreshedBusinesses
      .filter((business) => business.pipelineBucket === PipelineBucket.UNVERIFIED)
      .map((business) => business.businessName)
      .sort(),
    intentionallyUnchangedNames: intentionallyUnchangedBusinessNames.filter(
      (name) => !updatedNames.includes(name),
    ),
    pipelineCounts: {
      active: refreshedBusinesses.filter(
        (business) => business.pipelineBucket === PipelineBucket.ACTIVE,
      ).length,
      watchlist: refreshedBusinesses.filter(
        (business) => business.pipelineBucket === PipelineBucket.WATCHLIST,
      ).length,
      compOnly: refreshedBusinesses.filter(
        (business) => business.pipelineBucket === PipelineBucket.COMP_ONLY,
      ).length,
      unverified: refreshedBusinesses.filter(
        (business) => business.pipelineBucket === PipelineBucket.UNVERIFIED,
      ).length,
    },
  };
}
