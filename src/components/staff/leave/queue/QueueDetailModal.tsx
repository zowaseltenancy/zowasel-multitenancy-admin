'use client';

import React from 'react';
import { Paperclip } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { LeaveRequest } from '@/types/staff';
import { formatDate } from '../leaveUtils';

interface QueueDetailModalProps {
  detailRequest: LeaveRequest | null;
  onClose: () => void;
  onApprove: (id: string) => void;
  onOpenRejectModal: (id: string) => void;
}

export function QueueDetailModal({
  detailRequest,
  onClose,
  onApprove,
  onOpenRejectModal,
}: QueueDetailModalProps) {
  return (
    <Dialog open={!!detailRequest} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-base font-bold">Leave Request Authorization</DialogTitle>
          <DialogDescription className="text-xs text-muted-foreground">
            Reviewing pending leave ticket {detailRequest?.id}
          </DialogDescription>
        </DialogHeader>

        {detailRequest && (
          <div className="space-y-3.5 py-2 text-xs">
            <div className="flex items-center justify-between p-3 rounded-xl bg-muted/40 border">
              <div>
                <p className="font-bold text-sm text-foreground">{detailRequest.employeeName}</p>
                <p className="text-xs text-muted-foreground">{detailRequest.department}</p>
              </div>
              <Badge variant="outline" className="text-[10px] bg-amber-500/15 text-amber-700 font-bold border-amber-500/30">
                Pending Review
              </Badge>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="p-2.5 rounded-lg border bg-muted/20 space-y-0.5">
                <span className="text-[10px] font-semibold text-muted-foreground uppercase">Leave Type</span>
                <p className="font-bold text-foreground">{detailRequest.type}</p>
              </div>
              <div className="p-2.5 rounded-lg border bg-muted/20 space-y-0.5">
                <span className="text-[10px] font-semibold text-muted-foreground uppercase">Working Days</span>
                <p className="font-bold text-foreground">{detailRequest.workingDays} Days</p>
              </div>
            </div>

            <div className="p-2.5 rounded-lg border bg-muted/20 space-y-0.5">
              <span className="text-[10px] font-semibold text-muted-foreground uppercase">Time Off Span</span>
              <p className="font-bold text-foreground">
                {formatDate(detailRequest.startDate)} → {formatDate(detailRequest.endDate)}
              </p>
            </div>

            <div className="p-2.5 rounded-lg border bg-muted/20 space-y-1">
              <span className="text-[10px] font-semibold text-muted-foreground uppercase">Reason / Stated Purpose</span>
              <p className="text-slate-800 dark:text-slate-200 leading-relaxed">{detailRequest.reason}</p>
            </div>

            {detailRequest.attachment && (
              <div className="flex items-center gap-2 p-2 rounded-lg border bg-muted/10 text-xs">
                <Paperclip className="h-3.5 w-3.5 text-muted-foreground" />
                <span className="font-medium">{detailRequest.attachment}</span>
              </div>
            )}

            <DialogFooter className="gap-2 pt-2">
              <Button
                type="button"
                variant="destructive"
                size="sm"
                onClick={() => onOpenRejectModal(detailRequest.id)}
                className="text-xs cursor-pointer"
              >
                Reject Request
              </Button>
              <Button
                type="button"
                size="sm"
                onClick={() => onApprove(detailRequest.id)}
                className="bg-[#00A651] hover:bg-[#008C44] text-white font-bold text-xs cursor-pointer shadow-xs"
              >
                Approve Request
              </Button>
            </DialogFooter>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
