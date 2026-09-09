'use client';

import React from 'react';
import { CheckCircle2 } from 'lucide-react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { LeaveRequest } from '@/types/staff';
import { QueueTableRow } from './QueueTableRow';

interface QueueTableProps {
  filteredRequests: LeaveRequest[];
  selectedIds: string[];
  currentUserId: string;
  onToggleSelectAll: () => void;
  onToggleSelectOne: (id: string) => void;
  onSelectDetail: (req: LeaveRequest) => void;
  onApprove: (ids: string[]) => void;
  onOpenRejectModal: (ids: string[]) => void;
  getConflict: (req: LeaveRequest) => boolean;
  getConflictingPeers: (req: LeaveRequest) => LeaveRequest[];
}

export function QueueTable({
  filteredRequests,
  selectedIds,
  currentUserId,
  onToggleSelectAll,
  onToggleSelectOne,
  onSelectDetail,
  onApprove,
  onOpenRejectModal,
  getConflict,
  getConflictingPeers,
}: QueueTableProps) {
  const isAllSelected =
    filteredRequests.length > 0 && selectedIds.length === filteredRequests.length;

  return (
    <div className="border border-border/60 rounded-2xl bg-card overflow-hidden shadow-2xs">
      <Table>
        <TableHeader>
          <TableRow className="bg-muted/30 hover:bg-muted/30 border-b border-border/60">
            <TableHead className="w-12 pl-4">
              <input
                type="checkbox"
                onChange={onToggleSelectAll}
                checked={isAllSelected}
                className="h-4 w-4 rounded border-border text-[#00A651] focus:ring-[#00A651] cursor-pointer"
              />
            </TableHead>
            <TableHead className="text-xs font-bold uppercase tracking-wider text-muted-foreground h-11">
              Employee
            </TableHead>
            <TableHead className="text-xs font-bold uppercase tracking-wider text-muted-foreground h-11">
              Department
            </TableHead>
            <TableHead className="text-xs font-bold uppercase tracking-wider text-muted-foreground h-11">
              Type
            </TableHead>
            <TableHead className="text-xs font-bold uppercase tracking-wider text-muted-foreground h-11">
              Dates Requested
            </TableHead>
            <TableHead className="text-xs font-bold uppercase tracking-wider text-muted-foreground h-11">
              Working Days
            </TableHead>
            <TableHead className="text-xs font-bold uppercase tracking-wider text-muted-foreground h-11">
              Overlap Analysis
            </TableHead>
            <TableHead className="text-xs font-bold uppercase tracking-wider text-muted-foreground h-11 text-right pr-5">
              Actions
            </TableHead>
          </TableRow>
        </TableHeader>

        <TableBody>
          {filteredRequests.length === 0 ? (
            <TableRow>
              <TableCell colSpan={8} className="h-56 text-center">
                <div className="flex flex-col items-center justify-center gap-2.5 max-w-sm mx-auto text-muted-foreground">
                  <div className="h-12 w-12 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-[#00A651] flex items-center justify-center">
                    <CheckCircle2 className="h-6 w-6" />
                  </div>
                  <div>
                    <p className="font-bold text-sm text-foreground">Queue is completely clear!</p>
                    <p className="text-xs text-muted-foreground mt-0.5">
                      There are no pending employee leave requests requiring authorization.
                    </p>
                  </div>
                </div>
              </TableCell>
            </TableRow>
          ) : (
            filteredRequests.map((req) => (
              <QueueTableRow
                key={req.id}
                req={req}
                isSelected={selectedIds.includes(req.id)}
                hasConflict={getConflict(req)}
                conflictingPeers={getConflictingPeers(req)}
                currentUserId={currentUserId}
                onToggleSelect={() => onToggleSelectOne(req.id)}
                onRowClick={() => onSelectDetail(req)}
                onApprove={() => onApprove([req.id])}
                onReject={() => onOpenRejectModal([req.id])}
              />
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
}
