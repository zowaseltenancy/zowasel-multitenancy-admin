'use client';

import { ShieldCheck, ArrowRight, Key } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { TabKey } from '../ProfileTabs';

interface RolesSnapshotCardProps {
  systemRole?: string;
  assignedRoleNames: string[];
  permissionsCount: number;
  onNavigateRoles: () => void;
}

export function RolesSnapshotCard({
  systemRole = 'STAFF',
  assignedRoleNames,
  permissionsCount,
  onNavigateRoles,
}: RolesSnapshotCardProps) {
  return (
    <div className="border border-border/60 rounded-2xl bg-card p-5 shadow-2xs space-y-4">
      <div className="flex items-center justify-between pb-1 border-b border-border/40">
        <div className="flex items-center gap-2">
          <ShieldCheck className="h-4 w-4 text-[#00A651]" />
          <h3 className="text-sm font-bold tracking-tight text-slate-900 dark:text-white">
            Assigned Roles & Access Scope
          </h3>
        </div>

        <button
          type="button"
          onClick={onNavigateRoles}
          className="text-xs font-semibold text-[#008C44] dark:text-[#00C862] hover:underline flex items-center gap-1 cursor-pointer"
        >
          View permissions matrix <ArrowRight className="h-3 w-3" />
        </button>
      </div>

      <div className="space-y-3 text-xs">
        <div className="flex items-center justify-between">
          <span className="text-[11px] text-muted-foreground">System Role (Platform Level):</span>
          <Badge
            variant="outline"
            className="text-[10.5px] font-mono uppercase font-bold text-[#008C44] dark:text-[#00C862] border-[#00A651]/30 bg-[#00A651]/10"
          >
            {systemRole}
          </Badge>
        </div>

        <div className="space-y-1.5 pt-1">
          <span className="text-[11px] text-muted-foreground block">Assigned Custom Roles:</span>
          <div className="flex flex-wrap gap-1.5">
            {assignedRoleNames.map((name, idx) => (
              <Badge
                key={idx}
                variant="secondary"
                className="text-xs font-medium px-2.5 py-1 bg-muted text-foreground border border-border"
              >
                {name}
              </Badge>
            ))}
          </div>
        </div>

        <div className="pt-2 border-t border-border/40 flex items-center justify-between text-muted-foreground text-[11.5px]">
          <span className="flex items-center gap-1.5">
            <Key className="h-3.5 w-3.5 text-[#00A651]" />
            {permissionsCount} active capability keys
          </span>
          <span className="font-mono text-[10.5px]">SSO Section 4.2</span>
        </div>
      </div>
    </div>
  );
}
