'use client';

import { useState, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { ShieldCheck, Loader2 } from 'lucide-react';
import { StaffMember, StaffRole } from '@/types/staff';
import { useStaff } from '@/features/staff/hooks/useStaff';
import { toApiSystemRole } from '@/features/staff/api/staff.mappers';
import { toast } from 'sonner';
import { CustomRolesChecklist } from './CustomRolesChecklist';
import { SystemRoleSelect } from './SystemRoleSelect';

interface ChangeRoleModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  staff: StaffMember;
  roles: StaffRole[];
  onSuccess?: () => void;
}

export function ChangeRoleModal({
  open,
  onOpenChange,
  staff,
  roles,
  onSuccess,
}: ChangeRoleModalProps) {
  const { changeSystemRole, assignRoles, isMutating } = useStaff();

  const [systemRole, setSystemRole] = useState<'super_admin' | 'admin' | 'staff'>(
    (staff.systemRole as 'super_admin' | 'admin' | 'staff') || (staff.roleId === 'role-super-admin' ? 'super_admin' : staff.roleId === 'role-admin' ? 'admin' : 'staff')
  );

  const [selectedRoleIds, setSelectedRoleIds] = useState<string[]>(
    staff.roleIds && staff.roleIds.length > 0 ? staff.roleIds : staff.roleId ? [staff.roleId] : []
  );


  useEffect(() => {
    if (open) {
      setSystemRole(
        (staff.systemRole as 'super_admin' | 'admin' | 'staff') || (staff.roleId === 'role-super-admin' ? 'super_admin' : staff.roleId === 'role-admin' ? 'admin' : 'staff')
      );
      setSelectedRoleIds(
        staff.roleIds && staff.roleIds.length > 0 ? staff.roleIds : staff.roleId ? [staff.roleId] : []
      );
    }
  }, [open, staff]);

  const toggleCustomRole = (roleId: string) => {
    setSelectedRoleIds((prev) =>
      prev.includes(roleId) ? prev.filter((id) => id !== roleId) : [...prev, roleId]
    );
  };

  // Two separate endpoints, and they are sequenced rather than fired together:
  //
  //   PATCH /admin/staff/{id}/system-role  — the privilege tier, SUPER_ADMIN-only
  //   PUT   /admin/staff/{id}/roles        — the assignable role set
  //
  // The tier change goes first because it is the one that can be refused (only
  // a super admin may change it, never their own, never the last active one).
  // Applying the role set first would leave the two half-saved on that refusal.
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    changeSystemRole(staff.id, toApiSystemRole(systemRole), {
      onSuccess: () => {
        assignRoles(staff.id, selectedRoleIds, {
          onSuccess: () => {
            onOpenChange(false);
            onSuccess?.();
          },
        });
      },
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <div className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-lg bg-[#00A651]/10 text-[#00A651] flex items-center justify-center">
              <ShieldCheck className="h-4 w-4" />
            </div>
            <div>
              <DialogTitle className="text-base font-bold text-slate-900 dark:text-white">
                Modify Role Assignments
              </DialogTitle>
              <DialogDescription className="text-xs text-muted-foreground mt-0.5">
                {staff.firstName} {staff.lastName} ({staff.email})
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 pt-2">
          <SystemRoleSelect
            systemRole={systemRole}
            onRoleChange={setSystemRole}
          />

          <CustomRolesChecklist
            roles={roles}
            selectedRoleIds={selectedRoleIds}
            toggleCustomRole={toggleCustomRole}
          />

          <DialogFooter className="gap-2 sm:gap-0 pt-2">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => onOpenChange(false)}
              disabled={isMutating}
              className="text-xs h-8.5"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              size="sm"
              disabled={isMutating}
              className="text-xs h-8.5 bg-[#00A651] hover:bg-[#008C44] text-white font-medium"
            >
              {isMutating ? (
                <>
                  <Loader2 className="h-3.5 w-3.5 animate-spin mr-1.5" />
                  Updating...
                </>
              ) : (
                'Save Role Assignments'
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
