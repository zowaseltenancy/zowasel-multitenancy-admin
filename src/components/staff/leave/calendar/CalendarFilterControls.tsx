'use client';

import { Filter, Check, ChevronUp } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

interface CalendarFilterControlsProps {
  calendarDepartment: string;
  includePending: boolean;
  departments: { id: string; name: string }[];
  onSelectDepartment: (dept: string) => void;
  onTogglePending: () => void;
  onFoldUp: () => void;
}

export function CalendarFilterControls({
  calendarDepartment,
  includePending,
  departments,
  onSelectDepartment,
  onTogglePending,
  onFoldUp,
}: CalendarFilterControlsProps) {
  return (
    <div className="flex items-center gap-1.5 flex-wrap">
      <Select
        value={calendarDepartment}
        onValueChange={(val) => {
          if (val !== null) onSelectDepartment(val);
        }}
      >
        <SelectTrigger className="h-7 w-[145px] text-[11px]">
          <div className="flex items-center gap-1 truncate">
            <Filter className="h-2.5 w-2.5 text-muted-foreground" />
            <SelectValue placeholder="All Departments" />
          </div>
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all" className="text-xs font-semibold">
            All Departments
          </SelectItem>
          {departments.map((d) => (
            <SelectItem key={d.id} value={d.name} className="text-xs">
              {d.name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <button
        type="button"
        onClick={onTogglePending}
        className={`h-7 px-2 rounded-lg border text-[10.5px] font-medium flex items-center gap-1.5 cursor-pointer transition-colors ${
          includePending
            ? 'bg-amber-500/10 border-amber-500/30 text-amber-700 dark:text-amber-400 font-bold'
            : 'bg-card border-border/70 text-muted-foreground hover:bg-muted/40'
        }`}
        title="Include pending leave applications"
      >
        <div
          className={`h-2.5 w-2.5 rounded border flex items-center justify-center ${
            includePending ? 'bg-amber-500 border-amber-600 text-white' : 'border-border'
          }`}
        >
          {includePending && <Check className="h-2 w-2 stroke-[3]" />}
        </div>
        <span>Pending</span>
      </button>

      <Button
        type="button"
        variant="ghost"
        size="sm"
        onClick={onFoldUp}
        className="h-7 px-2 text-[11px] text-muted-foreground hover:text-foreground gap-1 cursor-pointer rounded-lg hover:bg-muted/60"
        title="Collapse calendar back up"
      >
        <ChevronUp className="h-3 w-3" />
        <span>Fold Up</span>
      </Button>
    </div>
  );
}