'use client';

import React from 'react';
import { Plus } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { LeaveType } from '@/types/staff';
import { LeaveDateRangePicker } from './LeaveDateRangePicker';

interface RequestLeaveModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  form: {
    type: LeaveType;
    startDate: string;
    endDate: string;
    reason: string;
    attachment: File | null;
  };
  setForm: React.Dispatch<React.SetStateAction<{
    type: LeaveType;
    startDate: string;
    endDate: string;
    reason: string;
    attachment: File | null;
  }>>;
  workingDays: number;
  onSubmit: () => void;
}

export function RequestLeaveModal({
  open,
  onOpenChange,
  form,
  setForm,
  workingDays,
  onSubmit,
}: RequestLeaveModalProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <div className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-lg bg-[#00A651]/10 text-[#00A651] flex items-center justify-center">
              <Plus className="h-4 w-4" />
            </div>
            <div>
              <DialogTitle className="text-base font-bold text-slate-900 dark:text-white">
                Submit Leave Application
              </DialogTitle>
              <DialogDescription className="text-xs text-muted-foreground">
                Task 5.2: POST /api/v1/leave/requests
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <div className="space-y-4 py-2 text-xs">
          <div className="space-y-1.5">
            <Label className="font-semibold text-xs">Leave Classification</Label>
            <Select
              value={form.type}
              onValueChange={(val) => {
                if (val !== null) setForm({ ...form, type: val as LeaveType });
              }}
            >
              <SelectTrigger className="h-9 text-xs">
                <SelectValue placeholder="Select classification" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Annual" className="text-xs">Annual Vacation (20d Entitled)</SelectItem>
                <SelectItem value="Sick" className="text-xs">Sick Leave (Medical Cert required &gt; 2 days)</SelectItem>
                <SelectItem value="Casual" className="text-xs">Casual / Personal Emergency</SelectItem>
                <SelectItem value="Maternity/Paternity" className="text-xs">Maternity / Paternity</SelectItem>
                <SelectItem value="Unpaid" className="text-xs">Unpaid Leave</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <LeaveDateRangePicker
            startDate={form.startDate}
            endDate={form.endDate}
            workingDays={workingDays}
            onStartDateChange={(val) => setForm({ ...form, startDate: val })}
            onEndDateChange={(val) => setForm({ ...form, endDate: val })}
          />

          <div className="space-y-1.5">
            <Label htmlFor="reason" className="font-semibold text-xs">Reason & Context</Label>
            <Textarea
              id="reason"
              placeholder="Detail reason for absence, handover arrangements, and emergency contacts..."
              value={form.reason}
              onChange={(e) => setForm({ ...form, reason: e.target.value })}
              rows={3}
              className="text-xs resize-none"
            />
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
              size="sm"
              onClick={onSubmit}
              disabled={!form.startDate || !form.endDate || !form.reason.trim()}
              className="bg-[#00A651] hover:bg-[#008C44] text-white font-bold text-xs gap-1.5 shadow-xs cursor-pointer"
            >
              Submit Application
            </Button>
          </DialogFooter>
        </div>
      </DialogContent>
    </Dialog>
  );
}
