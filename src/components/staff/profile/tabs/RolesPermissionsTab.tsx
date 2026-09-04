'use client';

import { ShieldCheck, Shield, Edit } from 'lucide-react';
import { StaffMember, StaffRole } from '@/types/staff';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { PermissionsMatrixCard } from './PermissionsMatrixCard';

interface RolesPermissionsTabProps {
  staff: StaffMember;
  roles: StaffRole[];
  onChangeRoles: () => void;
  onChangeSystemRole: () => void;
}

export function RolesPermissionsTab({
  staff,
  roles,
  onChangeRoles,
  onChangeSystemRole,
}: RolesPermissionsTabProps) {
  // Resolve assigned custom roles
  const assignedRoleIds = staff.roleIds || (staff.roleId ? [staff.roleId] : []);
  const assignedRoles = roles.filter((r) => assignedRoleIds.includes(r.id));

  // Collect all granted permission keys across assigned roles and explicit staff permissions
  const grantedPermissions = new Set<string>([
    ...(staff.permissions || []),
    ...assignedRoles.flatMap((r) => r.permissions || []),
  ]);

  return (
    <div className="space-y-6">
      {/* 1. Header & Quick Actions */}
      <div className="border border-border/60 rounded-2xl bg-card p-5 sm:p-6 shadow-2xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-border/40">
          <div className="flex items-center gap-2.5">
            <div className="h-9 w-9 rounded-xl bg-[#00A651]/10 text-[#00A651] flex items-center justify-center shrink-0">
              <ShieldCheck className="h-5 w-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                Roles & Access Control
              </h3>
              <p className="text-xs text-muted-foreground">
                Zowasel SSO Backend Track (Section 4.2) role assignments and resolved permissions catalogue.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={onChangeSystemRole}
              className="h-8.5 text-xs font-medium gap-1.5 cursor-pointer"
            >
              <Shield className="h-3.5 w-3.5 text-muted-foreground" /> System Role
            </Button>
            <Button
              type="button"
              size="sm"
              onClick={onChangeRoles}
              className="h-8.5 bg-[#00A651] hover:bg-[#008C44] text-white font-medium text-xs gap-1.5 shadow-xs cursor-pointer"
            >
              <Edit className="h-3.5 w-3.5" /> Modify Role Assignments
            </Button>
          </div>
        </div>

        {/* System Role & Assigned Roles Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-1">
          {/* System Role Box */}
          <div className="rounded-xl border border-border/80 bg-muted/20 p-4 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground">
                System Role (Platform Level)
              </span>
              <Badge
                variant="outline"
                className="text-xs font-mono font-bold uppercase px-2 py-0.5 border-[#00A651]/30 bg-[#00A651]/10 text-[#008C44] dark:text-[#00C862]"
              >
                {staff.systemRole || 'STAFF'}
              </Badge>
            </div>
            <p className="text-xs text-slate-600 dark:text-slate-300">
              Governs baseline authentication scope across Zowasel SSO (SUPER_ADMIN, ADMIN, or STAFF). Managed independently via dedicated authorization endpoint.
            </p>
          </div>

          {/* Assigned Roles Box */}
          <div className="rounded-xl border border-border/80 bg-muted/20 p-4 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground">
                Assigned Department Roles ({assignedRoles.length})
              </span>
              <span className="text-[11px] font-mono text-muted-foreground">
                PUT /admin/staff/:id/roles
              </span>
            </div>
            {assignedRoles.length > 0 ? (
              <div className="flex flex-wrap gap-1.5">
                {assignedRoles.map((role) => (
                  <Badge
                    key={role.id}
                    variant="secondary"
                    className="text-xs font-medium px-2.5 py-1 bg-card border border-border text-foreground shadow-2xs"
                  >
                    {role.name}
                  </Badge>
                ))}
              </div>
            ) : (
              <p className="text-xs text-muted-foreground italic">
                No custom department roles assigned yet.
              </p>
            )}
          </div>
        </div>
      </div>

      {/* 2. Resolved Permissions Catalogue Matrix */}
      <PermissionsMatrixCard grantedPermissions={grantedPermissions} />
    </div>
  );
}
