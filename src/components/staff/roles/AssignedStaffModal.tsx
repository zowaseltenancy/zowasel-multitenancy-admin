'use client';

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Users, ExternalLink } from 'lucide-react';
import { StaffMember, StaffRole } from '@/types/staff';
import { useRouter } from 'next/navigation';

interface AssignedStaffModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  role: StaffRole | null;
  assignedStaff: StaffMember[];
}

export function AssignedStaffModal({
  open,
  onOpenChange,
  role,
  assignedStaff,
}: AssignedStaffModalProps) {
  const router = useRouter();

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <div className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-lg bg-blue-500/10 text-blue-600 dark:text-blue-400 flex items-center justify-center">
              <Users className="h-4 w-4" />
            </div>
            <div>
              <DialogTitle className="text-base font-bold">
                Assigned Staff: {role?.name}
              </DialogTitle>
              <DialogDescription className="text-xs text-muted-foreground">
                Personnel currently holding this corporate role and permissions.
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <div className="space-y-3 py-2 text-xs">
          {assignedStaff.length === 0 ? (
            <p className="text-muted-foreground italic text-center py-6">
              No staff members are currently assigned to this role.
            </p>
          ) : (
            <div className="space-y-2 max-h-64 overflow-y-auto pr-1">
              {assignedStaff.map((staff) => (
                <div
                  key={staff.id}
                  className="p-3 rounded-xl bg-muted/20 border border-border/60 flex items-center justify-between gap-3 hover:bg-muted/30 transition-colors"
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    <div className="h-8 w-8 rounded-lg bg-muted border flex items-center justify-center font-bold text-xs uppercase">
                      {staff.firstName?.[0]}{staff.lastName?.[0]}
                    </div>
                    <div className="min-w-0">
                      <p className="font-bold text-slate-900 dark:text-slate-100 truncate">
                        {staff.firstName} {staff.lastName}
                      </p>
                      <p className="text-[11px] text-muted-foreground font-mono truncate">
                        {staff.email} · {staff.department}
                      </p>
                    </div>
                  </div>

                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => {
                      onOpenChange(false);
                      router.push(`/admin/staff/${staff.id}`);
                    }}
                    className="h-7 text-xs text-[#00A651] hover:text-[#008C44] hover:bg-[#00A651]/10 gap-1 cursor-pointer shrink-0"
                  >
                    Profile <ExternalLink className="h-3 w-3" />
                  </Button>
                </div>
              ))}
            </div>
          )}
        </div>

        <DialogFooter>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => onOpenChange(false)}
            className="text-xs cursor-pointer w-full"
          >
            Close
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
