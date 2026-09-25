'use client';

import React from 'react';
import { Search, RotateCcw, Loader2 } from 'lucide-react';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

interface DirectoryFilterBarProps {
  search: string;
  onSearchChange: (val: string) => void;
  statusFilter: string;
  onStatusFilterChange: (val: string) => void;
  deptFilter: string;
  onDeptFilterChange: (val: string) => void;
  roleFilter: string;
  onRoleFilterChange: (val: string) => void;
  // { id, name } rather than bare names, matching `roles` below: the filter
  // is sent to the server as departmentId, so the option needs the id while
  // the label stays the name.
  departments: { id: string; name: string }[];
  roles: { id: string; name: string }[];
  stats: { total: number; active: number; inactive: number };
  hasActiveFilters: boolean;
  onResetFilters: () => void;
  /** A search or filter request is in flight — shown inside the search field. */
  isFetching?: boolean;
}

export function DirectoryFilterBar({
  search,
  onSearchChange,
  statusFilter,
  onStatusFilterChange,
  deptFilter,
  onDeptFilterChange,
  roleFilter,
  onRoleFilterChange,
  departments,
  roles,
  stats,
  hasActiveFilters,
  isFetching = false,
  onResetFilters,
}: DirectoryFilterBarProps) {
  return (
    <div className="border border-border/60 rounded-2xl bg-card p-4 shadow-2xs space-y-3.5">
      <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
        {/* Status Quick Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 md:pb-0">
          {[
            { label: 'All Staff', value: 'all', count: stats.total },
            { label: 'Active', value: 'active', count: stats.active },
            { label: 'Inactive / On Leave', value: 'inactive', count: stats.inactive },
          ].map((st) => (
            <button
              key={st.value}
              type="button"
              onClick={() => onStatusFilterChange(st.value)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer flex items-center gap-1.5 ${
                statusFilter === st.value
                  ? 'bg-[#00A651] text-white shadow-2xs'
                  : 'bg-muted/40 hover:bg-muted text-muted-foreground border border-border/40'
              }`}
            >
              <span>{st.label}</span>
              <span
                className={`text-[10px] font-mono px-1.5 py-0.2 rounded-full font-bold ${
                  statusFilter === st.value
                    ? 'bg-white/20 text-white'
                    : 'bg-muted text-muted-foreground'
                }`}
              >
                {st.count}
              </span>
            </button>
          ))}
        </div>

        {/* Reset Filters CTA if active */}
        {hasActiveFilters && (
          <button
            type="button"
            onClick={onResetFilters}
            className="text-xs font-semibold text-muted-foreground hover:text-foreground flex items-center gap-1 cursor-pointer self-end md:self-auto"
          >
            <RotateCcw className="h-3 w-3" /> Reset Filters
          </button>
        )}
      </div>

      {/* Search & Dropdown Selectors */}
      <div className="grid grid-cols-1 sm:grid-cols-12 gap-3">
        <div className="sm:col-span-6 relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            value={search}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Search by name, official email, or Staff ID..."
            className="pl-9 pr-9 h-9.5 text-xs bg-muted/20"
          />
          {/* The one moving part while a query is in flight. The rows below
              stay on screen, so without this there is no sign the typed term
              has not been applied yet. */}
          {isFetching && (
            <Loader2
              aria-hidden
              className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 animate-spin text-muted-foreground"
            />
          )}
        </div>

        <div className="sm:col-span-3">
          <Select value={deptFilter} onValueChange={onDeptFilterChange}>
            <SelectTrigger className="h-9.5 text-xs">
              <SelectValue placeholder="All Departments" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all" className="text-xs">All Departments</SelectItem>
              {departments.map((dept) => (
                <SelectItem key={dept.id} value={dept.id} className="text-xs">
                  {dept.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="sm:col-span-3">
          <Select value={roleFilter} onValueChange={onRoleFilterChange}>
            <SelectTrigger className="h-9.5 text-xs">
              <SelectValue placeholder="All Corporate Roles" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all" className="text-xs">All Corporate Roles</SelectItem>
              {roles.map((r) => (
                <SelectItem key={r.id} value={r.id} className="text-xs">
                  {r.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>
    </div>
  );
}
