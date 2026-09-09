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
import { StaffMember, StaffRole } from '@/types/staff';

interface ChangeRoleDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  staff: StaffMember | null;
  roles: StaffRole[];
  selectedRoleId: string;
  onRoleIdChange: (roleId: string) => void;
  onSave: (e: React.FormEvent) => void;
}

export function ChangeRoleDialog({
  open,
  onOpenChange,
  staff,
  roles,
  selectedRoleId,
  onRoleIdChange,
  onSave,
}: ChangeRoleDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-base font-bold">
            Change Corporate Designation
          </DialogTitle>
          <DialogDescription className="text-xs text-muted-foreground">
            Update role assignment for {staff?.firstName} {staff?.lastName}.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={onSave} className="space-y-4 py-2 text-xs">
          <div className="space-y-1.5">
            <Label className="text-xs font-semibold">Select Designation / Role</Label>
            <Select value={selectedRoleId} onValueChange={onRoleIdChange}>
              <SelectTrigger className="h-9 text-xs">
                <SelectValue placeholder="Select role" />
              </SelectTrigger>
              <SelectContent>
                {roles.map((r) => (
                  <SelectItem key={r.id} value={r.id} className="text-xs">
                    {r.name}
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
              Save Role
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
