'use client';

import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

interface SystemRoleSelectProps {
  systemRole: 'super_admin' | 'admin' | 'staff';
  onRoleChange: (val: 'super_admin' | 'admin' | 'staff') => void;
}

export function SystemRoleSelect({ systemRole, onRoleChange }: SystemRoleSelectProps) {
  return (
    <div className="space-y-1.5">
      <div className="flex items-center justify-between">
        <Label htmlFor="system-role-select" className="text-xs font-semibold">
          Platform System Role (SSO Identity Scope)
        </Label>
        <span className="text-[11px] text-muted-foreground font-mono">
          PATCH .../system-role
        </span>
      </div>

      <Select
        value={systemRole}
        onValueChange={(val) => onRoleChange(val as 'super_admin' | 'admin' | 'staff')}
      >
        <SelectTrigger id="system-role-select" className="text-xs h-9">
          <SelectValue placeholder="Select platform system role" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="staff" className="text-xs">
            <div className="space-y-0.5 py-0.5">
              <span className="font-semibold block">STAFF</span>
              <span className="text-[11px] text-muted-foreground block">
                Standard internal team access scoped to departmental assignments.
              </span>
            </div>
          </SelectItem>
          <SelectItem value="admin" className="text-xs">
            <div className="space-y-0.5 py-0.5">
              <span className="font-semibold block">ADMIN</span>
              <span className="text-[11px] text-muted-foreground block">
                Administrative capability across user management and departments.
              </span>
            </div>
          </SelectItem>
          <SelectItem value="super_admin" className="text-xs">
            <div className="space-y-0.5 py-0.5">
              <span className="font-semibold block text-purple-600 dark:text-purple-400">
                SUPER_ADMIN
              </span>
              <span className="text-[11px] text-muted-foreground block">
                Full platform control including security settings and role elevations.
              </span>
            </div>
          </SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
}