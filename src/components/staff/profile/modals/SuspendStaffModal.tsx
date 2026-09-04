'use client';

import { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { UserX, UserCheck, AlertTriangle, Loader2 } from 'lucide-react';
import { StaffMember } from '@/types/staff';
import { toast } from 'sonner';

interface SuspendStaffModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  staff: StaffMember;
  onSuccess?: () => void;
}

export function SuspendStaffModal({
  open,
  onOpenChange,
  staff,
  onSuccess,
}: SuspendStaffModalProps) {
  const isSuspended = staff.status?.toLowerCase() === 'suspended' || staff.status?.toLowerCase() === 'inactive';
  const [reason, setReason] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isSuspended && !reason.trim()) {
      toast.error('Please provide a reason for suspending this account.');
      return;
    }

    setLoading(true);
    try {
      // Backend track: PATCH /admin/staff/:id/status { status, reason }
      await new Promise((r) => setTimeout(r, 600));
      toast.success(
        `Staff account has been ${isSuspended ? 'reactivated' : 'suspended'} successfully.`
      );
      setReason('');
      onOpenChange(false);
      onSuccess?.();
    } catch {
      toast.error('Failed to update staff status');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <div className="flex items-center gap-2">
            <div
              className={`p-2 rounded-xl ${
                isSuspended
                  ? 'bg-[#00A651]/10 text-[#00A651]'
                  : 'bg-amber-500/10 text-amber-600 dark:text-amber-400'
              }`}
            >
              {isSuspended ? (
                <UserCheck className="h-5 w-5" />
              ) : (
                <UserX className="h-5 w-5" />
              )}
            </div>
            <div>
              <DialogTitle className="text-base font-bold text-slate-900 dark:text-white">
                {isSuspended ? 'Reactivate Staff Account' : 'Suspend Staff Account'}
              </DialogTitle>
              <DialogDescription className="text-xs text-muted-foreground mt-0.5">
                {staff.firstName} {staff.lastName} ({staff.email})
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 pt-2">
          {!isSuspended && (
            <div className="rounded-xl border border-amber-500/20 bg-amber-500/5 p-3 text-xs text-amber-700 dark:text-amber-400 flex items-start gap-2.5">
              <AlertTriangle className="h-4 w-4 shrink-0 mt-0.5" />
              <span>
                Suspending this staff account will revoke their active session and block platform authentication immediately.
              </span>
            </div>
          )}

          <div className="space-y-1.5">
            <Label htmlFor="status-reason" className="text-xs font-semibold">
              {isSuspended ? 'Reactivation Note (Optional)' : 'Suspension Reason (Required)'}
            </Label>
            <Textarea
              id="status-reason"
              placeholder={
                isSuspended
                  ? 'e.g., Staff returned from leave, access restored'
                  : 'e.g., Extended unpaid leave beyond policy window, or security review'
              }
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              required={!isSuspended}
              rows={3}
              className="text-xs resize-none"
            />
            <p className="text-[11px] text-muted-foreground">
              This note will be permanently recorded in the staff member&apos;s status history.
            </p>
          </div>

          <DialogFooter className="gap-2 sm:gap-0 pt-2">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => onOpenChange(false)}
              disabled={loading}
              className="text-xs h-8.5"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              size="sm"
              disabled={loading}
              className={`text-xs h-8.5 text-white font-medium ${
                isSuspended
                  ? 'bg-[#00A651] hover:bg-[#008C44]'
                  : 'bg-amber-600 hover:bg-amber-700'
              }`}
            >
              {loading ? (
                <>
                  <Loader2 className="h-3.5 w-3.5 animate-spin mr-1.5" />
                  Updating...
                </>
              ) : isSuspended ? (
                'Reactivate Account'
              ) : (
                'Suspend Account'
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
