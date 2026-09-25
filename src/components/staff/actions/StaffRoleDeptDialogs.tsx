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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { toast } from 'sonner';
import { Loader2, ShieldCheck, Building2 } from 'lucide-react';
import { StaffMember, StaffRole } from '@/types/staff';
import { useStaff } from '@/features/staff/hooks/useStaff';

interface RoleDialogProps {
  staff: StaffMember;
  roles: StaffRole[];
  onSuccess: () => void;
}

export function StaffRoleDialog({ staff, roles, onSuccess }: RoleDialogProps) {
  const { assignRoles, isMutating: loadingRole } = useStaff();
  const [roleOpen, setRoleOpen] = useState(false);
  const [newRoleId, setNewRoleId] = useState(staff.roleId);

  // PUT /admin/staff/{id}/roles replaces the whole set, so a single-select
  // control sends a one-element array — picking a role here therefore replaces
  // any others the member held, which is what a single-select means.
  const handleRoleChange = () => {
    assignRoles(staff.id, [newRoleId], {
      onSuccess: () => {
        setRoleOpen(false);
        onSuccess();
      },
    });
  };

  return (
    <Dialog open={roleOpen} onOpenChange={setRoleOpen}>
      <DialogTrigger className="inline-flex items-center justify-center gap-2 rounded-md border border-input bg-background px-4 py-2 text-sm font-medium hover:bg-accent hover:text-accent-foreground">
        <ShieldCheck className="h-4 w-4" />
        Change Role
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Assign New Role</DialogTitle>
        </DialogHeader>
        <Select value={newRoleId ?? ''} onValueChange={(val) => setNewRoleId(val ?? '')}>
          <SelectTrigger>
            <SelectValue placeholder="Select role" />
          </SelectTrigger>
          <SelectContent>
            {roles.map((r) => (
              <SelectItem key={r.id} value={r.id}>
                {r.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Button onClick={handleRoleChange} disabled={loadingRole} className="mt-4">
          {loadingRole && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          Save Role
        </Button>
      </DialogContent>
    </Dialog>
  );
}

interface DeptDialogProps {
  staff: StaffMember;
  /** { id, name }: the PATCH takes departmentId, so the id is the value. */
  departments: { id: string; name: string }[];
  onSuccess: () => void;
}

export function StaffDepartmentDialog({ staff, departments, onSuccess }: DeptDialogProps) {
  const { edit, isMutating: loadingDept } = useStaff();
  const [deptOpen, setDeptOpen] = useState(false);
  // The value is the department id now, not its name — PATCH takes departmentId.
  const [newDept, setNewDept] = useState(staff.departmentId ?? '');

  const handleDeptChange = () => {
    edit(staff.id, { departmentId: newDept }, {
      onSuccess: () => {
        setDeptOpen(false);
        onSuccess();
      },
    });
  };

  return (
    <Dialog open={deptOpen} onOpenChange={setDeptOpen}>
      <DialogTrigger className="inline-flex items-center justify-center gap-2 rounded-md border border-input bg-background px-4 py-2 text-sm font-medium hover:bg-accent hover:text-accent-foreground">
        <Building2 className="h-4 w-4" />
        Change Department
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Change Department</DialogTitle>
        </DialogHeader>
        <Select value={newDept ?? ''} onValueChange={(val) => setNewDept(val ?? '')}>
          <SelectTrigger>
            <SelectValue placeholder="Select department" />
          </SelectTrigger>
          <SelectContent>
            {departments.map((dept) => (
              <SelectItem key={dept.id} value={dept.id}>
                {dept.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Button onClick={handleDeptChange} disabled={loadingDept} className="mt-4">
          {loadingDept && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          Save Department
        </Button>
      </DialogContent>
    </Dialog>
  );
}