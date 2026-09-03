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
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import { ShieldCheck, Shield, Loader2, UserCheck } from 'lucide-react';
import { StaffMember, StaffRole } from '@/types/staff';
import { useStaff } from '@/hooks/useStaff';
import { toast } from 'sonner';

interface ChangeRoleModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  staff: StaffMember;
  roles: StaffRole[];
  onSuccess?: () => void;
}

export function ChangeRoleModal({
  open,
  onOpenChange,
  staff,
  roles,
  onSuccess,
}: ChangeRoleModalProps) {
  const { repo, refresh } = useStaff();

  const [systemRole, setSystemRole] = useState<'super_admin' | 'admin' | 'staff'>(
    staff.systemRole || (staff.roleId === 'role-super-admin' ? 'super_admin' : staff.roleId === 'role-admin' ? 'admin' : 'staff')
  );

  const [selectedRoleIds, setSelectedRoleIds] = useState<string[]>(
    staff.roleIds && staff.roleIds.length > 0 ? staff.roleIds : staff.roleId ? [staff.roleId] : []
  );

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (open) {
      setSystemRole(
        staff.systemRole || (staff.roleId === 'role-super-admin' ? 'super_admin' : staff.roleId === 'role-admin' ? 'admin' : 'staff')
      );
      setSelectedRoleIds(
        staff.roleIds && staff.roleIds.length > 0 ? staff.roleIds : staff.roleId ? [staff.roleId] : []
      );
    }
  }, [open, staff]);

  const toggleCustomRole = (roleId: string) => {
    setSelectedRoleIds((prev) =>
      prev.includes(roleId) ? prev.filter((id) => id !== roleId) : [...prev, roleId]
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      // Backend Contract: PATCH /admin/staff/:id/system-role
      repo.updateStaffSystemRole(staff.id, systemRole);

      // Backend Contract: PUT /admin/staff/:id/roles
      repo.updateStaffRoles(staff.id, selectedRoleIds);

      refresh();
      toast.success(`Role assignments for ${staff.firstName} updated successfully.`);
      onOpenChange(false);
      onSuccess?.();
    } catch {
      toast.error('Failed to update roles');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <div className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-lg bg-[#00A651]/10 text-[#00A651] flex items-center justify-center">
              <ShieldCheck className="h-4 w-4" />
            </div>
            <div>
              <DialogTitle className="text-base font-bold text-slate-900 dark:text-white">
                Manage Staff Roles & Authorization
              </DialogTitle>
              <DialogDescription className="text-xs text-muted-foreground">
                Configure base system tier and custom operational roles for {staff.firstName} {staff.lastName}.
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 py-2 text-xs">
          {/* 1. Base System Role Tier (PATCH /admin/staff/:id/system-role) */}
          <div className="space-y-1.5 p-3 rounded-xl bg-muted/40 border border-border/60">
            <Label className="text-xs font-bold flex items-center gap-1.5 text-foreground">
              <Shield className="h-3.5 w-3.5 text-[#00A651]" />
              Base System Role (Platform Access Level)
            </Label>
            <p className="text-[11px] text-muted-foreground pb-1">
              Determines platform-wide authority tier (Super Admin, Admin, or Staff).
            </p>
            <Select
              value={systemRole}
              onValueChange={(val) => {
                if (val === 'super_admin' || val === 'admin' || val === 'staff') {
                  setSystemRole(val);
                }
              }}
            >
              <SelectTrigger className="h-9 text-xs bg-card">
                <SelectValue placeholder="Select system role" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="super_admin" className="text-xs font-semibold text-amber-600 dark:text-amber-400">
                  Super Admin (Full Unrestricted Access)
                </SelectItem>
                <SelectItem value="admin" className="text-xs font-semibold text-[#00A651]">
                  Platform Admin (Administrative Operations)
                </SelectItem>
                <SelectItem value="staff" className="text-xs font-normal">
                  Standard Staff Member
                </SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* 2. Custom Role Assignments (PUT /admin/staff/:id/roles) */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label className="text-xs font-bold text-foreground">
                Assigned Operational Roles ({selectedRoleIds.length} active)
              </Label>
              <span className="text-[10.5px] text-muted-foreground font-mono">
                Multi-Role Enabled
              </span>
            </div>
            <p className="text-[11px] text-muted-foreground">
              Select all corporate, departmental, or functional roles that apply to this staff member.
            </p>

            <div className="space-y-1.5 max-h-52 overflow-y-auto border border-border/60 rounded-xl p-2.5 bg-card">
              {roles.map((r) => {
                const isSelected = selectedRoleIds.includes(r.id);
                return (
                  <label
                    key={r.id}
                    className={`flex items-start gap-2.5 p-2 rounded-lg cursor-pointer transition-colors border ${
                      isSelected
                        ? 'bg-[#00A651]/10 border-[#00A651]/40'
                        : 'hover:bg-muted/40 border-transparent'
                    }`}
                  >
                    <Checkbox
                      checked={isSelected}
                      onCheckedChange={() => toggleCustomRole(r.id)}
                      className="mt-0.5"
                    />
                    <div className="flex-1 space-y-0.5">
                      <div className="flex items-center justify-between">
                        <span className="font-semibold text-xs text-foreground">{r.name}</span>
                        <div className="flex items-center gap-1">
                          {r.isSystemRole ? (
                            <Badge variant="outline" className="text-[9px] px-1 py-0 border-amber-500/30 text-amber-600 bg-amber-500/10">
                              System
                            </Badge>
                          ) : (
                            <Badge variant="secondary" className="text-[9px] px-1 py-0">
                              Custom
                            </Badge>
                          )}
                          <span className="text-[10px] text-muted-foreground font-mono">
                            {r.permissions?.length || 0} scopes
                          </span>
                        </div>
                      </div>
                      {r.description && (
                        <p className="text-[11px] text-muted-foreground line-clamp-1">
                          {r.description}
                        </p>
                      )}
                    </div>
                  </label>
                );
              })}
            </div>
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
              Save Role Assignments
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
