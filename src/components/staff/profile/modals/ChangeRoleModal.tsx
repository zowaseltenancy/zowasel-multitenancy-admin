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
import { useStaff } from '@/hooks/useStaff';
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
  const { repo, refresh } = useStaff();

  const [systemRole, setSystemRole] = useState<'super_admin' | 'admin' | 'staff'>(
    (staff.systemRole as 'super_admin' | 'admin' | 'staff') || (staff.roleId === 'role-super-admin' ? 'super_admin' : staff.roleId === 'role-admin' ? 'admin' : 'staff')
  );

  const [selectedRoleIds, setSelectedRoleIds] = useState<string[]>(
    staff.roleIds && staff.roleIds.length > 0 ? staff.roleIds : staff.roleId ? [staff.roleId] : []
  );

  const [loading, setLoading] = useState(false);

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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      repo.updateStaffSystemRole(staff.id, systemRole);
      repo.updateStaffRoles(staff.id, selectedRoleIds);
      refresh();
      toast.success(`Role assignments for ${staff.firstName} updated successfully.`);
      onOpenChange(false);
      onSuccess?.();
    } catch {
      toast.error('Failed to update roles');
    } finally {
      setLoading(false);
    }
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
              disabled={loading}
              className="text-xs h-8.5"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              size="sm"
              disabled={loading}
              className="text-xs h-8.5 bg-[#00A651] hover:bg-[#008C44] text-white font-medium"
            >
              {loading ? (
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
