'use client';

import React from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { CheckCircle2, X, Plus, Check, Shield } from 'lucide-react';
import { StaffRole } from '@/types/staff';
import { PERMISSION_GROUPS } from '@/constants/permissions';
import { PermissionCategory } from '@/types/permissions';

interface RolesMatrixTabProps {
  roles: StaffRole[];
  newlyCreatedRoleId: string | null;
  getCategoryIcon: (cat: PermissionCategory) => React.ComponentType<{ className?: string }>;
  onOpenCreate: () => void;
  onOpenEdit: (role: StaffRole) => void;
  onToggleMatrixPermission: (role: StaffRole, code: string) => void;
}

export function RolesMatrixTab({
  roles,
  newlyCreatedRoleId,
  getCategoryIcon,
  onOpenCreate,
  onOpenEdit,
  onToggleMatrixPermission,
}: RolesMatrixTabProps) {
  return (
    <div className="border border-border/60 rounded-2xl bg-card overflow-hidden shadow-2xs">
      <div className="p-4 border-b border-border/60 flex flex-col sm:flex-row sm:items-center justify-between gap-2 bg-muted/10">
        <div>
          <h3 className="font-bold text-sm text-slate-900 dark:text-white">Platform RBAC Cross-Matrix</h3>
          <p className="text-xs text-muted-foreground">Compare granted capabilities across defined roles.</p>
        </div>
        <div className="flex items-center gap-2 text-xs">
          <span className="flex items-center gap-1.5 text-[#008C44] dark:text-[#00C862] font-semibold">
            <CheckCircle2 className="h-3.5 w-3.5" /> Granted
          </span>
          <span className="flex items-center gap-1.5 text-muted-foreground">
            <X className="h-3.5 w-3.5 opacity-40" /> Not Allowed
          </span>
          <Button
            type="button"
            size="sm"
            onClick={onOpenCreate}
            className="h-7.5 px-2.5 bg-[#00A651] hover:bg-[#008C44] text-white font-bold text-xs gap-1 cursor-pointer shadow-2xs ml-1"
          >
            <Plus className="h-3.5 w-3.5" /> Add Role
          </Button>
        </div>
      </div>

      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow className="bg-muted/30 border-b border-border/60">
              <TableHead className="text-xs font-bold uppercase tracking-wider text-muted-foreground min-w-[220px] pl-5">
                Module / Permission Scope
              </TableHead>
              {roles.map((r) => {
                const isNew = r.id === newlyCreatedRoleId;
                return (
                  <TableHead
                    key={r.id}
                    onClick={() => onOpenEdit(r)}
                    className={`text-xs font-bold text-center uppercase tracking-wider min-w-[130px] cursor-pointer transition-all ${
                      isNew
                        ? 'bg-emerald-500/15 text-[#008C44] dark:text-[#00C862] border-x-2 border-emerald-500/40'
                        : 'text-muted-foreground hover:bg-muted/50'
                    }`}
                  >
                    <div className="flex flex-col items-center gap-0.5">
                      <span className="block truncate font-bold hover:text-[#008C44]">{r.name}</span>
                      <span className="text-[10px] font-mono opacity-60 normal-case">
                        {r.isSystemRole ? '(System)' : '(Custom)'}
                      </span>
                    </div>
                  </TableHead>
                );
              })}
            </TableRow>
          </TableHeader>
          <TableBody>
            {PERMISSION_GROUPS.map((group) => {
              const Icon = getCategoryIcon(group.category);
              return (
                <React.Fragment key={group.category}>
                  <TableRow className="bg-muted/40 font-semibold border-b border-border/50">
                    <TableCell colSpan={roles.length + 1} className="py-2 pl-5 text-xs text-slate-800 dark:text-slate-200">
                      <div className="flex items-center gap-2">
                        <Icon className="h-4 w-4 text-[#00A651]" />
                        <span>{group.label}</span>
                        <span className="text-[10px] font-mono font-normal text-muted-foreground">
                          ({group.permissions.length} capabilities)
                        </span>
                      </div>
                    </TableCell>
                  </TableRow>

                  {group.permissions.map((perm) => (
                    <TableRow key={perm.id} className="hover:bg-muted/20 border-b border-border/40 text-xs">
                      <TableCell className="pl-6 py-2">
                        <div className="space-y-0.5">
                          <span className="font-semibold text-slate-900 dark:text-slate-100">{perm.name}</span>
                          <span className="text-[10px] text-muted-foreground font-mono block">{perm.code}</span>
                        </div>
                      </TableCell>

                      {roles.map((r) => {
                        const isSuperAdmin = r.id === 'role-super-admin';
                        const hasPerm = isSuperAdmin || (r.permissions || []).includes(perm.code);

                        return (
                          <TableCell
                            key={r.id}
                            className={`text-center py-2 ${!r.isSystemRole ? 'cursor-pointer hover:bg-muted/40' : ''}`}
                            onClick={() => !r.isSystemRole && onToggleMatrixPermission(r, perm.code)}
                          >
                            {hasPerm ? (
                              <span className="inline-flex items-center justify-center h-5 w-5 rounded-full bg-emerald-500/15 text-[#008C44] dark:text-[#00C862]">
                                <Check className="h-3 w-3 stroke-[2.5]" />
                              </span>
                            ) : (
                              <span className="inline-flex items-center justify-center h-5 w-5 rounded-full bg-muted/30 text-muted-foreground/40">
                                <X className="h-3 w-3" />
                              </span>
                            )}
                          </TableCell>
                        );
                      })}
                    </TableRow>
                  ))}
                </React.Fragment>
              );
            })}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
