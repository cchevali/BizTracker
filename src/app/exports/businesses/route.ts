import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

import {
  buildBusinessExportFilename,
  createBusinessExportDataset,
} from "@/features/businesses/domain/business-export";
import {
  parseBusinessFilters,
  serializeBusinessFilters,
} from "@/features/businesses/domain/business.filters";
import { getBusinessesForExport } from "@/features/businesses/data/business-repository";
import { buildBusinessExportWorkbook } from "@/features/businesses/utils/business-export-workbook";

export const runtime = "nodejs";

export async function GET(request: NextRequest) {
  try {
    const filters = parseBusinessFilters(
      Object.fromEntries(request.nextUrl.searchParams.entries()),
    );
    const query = serializeBusinessFilters(filters);
    const businesses = await getBusinessesForExport(filters);
    const generatedAt = new Date();
    const dataset = createBusinessExportDataset({
      businesses,
      filters,
      query,
      generatedAt,
    });
    const workbook = await buildBusinessExportWorkbook(dataset);
    const filename = buildBusinessExportFilename(generatedAt);

    return new NextResponse(workbook, {
      headers: {
        "Content-Type":
          "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        "Content-Disposition": `attachment; filename="${filename}"`,
        "Cache-Control": "no-store, max-age=0",
      },
    });
  } catch {
    return new NextResponse("Could not generate the export workbook.", {
      status: 500,
      headers: {
        "Content-Type": "text/plain; charset=utf-8",
      },
    });
  }
}
