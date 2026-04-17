import type {
  Business,
  BusinessHistoryEvent,
  BusinessNote,
  FilterPreset,
  Prisma,
} from "@/generated/prisma/client";

import { calculateBusinessScenario } from "../domain/business-scenario";
import {
  parseBusinessFilters,
  serializeBusinessFilters,
} from "../domain/business.filters";
import type {
  BusinessDetail,
  BusinessHistoryView,
  BusinessListItem,
  BusinessNoteView,
  FilterPresetView,
} from "../domain/business.types";

function decimalToNumber(value: Prisma.Decimal | null) {
  return value ? value.toNumber() : null;
}

function dateToIso(value: Date | null) {
  return value ? value.toISOString() : null;
}

function mapBusinessBase(record: Business): BusinessListItem {
  const askingPrice = decimalToNumber(record.askingPrice);
  const sde = decimalToNumber(record.sde);

  return {
    id: record.id,
    businessName: record.businessName,
    sourceUrl: record.sourceUrl,
    category: record.category,
    subcategory: record.subcategory,
    location: record.location,
    stateCode: record.stateCode,
    askingPrice,
    revenue: decimalToNumber(record.revenue),
    sde,
    ebitda: decimalToNumber(record.ebitda),
    employees: record.employees,
    summary: record.summary,
    overallScore: record.overallScore,
    tags: record.tags,
    dealStatus: record.dealStatus,
    createdAt: record.createdAt.toISOString(),
    updatedAt: record.updatedAt.toISOString(),
    listingSource: record.listingSource,
    brokerFirm: record.brokerFirm,
    pipelineBucket: record.pipelineBucket,
    publicSourceVerified: record.publicSourceVerified,
    aiResistanceScore: record.aiResistanceScore,
    financeabilityRating: record.financeabilityRating,
    sellerFinancingAvailable: record.sellerFinancingAvailable,
    operatorSkillDependency: record.operatorSkillDependency,
    licenseDependency: record.licenseDependency,
    afterHoursBurden: record.afterHoursBurden,
    capexRisk: record.capexRisk,
    regretIfWrongScore: record.regretIfWrongScore,
    dataConfidenceScore: record.dataConfidenceScore,
    keepDayJobFit: record.keepDayJobFit,
    quitDayJobFit: record.quitDayJobFit,
    primaryUseCase: record.primaryUseCase,
    beatsCurrentBenchmark: record.beatsCurrentBenchmark,
    freshnessVerifiedAt: dateToIso(record.freshnessVerifiedAt),
    staleListingRisk: record.staleListingRisk,
    homeBasedFlag: record.homeBasedFlag,
    recurringRevenuePercent: decimalToNumber(record.recurringRevenuePercent),
    ownerHoursClaimed: record.ownerHoursClaimed,
    opsManagerExists: record.opsManagerExists,
    keyPersonRisk: record.keyPersonRisk,
    ...calculateBusinessScenario({
      askingPrice,
      sde,
    }),
  };
}

export function mapBusinessListRecord(record: Business): BusinessListItem {
  return mapBusinessBase(record);
}

function mapNoteRecord(record: BusinessNote): BusinessNoteView {
  return {
    id: record.id,
    body: record.body,
    createdAt: record.createdAt.toISOString(),
    updatedAt: record.updatedAt.toISOString(),
  };
}

function mapHistoryRecord(record: BusinessHistoryEvent): BusinessHistoryView {
  return {
    id: record.id,
    eventType: record.eventType,
    description: record.description,
    createdAt: record.createdAt.toISOString(),
    metadata:
      record.metadata && typeof record.metadata === "object"
        ? (record.metadata as Record<string, unknown>)
        : null,
  };
}

export function mapBusinessDetailRecord(
  record: Business & {
    noteEntries: BusinessNote[];
    historyEvents: BusinessHistoryEvent[];
  },
): BusinessDetail {
  return {
    ...mapBusinessBase(record),
    whyItMayFit: record.whyItMayFit,
    risks: record.risks,
    brokerName: record.brokerName,
    notes: record.notes,
    ownerDependenceRating: record.ownerDependenceRating,
    recurringRevenueRating: record.recurringRevenueRating,
    transferabilityRating: record.transferabilityRating,
    scheduleControlFitRating: record.scheduleControlFitRating,
    brotherOperatorFitRating: record.brotherOperatorFitRating,
    benchmarkNotes: record.benchmarkNotes,
    sellerFinancingNotes: record.sellerFinancingNotes,
    cashToCloseNotes: record.cashToCloseNotes,
    noteEntries: record.noteEntries.map(mapNoteRecord),
    historyEvents: record.historyEvents.map(mapHistoryRecord),
  };
}

export function mapFilterPresetRecord(record: FilterPreset): FilterPresetView {
  const rawQuery =
    record.query && typeof record.query === "object"
      ? (record.query as Record<string, string | string[] | undefined>)
      : {};

  return {
    id: record.id,
    name: record.name,
    query: serializeBusinessFilters(parseBusinessFilters(rawQuery)),
    createdAt: record.createdAt.toISOString(),
    updatedAt: record.updatedAt.toISOString(),
  };
}
