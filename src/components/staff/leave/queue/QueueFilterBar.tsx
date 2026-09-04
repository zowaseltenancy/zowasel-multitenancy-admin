'use client';

import React from 'react';
import { Search, CheckSquare, X, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

interface QueueFilterBarProps {
  filterDepartment: string;
  onFilterDepartmentChange: (dept: string) => void;
  filterType: string;
  onFilterTypeChange: (type: string) => void;
  search: string;
  onSearchChange: (search: string) => void;
  departments: string[];
  selectedIds: string[];
  onClearSelection: () => void;
  onRejectSelected: () => void;
  onApproveSelected: () => void;
}

export function QueueFilterBar({
  filterDepartment,
  onFilterDepartmentChange,
  filterType,
  onFilterTypeChange,
  search,
  onSearchChange,
  departments,
  selectedIds,
  onClearSelection,
  onRejectSelected,
  onApproveSelected,
}: QueueFilterBarProps) {
  return (
    <div className="border border-border/60 rounded-2xl bg-card p-4 shadow-2xs space-y-3.5">
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        <div className="flex flex-wrap items-center gap-2">
          {/* Dept Filter */}
          <Select value={filterDepartment} onValueChange={onFilterDepartmentChange}>
            <SelectTrigger className="h-9 w-[180px] text-xs">
              <SelectValue placeholder="All Departments" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all" className="text-xs">All Departments</SelectItem>
              {departments.map((d) => (
                <SelectItem key={d} value={d} className="text-xs">
                  {d}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          {/* Leave Type Filter */}
          <Select value={filterType} onValueChange={onFilterTypeChange}>
            <SelectTrigger className="h-9 w-[160px] text-xs">
              <SelectValue placeholder="All Leave Types" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all" className="text-xs">All Leave Types</SelectItem>
              <SelectItem value="Annual" className="text-xs">Annual</SelectItem>
              <SelectItem value="Sick" className="text-xs">Sick</SelectItem>
              <SelectItem value="Casual" className="text-xs">Casual</SelectItem>
              <SelectItem value="Unpaid" className="text-xs">Unpaid</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Search */}
        <div className="relative sm:w-72">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            value={search}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Search by employee or reason..."
            className="pl-9 h-9 text-xs bg-muted/20"
          />
        </div>
      </div>

      {/* Batch Action Bar */}
      {selectedIds.length > 0 && (
        <div className="flex items-center justify-between p-2.5 rounded-xl bg-muted/50 border border-border/60 text-xs animate-in fade-in duration-150">
          <span className="font-semibold text-slate-900 dark:text-white flex items-center gap-2">
            <CheckSquare className="h-4 w-4 text-[#00A651]" />
            {selectedIds.length} request{selectedIds.length === 1 ? '' : 's'} selected for bulk action
          </span>

          <div className="flex items-center gap-2">
            <Button
              type="button"
              size="sm"
              variant="outline"
              onClick={onClearSelection}
              className="h-8 text-xs cursor-pointer"
            >
              Clear
            </Button>
            <Button
              type="button"
              size="sm"
              variant="destructive"
              onClick={onRejectSelected}
              className="h-8 text-xs font-semibold gap-1 cursor-pointer"
            >
              <X className="h-3.5 w-3.5" /> Reject Selected ({selectedIds.length})
            </Button>
            <Button
              type="button"
              size="sm"
              onClick={onApproveSelected}
              className="h-8 bg-[#00A651] hover:bg-[#008C44] text-white font-bold text-xs gap-1 cursor-pointer shadow-2xs"
            >
              <Check className="h-3.5 w-3.5" /> Approve Selected ({selectedIds.length})
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
