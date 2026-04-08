import {
  Prisma,
  type Business,
} from "@/generated/prisma/client";
import { HistoryEventType } from "@/generated/prisma/enums";
import type { DealStatus } from "@/generated/prisma/enums";

import { prisma } from "@/lib/prisma";
import { uniqueStrings } from "@/lib/utils";

import {
  mapBusinessDetailRecord,
  mapBusinessListRecord,
  mapFilterPresetRecord,
} from "./business-mappers";
import type { BusinessFormInput } from "../domain/business.schemas";
import {
  activeDealStatuses,
  type BusinessDetail,
  type BusinessFilters,
  type BusinessListItem,
  type DashboardData,
  type DashboardSummary,
  type FilterOptionSet,
} from "../domain/business.types";

const defaultOrderBy: Prisma.BusinessOrderByWithRelationInput[] = [
  { updatedAt: "desc" },
  { createdAt: "desc" },
];

function buildWhereInput(filters: BusinessFilters): Prisma.BusinessWhereInput {
  const andClauses: Prisma.BusinessWhereInput[] = [];

  if (filters.q) {
    andClauses.push({
      OR: [
        { businessName: { contains: filters.q, mode: "insensitive" } },
        { category: { contains: filters.q, mode: "insensitive" } },
        { subcategory: { contains: filters.q, mode: "insensitive" } },
        { location: { contains: filters.q, mode: "insensitive" } },
        { summary: { contains: filters.q, mode: "insensitive" } },
        { whyItMayFit: { contains: filters.q, mode: "insensitive" } },
        { risks: { contains: filters.q, mode: "insensitive" } },
        { brokerName: { contains: filters.q, mode: "insensitive" } },
        { brokerFirm: { contains: filters.q, mode: "insensitive" } },
        { listingSource: { contains: filters.q, mode: "insensitive" } },
        { sourceUrl: { contains: filters.q, mode: "insensitive" } },
        { benchmarkNotes: { contains: filters.q, mode: "insensitive" } },
        {
          sellerFinancingNotes: { contains: filters.q, mode: "insensitive" },
        },
        { cashToCloseNotes: { contains: filters.q, mode: "insensitive" } },
      ],
    });
  }

  if (filters.state) {
    andClauses.push({
      stateCode: {
        equals: filters.state,
      },
    });
  }

  if (filters.category) {
    andClauses.push({
      category: {
        equals: filters.category,
      },
    });
  }

  if (filters.status) {
    andClauses.push({
      dealStatus: filters.status,
    });
  } else {
    andClauses.push({
      dealStatus: {
        in: activeDealStatuses,
      },
    });
  }

  if (filters.tags.length > 0) {
    andClauses.push({
      tags: {
        hasSome: filters.tags,
      },
    });
  }

  if (filters.minAsk !== undefined || filters.maxAsk !== undefined) {
    andClauses.push({
      askingPrice: {
        gte: filters.minAsk,
        lte: filters.maxAsk,
      },
    });
  }

  if (filters.minSde !== undefined || filters.maxSde !== undefined) {
    andClauses.push({
      sde: {
        gte: filters.minSde,
        lte: filters.maxSde,
      },
    });
  }

  if (filters.minScore !== undefined || filters.maxScore !== undefined) {
    andClauses.push({
      overallScore: {
        gte: filters.minScore,
        lte: filters.maxScore,
      },
    });
  }

  if (filters.primaryUseCase) {
    andClauses.push({
      primaryUseCase: filters.primaryUseCase,
    });
  }

  if (filters.minKeepDayJobFit !== undefined) {
    andClauses.push({
      keepDayJobFit: {
        gte: filters.minKeepDayJobFit,
      },
    });
  }

  if (filters.minQuitDayJobFit !== undefined) {
    andClauses.push({
      quitDayJobFit: {
        gte: filters.minQuitDayJobFit,
      },
    });
  }

  if (filters.minAiResistanceScore !== undefined) {
    andClauses.push({
      aiResistanceScore: {
        gte: filters.minAiResistanceScore,
      },
    });
  }

  if (filters.minFinanceabilityRating !== undefined) {
    andClauses.push({
      financeabilityRating: {
        gte: filters.minFinanceabilityRating,
      },
    });
  }

  if (filters.sellerFinancingAvailable !== undefined) {
    andClauses.push({
      sellerFinancingAvailable: filters.sellerFinancingAvailable,
    });
  }

  if (filters.homeBasedFlag !== undefined) {
    andClauses.push({
      homeBasedFlag: filters.homeBasedFlag,
    });
  }

  if (filters.opsManagerExists !== undefined) {
    andClauses.push({
      opsManagerExists: filters.opsManagerExists,
    });
  }

  if (filters.maxStaleListingRisk !== undefined) {
    andClauses.push({
      staleListingRisk: {
        lte: filters.maxStaleListingRisk,
      },
    });
  }

  if (filters.minDataConfidenceScore !== undefined) {
    andClauses.push({
      dataConfidenceScore: {
        gte: filters.minDataConfidenceScore,
      },
    });
  }

  if (filters.beatsCurrentBenchmark !== undefined) {
    andClauses.push({
      beatsCurrentBenchmark: filters.beatsCurrentBenchmark,
    });
  }

  return andClauses.length > 0 ? { AND: andClauses } : {};
}

function buildFilterOptions(
  records: Array<{ category: string; stateCode: string | null; tags: string[] }>,
): FilterOptionSet {
  return {
    categories: uniqueStrings(
      records.map((record) => record.category).sort((a, b) => a.localeCompare(b)),
    ),
    states: uniqueStrings(
      records
        .map((record) => record.stateCode)
        .filter((value): value is string => Boolean(value))
        .sort((a, b) => a.localeCompare(b)),
    ),
    tags: uniqueStrings(
      records.flatMap((record) => record.tags).sort((a, b) => a.localeCompare(b)),
    ),
  };
}

function buildDashboardSummary(businesses: DashboardData["businesses"]): DashboardSummary {
  const scoredBusinesses = businesses.filter(
    (business) => business.overallScore !== null,
  );
  const sdeValues = businesses
    .map((business) => business.sde)
    .filter((value): value is number => value !== null);

  return {
    total: businesses.length,
    averageScore:
      scoredBusinesses.length > 0
        ? Math.round(
            scoredBusinesses.reduce(
              (sum, business) => sum + (business.overallScore ?? 0),
              0,
            ) / scoredBusinesses.length,
          )
        : null,
    active: businesses.filter((business) =>
      activeDealStatuses.includes(business.dealStatus),
    ).length,
    watchlist: businesses.filter((business) => business.dealStatus === "WATCHLIST")
      .length,
    passed: businesses.filter((business) => business.dealStatus === "PASSED")
      .length,
    highestSde: sdeValues.length > 0 ? Math.max(...sdeValues) : null,
  };
}

function compareNullableNumber(
  left: number | null,
  right: number | null,
  direction: "asc" | "desc",
) {
  if (left === null && right === null) {
    return 0;
  }

  if (left === null) {
    return 1;
  }

  if (right === null) {
    return -1;
  }

  return direction === "asc" ? left - right : right - left;
}

function compareDateStrings(left: string, right: string, direction: "asc" | "desc") {
  const leftTime = new Date(left).getTime();
  const rightTime = new Date(right).getTime();
  return direction === "asc" ? leftTime - rightTime : rightTime - leftTime;
}

function sortBusinesses<T extends BusinessListItem | BusinessDetail>(
  businesses: T[],
  sort: BusinessFilters["sort"],
) {
  return [...businesses].sort((left, right) => {
    let comparison = 0;

    switch (sort) {
      case "newest":
        comparison = compareDateStrings(left.createdAt, right.createdAt, "desc");
        break;
      case "ask-price":
        comparison = compareNullableNumber(
          left.askingPrice,
          right.askingPrice,
          "asc",
        );
        break;
      case "sde":
        comparison = compareNullableNumber(left.sde, right.sde, "desc");
        break;
      case "score":
        comparison = compareNullableNumber(
          left.overallScore,
          right.overallScore,
          "desc",
        );
        break;
      case "location":
        comparison =
          (left.stateCode ?? "").localeCompare(right.stateCode ?? "") ||
          left.location.localeCompare(right.location);
        break;
      case "keep-day-job-fit":
        comparison = compareNullableNumber(
          left.keepDayJobFit,
          right.keepDayJobFit,
          "desc",
        );
        break;
      case "quit-day-job-fit":
        comparison = compareNullableNumber(
          left.quitDayJobFit,
          right.quitDayJobFit,
          "desc",
        );
        break;
      case "ai-resistance":
        comparison = compareNullableNumber(
          left.aiResistanceScore,
          right.aiResistanceScore,
          "desc",
        );
        break;
      case "financeability":
        comparison = compareNullableNumber(
          left.financeabilityRating,
          right.financeabilityRating,
          "desc",
        );
        break;
      case "cash-to-close-high":
        comparison = compareNullableNumber(
          left.cashToCloseHigh,
          right.cashToCloseHigh,
          "asc",
        );
        break;
      case "conservative-cash-after-brother":
        comparison = compareNullableNumber(
          left.conservativeCashAfterBrother,
          right.conservativeCashAfterBrother,
          "desc",
        );
        break;
      case "stale-listing-risk":
        comparison = compareNullableNumber(
          left.staleListingRisk,
          right.staleListingRisk,
          "asc",
        );
        break;
      case "data-confidence":
        comparison = compareNullableNumber(
          left.dataConfidenceScore,
          right.dataConfidenceScore,
          "desc",
        );
        break;
      case "updated":
      default:
        comparison = compareDateStrings(left.updatedAt, right.updatedAt, "desc");
        break;
    }

    if (comparison !== 0) {
      return comparison;
    }

    return compareDateStrings(left.updatedAt, right.updatedAt, "desc");
  });
}

function applyDerivedFilters<T extends BusinessListItem | BusinessDetail>(
  businesses: T[],
  filters: BusinessFilters,
) {
  return businesses.filter((business) => {
    if (
      filters.maxCashToCloseHigh !== undefined &&
      (business.cashToCloseHigh === null ||
        business.cashToCloseHigh > filters.maxCashToCloseHigh)
    ) {
      return false;
    }

    if (
      filters.minConservativeCashAfterBrother !== undefined &&
      (business.conservativeCashAfterBrother === null ||
        business.conservativeCashAfterBrother <
          filters.minConservativeCashAfterBrother)
    ) {
      return false;
    }

    return true;
  });
}

export async function getBusinessesDashboard(
  filters: BusinessFilters,
): Promise<DashboardData> {
  const where = buildWhereInput(filters);

  const [businesses, filterSource, presets] = await Promise.all([
    prisma.business.findMany({
      where,
      orderBy: defaultOrderBy,
    }),
    prisma.business.findMany({
      select: {
        category: true,
        stateCode: true,
        tags: true,
      },
    }),
    prisma.filterPreset.findMany({
      orderBy: {
        updatedAt: "desc",
      },
    }),
  ]);

  const mappedBusinesses = sortBusinesses(
    applyDerivedFilters(businesses.map(mapBusinessListRecord), filters),
    filters.sort,
  );

  return {
    filters,
    businesses: mappedBusinesses,
    filterOptions: buildFilterOptions(filterSource),
    presets: presets.map(mapFilterPresetRecord),
    summary: buildDashboardSummary(mappedBusinesses),
  };
}

export async function getBusinessById(id: string): Promise<BusinessDetail | null> {
  const business = await prisma.business.findUnique({
    where: { id },
    include: {
      noteEntries: {
        orderBy: {
          createdAt: "desc",
        },
      },
      historyEvents: {
        orderBy: {
          createdAt: "desc",
        },
      },
    },
  });

  if (!business) {
    return null;
  }

  return mapBusinessDetailRecord(business);
}

export async function getBusinessesForExport(
  filters: BusinessFilters,
): Promise<BusinessDetail[]> {
  const businesses = await prisma.business.findMany({
    where: buildWhereInput(filters),
    orderBy: defaultOrderBy,
    include: {
      noteEntries: {
        orderBy: {
          createdAt: "asc",
        },
      },
      historyEvents: {
        orderBy: {
          createdAt: "asc",
        },
      },
    },
  });

  return sortBusinesses(
    applyDerivedFilters(businesses.map(mapBusinessDetailRecord), filters),
    filters.sort,
  );
}

function buildBusinessData(input: BusinessFormInput) {
  return {
    businessName: input.businessName,
    sourceUrl: input.sourceUrl,
    category: input.category,
    subcategory: input.subcategory,
    location: input.location,
    stateCode: input.stateCode,
    askingPrice: input.askingPrice,
    revenue: input.revenue,
    sde: input.sde,
    ebitda: input.ebitda,
    employees: input.employees,
    summary: input.summary,
    whyItMayFit: input.whyItMayFit,
    risks: input.risks,
    brokerName: input.brokerName,
    brokerFirm: input.brokerFirm,
    listingSource: input.listingSource,
    dealStatus: input.dealStatus,
    ownerDependenceRating: input.ownerDependenceRating,
    recurringRevenueRating: input.recurringRevenueRating,
    transferabilityRating: input.transferabilityRating,
    scheduleControlFitRating: input.scheduleControlFitRating,
    brotherOperatorFitRating: input.brotherOperatorFitRating,
    aiResistanceScore: input.aiResistanceScore,
    keepDayJobFit: input.keepDayJobFit,
    quitDayJobFit: input.quitDayJobFit,
    primaryUseCase: input.primaryUseCase,
    beatsCurrentBenchmark: input.beatsCurrentBenchmark,
    benchmarkNotes: input.benchmarkNotes,
    financeabilityRating: input.financeabilityRating,
    sellerFinancingAvailable: input.sellerFinancingAvailable,
    sellerFinancingNotes: input.sellerFinancingNotes,
    operatorSkillDependency: input.operatorSkillDependency,
    licenseDependency: input.licenseDependency,
    afterHoursBurden: input.afterHoursBurden,
    capexRisk: input.capexRisk,
    regretIfWrongScore: input.regretIfWrongScore,
    dataConfidenceScore: input.dataConfidenceScore,
    staleListingRisk: input.staleListingRisk,
    keyPersonRisk: input.keyPersonRisk,
    homeBasedFlag: input.homeBasedFlag,
    recurringRevenuePercent: input.recurringRevenuePercent,
    ownerHoursClaimed: input.ownerHoursClaimed,
    opsManagerExists: input.opsManagerExists,
    freshnessVerifiedAt: input.freshnessVerifiedAt,
    cashToCloseNotes: input.cashToCloseNotes,
    overallScore: input.overallScore,
    notes: input.notes,
    tags: input.tags,
  };
}

function decimalToNumber(value: Prisma.Decimal | null) {
  return value ? value.toNumber() : undefined;
}

function dateToIso(value: Date | null) {
  return value ? value.toISOString() : undefined;
}

type BusinessFormComparisonTarget = Business;

function normalizeExistingBusiness(business: BusinessFormComparisonTarget) {
  return {
    businessName: business.businessName,
    sourceUrl: business.sourceUrl ?? undefined,
    category: business.category,
    subcategory: business.subcategory ?? undefined,
    location: business.location,
    stateCode: business.stateCode ?? undefined,
    askingPrice: decimalToNumber(business.askingPrice),
    revenue: decimalToNumber(business.revenue),
    sde: decimalToNumber(business.sde),
    ebitda: decimalToNumber(business.ebitda),
    employees: business.employees ?? undefined,
    summary: business.summary,
    whyItMayFit: business.whyItMayFit,
    risks: business.risks,
    brokerName: business.brokerName ?? undefined,
    brokerFirm: business.brokerFirm ?? undefined,
    listingSource: business.listingSource ?? undefined,
    dealStatus: business.dealStatus,
    ownerDependenceRating: business.ownerDependenceRating ?? undefined,
    recurringRevenueRating: business.recurringRevenueRating ?? undefined,
    transferabilityRating: business.transferabilityRating ?? undefined,
    scheduleControlFitRating: business.scheduleControlFitRating ?? undefined,
    brotherOperatorFitRating: business.brotherOperatorFitRating ?? undefined,
    aiResistanceScore: business.aiResistanceScore ?? undefined,
    keepDayJobFit: business.keepDayJobFit ?? undefined,
    quitDayJobFit: business.quitDayJobFit ?? undefined,
    primaryUseCase: business.primaryUseCase ?? undefined,
    beatsCurrentBenchmark: business.beatsCurrentBenchmark ?? undefined,
    benchmarkNotes: business.benchmarkNotes ?? undefined,
    financeabilityRating: business.financeabilityRating ?? undefined,
    sellerFinancingAvailable: business.sellerFinancingAvailable ?? undefined,
    sellerFinancingNotes: business.sellerFinancingNotes ?? undefined,
    operatorSkillDependency: business.operatorSkillDependency ?? undefined,
    licenseDependency: business.licenseDependency ?? undefined,
    afterHoursBurden: business.afterHoursBurden ?? undefined,
    capexRisk: business.capexRisk ?? undefined,
    regretIfWrongScore: business.regretIfWrongScore ?? undefined,
    dataConfidenceScore: business.dataConfidenceScore ?? undefined,
    staleListingRisk: business.staleListingRisk ?? undefined,
    keyPersonRisk: business.keyPersonRisk ?? undefined,
    homeBasedFlag: business.homeBasedFlag ?? undefined,
    recurringRevenuePercent: decimalToNumber(business.recurringRevenuePercent),
    ownerHoursClaimed: business.ownerHoursClaimed ?? undefined,
    opsManagerExists: business.opsManagerExists ?? undefined,
    freshnessVerifiedAt: dateToIso(business.freshnessVerifiedAt),
    cashToCloseNotes: business.cashToCloseNotes ?? undefined,
    overallScore: business.overallScore ?? undefined,
    notes: business.notes ?? undefined,
    tags: [...business.tags].sort(),
  };
}

function normalizeInput(input: BusinessFormInput) {
  return {
    ...input,
    freshnessVerifiedAt: input.freshnessVerifiedAt?.toISOString(),
    tags: [...input.tags].sort(),
  };
}

const changedFieldLabels: Record<keyof ReturnType<typeof normalizeInput>, string> = {
  businessName: "business name",
  sourceUrl: "source URL",
  category: "category",
  subcategory: "subcategory",
  location: "location",
  stateCode: "state",
  askingPrice: "asking price",
  revenue: "revenue",
  sde: "SDE",
  ebitda: "EBITDA",
  employees: "employees",
  summary: "summary",
  whyItMayFit: "fit rationale",
  risks: "risks",
  brokerName: "broker name",
  brokerFirm: "broker firm",
  listingSource: "listing source",
  dealStatus: "deal status",
  ownerDependenceRating: "owner dependence rating",
  recurringRevenueRating: "recurring revenue rating",
  transferabilityRating: "transferability rating",
  scheduleControlFitRating: "schedule-control fit rating",
  brotherOperatorFitRating: "brother-operator fit rating",
  aiResistanceScore: "AI resistance score",
  keepDayJobFit: "keep-day-job fit",
  quitDayJobFit: "quit-day-job fit",
  primaryUseCase: "primary use case",
  beatsCurrentBenchmark: "benchmark winner flag",
  benchmarkNotes: "benchmark notes",
  financeabilityRating: "financeability rating",
  sellerFinancingAvailable: "seller financing availability",
  sellerFinancingNotes: "seller financing notes",
  operatorSkillDependency: "operator skill dependency",
  licenseDependency: "license dependency",
  afterHoursBurden: "after-hours burden",
  capexRisk: "capex risk",
  regretIfWrongScore: "regret-if-wrong score",
  dataConfidenceScore: "data confidence score",
  staleListingRisk: "stale listing risk",
  keyPersonRisk: "key-person risk",
  homeBasedFlag: "home-based flag",
  recurringRevenuePercent: "recurring revenue percent",
  ownerHoursClaimed: "owner hours claimed",
  opsManagerExists: "ops manager flag",
  freshnessVerifiedAt: "freshness verification time",
  cashToCloseNotes: "cash-to-close notes",
  overallScore: "overall score",
  notes: "notes",
  tags: "tags",
};

function arraysEqual(left: string[], right: string[]) {
  return left.length === right.length && left.every((value, index) => value === right[index]);
}

function describeChangedFields(
  existing: BusinessFormComparisonTarget,
  input: BusinessFormInput,
) {
  const current = normalizeExistingBusiness(existing);
  const next = normalizeInput(input);

  return (Object.keys(next) as Array<keyof typeof next>).flatMap((key) => {
    if (Array.isArray(next[key])) {
      return arraysEqual(next[key], current[key] as string[])
        ? []
        : [changedFieldLabels[key]];
    }

    return current[key] === next[key] ? [] : [changedFieldLabels[key]];
  });
}

function summarizeChangedFields(changedFields: string[]) {
  if (changedFields.length <= 5) {
    return `Updated ${changedFields.join(", ")}.`;
  }

  return `Updated ${changedFields.slice(0, 5).join(", ")}, and ${changedFields.length - 5} more fields.`;
}

export async function createBusiness(input: BusinessFormInput) {
  return prisma.business.create({
    data: {
      ...buildBusinessData(input),
      historyEvents: {
        create: {
          eventType: HistoryEventType.CREATED,
          description: "Business record created.",
        },
      },
    },
  });
}

export async function updateBusiness(id: string, input: BusinessFormInput) {
  const existing = await prisma.business.findUnique({
    where: { id },
  });

  if (!existing) {
    return null;
  }

  const changedFields = describeChangedFields(existing, input);

  if (changedFields.length === 0) {
    return {
      business: existing,
      changedFields,
    };
  }

  const historyEvents: Prisma.BusinessHistoryEventCreateWithoutBusinessInput[] = [
    {
      eventType: HistoryEventType.UPDATED,
      description: summarizeChangedFields(changedFields),
      metadata: {
        changedFields,
      },
    },
  ];

  if (existing.dealStatus !== input.dealStatus) {
    historyEvents.push({
      eventType: HistoryEventType.STATUS_CHANGED,
      description: `Status changed from ${existing.dealStatus} to ${input.dealStatus}.`,
      metadata: {
        from: existing.dealStatus,
        to: input.dealStatus,
      },
    });
  }

  const updated = await prisma.business.update({
    where: { id },
    data: {
      ...buildBusinessData(input),
      historyEvents: {
        create: historyEvents,
      },
    },
  });

  return {
    business: updated,
    changedFields,
  };
}

export async function addBusinessNote(id: string, body: string) {
  const [note] = await prisma.$transaction([
    prisma.businessNote.create({
      data: {
        businessId: id,
        body,
      },
    }),
    prisma.businessHistoryEvent.create({
      data: {
        businessId: id,
        eventType: HistoryEventType.NOTE_ADDED,
        description: body.length > 120 ? `${body.slice(0, 117)}...` : body,
      },
    }),
  ]);

  return note;
}

export async function updateBusinessStatus(id: string, dealStatus: DealStatus) {
  const existing = await prisma.business.findUnique({
    where: { id },
    select: {
      id: true,
      dealStatus: true,
    },
  });

  if (!existing) {
    return null;
  }

  if (existing.dealStatus === dealStatus) {
    return existing;
  }

  return prisma.business.update({
    where: { id },
    data: {
      dealStatus,
      historyEvents: {
        create: {
          eventType: HistoryEventType.STATUS_CHANGED,
          description: `Status changed from ${existing.dealStatus} to ${dealStatus}.`,
          metadata: {
            from: existing.dealStatus,
            to: dealStatus,
          },
        },
      },
    },
  });
}

export async function saveFilterPreset(name: string, query: Record<string, string>) {
  return prisma.filterPreset.upsert({
    where: { name },
    update: {
      query,
    },
    create: {
      name,
      query,
    },
  });
}

export async function deleteFilterPreset(id: string) {
  return prisma.filterPreset.delete({
    where: { id },
  });
}
