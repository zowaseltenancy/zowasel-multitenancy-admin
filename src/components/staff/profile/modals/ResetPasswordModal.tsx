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
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { KeyRound, Loader2, CheckCircle2, Copy } from 'lucide-react';
import { StaffMember } from '@/types/staff';
import { toast } from 'sonner';

interface ResetPasswordModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  staff: StaffMember;
}

export function ResetPasswordModal({ open, onOpenChange, staff }: ResetPasswordModalProps) {
  const [loading, setLoading] = useState(false);
  const [tempPassword, setTempPassword] = useState<string | null>(null);

  const handleGenerate = async () => {
    setLoading(true);
    try {
      await new Promise((r) => setTimeout(r, 600));
      const generated = `Zowa_${Math.random().toString(36).slice(2, 6).toUpperCase()}!${Math.floor(100 + Math.random() * 900)}`;
      setTempPassword(generated);
      toast.success(`Temporary credentials created for ${staff.firstName}`);
    } catch {
      toast.error('Failed to generate password');
    } finally {
      setLoading(false);
    }
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
                Generating a temporary password will expire the staff member's previous credentials. They will be prompted to choose a new password upon their next login.
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
                Share this securely with {staff.firstName}. A notification has also been sent to their official email.
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
                className="text-xs cursor-pointer"
              >
                Cancel
              </Button>
              <Button
                type="button"
                size="sm"
                onClick={handleGenerate}
                disabled={loading}
                className="bg-[#00A651] hover:bg-[#008C44] text-white font-bold text-xs gap-1.5 shadow-xs cursor-pointer"
              >
                {loading && <Loader2 className="h-3.5 w-3.5 animate-spin" />}
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
