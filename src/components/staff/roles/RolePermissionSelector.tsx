'use client';

import React from 'react';
import { Label } from '@/components/ui/label';
import { PERMISSION_GROUPS } from '@/constants/permissions';
import { PermissionCategory } from '@/types/permissions';

interface RolePermissionSelectorProps {
  selectedPermissions: string[];
  onChange: (permissions: string[]) => void;
}

export function RolePermissionSelector({
  selectedPermissions,
  onChange,
}: RolePermissionSelectorProps) {
  const togglePermission = (permCode: string) => {
    onChange(
      selectedPermissions.includes(permCode)
        ? selectedPermissions.filter((p) => p !== permCode)
        : [...selectedPermissions, permCode]
    );
  };

  const toggleCategoryGroup = (category: PermissionCategory) => {
    const groupPerms = (PERMISSION_GROUPS.find((g) => g.category === category)?.permissions || []).map((p) => p.code);
    const allSelected = groupPerms.every((code) => selectedPermissions.includes(code));
    onChange(
      allSelected
        ? selectedPermissions.filter((code) => !groupPerms.includes(code))
        : Array.from(new Set([...selectedPermissions, ...groupPerms]))
    );
  };

  return (
    <div className="space-y-3 pt-2">
      <div className="flex items-center justify-between pb-1 border-b border-border/40">
        <Label className="text-xs font-bold uppercase tracking-wider text-slate-900 dark:text-white">
          Granted Capabilities ({selectedPermissions.length} selected)
        </Label>
        <span className="text-[11px] text-muted-foreground">Toggle scopes individually or select full module</span>
      </div>

      <div className="space-y-3">
        {PERMISSION_GROUPS.map((group) => {
          const groupPermCodes = group.permissions.map((p) => p.code);
          const isAllSelected = groupPermCodes.every((c) => selectedPermissions.includes(c));

          return (
            <div key={group.category} className="p-3.5 rounded-xl bg-muted/20 border border-border/60 space-y-2.5">
              <div className="flex items-center justify-between">
                <span className="font-bold text-xs text-slate-900 dark:text-slate-100">{group.label}</span>
                <button
                  type="button"
                  onClick={() => toggleCategoryGroup(group.category)}
                  className="text-[11px] font-semibold text-[#008C44] dark:text-[#00C862] hover:underline cursor-pointer"
                >
                  {isAllSelected ? 'Deselect All' : 'Select All Module'}
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {group.permissions.map((perm) => {
                  const isChecked = selectedPermissions.includes(perm.code);
                  return (
                    <label
                      key={perm.id}
                      className={`flex items-start gap-2.5 p-2 rounded-lg border transition-all cursor-pointer ${
                        isChecked
                          ? 'bg-[#00A651]/10 border-[#00A651]/40 text-slate-900 dark:text-white'
                          : 'bg-card border-border/60 text-muted-foreground hover:bg-muted/40'
                      }`}
                    >
                      <input
                        type="checkbox"
                        checked={isChecked}
                        onChange={() => togglePermission(perm.code)}
                        className="mt-0.5 rounded text-[#00A651] focus:ring-[#00A651] cursor-pointer"
                      />
                      <div className="min-w-0">
                        <span className="font-semibold text-xs text-foreground truncate block">{perm.name}</span>
                        <span className="text-[10px] text-muted-foreground font-mono block truncate">{perm.code}</span>
                      </div>
                    </label>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
