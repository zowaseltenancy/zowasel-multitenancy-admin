'use client';

import { leaveTypeLabel } from '@/constants/leave';
import React from 'react';
import { CalendarRange, Building2, CheckCircle2 } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { LeaveRequest } from '@/types/staff';
import { formatDate, StatusBadge } from './leaveUtils';

interface AbsenceDetailsModalProps {
  absence: LeaveRequest | null;
  onClose: () => void;
}

export function AbsenceDetailsModal({ absence, onClose }: AbsenceDetailsModalProps) {
  return (
    <Dialog open={!!absence} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <div className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-lg bg-[#00A651]/10 text-[#00A651] flex items-center justify-center">
              <CalendarRange className="h-4 w-4" />
            </div>
            <div>
              <DialogTitle className="text-base font-bold text-slate-900 dark:text-white">
                Absence Event Details
              </DialogTitle>
              <DialogDescription className="text-xs text-muted-foreground">
                Task 5.2: Calendar schedule overview for team availability
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        {absence && (
          <div className="space-y-4 py-2 text-xs">
            <div className="p-3 rounded-xl bg-muted/40 border border-border/60 flex items-center justify-between">
              <div>
                <h4 className="font-bold text-sm text-foreground">
                  {absence.employeeName}
                </h4>
                <p className="text-[11px] text-muted-foreground flex items-center gap-1 mt-0.5">
                  <Building2 className="h-3 w-3" />
                  {absence.department || 'Corporate'}
                </p>
              </div>
              <StatusBadge status={absence.status} />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="p-2.5 rounded-lg border border-border/50 bg-card">
                <span className="text-[10px] text-muted-foreground uppercase font-semibold block">
                  Leave Category
                </span>
                <span className="font-bold text-xs text-foreground mt-0.5 block">
                  {leaveTypeLabel(absence.type)} Leave
                </span>
              </div>
              <div className="p-2.5 rounded-lg border border-border/50 bg-card">
                <span className="text-[10px] text-muted-foreground uppercase font-semibold block">
                  Absence Duration
                </span>
                <span className="font-bold text-xs text-foreground mt-0.5 block">
                  {absence.workingDays} working days
                </span>
              </div>
            </div>

            <div className="space-y-1">
              <span className="text-[11px] text-muted-foreground block font-medium">
                Date Range:
              </span>
              <p className="font-semibold text-xs text-foreground bg-muted/30 p-2 rounded-lg border font-mono">
                {formatDate(absence.startDate)} → {formatDate(absence.endDate)}
              </p>
            </div>

            <div className="space-y-1">
              <span className="text-[11px] text-muted-foreground block font-medium">
                Stated Reason:
              </span>
              <p className="text-xs text-slate-700 dark:text-slate-300 bg-muted/30 p-2.5 rounded-lg border">
                {absence.reason || 'No description provided.'}
              </p>
            </div>

            {absence.approvedBy && (
              <div className="text-[11px] text-muted-foreground flex items-center gap-1.5 pt-1">
                <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600" />
                <span>Approved & Authorized by: <strong className="text-foreground">{absence.approvedBy}</strong></span>
              </div>
            )}

            <DialogFooter className="pt-2">
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={onClose}
                className="w-full text-xs cursor-pointer"
              >
                Close
              </Button>
            </DialogFooter>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
