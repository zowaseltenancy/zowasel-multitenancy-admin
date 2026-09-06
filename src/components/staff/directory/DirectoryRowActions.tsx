'use client';

import React from 'react';
import {
  Eye,
  Pencil,
  MoreHorizontal,
  Building2,
  UserX,
  UserCheck,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { StaffMember } from '@/types/staff';

interface DirectoryRowActionsProps {
  staff: StaffMember;
  onViewProfile: (e: React.MouseEvent) => void;
  onEditStaff: (e: React.MouseEvent) => void;
  onOpenRoleDialog?: (e: React.MouseEvent, staff: StaffMember) => void;
  onOpenDeptDialog: (e: React.MouseEvent, staff: StaffMember) => void;
  onOpenMessageDialog?: (e: React.MouseEvent, staff: StaffMember) => void;
  onStatusToggle: (e: React.MouseEvent, staff: StaffMember) => void;
}

export function DirectoryRowActions({
  staff,
  onViewProfile,
  onEditStaff,
  onOpenRoleDialog,
  onOpenDeptDialog,
  onOpenMessageDialog,
  onStatusToggle,
}: DirectoryRowActionsProps) {
  return (
    <div className="flex items-center justify-end gap-1">
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger
            render={
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={onViewProfile}
                className="h-8 w-8 p-0 text-muted-foreground hover:text-[#44883C] hover:bg-[#44883C]/10 cursor-pointer"
              >
                <Eye className="h-4 w-4" />
              </Button>
            }
          />
          <TooltipContent side="top">View Full Profile</TooltipContent>
        </Tooltip>
      </TooltipProvider>

      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger
            render={
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={onEditStaff}
                className="h-8 w-8 p-0 text-muted-foreground hover:text-foreground cursor-pointer"
              >
                <Pencil className="h-3.5 w-3.5" />
              </Button>
            }
          />
          <TooltipContent side="top">Edit Staff Information</TooltipContent>
        </Tooltip>
      </TooltipProvider>

      <DropdownMenu>
        <DropdownMenuTrigger
          render={
            <Button
              type="button"
              variant="ghost"
              size="sm"
              className="h-8 w-8 p-0 text-muted-foreground hover:text-foreground cursor-pointer"
            >
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          }
        />
        <DropdownMenuContent align="end" className="w-48">
          <DropdownMenuLabel className="text-[10px] font-bold uppercase text-muted-foreground tracking-wider">
            Actions
          </DropdownMenuLabel>
          <DropdownMenuItem onClick={onViewProfile} className="gap-2 text-xs cursor-pointer">
            <Eye className="h-3.5 w-3.5 text-muted-foreground" /> View Profile
          </DropdownMenuItem>
          <DropdownMenuItem onClick={onEditStaff} className="gap-2 text-xs cursor-pointer">
            <Pencil className="h-3.5 w-3.5 text-muted-foreground" /> Edit Details
          </DropdownMenuItem>
          <DropdownMenuItem onClick={(e) => onOpenDeptDialog(e, staff)} className="gap-2 text-xs cursor-pointer">
            <Building2 className="h-3.5 w-3.5 text-muted-foreground" /> Reassign Dept
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem
            onClick={(e) => onStatusToggle(e, staff)}
            className={`gap-2 text-xs cursor-pointer ${
              staff.status === 'active'
                ? 'text-amber-600 dark:text-amber-400'
                : 'text-[#44883C]'
            }`}
          >
            {staff.status === 'active' ? (
              <>
                <UserX className="h-3.5 w-3.5" /> Deactivate Staff
              </>
            ) : (
              <>
                <UserCheck className="h-3.5 w-3.5" /> Activate Staff
              </>
            )}
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
