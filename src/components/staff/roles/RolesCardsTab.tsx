'use client';

import { Shield, ShieldCheck, Users, Pencil, Trash2, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { StaffRole, StaffMember } from '@/types/staff';

interface RolesCardsTabProps {
  roles: StaffRole[];
  getStaffForRole: (id: string) => StaffMember[];
  onOpenCreate: () => void;
  onOpenEdit: (role: StaffRole) => void;
  onOpenAssigned: (role: StaffRole) => void;
  onDelete: (role: StaffRole) => void;
}

export function RolesCardsTab({
  roles,
  getStaffForRole,
  onOpenCreate,
  onOpenEdit,
  onOpenAssigned,
  onDelete,
}: RolesCardsTabProps) {
  if (roles.length === 0) {
    return (
      <div className="border border-dashed border-border rounded-2xl p-12 text-center space-y-3 bg-card">
        <Shield className="h-10 w-10 text-muted-foreground mx-auto opacity-30" />
        <h3 className="font-bold text-sm text-foreground">No matching roles found</h3>
        <p className="text-xs text-muted-foreground max-w-sm mx-auto">
          No corporate access roles match your query. Try clearing the search filter or create a new custom role.
        </p>
        <Button onClick={onOpenCreate} size="sm" className="bg-[#00A651] hover:bg-[#008C44] text-white text-xs gap-1.5 mt-2">
          <Plus className="h-3.5 w-3.5" /> Create First Role
        </Button>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {roles.map((role) => {
        const assignedStaff = getStaffForRole(role.id);
        const permissionCount = (role.permissions || []).length;
        const isSystem = Boolean(role.isSystemRole);

        return (
          <div
            key={role.id}
            className="border border-border/60 rounded-2xl bg-card p-5 shadow-2xs flex flex-col justify-between gap-4 hover:border-border transition-all"
          >
            <div className="space-y-2">
              <div className="flex items-start justify-between gap-2">
                <div className="flex items-center gap-2">
                  <div className="h-8 w-8 rounded-lg bg-[#00A651]/10 text-[#00A651] flex items-center justify-center shrink-0">
                    {isSystem ? <ShieldCheck className="h-4 w-4" /> : <Shield className="h-4 w-4" />}
                  </div>
                  <div>
                    <h3 className="font-bold text-sm text-slate-900 dark:text-slate-100">{role.name}</h3>
                    <span className="text-[10px] font-mono text-muted-foreground block">ID: {role.id}</span>
                  </div>
                </div>

                <Badge
                  variant="outline"
                  className={`text-[10px] font-semibold shrink-0 ${
                    isSystem
                      ? 'text-purple-600 dark:text-purple-400 border-purple-500/30 bg-purple-500/10'
                      : 'text-[#008C44] dark:text-[#00C862] border-[#00A651]/30 bg-[#00A651]/10'
                  }`}
                >
                  {isSystem ? 'System Core' : 'Custom'}
                </Badge>
              </div>

              <p className="text-xs text-slate-600 dark:text-slate-300 line-clamp-2 min-h-[32px]">
                {role.description || 'Standard corporate access role.'}
              </p>
            </div>

            <div className="space-y-1.5 pt-2 border-t border-border/40">
              <div className="flex items-center justify-between text-[11px] text-muted-foreground">
                <span>Permission Scopes</span>
                <span className="font-mono font-bold text-slate-800 dark:text-slate-200">
                  {isSystem && role.permissions?.length === 0 ? 'Full Root Access' : `${permissionCount} Granted`}
                </span>
              </div>

              <div className="flex flex-wrap gap-1">
                {role.permissions && role.permissions.length > 0 ? (
                  role.permissions.slice(0, 3).map((pCode) => (
                    <span
                      key={pCode}
                      className="px-2 py-0.5 rounded-md bg-muted/40 border border-border/50 font-mono text-[10px] text-muted-foreground truncate max-w-[130px]"
                    >
                      {pCode}
                    </span>
                  ))
                ) : (
                  <span className="text-[11px] text-muted-foreground italic">
                    {isSystem ? 'All system capabilities unrestricted' : 'No explicit permissions assigned'}
                  </span>
                )}
                {role.permissions && role.permissions.length > 3 && (
                  <span className="px-1.5 py-0.5 rounded-md bg-muted text-[10px] font-mono text-muted-foreground font-semibold">
                    +{role.permissions.length - 3} more
                  </span>
                )}
              </div>
            </div>

            <div className="flex items-center justify-between pt-3 border-t border-border/40 text-xs">
              <button
                type="button"
                onClick={() => onOpenAssigned(role)}
                className="flex items-center gap-1.5 text-xs text-slate-700 dark:text-slate-300 font-semibold hover:text-[#00A651] transition-colors cursor-pointer"
              >
                <Users className="h-3.5 w-3.5 text-muted-foreground" />
                <span>{assignedStaff.length} Assigned</span>
              </button>

              <div className="flex items-center gap-1">
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => onOpenEdit(role)}
                  className="h-7.5 px-2 text-xs text-muted-foreground hover:text-foreground cursor-pointer gap-1"
                >
                  <Pencil className="h-3 w-3" /> Edit
                </Button>
                {!isSystem && (
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => onDelete(role)}
                    className="h-7.5 px-2 text-xs text-rose-500 hover:text-rose-600 hover:bg-rose-500/10 cursor-pointer"
                  >
                    <Trash2 className="h-3 w-3" />
                  </Button>
                )}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
