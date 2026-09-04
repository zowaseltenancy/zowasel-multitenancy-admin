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
import { useStaff } from '@/hooks/useStaff';

interface RoleDialogProps {
  staff: StaffMember;
  roles: StaffRole[];
  onSuccess: () => void;
}

export function StaffRoleDialog({ staff, roles, onSuccess }: RoleDialogProps) {
  const { repo } = useStaff();
  const [roleOpen, setRoleOpen] = useState(false);
  const [newRoleId, setNewRoleId] = useState(staff.roleId);
  const [loadingRole, setLoadingRole] = useState(false);

  const handleRoleChange = async () => {
    setLoadingRole(true);
    try {
      repo.updateStaff(staff.id, { roleId: newRoleId });
      toast.success('Role updated');
      setRoleOpen(false);
      onSuccess();
    } catch {
      toast.error('Failed to change role');
    } finally {
      setLoadingRole(false);
    }
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
  departments: string[];
  onSuccess: () => void;
}

export function StaffDepartmentDialog({ staff, departments, onSuccess }: DeptDialogProps) {
  const { repo } = useStaff();
  const [deptOpen, setDeptOpen] = useState(false);
  const [newDept, setNewDept] = useState(staff.department);
  const [loadingDept, setLoadingDept] = useState(false);

  const handleDeptChange = async () => {
    setLoadingDept(true);
    try {
      repo.updateStaff(staff.id, { department: newDept });
      toast.success('Department updated');
      setDeptOpen(false);
      onSuccess();
    } catch {
      toast.error('Failed to change department');
    } finally {
      setLoadingDept(false);
    }
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
              <SelectItem key={dept} value={dept}>
                {dept}
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