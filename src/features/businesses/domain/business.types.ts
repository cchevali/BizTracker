import type { DealStatus, HistoryEventType } from "@/generated/prisma/enums";

export const viewModes = ["table", "cards"] as const;
export type ViewMode = (typeof viewModes)[number];

export const sortOptionValues = [
  "ask-price",
  "updated",
  "newest",
  "sde",
  "score",
  "location",
] as const;
export type SortOption = (typeof sortOptionValues)[number];

export const DEFAULT_VIEW_MODE: ViewMode = "table";
export const DEFAULT_SORT_OPTION: SortOption = "ask-price";

export const sortOptions: Array<{ value: SortOption; label: string }> = [
  { value: "ask-price", label: "Ask price (low to high)" },
  { value: "updated", label: "Recently updated" },
  { value: "newest", label: "Newest added" },
  { value: "sde", label: "SDE (high to low)" },
  { value: "score", label: "Score (high to low)" },
  { value: "location", label: "Location (A to Z)" },
];

export const viewModeOptions: Array<{ value: ViewMode; label: string }> = [
  { value: "table", label: "Table" },
  { value: "cards", label: "Cards" },
];

export const dealStatusOptions: Array<{ value: DealStatus; label: string }> = [
  { value: "NEW", label: "New" },
  { value: "WATCHLIST", label: "Watchlist" },
  { value: "RESEARCHING", label: "Researching" },
  { value: "CONTACTED_BROKER", label: "Contacted broker" },
  { value: "UNDER_REVIEW", label: "Under review" },
  { value: "LETTER_OF_INTENT", label: "Letter of intent" },
  { value: "PASSED", label: "Passed" },
  { value: "CLOSED", label: "Closed" },
];

export const ratingOptions = [1, 2, 3, 4, 5] as const;

export const activeDealStatuses: DealStatus[] = [
  "NEW",
  "WATCHLIST",
  "RESEARCHING",
  "CONTACTED_BROKER",
  "UNDER_REVIEW",
  "LETTER_OF_INTENT",
];

export const filterQueryKeys = [
  "q",
  "view",
  "sort",
  "state",
  "category",
  "minAsk",
  "maxAsk",
  "minSde",
  "maxSde",
  "minScore",
  "maxScore",
  "status",
  "tags",
] as const;

export type FilterQueryKey = (typeof filterQueryKeys)[number];
export type FilterQueryRecord = Partial<Record<FilterQueryKey, string>>;
export type SearchParamsInput = Record<
  string,
  string | string[] | undefined
>;

export type BusinessFilters = {
  q: string;
  view: ViewMode;
  sort: SortOption;
  state: string;
  category: string;
  minAsk?: number;
  maxAsk?: number;
  minSde?: number;
  maxSde?: number;
  minScore?: number;
  maxScore?: number;
  status?: DealStatus;
  tags: string[];
};

export type BusinessListItem = {
  id: string;
  businessName: string;
  sourceUrl: string | null;
  category: string;
  subcategory: string | null;
  location: string;
  stateCode: string | null;
  askingPrice: number | null;
  revenue: number | null;
  sde: number | null;
  ebitda: number | null;
  employees: number | null;
  summary: string;
  overallScore: number | null;
  tags: string[];
  dealStatus: DealStatus;
  createdAt: string;
  updatedAt: string;
  listingSource: string | null;
  brokerFirm: string | null;
};

export type BusinessNoteView = {
  id: string;
  body: string;
  createdAt: string;
  updatedAt: string;
};

export type BusinessHistoryView = {
  id: string;
  eventType: HistoryEventType;
  description: string;
  createdAt: string;
  metadata?: Record<string, unknown> | null;
};

export type BusinessDetail = BusinessListItem & {
  whyItMayFit: string;
  risks: string;
  brokerName: string | null;
  notes: string | null;
  ownerDependenceRating: number | null;
  recurringRevenueRating: number | null;
  transferabilityRating: number | null;
  scheduleControlFitRating: number | null;
  brotherOperatorFitRating: number | null;
  noteEntries: BusinessNoteView[];
  historyEvents: BusinessHistoryView[];
};

export type FilterOptionSet = {
  categories: string[];
  states: string[];
  tags: string[];
};

export type FilterPresetView = {
  id: string;
  name: string;
  query: FilterQueryRecord;
  createdAt: string;
  updatedAt: string;
};

export type DashboardSummary = {
  total: number;
  averageScore: number | null;
  active: number;
  watchlist: number;
  passed: number;
  highestSde: number | null;
};

export type DashboardData = {
  filters: BusinessFilters;
  businesses: BusinessListItem[];
  filterOptions: FilterOptionSet;
  presets: FilterPresetView[];
  summary: DashboardSummary;
};

export type ActionState = {
  status: "idle" | "success" | "error";
  message?: string;
  fieldErrors?: Record<string, string[]>;
};

export const initialActionState: ActionState = {
  status: "idle",
};

export type BusinessFormValues = {
  businessName: string;
  sourceUrl: string;
  category: string;
  subcategory: string;
  location: string;
  stateCode: string;
  askingPrice: string;
  revenue: string;
  sde: string;
  ebitda: string;
  employees: string;
  summary: string;
  whyItMayFit: string;
  risks: string;
  brokerName: string;
  brokerFirm: string;
  listingSource: string;
  dealStatus: DealStatus;
  ownerDependenceRating: string;
  recurringRevenueRating: string;
  transferabilityRating: string;
  scheduleControlFitRating: string;
  brotherOperatorFitRating: string;
  overallScore: string;
  notes: string;
  tags: string;
};

export const emptyBusinessFormValues: BusinessFormValues = {
  businessName: "",
  sourceUrl: "",
  category: "",
  subcategory: "",
  location: "",
  stateCode: "",
  askingPrice: "",
  revenue: "",
  sde: "",
  ebitda: "",
  employees: "",
  summary: "",
  whyItMayFit: "",
  risks: "",
  brokerName: "",
  brokerFirm: "",
  listingSource: "",
  dealStatus: "NEW",
  ownerDependenceRating: "",
  recurringRevenueRating: "",
  transferabilityRating: "",
  scheduleControlFitRating: "",
  brotherOperatorFitRating: "",
  overallScore: "",
  notes: "",
  tags: "",
};

function numberToInput(value: number | null | undefined) {
  return value === null || value === undefined ? "" : String(value);
}

export function createBusinessFormValues(
  business?: Partial<BusinessDetail>,
): BusinessFormValues {
  if (!business) {
    return emptyBusinessFormValues;
  }

  return {
    businessName: business.businessName ?? "",
    sourceUrl: business.sourceUrl ?? "",
    category: business.category ?? "",
    subcategory: business.subcategory ?? "",
    location: business.location ?? "",
    stateCode: business.stateCode ?? "",
    askingPrice: numberToInput(business.askingPrice),
    revenue: numberToInput(business.revenue),
    sde: numberToInput(business.sde),
    ebitda: numberToInput(business.ebitda),
    employees: numberToInput(business.employees),
    summary: business.summary ?? "",
    whyItMayFit: business.whyItMayFit ?? "",
    risks: business.risks ?? "",
    brokerName: business.brokerName ?? "",
    brokerFirm: business.brokerFirm ?? "",
    listingSource: business.listingSource ?? "",
    dealStatus: business.dealStatus ?? "NEW",
    ownerDependenceRating: numberToInput(business.ownerDependenceRating),
    recurringRevenueRating: numberToInput(business.recurringRevenueRating),
    transferabilityRating: numberToInput(business.transferabilityRating),
    scheduleControlFitRating: numberToInput(business.scheduleControlFitRating),
    brotherOperatorFitRating: numberToInput(business.brotherOperatorFitRating),
    overallScore: numberToInput(business.overallScore),
    notes: business.notes ?? "",
    tags: business.tags?.join(", ") ?? "",
  };
}

export function getDealStatusLabel(status: DealStatus) {
  return (
    dealStatusOptions.find((option) => option.value === status)?.label ?? status
  );
}

export function getHistoryEventLabel(eventType: HistoryEventType) {
  switch (eventType) {
    case "CREATED":
      return "Created";
    case "UPDATED":
      return "Updated";
    case "STATUS_CHANGED":
      return "Status changed";
    case "NOTE_ADDED":
      return "Note added";
    default:
      return eventType;
  }
}
