'use client';

import React from 'react';
import { TableHeader, TableRow, TableHead } from '@/components/ui/table';

export function DirectoryTableHeader() {
  return (
    <TableHeader>
      <TableRow className="bg-emerald-500/10 dark:bg-emerald-500/15 hover:bg-emerald-500/10 dark:hover:bg-emerald-500/15 border-b border-emerald-500/20">
        <TableHead className="text-xs font-bold uppercase tracking-wider text-emerald-950 dark:text-emerald-200 h-11 pl-5">
          Staff Member
        </TableHead>
        <TableHead className="text-xs font-bold uppercase tracking-wider text-emerald-950 dark:text-emerald-200 h-11">
          Staff ID
        </TableHead>
        <TableHead className="text-xs font-bold uppercase tracking-wider text-emerald-950 dark:text-emerald-200 h-11">
          Department
        </TableHead>
        <TableHead className="text-xs font-bold uppercase tracking-wider text-emerald-950 dark:text-emerald-200 h-11">
          Designation
        </TableHead>
        <TableHead className="text-xs font-bold uppercase tracking-wider text-emerald-950 dark:text-emerald-200 h-11">
          Status
        </TableHead>
        <TableHead className="text-xs font-bold uppercase tracking-wider text-emerald-950 dark:text-emerald-200 h-11">
          Date Joined
        </TableHead>
        <TableHead className="text-xs font-bold uppercase tracking-wider text-emerald-950 dark:text-emerald-200 h-11 text-right pr-5">
          Actions
        </TableHead>
      </TableRow>
    </TableHeader>
  );
}
