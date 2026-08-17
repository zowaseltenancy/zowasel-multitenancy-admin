import jsPDF from "jspdf";
import html2canvas from "html2canvas-pro";
import ExcelJS from "exceljs";

export interface ExportTable {
  title: string;
  headers: string[];
  rows: (string | number)[][];
}

// A captured chart image ready to embed — produced by captureElementForEmbed
// and handed to exportToExcel, so "Export as XLSX" can show the same visual
// the user is looking at, not just the numbers behind it.
export interface CapturedChartImage {
  dataUrl: string;
  width: number;
  height: number;
}

function cell(value: string | number) {
  return String(value ?? "");
}

export function exportToCsv({
  headers,
  rows,
  title,
}: ExportTable) {
  const csv = [headers, ...rows]
    .map((row) =>
      row
        .map(
          (value) =>
            `"${cell(value).replace(/"/g, '""')}"`
        )
        .join(",")
    )
    .join("\n");

  downloadBlob(
    csv,
    "text/csv;charset=utf-8;",
    `${slug(title)}.csv`
  );
}

// Real OOXML .xlsx via ExcelJS — the previous implementation built an HTML
// <table> and saved it with a .xls extension and an Excel MIME type; Excel
// would open it, but it was never a genuine workbook (no real cell types, no
// embedded-image support, not readable by anything that actually parses
// xlsx). This produces a real binary workbook, and when a chartImage is
// supplied (see captureElementForEmbed), embeds it as a real anchored
// picture above the data — not an HTML hack.
export async function exportToExcel(
  { title, headers, rows }: ExportTable,
  chartImage?: CapturedChartImage
) {
  const workbook = new ExcelJS.Workbook();
  workbook.creator = "Zowasel Platform Admin";
  workbook.created = new Date();

  const sheetName = title.replace(/[\\/*?:[\]]/g, "").slice(0, 31) || "Export";
  const worksheet = workbook.addWorksheet(sheetName, {
    views: [{ state: "frozen", ySplit: 0 }],
  });

  let dataStartRow = 1;

  worksheet.getCell(1, 1).value = "Zowasel Platform Admin";
  worksheet.getCell(1, 1).font = { bold: true, size: 14, color: { argb: "FF0F172A" } };
  worksheet.getCell(2, 1).value = title;
  worksheet.getCell(2, 1).font = { bold: true, size: 12, color: { argb: "FF334155" } };
  worksheet.getCell(3, 1).value = `Exported on: ${new Date().toLocaleString()} | Total Records: ${rows.length}`;
  worksheet.getCell(3, 1).font = { size: 9, italic: true, color: { argb: "FF64748B" } };
  dataStartRow = 5;

  // Embed the chart as a real anchored picture, scaled to a sane on-sheet
  // size (html2canvas captures at 2x scale for print sharpness, which is
  // far too large to drop onto a worksheet at native pixel dimensions).
  if (chartImage) {
    const maxDisplayWidth = 760;
    const scale = Math.min(1, maxDisplayWidth / chartImage.width);
    const displayWidth = Math.round(chartImage.width * scale);
    const displayHeight = Math.round(chartImage.height * scale);

    const base64 = chartImage.dataUrl.split(",")[1] ?? "";
    const imageId = workbook.addImage({ base64, extension: "png" });
    worksheet.addImage(imageId, {
      tl: { col: 0, row: dataStartRow - 1 },
      ext: { width: displayWidth, height: displayHeight },
    });

    // Rows default to ~20px tall — reserve enough rows for the image plus a
    // gap before the table starts, so the picture never overlaps the data.
    const rowsNeeded = Math.ceil(displayHeight / 20) + 2;
    dataStartRow += rowsNeeded;
  }

  const headerRowNum = dataStartRow;
  const headerRow = worksheet.getRow(headerRowNum);
  headers.forEach((header, i) => {
    const c = headerRow.getCell(i + 1);
    c.value = header;
    c.font = { bold: true, color: { argb: "FF111827" } };
    c.fill = { type: "pattern", pattern: "solid", fgColor: { argb: "FFF3F4F6" } };
    c.border = {
      top: { style: "thin", color: { argb: "FFD1D5DB" } },
      bottom: { style: "thin", color: { argb: "FFD1D5DB" } },
      left: { style: "thin", color: { argb: "FFD1D5DB" } },
      right: { style: "thin", color: { argb: "FFD1D5DB" } },
    };
  });
  headerRow.commit();

  rows.forEach((row, rowIdx) => {
    const excelRow = worksheet.getRow(headerRowNum + 1 + rowIdx);
    row.forEach((value, colIdx) => {
      const c = excelRow.getCell(colIdx + 1);
      c.value = value;
      c.fill = {
        type: "pattern",
        pattern: "solid",
        fgColor: { argb: rowIdx % 2 === 0 ? "FFFFFFFF" : "FFF9FAFB" },
      };
      c.border = {
        top: { style: "thin", color: { argb: "FFE5E7EB" } },
        bottom: { style: "thin", color: { argb: "FFE5E7EB" } },
        left: { style: "thin", color: { argb: "FFE5E7EB" } },
        right: { style: "thin", color: { argb: "FFE5E7EB" } },
      };
    });
    excelRow.commit();
  });

  // Column widths sized off the longest value in header or body, not a flat
  // default — ExcelJS doesn't auto-size, so this is the closest equivalent.
  headers.forEach((header, i) => {
    const longest = rows.reduce((max, row) => Math.max(max, cell(row[i]).length), header.length);
    worksheet.getColumn(i + 1).width = Math.min(48, Math.max(10, longest + 2));
  });

  const buffer = await workbook.xlsx.writeBuffer();
  downloadBlob(
    buffer,
    "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    `${slug(title)}.xlsx`
  );
}

async function loadLogoImage(): Promise<HTMLImageElement | null> {
  return new Promise((resolve) => {
    if (typeof window === "undefined") return resolve(null);
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.src = "/zowasel-logo-grey.png";
    img.onload = () => resolve(img);
    img.onerror = () => resolve(null);
  });
}

export async function exportToPdf({
  title,
  headers,
  rows,
}: ExportTable) {
  const doc = new jsPDF({ orientation: "landscape", unit: "mm" });
  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  const marginX = 14;
  const logoWidth = 32;
  const logoHeight = 8;

  // Try to load Zowasel brand logo
  let logoImg: HTMLImageElement | null = null;
  try {
    logoImg = await loadLogoImage();
  } catch {
    logoImg = null;
  }

  const renderHeader = (pageNumber: number, totalPages?: number) => {
    // Top bar decoration
    doc.setFillColor(24, 116, 68); // Zowasel Emerald Accent
    doc.rect(0, 0, pageWidth, 3, "F");

    if (logoImg) {
      try {
        doc.addImage(logoImg, "PNG", marginX, 8, logoWidth, logoHeight);
      } catch {
        // Fallback text if image draw fails
        doc.setFontSize(11);
        doc.setFont("helvetica", "bold");
        doc.setTextColor(24, 116, 68);
        doc.text("ZOWASEL", marginX, 14);
      }
    } else {
      doc.setFontSize(11);
      doc.setFont("helvetica", "bold");
      doc.setTextColor(24, 116, 68);
      doc.text("ZOWASEL", marginX, 14);
    }

    // Document Title — the title alone identifies what this export is;
    // a static "PLATFORM ADMINISTRATION & FINANCIAL LEDGER" subtitle read as
    // redundant boilerplate on every export regardless of what it contained.
    doc.setFontSize(14);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(15, 23, 42);
    doc.text(title, marginX, 22);

    // Export metadata right-aligned
    doc.setFontSize(8);
    doc.setFont("helvetica", "normal");
    doc.setTextColor(100, 116, 139);
    const dateStr = `Exported: ${new Date().toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit" })}`;
    const countStr = `Total Records: ${rows.length}`;
    doc.text(dateStr, pageWidth - marginX - doc.getTextWidth(dateStr), 13);
    doc.text(countStr, pageWidth - marginX - doc.getTextWidth(countStr), 18);

    // Divider rule
    doc.setDrawColor(226, 232, 240);
    doc.setLineWidth(0.5);
    doc.line(marginX, 26, pageWidth - marginX, 26);
  };

  const renderFooter = (pageNumber: number) => {
    doc.setDrawColor(226, 232, 240);
    doc.setLineWidth(0.3);
    doc.line(marginX, pageHeight - 10, pageWidth - marginX, pageHeight - 10);

    doc.setFontSize(7.5);
    doc.setFont("helvetica", "normal");
    doc.setTextColor(148, 163, 184);
    doc.text("Confidential & Proprietary — Zowasel Multitenancy Operations", marginX, pageHeight - 6);

    const pageStr = `Page ${pageNumber}`;
    doc.text(pageStr, pageWidth - marginX - doc.getTextWidth(pageStr), pageHeight - 6);
  };

  let pageNumber = 1;
  renderHeader(pageNumber);

  const availableWidth = pageWidth - marginX * 2;
  const colCount = Math.max(1, headers.length);
  const columnWidth = availableWidth / colCount;
  const startY = 32;
  const rowHeight = 7.5;
  let y = startY;

  // Table Headers
  doc.setFillColor(241, 245, 249);
  doc.rect(marginX, y - 4.5, availableWidth, rowHeight, "F");
  doc.setDrawColor(203, 213, 225);
  doc.rect(marginX, y - 4.5, availableWidth, rowHeight, "S");

  doc.setFontSize(8);
  doc.setFont("helvetica", "bold");
  doc.setTextColor(51, 65, 85);

  headers.forEach((header, index) => {
    const x = marginX + index * columnWidth + 2;
    const maxTextWidth = columnWidth - 4;
    const truncated = doc.splitTextToSize(cell(header), maxTextWidth);
    doc.text(truncated[0] || "", x, y);
  });

  y += rowHeight;

  // Table Rows — each cell wraps to as many lines as it needs (no content
  // dropped past line 1), and the row's height grows to fit its tallest cell.
  const lineHeight = 3.4;
  rows.forEach((row, rowIndex) => {
    const maxTextWidth = columnWidth - 4;
    const wrappedCells = row.map((value) => doc.splitTextToSize(cell(value), maxTextWidth) as string[]);
    const linesInRow = Math.max(1, ...wrappedCells.map((lines) => lines.length));
    const thisRowHeight = Math.max(rowHeight, linesInRow * lineHeight + 3);

    if (y + thisRowHeight > pageHeight - 18) {
      renderFooter(pageNumber);
      doc.addPage();
      pageNumber += 1;
      renderHeader(pageNumber);
      y = startY;

      // Repeat Table Header on next page
      doc.setFillColor(241, 245, 249);
      doc.rect(marginX, y - 4.5, availableWidth, rowHeight, "F");
      doc.setDrawColor(203, 213, 225);
      doc.rect(marginX, y - 4.5, availableWidth, rowHeight, "S");

      doc.setFontSize(8);
      doc.setFont("helvetica", "bold");
      doc.setTextColor(51, 65, 85);
      headers.forEach((header, index) => {
        const x = marginX + index * columnWidth + 2;
        const maxTextWidth = columnWidth - 4;
        const truncated = doc.splitTextToSize(cell(header), maxTextWidth);
        doc.text(truncated[0] || "", x, y);
      });
      y += rowHeight;
    }

    // Alternating row background
    if (rowIndex % 2 === 1) {
      doc.setFillColor(248, 250, 252);
      doc.rect(marginX, y - 4.5, availableWidth, thisRowHeight, "F");
    }

    // Row bottom line
    doc.setDrawColor(241, 245, 249);
    doc.line(marginX, y - 4.5 + thisRowHeight, marginX + availableWidth, y - 4.5 + thisRowHeight);

    doc.setFontSize(7.5);
    doc.setFont("helvetica", "normal");
    doc.setTextColor(30, 41, 59);

    wrappedCells.forEach((lines, index) => {
      const x = marginX + index * columnWidth + 2;
      doc.text(lines, x, y);
    });

    y += thisRowHeight;
  });

  renderFooter(pageNumber);
  doc.save(`${slug(title)}.pdf`);
}

// Shared capture core — renders `element` to a canvas via html2canvas and
// composites the same branded header bar used across every export format.
// Used both for the standalone "Export as Image" download and for embedding
// a chart into an xlsx workbook (captureElementForEmbed below), so the two
// never drift into looking like different products.
async function captureElementComposited(
  element: HTMLElement,
  title: string,
  format: "png" | "jpeg" = "png"
): Promise<{ dataUrl: string; width: number; height: number }> {
  const captured = await html2canvas(element, {
    backgroundColor: "#ffffff",
    scale: 2,
    useCORS: true,
    allowTaint: true,
    logging: false,
  });

  let logoImg: HTMLImageElement | null = null;
  try {
    logoImg = await loadLogoImage();
  } catch {
    logoImg = null;
  }

  const headerHeight = 64;
  const canvas = document.createElement("canvas");
  canvas.width = captured.width;
  canvas.height = captured.height + headerHeight;
  const ctx = canvas.getContext("2d");

  let dataUrl: string;
  if (ctx) {
    ctx.fillStyle = "#ffffff";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = "#187444";
    ctx.fillRect(0, 0, canvas.width, 4);

    if (logoImg) {
      const logoDrawHeight = 32;
      const logoDrawWidth = (logoImg.width / logoImg.height) * logoDrawHeight;
      ctx.drawImage(logoImg, 24, (headerHeight - logoDrawHeight) / 2, logoDrawWidth, logoDrawHeight);
    }

    ctx.fillStyle = "#1e293b";
    ctx.font = "600 20px sans-serif";
    ctx.textBaseline = "middle";
    ctx.fillText(title, logoImg ? 190 : 24, headerHeight / 2 + 2);

    ctx.drawImage(captured, 0, headerHeight);

    const mime = format === "jpeg" ? "image/jpeg" : "image/png";
    dataUrl = canvas.toDataURL(mime, 0.95);
  } else {
    const mime = format === "jpeg" ? "image/jpeg" : "image/png";
    dataUrl = captured.toDataURL(mime, 0.95);
  }

  return { dataUrl, width: canvas.width, height: canvas.height };
}

export async function exportElementToImage(
  element: HTMLElement,
  title: string,
  format: "png" | "jpeg" = "png"
) {
  try {
    const { dataUrl } = await captureElementComposited(element, title, format);

    const link = document.createElement("a");
    link.href = dataUrl;
    link.download = `${slug(title)}.${format === "jpeg" ? "jpg" : "png"}`;

    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  } catch (err) {
    console.error("Image export error:", err);
    throw err;
  }
}

// Captures `element` the same way "Export as Image" does, but returns the
// result for embedding into an xlsx workbook (exportToExcel's chartImage
// param) instead of triggering a download — so "Export as XLSX" can show
// the chart exactly as it looks on screen, next to the real data.
export async function captureElementForEmbed(
  element: HTMLElement,
  title: string
): Promise<CapturedChartImage> {
  return captureElementComposited(element, title, "png");
}

function downloadBlob(
  content: string | ArrayBuffer,
  mimeType: string,
  filename: string
) {
  const blob = new Blob([content], { type: mimeType });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

function slug(value: string) {
  return `${value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "")}-${new Date()
    .toISOString()
    .slice(0, 10)}`;
}
