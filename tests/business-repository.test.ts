import { Prisma } from "@/generated/prisma/client";
import { HistoryEventType } from "@/generated/prisma/enums";
import type { BusinessFormInput } from "@/features/businesses/domain/business.schemas";
import { beforeEach, describe, expect, it, vi } from "vitest";

const prismaMock = vi.hoisted(() => ({
  business: {
    create: vi.fn(),
    findMany: vi.fn(),
    findUnique: vi.fn(),
    update: vi.fn(),
  },
  businessNote: {
    create: vi.fn(),
  },
  businessHistoryEvent: {
    create: vi.fn(),
  },
  filterPreset: {
    upsert: vi.fn(),
    delete: vi.fn(),
  },
  $transaction: vi.fn(),
}));

vi.mock("@/lib/prisma", () => ({
  prisma: prismaMock,
}));

import {
  addBusinessNote,
  createBusiness,
  deleteFilterPreset,
  getBusinessesForExport,
  saveFilterPreset,
  updateBusiness,
  updateBusinessStatus,
} from "@/features/businesses/data/business-repository";

function createBusinessInput(
  overrides: Partial<BusinessFormInput> = {},
): BusinessFormInput {
  return {
    businessName: "Anchor Point Bookkeeping",
    sourceUrl: "https://chat.openai.com/c/bookkeeping-deal",
    category: "Professional Services",
    subcategory: "Bookkeeping",
    location: "Tampa, FL",
    stateCode: "FL",
    askingPrice: 860000,
    revenue: 640000,
    sde: 248000,
    ebitda: 214000,
    employees: 6,
    summary: "Subscription-heavy bookkeeping firm with stable client retention.",
    whyItMayFit: "High recurring revenue and a remote-friendly service model.",
    risks: "Referral concentration and workflow cleanup are still concerns.",
    brokerName: "Jon Velasquez",
    brokerFirm: "Gulf Coast M&A",
    listingSource: "Referral",
    dealStatus: "WATCHLIST",
    ownerDependenceRating: 3,
    recurringRevenueRating: 5,
    transferabilityRating: 4,
    scheduleControlFitRating: 5,
    brotherOperatorFitRating: 3,
    overallScore: 82,
    notes: "Potentially strong fit for a first services acquisition.",
    tags: ["b2b", "bookkeeping", "subscription"],
    ...overrides,
  };
}

function createExistingBusiness(overrides: Record<string, unknown> = {}) {
  return {
    id: "business-1",
    businessName: "Anchor Point Bookkeeping",
    sourceUrl: "https://chat.openai.com/c/bookkeeping-deal",
    category: "Professional Services",
    subcategory: "Bookkeeping",
    location: "Tampa, FL",
    stateCode: "FL",
    askingPrice: new Prisma.Decimal(860000),
    revenue: new Prisma.Decimal(640000),
    sde: new Prisma.Decimal(248000),
    ebitda: new Prisma.Decimal(214000),
    employees: 6,
    summary: "Subscription-heavy bookkeeping firm with stable client retention.",
    whyItMayFit: "High recurring revenue and a remote-friendly service model.",
    risks: "Referral concentration and workflow cleanup are still concerns.",
    brokerName: "Jon Velasquez",
    brokerFirm: "Gulf Coast M&A",
    listingSource: "Referral",
    dealStatus: "WATCHLIST",
    ownerDependenceRating: 3,
    recurringRevenueRating: 5,
    transferabilityRating: 4,
    scheduleControlFitRating: 5,
    brotherOperatorFitRating: 3,
    overallScore: 82,
    notes: "Potentially strong fit for a first services acquisition.",
    tags: ["bookkeeping", "subscription", "b2b"],
    createdAt: new Date("2026-04-05T00:00:00.000Z"),
    updatedAt: new Date("2026-04-05T00:00:00.000Z"),
    ...overrides,
  };
}

describe("business-repository mutations", () => {
  beforeEach(() => {
    prismaMock.business.create.mockReset();
    prismaMock.business.findMany.mockReset();
    prismaMock.business.findUnique.mockReset();
    prismaMock.business.update.mockReset();
    prismaMock.businessNote.create.mockReset();
    prismaMock.businessHistoryEvent.create.mockReset();
    prismaMock.filterPreset.upsert.mockReset();
    prismaMock.filterPreset.delete.mockReset();
    prismaMock.$transaction.mockReset();
  });

  it("creates a business with an initial history event", async () => {
    const input = createBusinessInput();
    prismaMock.business.create.mockResolvedValue({ id: "business-1" });

    await createBusiness(input);

    expect(prismaMock.business.create).toHaveBeenCalledWith({
      data: {
        ...input,
        historyEvents: {
          create: {
            eventType: HistoryEventType.CREATED,
            description: "Business record created.",
          },
        },
      },
    });
  });

  it("returns null when updating a missing business", async () => {
    prismaMock.business.findUnique.mockResolvedValue(null);

    await expect(updateBusiness("missing-id", createBusinessInput())).resolves.toBe(
      null,
    );
    expect(prismaMock.business.update).not.toHaveBeenCalled();
  });

  it("loads export data with related notes and history in filter order", async () => {
    prismaMock.business.findMany.mockResolvedValue([
      {
        ...createExistingBusiness(),
        noteEntries: [
          {
            id: "note-1",
            businessId: "business-1",
            body: "Export note",
            createdAt: new Date("2026-04-05T01:00:00.000Z"),
            updatedAt: new Date("2026-04-05T01:05:00.000Z"),
          },
        ],
        historyEvents: [
          {
            id: "history-1",
            businessId: "business-1",
            eventType: "CREATED",
            description: "Business record created.",
            metadata: null,
            createdAt: new Date("2026-04-05T00:00:00.000Z"),
          },
        ],
      },
    ]);

    const result = await getBusinessesForExport({
      q: "",
      view: "table",
      sort: "score",
      state: "",
      category: "",
      minAsk: undefined,
      maxAsk: undefined,
      minSde: undefined,
      maxSde: undefined,
      minScore: undefined,
      maxScore: undefined,
      status: undefined,
      tags: [],
    });

    expect(prismaMock.business.findMany).toHaveBeenCalledWith({
      where: {},
      orderBy: [
        { overallScore: { sort: "desc", nulls: "last" } },
        { updatedAt: "desc" },
      ],
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
    expect(result).toEqual([
      expect.objectContaining({
        id: "business-1",
        businessName: "Anchor Point Bookkeeping",
        noteEntries: [
          expect.objectContaining({
            id: "note-1",
            body: "Export note",
          }),
        ],
        historyEvents: [
          expect.objectContaining({
            id: "history-1",
            eventType: "CREATED",
          }),
        ],
      }),
    ]);
  });

  it("short-circuits updates when no fields changed", async () => {
    const existing = createExistingBusiness();
    prismaMock.business.findUnique.mockResolvedValue(existing);

    const result = await updateBusiness(
      existing.id,
      createBusinessInput({
        tags: ["subscription", "b2b", "bookkeeping"],
      }),
    );

    expect(result).toEqual({
      business: existing,
      changedFields: [],
    });
    expect(prismaMock.business.update).not.toHaveBeenCalled();
  });

  it("creates update and status history when meaningful fields change", async () => {
    const existing = createExistingBusiness({
      dealStatus: "NEW",
      businessName: "Anchor Point Bookkeeping Co.",
    });
    const input = createBusinessInput({
      businessName: "Anchor Point Bookkeeping",
      dealStatus: "UNDER_REVIEW",
      tags: ["subscription", "bookkeeping", "remote-friendly"],
    });
    const updatedBusiness = createExistingBusiness({
      dealStatus: "UNDER_REVIEW",
      tags: ["subscription", "bookkeeping", "remote-friendly"],
    });

    prismaMock.business.findUnique.mockResolvedValue(existing);
    prismaMock.business.update.mockResolvedValue(updatedBusiness);

    const result = await updateBusiness(existing.id, input);

    expect(prismaMock.business.update).toHaveBeenCalledTimes(1);
    expect(prismaMock.business.update).toHaveBeenCalledWith({
      where: { id: existing.id },
      data: {
        ...input,
        historyEvents: {
          create: [
            {
              eventType: HistoryEventType.UPDATED,
              description: "Updated business name, deal status, tags.",
              metadata: {
                changedFields: ["business name", "deal status", "tags"],
              },
            },
            {
              eventType: HistoryEventType.STATUS_CHANGED,
              description: "Status changed from NEW to UNDER_REVIEW.",
              metadata: {
                from: "NEW",
                to: "UNDER_REVIEW",
              },
            },
          ],
        },
      },
    });
    expect(result).toEqual({
      business: updatedBusiness,
      changedFields: ["business name", "deal status", "tags"],
    });
  });

  it("adds a note and writes a history event in one transaction", async () => {
    const noteOperation = { op: "create-note" };
    const historyOperation = { op: "create-history" };
    const expectedNote = {
      id: "note-1",
      businessId: "business-1",
      body: "Follow up with the broker after reviewing the packet.",
    };

    prismaMock.businessNote.create.mockReturnValue(noteOperation);
    prismaMock.businessHistoryEvent.create.mockReturnValue(historyOperation);
    prismaMock.$transaction.mockResolvedValue([expectedNote, { id: "history-1" }]);

    const result = await addBusinessNote(
      "business-1",
      "Follow up with the broker after reviewing the packet.",
    );

    expect(prismaMock.$transaction).toHaveBeenCalledWith([
      noteOperation,
      historyOperation,
    ]);
    expect(result).toEqual(expectedNote);
  });

  it("updates status only when the value changes", async () => {
    prismaMock.business.findUnique.mockResolvedValue({
      id: "business-1",
      dealStatus: "WATCHLIST",
    });
    prismaMock.business.update.mockResolvedValue({
      id: "business-1",
      dealStatus: "UNDER_REVIEW",
    });

    const updated = await updateBusinessStatus("business-1", "UNDER_REVIEW");

    expect(prismaMock.business.update).toHaveBeenCalledWith({
      where: { id: "business-1" },
      data: {
        dealStatus: "UNDER_REVIEW",
        historyEvents: {
          create: {
            eventType: HistoryEventType.STATUS_CHANGED,
            description: "Status changed from WATCHLIST to UNDER_REVIEW.",
            metadata: {
              from: "WATCHLIST",
              to: "UNDER_REVIEW",
            },
          },
        },
      },
    });
    expect(updated).toEqual({
      id: "business-1",
      dealStatus: "UNDER_REVIEW",
    });
  });

  it("returns the existing record when the status is unchanged", async () => {
    const existing = {
      id: "business-1",
      dealStatus: "WATCHLIST",
    };
    prismaMock.business.findUnique.mockResolvedValue(existing);

    const result = await updateBusinessStatus("business-1", "WATCHLIST");

    expect(result).toEqual(existing);
    expect(prismaMock.business.update).not.toHaveBeenCalled();
  });

  it("persists preset upserts and deletes", async () => {
    prismaMock.filterPreset.upsert.mockResolvedValue({ id: "preset-1" });
    prismaMock.filterPreset.delete.mockResolvedValue({ id: "preset-1" });

    await saveFilterPreset("High score", { minScore: "80", sort: "score" });
    await deleteFilterPreset("preset-1");

    expect(prismaMock.filterPreset.upsert).toHaveBeenCalledWith({
      where: { name: "High score" },
      update: {
        query: { minScore: "80", sort: "score" },
      },
      create: {
        name: "High score",
        query: { minScore: "80", sort: "score" },
      },
    });
    expect(prismaMock.filterPreset.delete).toHaveBeenCalledWith({
      where: { id: "preset-1" },
    });
  });
});
