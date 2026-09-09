'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import {
  Download,
  Table as TableIcon,
  FileSpreadsheet,
  FileText,
  Plus,
  ChevronRight as BreadcrumbArrow,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

interface DirectoryHeaderProps {
  onExportCSV: () => void;
  onExportExcel: () => void;
  onExportPDF: () => void;
}

export function DirectoryHeader({
  onExportCSV,
  onExportExcel,
  onExportPDF,
}: DirectoryHeaderProps) {
  const router = useRouter();

  return (
    <div className="space-y-3 pb-1 border-b border-border/60">
      <nav className="flex items-center gap-1.5 text-xs text-muted-foreground font-medium">
        <button
          type="button"
          onClick={() => router.push('/admin/staff/directory')}
          className="hover:text-foreground transition-colors cursor-pointer"
        >
          Staff Management
        </button>
        <BreadcrumbArrow className="h-3.5 w-3.5 opacity-50" />
        <span className="text-foreground font-semibold">Staff Directory</span>
      </nav>

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
            Staff Directory
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-0.5">
            Manage platform personnel, active field officers, corporate designations, and departmental teams.
          </p>
        </div>

        <div className="flex items-center gap-2 self-start sm:self-center shrink-0">
          <DropdownMenu>
            <DropdownMenuTrigger
              render={
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  className="h-9 px-3 text-xs font-medium gap-1.5 cursor-pointer shadow-2xs"
                >
                  <Download className="h-3.5 w-3.5 text-muted-foreground" />
                  Export
                </Button>
              }
            />
            <DropdownMenuContent align="end" className="w-52 p-1.5">
              <DropdownMenuLabel className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider px-2 py-1">
                Export Personnel Data
              </DropdownMenuLabel>
              <DropdownMenuItem
                onClick={onExportCSV}
                className="text-xs cursor-pointer flex items-center gap-2 py-2 px-2 rounded-md"
              >
                <TableIcon className="h-3.5 w-3.5 text-emerald-600 shrink-0" />
                <span>Export as CSV (.csv)</span>
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={onExportExcel}
                className="text-xs cursor-pointer flex items-center gap-2 py-2 px-2 rounded-md"
              >
                <FileSpreadsheet className="h-3.5 w-3.5 text-emerald-600 shrink-0" />
                <span>Export as Excel (.xlsx)</span>
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={onExportPDF}
                className="text-xs cursor-pointer flex items-center gap-2 py-2 px-2 rounded-md"
              >
                <FileText className="h-3.5 w-3.5 text-rose-600 shrink-0" />
                <span>Export as PDF (.pdf)</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          <Button
            type="button"
            size="sm"
            onClick={() => router.push('/admin/staff/onboarding')}
            className="h-9 px-3.5 bg-[#00A651] hover:bg-[#008C44] text-white font-bold shadow-xs gap-1.5 cursor-pointer text-xs sm:text-sm"
          >
            <Plus className="h-4 w-4" /> Add New Staff
          </Button>
        </div>
      </div>
    </div>
  );
}
