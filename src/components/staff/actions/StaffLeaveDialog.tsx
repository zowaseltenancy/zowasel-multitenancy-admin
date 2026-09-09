'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { toast } from 'sonner';
import { Loader2, CalendarPlus } from 'lucide-react';

export function StaffLeaveDialog() {
  const [leaveOpen, setLeaveOpen] = useState(false);
  const [leaveStart, setLeaveStart] = useState('');
  const [leaveEnd, setLeaveEnd] = useState('');
  const [leaveReason, setLeaveReason] = useState('');
  const [loadingLeave, setLoadingLeave] = useState(false);

  const handleLeaveRequest = async () => {
    if (!leaveStart || !leaveEnd || !leaveReason) {
      toast.error('Please fill all fields');
      return;
    }
    setLoadingLeave(true);
    try {
      await new Promise((r) => setTimeout(r, 1000));
      toast.success('Leave request submitted');
      setLeaveOpen(false);
      setLeaveStart('');
      setLeaveEnd('');
      setLeaveReason('');
    } catch {
      toast.error('Failed to submit leave request');
    } finally {
      setLoadingLeave(false);
    }
  };

  return (
    <Dialog open={leaveOpen} onOpenChange={setLeaveOpen}>
      <DialogTrigger className="inline-flex items-center justify-center gap-2 rounded-md border border-input bg-background px-4 py-2 text-sm font-medium hover:bg-accent hover:text-accent-foreground">
        <CalendarPlus className="h-4 w-4" />
        Leave Request
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Request Leave</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-sm font-medium leading-none mb-1 block">Start Date *</label>
              <Input type="date" value={leaveStart} onChange={(e) => setLeaveStart(e.target.value)} />
            </div>
            <div>
              <label className="text-sm font-medium leading-none mb-1 block">End Date *</label>
              <Input type="date" value={leaveEnd} onChange={(e) => setLeaveEnd(e.target.value)} />
            </div>
          </div>
          <div>
            <label className="text-sm font-medium leading-none mb-1 block">Reason *</label>
            <Input
              value={leaveReason}
              onChange={(e) => setLeaveReason(e.target.value)}
              placeholder="Reason for leave"
            />
          </div>
          <Button onClick={handleLeaveRequest} disabled={loadingLeave} className="w-full">
            {loadingLeave && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Submit Request
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}