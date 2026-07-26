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

interface Props {
  table: ExportTable;

  captureElementId?: string;
}

export default function ExportMenu({
  table,
  captureElementId,
}: Props) {
  const [capturing, setCapturing] = useState(false);

  const handleImageExport = async () => {
    if (!captureElementId) return;

    const element = document.getElementById(
      captureElementId
    );

    if (!element) return;

    setCapturing(true);

    try {
      await exportElementToImage(element, table.title);
    } finally {
      setCapturing(false);
    }
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        render={
          <Button variant="outline">
            <Download className="mr-2 h-4 w-4" />
            Export
          </Button>
        }
      />

      <DropdownMenuContent>
        <DropdownMenuItem
          onClick={() => exportToCsv(table)}
        >
          <Table className="mr-2 h-4 w-4" />
          CSV
        </DropdownMenuItem>

        <DropdownMenuItem
          onClick={() => exportToExcel(table)}
        >
          <FileSpreadsheet className="mr-2 h-4 w-4" />
          Excel
        </DropdownMenuItem>

        <DropdownMenuItem
          onClick={() => exportToPdf(table)}
        >
          <FileText className="mr-2 h-4 w-4" />
          PDF
        </DropdownMenuItem>

        {captureElementId && (
          <DropdownMenuItem
            disabled={capturing}
            onClick={handleImageExport}
          >
            <ImageIcon className="mr-2 h-4 w-4" />
            {capturing ? "Capturing..." : "Image (PNG)"}
          </DropdownMenuItem>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
