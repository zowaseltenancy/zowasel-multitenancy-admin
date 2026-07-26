import jsPDF from "jspdf";
import html2canvas from "html2canvas";

export interface ExportTable {
  title: string;

  headers: string[];

  rows: (string | number)[][];
}

function cell(value: string | number) {
  return String(value);
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

export function exportToExcel({
  title,
  headers,
  rows,
}: ExportTable) {
  const headerRow = headers
    .map((header) => `<th>${cell(header)}</th>`)
    .join("");

  const bodyRows = rows
    .map(
      (row) =>
        `<tr>${row
          .map((value) => `<td>${cell(value)}</td>`)
          .join("")}</tr>`
    )
    .join("");

  const html = `
    <html>
      <head><meta charset="utf-8" /></head>
      <body>
        <table border="1">
          <thead><tr>${headerRow}</tr></thead>
          <tbody>${bodyRows}</tbody>
        </table>
      </body>
    </html>
  `;

  downloadBlob(
    html,
    "application/vnd.ms-excel;charset=utf-8;",
    `${slug(title)}.xls`
  );
}

export function exportToPdf({
  title,
  headers,
  rows,
}: ExportTable) {
  const doc = new jsPDF({ orientation: "landscape" });

  const marginX = 10;
  const startY = 20;
  const rowHeight = 8;
  const pageHeight = doc.internal.pageSize.getHeight();
  const columnWidth =
    (doc.internal.pageSize.getWidth() - marginX * 2) /
    headers.length;

  doc.setFontSize(14);
  doc.text(title, marginX, 12);

  let y = startY;

  doc.setFontSize(9);
  doc.setFont("helvetica", "bold");

  headers.forEach((header, index) => {
    doc.text(
      cell(header),
      marginX + index * columnWidth,
      y
    );
  });

  doc.setFont("helvetica", "normal");
  y += rowHeight;

  rows.forEach((row) => {
    if (y > pageHeight - 15) {
      doc.addPage();
      y = startY;
    }

    row.forEach((value, index) => {
      doc.text(
        cell(value),
        marginX + index * columnWidth,
        y
      );
    });

    y += rowHeight;
  });

  doc.save(`${slug(title)}.pdf`);
}

export async function exportElementToImage(
  element: HTMLElement,
  title: string,
  format: "png" | "jpeg" = "png"
) {
  const canvas = await html2canvas(element, {
    backgroundColor: "#ffffff",
    scale: 2,
  });

  const mime =
    format === "jpeg" ? "image/jpeg" : "image/png";

  const dataUrl = canvas.toDataURL(mime, 0.95);

  const link = document.createElement("a");
  link.href = dataUrl;
  link.download = `${slug(title)}.${format === "jpeg" ? "jpg" : "png"}`;

  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

function downloadBlob(
  content: string,
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
