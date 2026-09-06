'use client';

import React from 'react';
import { Copy, Check } from 'lucide-react';
import { TableRow, TableCell } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { StaffMember } from '@/types/staff';
import { getDepartmentIcon } from '@/lib/departmentIcons';
import { DirectoryRowActions } from './DirectoryRowActions';

interface DirectoryTableRowProps {
  staff: StaffMember;
  roleName: string;
  copiedId: string | null;
  onCopyId: (e: React.MouseEvent, id: string) => void;
  onRowClick: () => void;
  onViewProfile: (e: React.MouseEvent) => void;
  onEditStaff: (e: React.MouseEvent) => void;
  onOpenRoleDialog: (e: React.MouseEvent, staff: StaffMember) => void;
  onOpenDeptDialog: (e: React.MouseEvent, staff: StaffMember) => void;
  onOpenMessageDialog: (e: React.MouseEvent, staff: StaffMember) => void;
  onStatusToggle: (e: React.MouseEvent, staff: StaffMember) => void;
  formatDate: (dateStr?: string) => string;
}

export function DirectoryTableRow({
  staff,
  roleName,
  copiedId,
  onCopyId,
  onRowClick,
  onViewProfile,
  onEditStaff,
  onOpenRoleDialog,
  onOpenDeptDialog,
  onOpenMessageDialog,
  onStatusToggle,
  formatDate,
}: DirectoryTableRowProps) {
  const initials = `${staff.firstName?.[0] || ''}${staff.lastName?.[0] || ''}`.toUpperCase() || 'ZS';
  const DeptIcon = getDepartmentIcon(staff.department);
  const employeeId = staff.employeeId || `STA-${staff.id.slice(-5).toUpperCase()}`;

  return (
    <TableRow
      onClick={onRowClick}
      className="hover:bg-muted/30 transition-colors cursor-pointer border-b border-border/50 group"
    >
      {/* Staff Name & Avatar */}
      <TableCell className="pl-5 py-3.5">
        <div className="flex items-center gap-3">
          <div className="relative shrink-0">
            {staff.avatarUrl ? (
              <img
                src={staff.avatarUrl}
                alt={`${staff.firstName} ${staff.lastName}`}
                className="h-9 w-9 rounded-xl object-cover border border-border shadow-2xs"
              />
            ) : (
              <div className="h-9 w-9 rounded-xl bg-muted text-foreground font-bold text-xs flex items-center justify-center border shadow-2xs">
                {initials}
              </div>
            )}
            <span
              className={`absolute -bottom-0.5 -right-0.5 h-2.5 w-2.5 rounded-full border-2 border-card ${
                staff.status === 'active' ? 'bg-[#44883C]' : 'bg-amber-500'
              }`}
            />
          </div>

          <div className="min-w-0">
            <p className="font-bold text-xs sm:text-sm text-slate-900 dark:text-slate-100 group-hover:text-[#44883C] dark:group-hover:text-[#5cb850] transition-colors truncate">
              {staff.firstName} {staff.lastName}
            </p>
            <p className="text-[11px] text-muted-foreground font-mono truncate">
              {staff.email}
            </p>
          </div>
        </div>
      </TableCell>

      {/* Staff ID */}
      <TableCell className="py-3.5">
        <button
          type="button"
          onClick={(e) => onCopyId(e, employeeId)}
          className="inline-flex items-center gap-1 font-mono text-xs px-2 py-0.5 rounded-md bg-muted/40 hover:bg-muted text-slate-800 dark:text-slate-200 border border-border/50 transition-colors cursor-pointer"
          title="Click to copy Staff ID"
        >
          <span>{employeeId}</span>
          {copiedId === employeeId ? (
            <Check className="h-3 w-3 text-[#44883C]" />
          ) : (
            <Copy className="h-3 w-3 opacity-40 group-hover:opacity-80" />
          )}
        </button>
      </TableCell>

      {/* Department */}
      <TableCell className="py-3.5">
        <div className="flex items-center gap-1.5 text-xs text-slate-700 dark:text-slate-300 font-medium">
          <DeptIcon className="h-3.5 w-3.5 text-muted-foreground shrink-0" />
          <span className="truncate max-w-[140px]">{staff.department || 'General'}</span>
        </div>
      </TableCell>

      {/* Corporate Role */}
      <TableCell className="py-3.5">
        <span className="text-xs font-semibold text-slate-900 dark:text-slate-100 block truncate max-w-[150px]">
          {roleName}
        </span>
      </TableCell>

      {/* Status Badge */}
      <TableCell className="py-3.5">
        <Badge
          variant="outline"
          className={`text-[10.5px] font-semibold px-2 py-0.5 ${
            staff.status === 'active'
              ? 'text-[#44883C] dark:text-[#5cb850] border-[#44883C]/30 bg-[#44883C]/10'
              : 'text-amber-600 dark:text-amber-400 border-amber-500/30 bg-amber-500/10'
          }`}
        >
          <span
            className={`h-1.5 w-1.5 rounded-full mr-1.5 ${
              staff.status === 'active' ? 'bg-[#44883C]' : 'bg-amber-500'
            }`}
          />
          {staff.status === 'active' ? 'Active' : 'Inactive'}
        </Badge>
      </TableCell>

      {/* Date Joined */}
      <TableCell className="py-3.5 text-xs text-muted-foreground font-medium">
        {formatDate(staff.dateJoined)}
      </TableCell>

      {/* Row Actions */}
      <TableCell className="py-3.5 text-right pr-5" onClick={(e) => e.stopPropagation()}>
        <DirectoryRowActions
          staff={staff}
          onViewProfile={onViewProfile}
          onEditStaff={onEditStaff}
          onOpenRoleDialog={onOpenRoleDialog}
          onOpenDeptDialog={onOpenDeptDialog}
          onOpenMessageDialog={onOpenMessageDialog}
          onStatusToggle={onStatusToggle}
        />
      </TableCell>
    </TableRow>
  );
}
