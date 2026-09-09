'use client';

import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Users,
  MoreVertical,
  Edit3,
  Settings,
  ArrowRight,
} from 'lucide-react';
import { Department, StaffMember } from '@/types/staff';
import { getDepartmentIcon } from '@/lib/departmentIcons';
import { useRouter } from 'next/navigation';
import { DepartmentHeadInfo } from './DepartmentHeadInfo';

export interface DepartmentWithMeta extends Department {
  staffCount: number;
  head: StaffMember | null;
}

interface DepartmentCardItemProps {
  dept: DepartmentWithMeta;
  onEdit: (dept: Department) => void;
}

export function DepartmentCardItem({ dept, onEdit }: DepartmentCardItemProps) {
  const router = useRouter();
  const Icon = getDepartmentIcon(dept.name);
  const headInitials = dept.head
    ? `${dept.head.firstName?.[0] || ''}${dept.head.lastName?.[0] || ''}`.toUpperCase()
    : null;

  return (
    <Card className="border rounded-xl bg-card hover:border-border/80 transition-all flex flex-col justify-between overflow-hidden shadow-2xs">
      <div className="p-5 space-y-4">
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-lg bg-muted flex items-center justify-center text-foreground shrink-0 border">
              <Icon className="h-5 w-5" />
            </div>
            <div>
              <h3 className="font-semibold text-base text-foreground leading-tight">
                {dept.name}
              </h3>
              <Badge variant="secondary" className="mt-1 text-[11px] font-medium">
                {dept.staffCount} {dept.staffCount === 1 ? 'member' : 'members'}
              </Badge>
            </div>
          </div>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground">
                <MoreVertical className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48">
              <DropdownMenuLabel>Actions</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => router.push(`/admin/staff/departments/${dept.id}`)}>
                <Users className="h-4 w-4 mr-2" /> View Members
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => router.push(`/admin/staff/departments/${dept.id}?tab=roles`)}>
                <Settings className="h-4 w-4 mr-2" /> Manage Roles
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => onEdit(dept)}>
                <Edit3 className="h-4 w-4 mr-2" /> Edit Department
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        <p className="text-xs text-muted-foreground line-clamp-2 min-h-[32px]">
          {dept.description || 'No description set.'}
        </p>

        <DepartmentHeadInfo dept={dept} head={dept.head} onEdit={onEdit} />
      </div>

      <div className="p-3 px-5 bg-muted/20 border-t flex items-center justify-between text-xs">
        <Button
          variant="ghost"
          size="sm"
          className="text-xs text-muted-foreground hover:text-foreground gap-1.5 p-0 h-auto font-medium"
          onClick={() => router.push(`/admin/staff/departments/${dept.id}?tab=roles`)}
        >
          <Settings className="h-3.5 w-3.5" /> Roles
        </Button>
        <Button
          variant="ghost"
          size="sm"
          className="text-xs text-foreground hover:text-foreground gap-1 p-0 h-auto font-medium"
          onClick={() => router.push(`/admin/staff/departments/${dept.id}`)}
        >
          View Details <ArrowRight className="h-3.5 w-3.5" />
        </Button>
      </div>
    </Card>
  );
}