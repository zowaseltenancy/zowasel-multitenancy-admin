'use client';

import React from 'react';
import Link from 'next/link';
import {
  ArrowLeft,
  ChevronRight as BreadcrumbArrow,
  Download,
} from 'lucide-react';
import { Button } from '@/components/ui/button';

interface QueueHeaderProps {
  onExportQueue: () => void;
}

export function QueueHeader({ onExportQueue }: QueueHeaderProps) {
  return (
    <div className="space-y-3 pb-1 border-b border-border/60">
      <nav className="flex items-center gap-1.5 text-xs text-muted-foreground font-medium">
        <Link href="/admin/staff/directory" className="hover:text-foreground transition-colors">
          Staff Management
        </Link>
        <BreadcrumbArrow className="h-3.5 w-3.5 opacity-50" />
        <Link href="/admin/staff/leave" className="hover:text-foreground transition-colors">
          Leave Management
        </Link>
        <BreadcrumbArrow className="h-3.5 w-3.5 opacity-50" />
        <span className="text-foreground font-semibold">Approval Queue</span>
      </nav>

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
            Leave Approval Queue
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-0.5">
            Review pending absence requests, resolve concurrent staffing overlaps, and authorize official time off.
          </p>
        </div>

        <div className="flex items-center gap-2 self-start sm:self-center shrink-0">
          <Link href="/admin/staff/leave">
            <Button
              type="button"
              variant="outline"
              size="sm"
              className="h-9 px-3 text-xs font-medium gap-1.5 cursor-pointer shadow-2xs"
            >
              <ArrowLeft className="h-3.5 w-3.5" /> Back to Leave Hub
            </Button>
          </Link>

          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={onExportQueue}
            className="h-9 px-3 text-xs font-medium gap-1.5 cursor-pointer shadow-2xs"
          >
            <Download className="h-3.5 w-3.5 text-muted-foreground" /> Export Queue
          </Button>
        </div>
      </div>
    </div>
  );
}
