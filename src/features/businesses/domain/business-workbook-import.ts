import ExcelJS from "exceljs";

import {
  normalizeChatGptBusinessListing,
  type NormalizedBusinessListing,
} from "./business-import-normalizer";

type WorkbookRow = Record<string, unknown>;

const workbookToListingFieldMap: Record<string, string> = {
  business_name: "businessName",
  source_url: "sourceUrl",
  category: "category",
  subcategory: "subcategory",
  location: "location",
  state_code: "stateCode",
  asking_price: "askingPrice",
  revenue: "revenue",
  sde: "sde",
  ebitda: "ebitda",
  employees: "employees",
  summary: "summary",
  why_it_may_fit: "whyItMayFit",
  risks: "risks",
  broker_name: "brokerName",
  broker_firm: "brokerFirm",
  listing_source: "listingSource",
  deal_status: "dealStatus",
  owner_dependence_rating: "ownerDependenceRating",
  recurring_revenue_rating: "recurringRevenueRating",
  transferability_rating: "transferabilityRating",
  schedule_control_fit_rating: "scheduleControlFitRating",
  brother_operator_fit_rating: "brotherOperatorFitRating",
  overall_score: "overallScore",
  notes: "notes",
  tags: "tags",
  ai_resistance_score: "aiResistanceScore",
  financeability_rating: "financeabilityRating",
  seller_financing_available: "sellerFinancingAvailable",
  seller_financing_notes: "sellerFinancingNotes",
  operator_skill_dependency: "operatorSkillDependency",
  license_dependency: "licenseDependency",
  after_hours_burden: "afterHoursBurden",
  capex_risk: "capexRisk",
  regret_if_wrong_score: "regretIfWrongScore",
  data_confidence_score: "dataConfidenceScore",
  keep_day_job_fit: "keepDayJobFit",
  quit_day_job_fit: "quitDayJobFit",
  primary_use_case: "primaryUseCase",
  beats_current_benchmark: "beatsCurrentBenchmark",
  benchmark_notes: "benchmarkNotes",
  freshness_verified_at: "freshnessVerifiedAt",
  stale_listing_risk: "staleListingRisk",
  home_based_flag: "homeBasedFlag",
  recurring_revenue_percent: "recurringRevenuePercent",
  owner_hours_claimed: "ownerHoursClaimed",
  ops_manager_exists: "opsManagerExists",
  key_person_risk: "keyPersonRisk",
  cash_to_close_notes: "cashToCloseNotes",
};

function normalizeCellValue(value: ExcelJS.CellValue | undefined) {
  if (value === undefined || value === null) {
    return null;
  }

  if (typeof value === "object") {
    if ("result" in value) {
      return value.result ?? null;
    }

    if ("text" in value) {
      return value.text ?? null;
    }

    if (value instanceof Date) {
      return value.toISOString();
    }
  }

  return value;
}

function readWorksheetRows(worksheet: ExcelJS.Worksheet) {
  const headerRow = worksheet.getRow(1);
  const rawHeaderValues = Array.isArray(headerRow.values)
    ? headerRow.values.slice(1)
    : [];
  const headers = rawHeaderValues.map((value: ExcelJS.CellValue) =>
    String(value ?? "").trim(),
  );

  const rows: WorkbookRow[] = [];

  worksheet.eachRow((row, rowNumber) => {
    if (rowNumber === 1) {
      return;
    }

    const mapped = Object.fromEntries(
      headers.map((header: string, index: number) => [
        header,
        normalizeCellValue(row.getCell(index + 1).value),
      ]),
    );

    if (Object.values(mapped).every((value) => value === null || value === "")) {
      return;
    }

    rows.push(mapped);
  });

  return rows;
}

function mapWorkbookRowToListingInput(row: WorkbookRow) {
  return Object.fromEntries(
    Object.entries(workbookToListingFieldMap)
      .filter(([column]) => column in row)
      .map(([column, field]) => {
        const value = row[column];

        if (field === "tags" && typeof value === "string") {
          return [field, value.split(",").map((tag) => tag.trim())];
        }

        return [field, value];
      }),
  );
}

export async function parseBusinessWorkbook(
  buffer: Buffer | Uint8Array,
): Promise<NormalizedBusinessListing[]> {
  const workbook = new ExcelJS.Workbook();
  const loadableBuffer = Buffer.from(buffer) as unknown as Parameters<
    typeof workbook.xlsx.load
  >[0];
  await workbook.xlsx.load(loadableBuffer);

  const worksheet = workbook.getWorksheet("businesses");

  if (!worksheet) {
    throw new Error("Workbook is missing the businesses sheet.");
  }

  return readWorksheetRows(worksheet).map((row) =>
    normalizeChatGptBusinessListing(mapWorkbookRowToListingInput(row)),
  );
}
