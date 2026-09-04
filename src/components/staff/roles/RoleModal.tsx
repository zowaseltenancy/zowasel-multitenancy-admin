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
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Shield } from 'lucide-react';
import { StaffRole } from '@/types/staff';
import { toast } from 'sonner';
import { RolePermissionSelector } from './RolePermissionSelector';

interface RoleModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  editingRole: StaffRole | null;
  onSaveRole: (data: { name: string; description: string; departmentId?: string; permissions: string[] }) => void;
}

export function RoleModal({
  open,
  onOpenChange,
  editingRole,
  onSaveRole,
}: RoleModalProps) {
  const [roleName, setRoleName] = useState('');
  const [roleDescription, setRoleDescription] = useState('');
  const [selectedDeptId, setSelectedDeptId] = useState('');
  const [selectedPermissions, setSelectedPermissions] = useState<string[]>([]);

  useEffect(() => {
    if (open) {
      setRoleName(editingRole?.name || '');
      setRoleDescription(editingRole?.description || '');
      setSelectedDeptId(editingRole?.departmentId || '');
      setSelectedPermissions(editingRole?.permissions || []);
    }
  }, [open, editingRole]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!roleName.trim()) return toast.error('Please enter a role designation name.');
    onSaveRole({
      name: roleName.trim(),
      description: roleDescription.trim(),
      departmentId: selectedDeptId.trim() || undefined,
      permissions: selectedPermissions,
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-2xl max-h-[90vh] flex flex-col p-0 overflow-hidden">
        <DialogHeader className="p-6 pb-4 border-b border-border/60">
          <div className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-lg bg-[#00A651]/10 text-[#00A651] flex items-center justify-center">
              <Shield className="h-4 w-4" />
            </div>
            <div>
              <DialogTitle className="text-base font-bold">
                {editingRole ? `Edit Role: ${editingRole.name}` : 'Create Corporate Role'}
              </DialogTitle>
              <DialogDescription className="text-xs text-muted-foreground">
                Configure designation parameters and assign granular permission scopes.
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6 space-y-4 text-xs">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            <div className="space-y-1">
              <Label className="text-xs font-semibold">Role Name / Designation</Label>
              <Input
                value={roleName}
                onChange={(e) => setRoleName(e.target.value)}
                placeholder="e.g. Agronomy Field Lead"
                required
                className="h-9 text-xs"
              />
            </div>
            <div className="space-y-1">
              <Label className="text-xs font-semibold">Department Scope (Optional)</Label>
              <Input
                value={selectedDeptId}
                onChange={(e) => setSelectedDeptId(e.target.value)}
                placeholder="e.g. Field Operations / Agronomy"
                className="h-9 text-xs"
              />
            </div>
          </div>

          <div className="space-y-1">
            <Label className="text-xs font-semibold">Role Description</Label>
            <Textarea
              value={roleDescription}
              onChange={(e) => setRoleDescription(e.target.value)}
              placeholder="Describe responsibilities and expected platform capabilities..."
              rows={2}
              className="text-xs"
            />
          </div>

          <RolePermissionSelector
            selectedPermissions={selectedPermissions}
            onChange={setSelectedPermissions}
          />

          <DialogFooter className="p-4 bg-muted/20 border-t border-border/60 gap-2">
            <Button type="button" variant="ghost" size="sm" onClick={() => onOpenChange(false)} className="text-xs">
              Cancel
            </Button>
            <Button type="submit" size="sm" className="bg-[#00A651] hover:bg-[#008C44] text-white font-bold text-xs">
              {editingRole ? 'Save Changes' : 'Create Role'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
