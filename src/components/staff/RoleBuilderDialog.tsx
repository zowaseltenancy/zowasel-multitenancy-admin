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
import { useAdminRoles } from '@/features/staff/hooks/useStaff';
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
  // POST/PATCH /admin/roles for the role itself, then PUT
  // /admin/roles/{id}/permissions for its set — two endpoints, because the
  // permission set is replaced wholesale rather than patched.
  const { create, update, savePermissions, roles } = useAdminRoles({ limit: 100 });
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

    const fields = {
      name: name.trim(),
      description: description.trim(),
      departmentId,
    };

    // The permission set is applied once the role exists, so a rejected
    // create (a duplicate name, say) never leaves an empty role behind with
    // permissions attached to nothing.
    const applyPermissions = (roleId: string) => {
      savePermissions(roleId, selectedPermissions, {
        onSuccess: () => {
          onSave({
            id: roleId,
            departmentId,
            name: fields.name,
            description: fields.description,
            permissions: selectedPermissions,
            isSystemRole: false,
          } satisfies DepartmentRole);
          onOpenChange(false);
        },
      });
    };

    if (existingRole) {
      update(existingRole.id, fields, { onSuccess: () => applyPermissions(existingRole.id) });
      return;
    }

    create(fields, {
      onSuccess: () => {
        // POST does not hand the new id to this callback, so it is recovered
        // by name — unique server-side, which is what makes that safe.
        const created = roles.find((r) => r.name === fields.name);
        if (created) applyPermissions(created.id);
        else onOpenChange(false);
      },
    });
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