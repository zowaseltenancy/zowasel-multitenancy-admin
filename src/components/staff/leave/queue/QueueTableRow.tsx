'use client';

import { TableRow, TableCell } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { LeaveRequest } from '@/types/staff';
import { getDepartmentIcon } from '@/lib/departmentIcons';
import { formatDate } from '../leaveUtils';
import { QueueConflictCell } from './QueueConflictCell';
import { QueueRowActions } from './QueueRowActions';

interface QueueTableRowProps {
  req: LeaveRequest;
  isSelected: boolean;
  hasConflict: boolean;
  conflictingPeers: LeaveRequest[];
  currentUserId: string;
  onToggleSelect: () => void;
  onRowClick: () => void;
  onApprove: () => void;
  onReject: () => void;
}

export function QueueTableRow({
  req,
  isSelected,
  hasConflict,
  conflictingPeers,
  currentUserId,
  onToggleSelect,
  onRowClick,
  onApprove,
  onReject,
}: QueueTableRowProps) {
  const DeptIcon = getDepartmentIcon(req.department);
  const initials = req.employeeName
    ? req.employeeName.split(' ').map((n) => n[0]).join('').slice(0, 2).toUpperCase()
    : 'ST';

  return (
    <TableRow
      onClick={onRowClick}
      className={`hover:bg-muted/30 transition-colors cursor-pointer border-b border-border/50 group ${
        isSelected ? 'bg-muted/20' : ''
      }`}
    >
      {/* Checkbox */}
      <TableCell className="pl-4 py-3.5" onClick={(e) => e.stopPropagation()}>
        <input
          type="checkbox"
          checked={isSelected}
          onChange={onToggleSelect}
          className="h-4 w-4 rounded border-border text-[#00A651] focus:ring-[#00A651] cursor-pointer"
        />
      </TableCell>

      {/* Employee */}
      <TableCell className="py-3.5">
        <div className="flex items-center gap-2.5">
          <div className="h-8 w-8 rounded-xl bg-muted text-foreground font-bold text-xs flex items-center justify-center border shrink-0">
            {initials}
          </div>
          <div className="min-w-0">
            <p className="font-bold text-xs text-slate-900 dark:text-slate-100 group-hover:text-[#008C44] transition-colors truncate">
              {req.employeeName}
            </p>
            <p className="text-[10.5px] text-muted-foreground font-mono">{req.id}</p>
          </div>
        </div>
      </TableCell>

      {/* Department */}
      <TableCell className="py-3.5">
        <div className="flex items-center gap-1.5 text-xs text-slate-700 dark:text-slate-300 font-medium">
          <DeptIcon className="h-3.5 w-3.5 text-muted-foreground shrink-0" />
          <span>{req.department}</span>
        </div>
      </TableCell>

      {/* Type */}
      <TableCell className="py-3.5">
        <Badge variant="outline" className="text-[11px] font-semibold px-2 py-0.5 bg-muted/30 border-border/60">
          {req.type}
        </Badge>
      </TableCell>

      {/* Dates */}
      <TableCell className="py-3.5">
        <div className="text-xs font-medium text-slate-800 dark:text-slate-200">
          {formatDate(req.startDate)} → {formatDate(req.endDate)}
        </div>
      </TableCell>

      {/* Days */}
      <TableCell className="py-3.5 text-xs font-mono font-bold text-slate-900 dark:text-slate-100">
        {req.workingDays}d
      </TableCell>

      {/* Conflict Analysis */}
      <QueueConflictCell
        hasConflict={hasConflict}
        conflictingPeers={conflictingPeers}
      />

      {/* Actions */}
      <QueueRowActions
        isSelfReview={req.staffId === currentUserId}
        onRowClick={onRowClick}
        onApprove={onApprove}
        onReject={onReject}
      />
    </TableRow>
  );
}
