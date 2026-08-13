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

      <DropdownMenuContent>
        <DropdownMenuItem onClick={() => exportToCsv(resolvedTable)}>
          <Table className="mr-2 h-4 w-4 text-emerald-600" />
          Export as CSV
        </DropdownMenuItem>

        <DropdownMenuItem onClick={() => exportToExcel(resolvedTable)}>
          <FileSpreadsheet className="mr-2 h-4 w-4 text-emerald-600" />
          Export as Excel (.xlsx)
        </DropdownMenuItem>

        <DropdownMenuItem onClick={() => exportToPdf(resolvedTable)}>
          <FileText className="mr-2 h-4 w-4 text-rose-600" />
          Export as PDF (Document)
        </DropdownMenuItem>

        {elementId && (
          <DropdownMenuItem disabled={capturing} onClick={handleImageExport}>
            <ImageIcon className="mr-2 h-4 w-4 text-primary" />
            {capturing ? "Capturing..." : "Export as Image (PNG)"}
          </DropdownMenuItem>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
