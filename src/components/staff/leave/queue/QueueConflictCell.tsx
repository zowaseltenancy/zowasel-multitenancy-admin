'use client';

import { AlertTriangle, Check } from 'lucide-react';
import { TableCell } from '@/components/ui/table';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { LeaveRequest } from '@/types/staff';
import { formatDate } from '../leaveUtils';

interface QueueConflictCellProps {
  hasConflict: boolean;
  conflictingPeers: LeaveRequest[];
}

export function QueueConflictCell({
  hasConflict,
  conflictingPeers,
}: QueueConflictCellProps) {
  return (
    <TableCell className="py-3.5">
      {hasConflict ? (
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger
              render={
                <div className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md bg-amber-500/15 border border-amber-500/30 text-amber-700 dark:text-amber-400 font-semibold text-[11px]">
                  <AlertTriangle className="h-3.5 w-3.5 shrink-0" />
                  <span>{conflictingPeers.length} Peer Clashing</span>
                </div>
              }
            />
            <TooltipContent side="top" className="max-w-xs space-y-1">
              <p className="font-bold text-xs">Concurrent Department Absence:</p>
              {conflictingPeers.map((p) => (
                <p key={p.id} className="text-[11px]">
                  • {p.employeeName} ({formatDate(p.startDate)} - {formatDate(p.endDate)})
                </p>
              ))}
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      ) : (
        <span className="text-[11px] text-emerald-600 dark:text-emerald-400 font-medium flex items-center gap-1">
          <Check className="h-3 w-3" /> Full Coverage
        </span>
      )}
    </TableCell>
  );
}