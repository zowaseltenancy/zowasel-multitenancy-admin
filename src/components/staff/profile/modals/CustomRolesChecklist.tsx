'use client';

import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import { StaffRole } from '@/types/staff';

interface CustomRolesChecklistProps {
  roles: StaffRole[];
  selectedRoleIds: string[];
  toggleCustomRole: (roleId: string) => void;
}

export function CustomRolesChecklist({
  roles,
  selectedRoleIds,
  toggleCustomRole,
}: CustomRolesChecklistProps) {
  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <label className="text-xs font-semibold text-slate-900 dark:text-white">
          Department Roles (Custom Assignments)
        </label>
        <span className="text-[11px] text-muted-foreground font-mono">
          PUT /admin/staff/:id/roles
        </span>
      </div>

      <div className="max-h-56 overflow-y-auto rounded-xl border border-border/70 p-2 space-y-1.5 bg-muted/20">
        {roles.map((role) => {
          const isSelected = selectedRoleIds.includes(role.id);
          return (
            <div
              key={role.id}
              onClick={() => toggleCustomRole(role.id)}
              className={`flex items-start gap-3 p-2.5 rounded-lg border transition-all cursor-pointer ${
                isSelected
                  ? 'border-[#00A651]/40 bg-[#00A651]/5'
                  : 'border-transparent hover:bg-muted/50'
              }`}
            >
              <Checkbox
                checked={isSelected}
                onCheckedChange={() => toggleCustomRole(role.id)}
                className="mt-0.5"
              />
              <div className="space-y-0.5 min-w-0 flex-1">
                <div className="flex items-center justify-between gap-2">
                  <span className="text-xs font-semibold text-slate-900 dark:text-slate-100 truncate">
                    {role.name}
                  </span>
                  <Badge
                    variant="outline"
                    className="text-[10px] font-mono shrink-0 px-1.5 py-0"
                  >
                    {role.permissions?.length || 0} scopes
                  </Badge>
                </div>
                {role.description && (
                  <p className="text-[11px] text-muted-foreground line-clamp-1">
                    {role.description}
                  </p>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
