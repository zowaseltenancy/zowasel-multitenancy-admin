'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { toast } from 'sonner';
import { useStaff } from '@/hooks/useStaff';
import { DepartmentRole } from '@/types/staff';
import { ShieldCheck } from 'lucide-react';
import { RoleBuilderPermissionsList } from './roles/RoleBuilderPermissionsList';

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  departmentId: string;
  existingRole: DepartmentRole | null;
  onSave: (role: DepartmentRole) => void;
}

export function RoleBuilderDialog({
  open,
  onOpenChange,
  departmentId,
  existingRole,
  onSave,
}: Props) {
  const { repo, refresh } = useStaff();
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [selectedPermissions, setSelectedPermissions] = useState<string[]>([]);

  useEffect(() => {
    if (open) {
      setName(existingRole?.name || '');
      setDescription(existingRole?.description || '');
      if (Array.isArray(existingRole?.permissions)) {
        setSelectedPermissions(existingRole.permissions);
      } else {
        setSelectedPermissions([]);
      }
    }
  }, [open, existingRole]);

  const togglePermission = (code: string) => {
    setSelectedPermissions((prev) =>
      prev.includes(code) ? prev.filter((p) => p !== code) : [...prev, code]
    );
  };

  const handleSave = () => {
    if (!name.trim()) return toast.error('Role name required');

    const newRole: DepartmentRole = {
      id: existingRole?.id || `role-dept-${Date.now()}`,
      departmentId,
      name: name.trim(),
      description: description.trim(),
      permissions: selectedPermissions,
      isSystemRole: false,
    };

    const rolePayload = {
      name: newRole.name,
      description: newRole.description || '',
      permissions: selectedPermissions,
      departmentId,
      isSystemRole: false,
    };

    if (existingRole) {
      repo.updateRole(existingRole.id, rolePayload);
    } else {
      repo.addRole(rolePayload);
    }

    onSave(newRole);
    refresh();
    toast.success(`Department role "${name}" saved and synced to the RBAC Access Matrix.`);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-lg bg-[#00A651]/10 text-[#00A651] flex items-center justify-center">
              <ShieldCheck className="h-4 w-4" />
            </div>
            <div>
              <DialogTitle className="text-base font-bold text-slate-900 dark:text-white">
                {existingRole ? 'Edit Department Role' : 'Create Custom Department Role'}
              </DialogTitle>
              <DialogDescription className="text-xs text-muted-foreground">
                Task 4.2: Define fine-grained operational roles and assign scope arrays.
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <div className="space-y-4 py-2 text-xs">
          <div className="space-y-1.5">
            <Label htmlFor="roleName" className="font-semibold">
              Role Designation Name <span className="text-destructive">*</span>
            </Label>
            <Input
              id="roleName"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Regional Lead, Field Supervisor, Sales Auditor"
              className="h-9 text-xs"
            />
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="roleDesc" className="font-semibold">Description</Label>
            <Textarea
              id="roleDesc"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Scope of work, operational authority, and responsibility boundaries"
              rows={2}
              className="text-xs resize-none"
            />
          </div>

          <RoleBuilderPermissionsList
            selectedPermissions={selectedPermissions}
            onTogglePermission={togglePermission}
          />

          <Button
            type="button"
            onClick={handleSave}
            className="w-full bg-[#00A651] hover:bg-[#008C44] text-white font-bold text-xs h-9 shadow-xs cursor-pointer"
          >
            {existingRole ? 'Save Changes' : 'Create & Attach Role'}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}