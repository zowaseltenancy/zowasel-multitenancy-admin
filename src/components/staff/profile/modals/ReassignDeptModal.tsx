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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Building2, Loader2 } from 'lucide-react';
import { StaffMember } from '@/types/staff';
import { toast } from 'sonner';
import { useStaff } from '@/features/staff/hooks/useStaff';

interface ReassignDeptModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  staff: StaffMember;
  /** { id, name }: PATCH /admin/staff/{id} takes departmentId. */
  departments: { id: string; name: string }[];
  onSuccess?: () => void;
}

export function ReassignDeptModal({
  open,
  onOpenChange,
  staff,
  departments,
  onSuccess,
}: ReassignDeptModalProps) {
  // PATCH /admin/staff/{id}. This was a setTimeout that reported success
  // without contacting the server, so the department appeared to change and
  // reverted on the next fetch.
  const { edit, isMutating: loading } = useStaff();
  const [selectedDept, setSelectedDept] = useState(staff.departmentId ?? '');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedDept) return;
    edit(staff.id, { departmentId: selectedDept }, {
      onSuccess: () => {
        onOpenChange(false);
        onSuccess?.();
      },
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <div className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-lg bg-[#00A651]/10 text-[#00A651] flex items-center justify-center">
              <Building2 className="h-4 w-4" />
            </div>
            <div>
              <DialogTitle className="text-base font-bold text-slate-900 dark:text-white">
                Reassign Department
              </DialogTitle>
              <DialogDescription className="text-xs text-muted-foreground">
                Move {staff.firstName} {staff.lastName} to a new organizational unit.
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 py-2 text-xs">
          <div className="space-y-1.5">
            <Label className="text-xs font-semibold">Select Department</Label>
            <Select value={selectedDept} onValueChange={setSelectedDept}>
              <SelectTrigger className="h-9 text-xs">
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
          </div>

          <DialogFooter className="gap-2 pt-2">
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => onOpenChange(false)}
              className="text-xs cursor-pointer"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              size="sm"
              disabled={loading}
              className="bg-[#00A651] hover:bg-[#008C44] text-white font-bold text-xs gap-1.5 shadow-xs cursor-pointer"
            >
              {loading && <Loader2 className="h-3.5 w-3.5 animate-spin" />}
              Save Reassignment
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
