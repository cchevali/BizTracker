import ExcelJS from "exceljs";

import {
  businessExportColumns,
  getColumnWidths,
  type BusinessExportBusinessRow,
  type BusinessExportDataset,
  type BusinessExportHistoryRow,
  type BusinessExportMetadataRow,
  type BusinessExportNoteRow,
} from "../domain/business-export";

type SheetRow =
  | BusinessExportBusinessRow
  | BusinessExportNoteRow
  | BusinessExportHistoryRow
  | BusinessExportMetadataRow;

function appendWorksheet<Row extends SheetRow>(
  workbook: ExcelJS.Workbook,
  name: string,
  columns: readonly (keyof Row)[],
  rows: Row[],
) {
  const worksheet = workbook.addWorksheet(name, {
    views: [{ state: "frozen", ySplit: 1 }],
  });

  const widths = getColumnWidths(columns, rows);

  worksheet.columns = columns.map((column, index) => ({
    header: String(column),
    key: String(column),
    width: widths[index],
  }));

  rows.forEach((row) => {
    worksheet.addRow(row);
  });

  const headerRow = worksheet.getRow(1);
  headerRow.font = {
    bold: true,
    color: { argb: "FF173430" },
  };
  headerRow.fill = {
    type: "pattern",
    pattern: "solid",
    fgColor: { argb: "FFF2EEE4" },
  };

  worksheet.eachRow((row, rowNumber) => {
    row.alignment = {
      vertical: "top",
      wrapText: rowNumber > 1,
    };
  });
}

export async function buildBusinessExportWorkbook(
  dataset: BusinessExportDataset,
) {
  const workbook = new ExcelJS.Workbook();
  workbook.creator = "BizTracker";
  workbook.created = dataset.generatedAt;
  workbook.modified = dataset.generatedAt;

  appendWorksheet(
    workbook,
    "businesses",
    businessExportColumns.businesses,
    dataset.businesses,
  );
  appendWorksheet(workbook, "notes", businessExportColumns.notes, dataset.notes);
  appendWorksheet(
    workbook,
    "history",
    businessExportColumns.history,
    dataset.history,
  );
  appendWorksheet(
    workbook,
    "metadata",
    businessExportColumns.metadata,
    dataset.metadata,
  );

  const buffer = await workbook.xlsx.writeBuffer();
  return Buffer.from(buffer);
}
