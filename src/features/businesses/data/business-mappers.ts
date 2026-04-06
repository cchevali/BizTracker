import type {
  Business,
  BusinessHistoryEvent,
  BusinessNote,
  FilterPreset,
  Prisma,
} from "@/generated/prisma/client";

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

function mapBusinessBase(record: Business): BusinessListItem {
  return {
    id: record.id,
    businessName: record.businessName,
    sourceUrl: record.sourceUrl,
    category: record.category,
    subcategory: record.subcategory,
    location: record.location,
    stateCode: record.stateCode,
    askingPrice: decimalToNumber(record.askingPrice),
    revenue: decimalToNumber(record.revenue),
    sde: decimalToNumber(record.sde),
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
