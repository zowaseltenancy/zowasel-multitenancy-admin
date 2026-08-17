"use client";

import { useState } from "react";
import {
  Download,
  FileSpreadsheet,
  FileText,
  Image as ImageIcon,
  Table,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import {
  captureElementForEmbed,
  exportElementToImage,
  exportToCsv,
  exportToExcel,
  exportToPdf,
  ExportTable,
} from "@/lib/export";

interface Column<T> {
  header: string;
  accessor: keyof T | ((item: T) => string | number);
}

interface Props<T = any> {
  table?: ExportTable;
  data?: T[];
  columns?: Column<T>[];
  filename?: string;
  targetElementId?: string;
  captureElementId?: string;
}

export default function ExportMenu<T = any>({
  table: explicitTable,
  data,
  columns,
  filename,
  targetElementId,
  captureElementId,
}: Props<T>) {
  const [capturing, setCapturing] = useState(false);
  const [exportingExcel, setExportingExcel] = useState(false);
  const elementId = targetElementId || captureElementId;

  const resolvedTable: ExportTable = explicitTable ?? {
    title: filename || "Export_Report",
    headers: columns ? columns.map((c) => c.header) : [],
    rows:
      data && columns
        ? data.map((item) =>
            columns.map((c) => {
              if (typeof c.accessor === "function") {
                return c.accessor(item);
              }
              return String(item[c.accessor] ?? "");
            })
          )
        : [],
  };

  const handleImageExport = async () => {
    if (!elementId) return;

    const element = document.getElementById(elementId);
    if (!element) return;

    setCapturing(true);
    try {
      await exportElementToImage(element, resolvedTable.title);
    } finally {
      setCapturing(false);
    }
  };

  // When a chart element is available, the xlsx export embeds a real
  // captured picture of it above the data — same visual as "Export as
  // Image," just landing inside the workbook instead of a standalone file.
  const handleExcelExport = async () => {
    setExportingExcel(true);
    try {
      const element = elementId ? document.getElementById(elementId) : null;
      const chartImage = element ? await captureElementForEmbed(element, resolvedTable.title) : undefined;
      await exportToExcel(resolvedTable, chartImage);
    } finally {
      setExportingExcel(false);
    }
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        render={
          <Button variant="outline" size="sm" className="h-9 text-xs font-bold gap-2">
            <Download className="h-4 w-4" />
            Export Report
          </Button>
        }
      />

      <DropdownMenuContent className="w-56 min-w-[14rem] p-1.5" align="end">
        <DropdownMenuItem
          onClick={() => exportToCsv(resolvedTable)}
          className="cursor-pointer whitespace-nowrap font-semibold text-xs py-2 px-2.5 flex items-center gap-2"
        >
          <Table className="h-4 w-4 text-emerald-600 shrink-0" />
          <span className="truncate">Export as CSV</span>
        </DropdownMenuItem>

        <DropdownMenuItem
          disabled={exportingExcel}
          onClick={handleExcelExport}
          className="cursor-pointer whitespace-nowrap font-semibold text-xs py-2 px-2.5 flex items-center gap-2"
        >
          <FileSpreadsheet className="h-4 w-4 text-emerald-600 shrink-0" />
          <span className="truncate">{exportingExcel ? "Generating..." : "Export as XLSX"}</span>
        </DropdownMenuItem>

        <DropdownMenuItem
          onClick={() => exportToPdf(resolvedTable)}
          className="cursor-pointer whitespace-nowrap font-semibold text-xs py-2 px-2.5 flex items-center gap-2"
        >
          <FileText className="h-4 w-4 text-rose-600 shrink-0" />
          <span className="truncate">Export as PDF</span>
        </DropdownMenuItem>

        {elementId && (
          <DropdownMenuItem
            disabled={capturing}
            onClick={handleImageExport}
            className="cursor-pointer whitespace-nowrap font-semibold text-xs py-2 px-2.5 flex items-center gap-2"
          >
            <ImageIcon className="h-4 w-4 text-primary shrink-0" />
            <span className="truncate">{capturing ? "Capturing..." : "Export as Image"}</span>
          </DropdownMenuItem>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
