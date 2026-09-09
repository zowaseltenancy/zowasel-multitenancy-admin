'use client';

import { Plus, ShieldCheck } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { DepartmentRole } from '@/types/staff';
import { RoleCard } from '@/components/staff/RoleCard';

interface DepartmentRolesListProps {
  deptName: string;
  roles: DepartmentRole[];
  onCreateRole: () => void;
  onEditRole: (role: DepartmentRole) => void;
  onDeleteRole: (roleId: string) => void;
}

export function DepartmentRolesList({
  deptName,
  roles,
  onCreateRole,
  onEditRole,
  onDeleteRole,
}: DepartmentRolesListProps) {
  if (roles.length === 0) {
    return (
      <div className="text-center py-12 border border-dashed rounded-2xl bg-muted/10 space-y-3">
        <ShieldCheck className="h-8 w-8 text-muted-foreground mx-auto opacity-50" />
        <p className="text-sm font-semibold">No custom roles created for {deptName}</p>
        <p className="text-xs text-muted-foreground">
          Create department-specific roles with granular permissions for team members in this unit.
        </p>
        <Button size="sm" className="gap-1.5 text-xs" onClick={onCreateRole}>
          <Plus className="h-3.5 w-3.5" /> Create First Role
        </Button>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {roles.map((role) => (
        <RoleCard
          key={role.id}
          role={role}
          onEdit={() => onEditRole(role)}
          onDelete={() => onDeleteRole(role.id)}
        />
      ))}
    </div>
  );
}
