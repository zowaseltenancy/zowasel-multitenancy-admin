'use client';

import { ShieldCheck } from 'lucide-react';
import { DepartmentRole } from '@/types/staff';
import { Badge } from '@/components/ui/badge';

interface DepartmentRolesSectionProps {
  departmentRoles?: DepartmentRole[];
}

export function DepartmentRolesSection({ departmentRoles = [] }: DepartmentRolesSectionProps) {
  if (!departmentRoles || departmentRoles.length === 0) return null;

  return (
    <div className="p-5 sm:p-6 space-y-4">
      <div className="flex items-center gap-2">
        <ShieldCheck className="h-4 w-4 text-[#00A651]" />
        <h3 className="text-sm font-bold uppercase tracking-wider text-slate-900 dark:text-white">
          Scoped Department Roles & Access Matrix
        </h3>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {departmentRoles.map((role) => (
          <div key={role.id} className="p-3.5 rounded-xl bg-muted/20 border border-border/60 space-y-2">
            <div className="flex items-center justify-between">
              <span className="font-bold text-xs sm:text-sm text-slate-900 dark:text-slate-100">
                {role.name}
              </span>
              <Badge
                variant="outline"
                className="text-[10px] text-[#008C44] dark:text-[#00C862] border-[#00A651]/30"
              >
                {role.departmentId}
              </Badge>
            </div>
            {Array.isArray(role.permissions) ? (
              <div className="flex flex-wrap gap-1 pt-1">
                {role.permissions.map((p) => (
                  <Badge key={p} variant="secondary" className="text-[10px] font-mono">
                    {p}
                  </Badge>
                ))}
              </div>
            ) : role.permissions ? (
              <div className="flex flex-wrap gap-1 pt-1">
                {Object.entries(role.permissions).map(([mod, perms]) => (
                  <span
                    key={mod}
                    className="px-2 py-0.5 bg-card border rounded text-[10px] font-mono text-muted-foreground"
                  >
                    {mod}:{' '}
                    {typeof perms === 'object'
                      ? Object.keys(perms)
                          .filter((k) => (perms as any)[k])
                          .join('/')
                      : perms}
                  </span>
                ))}
              </div>
            ) : null}
          </div>
        ))}
      </div>
    </div>
  );
}