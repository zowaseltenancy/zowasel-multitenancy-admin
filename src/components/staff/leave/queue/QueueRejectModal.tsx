'use client';

import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';

interface QueueRejectModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  targetCount: number;
  rejectReason: string;
  onRejectReasonChange: (val: string) => void;
  onConfirmReject: () => void;
}

export function QueueRejectModal({
  open,
  onOpenChange,
  targetCount,
  rejectReason,
  onRejectReasonChange,
  onConfirmReject,
}: QueueRejectModalProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-base font-bold text-rose-600">Reject Leave Request(s)</DialogTitle>
          <DialogDescription className="text-xs text-muted-foreground">
            Provide an official rationale for declining {targetCount} request(s).
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-3 py-2 text-xs">
          <div className="space-y-1">
            <Label className="text-xs font-semibold">Reason for Rejection *</Label>
            <Textarea
              value={rejectReason}
              onChange={(e) => onRejectReasonChange(e.target.value)}
              placeholder="Explain why this request is being rejected..."
              rows={3}
              required
              className="text-xs"
            />
          </div>
        </div>

        <DialogFooter className="gap-2 pt-2">
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={() => onOpenChange(false)}
            className="text-xs cursor-pointer"
          >
            Cancel
          </Button>
          <Button
            type="button"
            variant="destructive"
            size="sm"
            onClick={onConfirmReject}
            disabled={!rejectReason.trim()}
            className="text-xs font-bold cursor-pointer"
          >
            Confirm Rejection
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
