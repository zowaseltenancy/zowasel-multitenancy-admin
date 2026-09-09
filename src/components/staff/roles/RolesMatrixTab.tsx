'use client';

import React, { useState } from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
} from '@/components/ui/dropdown-menu';
import { CheckCircle2, X, Plus, Check, SlidersHorizontal, ChevronDown } from 'lucide-react';
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
  const [highlightedRoleId, setHighlightedRoleId] = useState<string | null>(null);

  // Jump to where the selected role is on the table
  const handleJumpToRole = (roleId: string) => {
    setHighlightedRoleId(roleId);

    const colElement = document.getElementById(`role-col-${roleId}`);
    if (colElement) {
      colElement.scrollIntoView({
        behavior: 'smooth',
        inline: 'center',
        block: 'nearest',
      });
    }

    // Auto-clear highlight after 3 seconds
    setTimeout(() => {
      setHighlightedRoleId((prev) => (prev === roleId ? null : prev));
    }, 3000);
  };

  return (
    <div className="border border-border/60 rounded-2xl bg-card overflow-hidden shadow-2xs">
      {/* Top Title & Legend Header */}
      <div className="p-4 border-b border-border/60 flex flex-col sm:flex-row sm:items-center justify-between gap-2 bg-muted/10">
        <div>
          <h3 className="font-bold text-sm text-foreground">Platform RBAC Cross-Matrix</h3>
          <p className="text-xs text-muted-foreground">
            Compare granted capabilities across defined roles ({roles.length} total).
          </p>
        </div>

        {/* Legend, Roles Dropdown (close to Granted and Not Allowed), and Add Role CTA */}
        <div className="flex items-center gap-2.5 text-xs flex-wrap sm:flex-nowrap">
          <span className="flex items-center gap-1.5 text-[#44883C] dark:text-[#5cb850] font-semibold">
            <CheckCircle2 className="h-3.5 w-3.5" /> Granted
          </span>
          <span className="flex items-center gap-1.5 text-muted-foreground">
            <X className="h-3.5 w-3.5 opacity-40" /> Not Allowed
          </span>

          <div className="h-4 w-px bg-border/60 mx-0.5" />

          {/* Role Dropdown: Contains all roles in the role card area; selecting any jumps to where it is on the table */}
          <DropdownMenu>
            <DropdownMenuTrigger
              render={
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  className="h-7.5 px-2.5 text-xs font-semibold gap-1.5 rounded-lg border-border/70 bg-card hover:bg-muted/60 text-foreground cursor-pointer shadow-2xs transition-colors"
                >
                  <SlidersHorizontal className="h-3 w-3 text-[#44883C]" />
                  <span>Select Role ({roles.length})</span>
                  <ChevronDown className="h-3 w-3 text-muted-foreground opacity-70" />
                </Button>
              }
            />
            <DropdownMenuContent
              align="end"
              className="w-64 rounded-xl p-1.5 shadow-xl border border-border/70 max-h-80 overflow-y-auto [scrollbar-width:thin]"
            >
              <DropdownMenuLabel className="px-2 py-1 text-xs font-bold text-foreground">
                All Defined Roles ({roles.length})
                <span className="block text-[10.5px] font-normal text-muted-foreground mt-0.5">
                  Click any role to navigate to it on the table
                </span>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />

              {roles.map((role) => {
                const isCurrentHighlighted = highlightedRoleId === role.id;
                return (
                  <DropdownMenuItem
                    key={role.id}
                    onClick={() => handleJumpToRole(role.id)}
                    className={`flex items-center justify-between px-2.5 py-1.5 text-xs rounded-lg cursor-pointer transition-colors ${
                      isCurrentHighlighted
                        ? 'bg-[#44883C]/15 text-[#44883C] font-bold'
                        : 'hover:bg-muted/50 text-foreground'
                    }`}
                  >
                    <span className="truncate font-medium">{role.name}</span>
                    <span className="text-[10px] font-mono text-muted-foreground opacity-70 shrink-0 ml-2">
                      {role.isSystemRole ? 'System' : 'Custom'}
                    </span>
                  </DropdownMenuItem>
                );
              })}
            </DropdownMenuContent>
          </DropdownMenu>

          <Button
            type="button"
            size="sm"
            onClick={onOpenCreate}
            className="h-7.5 px-2.5 bg-[#44883C] hover:bg-[#3b7434] text-white font-bold text-xs gap-1 cursor-pointer shadow-2xs ml-0.5"
          >
            <Plus className="h-3.5 w-3.5" /> Add Role
          </Button>
        </div>
      </div>

      {/* Permission Cross-Matrix Table */}
      <div className="overflow-x-auto [scrollbar-width:thin]">
        <Table>
          <TableHeader>
            <TableRow className="bg-muted/30 border-b border-border/60">
              <TableHead className="sticky left-0 bg-card z-20 text-xs font-bold uppercase tracking-wider text-muted-foreground min-w-[220px] pl-5 py-2.5 border-r border-border/60 shadow-[2px_0_4px_rgba(0,0,0,0.02)]">
                Module / Permission Scope
              </TableHead>

              {/* All Roles from role card area displayed on the table */}
              {roles.map((r) => {
                const isNew = r.id === newlyCreatedRoleId;
                const isHighlighted = highlightedRoleId === r.id;

                return (
                  <TableHead
                    key={r.id}
                    id={`role-col-${r.id}`}
                    onClick={() => onOpenEdit(r)}
                    className={`text-xs font-bold text-center uppercase tracking-wider min-w-[135px] max-w-[180px] p-2.5 cursor-pointer transition-all duration-300 ${
                      isHighlighted
                        ? 'bg-[#44883C]/25 text-[#44883C] dark:text-[#5cb850] ring-2 ring-inset ring-[#44883C] shadow-sm'
                        : isNew
                        ? 'bg-[#44883C]/15 text-[#44883C] dark:text-[#5cb850] border-x-2 border-[#44883C]/40'
                        : 'text-muted-foreground hover:bg-muted/50 hover:text-foreground'
                    }`}
                    title="Click to edit role permissions"
                  >
                    <div className="flex flex-col items-center gap-0.5">
                      <span className="block truncate font-bold hover:text-[#44883C]">{r.name}</span>
                      <span className="text-[10px] font-mono opacity-60 normal-case font-normal">
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
                    <TableCell colSpan={roles.length + 1} className="py-2 pl-5 text-xs text-foreground">
                      <div className="flex items-center gap-2">
                        <Icon className="h-4 w-4 text-[#44883C]" />
                        <span>{group.label}</span>
                        <span className="text-[10px] font-mono font-normal text-muted-foreground">
                          ({group.permissions.length} capabilities)
                        </span>
                      </div>
                    </TableCell>
                  </TableRow>

                  {group.permissions.map((perm) => (
                    <TableRow key={perm.id} className="hover:bg-muted/20 border-b border-border/40 text-xs">
                      <TableCell className="sticky left-0 bg-card z-10 pl-6 py-2 border-r border-border/60 shadow-[2px_0_4px_rgba(0,0,0,0.02)]">
                        <div className="space-y-0.5">
                          <span className="font-semibold text-foreground">{perm.name}</span>
                          <span className="text-[10px] text-muted-foreground font-mono block">{perm.code}</span>
                        </div>
                      </TableCell>

                      {roles.map((r) => {
                        const isSuperAdmin = r.id === 'role-super-admin';
                        const hasPerm = isSuperAdmin || (r.permissions || []).includes(perm.code);
                        const isHighlighted = highlightedRoleId === r.id;

                        return (
                          <TableCell
                            key={r.id}
                            className={`text-center py-2 min-w-[135px] max-w-[180px] transition-colors duration-300 ${
                              isHighlighted ? 'bg-[#44883C]/10 dark:bg-[#44883C]/15' : ''
                            } ${!r.isSystemRole ? 'cursor-pointer hover:bg-muted/40' : ''}`}
                            onClick={() => !r.isSystemRole && onToggleMatrixPermission(r, perm.code)}
                          >
                            {hasPerm ? (
                              <span className="inline-flex items-center justify-center h-5 w-5 rounded-full bg-[#44883C]/15 text-[#44883C] dark:text-[#5cb850]">
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
