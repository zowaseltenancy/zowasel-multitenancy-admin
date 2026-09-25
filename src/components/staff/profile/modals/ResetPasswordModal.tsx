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
import { KeyRound, Loader2, CheckCircle2, Copy } from 'lucide-react';
import { StaffMember } from '@/types/staff';
import { toast } from 'sonner';
import { useStaff } from '@/features/staff/hooks/useStaff';

interface ResetPasswordModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  staff: StaffMember;
}

// POST /admin/staff/{id}/reset-password.
//
// This used to be theatre: a 600ms sleep, `Math.random()` in the browser, and a
// line claiming the staff member had been emailed. No request was made, so the
// account's password never changed — the admin walked away holding a string
// that would not sign anyone in, and the real password was still whatever it
// had been.
//
// The server generates the password now, sets it, ends every session the
// account holds, and emails a notice that carries no credential. What comes
// back is shown here once; there is no way to retrieve it afterwards.
export function ResetPasswordModal({ open, onOpenChange, staff }: ResetPasswordModalProps) {
  const { resetPassword, isResettingPassword } = useStaff();
  const [tempPassword, setTempPassword] = useState<string | null>(null);
  const [noticeSent, setNoticeSent] = useState(true);

  const handleGenerate = () => {
    resetPassword(staff.id, {
      onSuccess: (result) => {
        setTempPassword(result.temporaryPassword);
        setNoticeSent(result.noticeSent);
      },
    });
  };

  const handleClose = () => {
    setTempPassword(null);
    onOpenChange(false);
  };

  const handleCopy = () => {
    if (tempPassword) {
      navigator.clipboard.writeText(tempPassword);
      toast.success('Password copied to clipboard');
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <div className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-lg bg-amber-500/10 text-amber-600 dark:text-amber-400 flex items-center justify-center">
              <KeyRound className="h-4 w-4" />
            </div>
            <div>
              <DialogTitle className="text-base font-bold text-slate-900 dark:text-white">
                Reset Password
              </DialogTitle>
              <DialogDescription className="text-xs text-muted-foreground">
                Issue a secure temporary password for {staff.firstName} {staff.lastName}.
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <div className="space-y-4 py-2 text-xs">
          {!tempPassword ? (
            <div className="p-3.5 rounded-xl bg-muted/20 border border-border/60 space-y-2">
              <p className="text-muted-foreground">
                This sets a new password on the account immediately and signs {staff.firstName} out
                everywhere. The password is shown here once, for you to pass on directly — it is not
                emailed and cannot be retrieved later.
              </p>
              <div className="text-[11px] text-muted-foreground">
                Official Email: <strong className="font-mono text-foreground">{staff.email}</strong>
              </div>
            </div>
          ) : (
            <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/30 space-y-2 text-center">
              <CheckCircle2 className="h-6 w-6 text-[#00A651] mx-auto" />
              <p className="font-bold text-sm text-[#007A3B] dark:text-[#00C862]">Temporary Password Generated</p>
              <div className="flex items-center justify-center gap-2 pt-1">
                <code className="px-3 py-1 bg-card border rounded-lg font-mono text-sm font-bold text-slate-900 dark:text-white shadow-2xs">
                  {tempPassword}
                </code>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={handleCopy}
                  className="h-8 px-2.5 text-xs gap-1 cursor-pointer"
                >
                  <Copy className="h-3.5 w-3.5" /> Copy
                </Button>
              </div>
              <p className="text-[10px] text-muted-foreground pt-1">
                {noticeSent
                  ? `Share this securely with ${staff.firstName}. They have been emailed that you reset it — the email does not contain the password.`
                  : `Share this securely with ${staff.firstName}. The notice email could not be sent, so they have no other warning that their sessions ended.`}
              </p>
            </div>
          )}
        </div>

        <DialogFooter className="gap-2">
          {!tempPassword ? (
            <>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={handleClose}
                disabled={isResettingPassword}
                className="text-xs cursor-pointer"
              >
                Cancel
              </Button>
              <Button
                type="button"
                size="sm"
                onClick={handleGenerate}
                disabled={isResettingPassword}
                className="bg-[#00A651] hover:bg-[#008C44] text-white font-bold text-xs gap-1.5 shadow-xs cursor-pointer"
              >
                {isResettingPassword && <Loader2 className="h-3.5 w-3.5 animate-spin" />}
                Generate & Reset
              </Button>
            </>
          ) : (
            <Button
              type="button"
              size="sm"
              onClick={handleClose}
              className="w-full bg-[#00A651] hover:bg-[#008C44] text-white font-bold text-xs cursor-pointer"
            >
              Done
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
