'use client';

import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { StaffMember } from '@/types/staff';

interface ReassignDeptDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  staff: StaffMember | null;
  /** { id, name }: reassignment PATCHes departmentId, so the id is the value. */
  departments: { id: string; name: string }[];
  selectedDept: string;
  onDeptChange: (dept: string) => void;
  onSave: (e: React.FormEvent) => void;
}

export function ReassignDeptDialog({
  open,
  onOpenChange,
  staff,
  departments,
  selectedDept,
  onDeptChange,
  onSave,
}: ReassignDeptDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-base font-bold">
            Reassign Department
          </DialogTitle>
          <DialogDescription className="text-xs text-muted-foreground">
            Move {staff?.firstName} {staff?.lastName} to a new organizational unit.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={onSave} className="space-y-4 py-2 text-xs">
          <div className="space-y-1.5">
            <Label className="text-xs font-semibold">Select Department</Label>
            <Select value={selectedDept} onValueChange={onDeptChange}>
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
              className="bg-[#00A651] hover:bg-[#008C44] text-white font-bold text-xs cursor-pointer"
            >
              Save Department
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
