'use client';

import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Layers } from 'lucide-react';
import { PERMISSION_GROUPS } from '@/constants/permissions';

interface RoleBuilderPermissionsListProps {
  selectedPermissions: string[];
  onTogglePermission: (code: string) => void;
}

export function RoleBuilderPermissionsList({
  selectedPermissions,
  onTogglePermission,
}: RoleBuilderPermissionsListProps) {
  return (
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
                      onCheckedChange={() => onTogglePermission(p.code)}
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
  );
}