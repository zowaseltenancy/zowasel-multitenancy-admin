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
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';
import { useStaff } from '@/hooks/useStaff';
import { PERMISSION_GROUPS } from '@/constants/permissions';
import { DepartmentRole } from '@/types/staff';
import { ShieldCheck, Layers } from 'lucide-react';

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

    // Backend Contract: POST /api/v1/admin/roles + PUT /api/v1/admin/roles/:id/permissions
    const newRole: DepartmentRole = {
      id: existingRole?.id || `role-dept-${Date.now()}`,
      departmentId,
      name: name.trim(),
      description: description.trim(),
      permissions: selectedPermissions,
      isSystemRole: false,
    };

    // Save to unified roles repo so it appears on RBAC Access Matrix
    if (existingRole) {
      repo.updateRole(existingRole.id, {
        name: newRole.name,
        description: newRole.description,
        permissions: selectedPermissions,
        departmentId,
      });
    } else {
      repo.addRole({
        name: newRole.name,
        description: newRole.description || '',
        permissions: selectedPermissions,
        departmentId,
        isSystemRole: false,
      });
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

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label className="text-xs font-bold text-foreground">
                Granted Capabilities ({selectedPermissions.length} selected)
              </Label>
              <span className="text-[10.5px] font-mono text-muted-foreground">
                Flat Permission Array
              </span>
            </div>

            <div className="border border-border/60 rounded-xl overflow-hidden divide-y divide-border/60 max-h-72 overflow-y-auto bg-card">
              {PERMISSION_GROUPS.map((group) => (
                <div key={group.category} className="p-3">
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-bold text-xs text-foreground flex items-center gap-1.5">
                      <Layers className="h-3.5 w-3.5 text-[#00A651]" />
                      {group.label}
                    </span>
                    <span className="text-[10px] text-muted-foreground font-mono">
                      {group.permissions.length} scopes
                    </span>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5">
                    {group.permissions.map((p) => {
                      const isChecked = selectedPermissions.includes(p.code);
                      return (
                        <label
                          key={p.code}
                          className={`flex items-start gap-2 p-1.5 rounded-lg cursor-pointer transition-colors border ${
                            isChecked
                              ? 'bg-[#00A651]/10 border-[#00A651]/30'
                              : 'hover:bg-muted/30 border-transparent'
                          }`}
                        >
                          <Checkbox
                            checked={isChecked}
                            onCheckedChange={() => togglePermission(p.code)}
                            className="mt-0.5"
                          />
                          <div className="flex-1">
                            <span className="font-semibold text-[11.5px] text-foreground block leading-tight">
                              {p.name}
                            </span>
                            <span className="text-[10px] text-muted-foreground font-mono block">
                              {p.code}
                            </span>
                          </div>
                        </label>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
          </div>

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