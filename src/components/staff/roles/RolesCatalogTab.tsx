'use client';

import React from 'react';
import { Badge } from '@/components/ui/badge';
import { PERMISSION_GROUPS } from '@/constants/permissions';
import { PermissionCategory } from '@/types/permissions';

interface RolesCatalogTabProps {
  getCategoryIcon: (cat: PermissionCategory) => React.ComponentType<{ className?: string }>;
}

export function RolesCatalogTab({ getCategoryIcon }: RolesCatalogTabProps) {
  return (
    <div className="space-y-4">
      {PERMISSION_GROUPS.map((group) => {
        const Icon = getCategoryIcon(group.category);
        return (
          <div key={group.category} className="border border-border/60 rounded-2xl bg-card p-5 shadow-2xs space-y-3">
            <div className="flex items-start justify-between pb-2 border-b border-border/40">
              <div className="flex items-center gap-2.5">
                <div className="h-8 w-8 rounded-lg bg-[#00A651]/10 text-[#00A651] flex items-center justify-center shrink-0">
                  <Icon className="h-4 w-4" />
                </div>
                <div>
                  <h3 className="font-bold text-sm text-slate-900 dark:text-white">{group.label}</h3>
                  <p className="text-xs text-muted-foreground">{group.description}</p>
                </div>
              </div>
              <Badge variant="outline" className="text-xs font-mono text-[#008C44] dark:text-[#00C862] border-[#00A651]/30">
                {group.permissions.length} Scopes
              </Badge>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {group.permissions.map((p) => (
                <div key={p.id} className="p-3 rounded-xl bg-muted/20 border border-border/60 space-y-1 text-xs">
                  <div className="flex items-center justify-between gap-2">
                    <span className="font-bold text-slate-900 dark:text-slate-100">{p.name}</span>
                    <div className="flex items-center gap-1">
                      {p.isSensitive && (
                        <Badge variant="outline" className="text-[9px] px-1 py-0 text-amber-600 border-amber-500/30 bg-amber-500/10">
                          Sensitive
                        </Badge>
                      )}
                      <span className="font-mono text-[10px] text-muted-foreground px-1.5 py-0.2 rounded bg-muted">
                        {p.action}
                      </span>
                    </div>
                  </div>
                  <p className="text-xs text-muted-foreground">{p.description}</p>
                  <code className="text-[10px] font-mono text-slate-600 dark:text-slate-400 block pt-0.5">
                    {p.code}
                  </code>
                </div>
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );
}
