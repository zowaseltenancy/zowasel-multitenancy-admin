'use client';

import { Key, CheckCircle2, XCircle } from 'lucide-react';
import { ALL_PERMISSIONS, PERMISSION_CATEGORIES } from '@/constants/permissions';

interface PermissionsMatrixCardProps {
  grantedPermissions: Set<string>;
}

export function PermissionsMatrixCard({ grantedPermissions }: PermissionsMatrixCardProps) {
  const ssoCategories = [
    'staff',
    'departments',
    'roles',
    'permissions',
    'leave',
    'leads',
    'businesses',
    'users',
  ] as const;

  return (
    <div className="border border-border/60 rounded-2xl bg-card p-5 sm:p-6 shadow-2xs space-y-5">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2 border-b border-border/40">
        <div>
          <h4 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <Key className="h-4 w-4 text-[#00A651]" /> Resolved Permissions Matrix
          </h4>
          <p className="text-xs text-muted-foreground mt-0.5">
            Live authorization capability keys granted to this staff account based on role membership.
          </p>
        </div>
        <div className="flex items-center gap-3 text-xs text-muted-foreground">
          <span className="flex items-center gap-1.5">
            <CheckCircle2 className="h-3.5 w-3.5 text-[#00A651]" /> Granted ({grantedPermissions.size})
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {ssoCategories.map((category) => {
          const catMeta = PERMISSION_CATEGORIES[category as keyof typeof PERMISSION_CATEGORIES];
          const permissionsInCat = ALL_PERMISSIONS.filter((p) => p.category === category);
          if (permissionsInCat.length === 0) return null;

          return (
            <div
              key={category}
              className="rounded-xl border border-border/70 bg-card p-4 space-y-3"
            >
              <div className="flex items-center justify-between pb-1.5 border-b border-border/40">
                <div>
                  <h5 className="text-xs font-bold text-slate-900 dark:text-white capitalize">
                    {catMeta?.label || category}
                  </h5>
                  <span className="text-[10.5px] text-muted-foreground font-mono">
                    domain: {category}
                  </span>
                </div>
              </div>

              <div className="space-y-2">
                {permissionsInCat.map((perm) => {
                  const isGranted = grantedPermissions.has(perm.code);

                  return (
                    <div
                      key={perm.id}
                      className={`flex items-start justify-between gap-3 p-2 rounded-lg text-xs transition-colors ${
                        isGranted
                          ? 'bg-[#00A651]/5 border border-[#00A651]/20'
                          : 'bg-muted/30 border border-transparent opacity-60'
                      }`}
                    >
                      <div className="space-y-0.5 min-w-0">
                        <div className="flex items-center gap-2">
                          <span className="font-semibold text-slate-900 dark:text-slate-100 truncate">
                            {perm.name}
                          </span>
                          <span className="text-[10px] font-mono px-1 py-0.2 rounded bg-muted text-muted-foreground">
                            {perm.code}
                          </span>
                        </div>
                        <p className="text-[11px] text-muted-foreground line-clamp-1">
                          {perm.description}
                        </p>
                      </div>

                      <div className="shrink-0 pt-0.5">
                        {isGranted ? (
                          <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-[#008C44] dark:text-[#00C862]">
                            <CheckCircle2 className="h-3.5 w-3.5 text-[#00A651]" /> Active
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 text-[11px] text-muted-foreground">
                            <XCircle className="h-3.5 w-3.5 opacity-40" /> Revoked
                          </span>
                        )}
                      </div>
                    </div>
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
