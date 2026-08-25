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
import { Input } from '@/components/ui/input';
import { toast } from 'sonner';
import { Loader2, ShieldCheck, Building2, CalendarPlus } from 'lucide-react';
import { StaffMember, StaffRole } from '@/types/staff';
import { useStaff } from '@/hooks/useStaff';

interface Props {
  staff: StaffMember;
  roles: StaffRole[];
  departments: string[];
  onSuccess: () => void;
}

export function StaffActions({ staff, roles, departments, onSuccess }: Props) {
  const { repo } = useStaff();

  // Role change
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

  // Department change
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

  // Leave request
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
      await new Promise(r => setTimeout(r, 1000));
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
    <div className="flex flex-wrap items-center gap-3 pt-4 border-t">
      {/* Change Role */}
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
              {roles.map(r => <SelectItem key={r.id} value={r.id}>{r.name}</SelectItem>)}
            </SelectContent>
          </Select>
          <Button onClick={handleRoleChange} disabled={loadingRole} className="mt-4">
            {loadingRole && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Save Role
          </Button>
        </DialogContent>
      </Dialog>

      {/* Change Department */}
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
              {departments.map(dept => <SelectItem key={dept} value={dept}>{dept}</SelectItem>)}
            </SelectContent>
          </Select>
          <Button onClick={handleDeptChange} disabled={loadingDept} className="mt-4">
            {loadingDept && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Save Department
          </Button>
        </DialogContent>
      </Dialog>

      {/* Leave Request */}
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
                <Input type="date" value={leaveStart} onChange={e => setLeaveStart(e.target.value)} />
              </div>
              <div>
                <label className="text-sm font-medium leading-none mb-1 block">End Date *</label>
                <Input type="date" value={leaveEnd} onChange={e => setLeaveEnd(e.target.value)} />
              </div>
            </div>
            <div>
              <label className="text-sm font-medium leading-none mb-1 block">Reason *</label>
              <Input value={leaveReason} onChange={e => setLeaveReason(e.target.value)} placeholder="Reason for leave" />
            </div>
            <Button onClick={handleLeaveRequest} disabled={loadingLeave} className="w-full">
              {loadingLeave && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Submit Request
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}