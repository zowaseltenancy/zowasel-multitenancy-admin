'use client';

import { Users, Plus, Search } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { TabsList, TabsTrigger } from '@/components/ui/tabs';

interface DepartmentTabControlsProps {
  activeTab: string;
  membersCount: number;
  rolesCount: number;
  memberSearch: string;
  onSearchChange: (value: string) => void;
  onCreateRole: () => void;
}

export function DepartmentTabControls({
  activeTab,
  membersCount,
  rolesCount,
  memberSearch,
  onSearchChange,
  onCreateRole,
}: DepartmentTabControlsProps) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b pb-3">
      <TabsList className="bg-muted/50 p-1">
        <TabsTrigger value="members" className="text-xs gap-2">
          <Users className="h-3.5 w-3.5" /> Members ({membersCount})
        </TabsTrigger>
        <TabsTrigger value="roles" className="text-xs gap-2">
          Roles ({rolesCount})
        </TabsTrigger>
      </TabsList>

      {activeTab === 'members' ? (
        <div className="relative w-full sm:w-64">
          <Search className="absolute left-2.5 top-2.5 h-3.5 w-3.5 text-muted-foreground" />
          <Input
            placeholder="Search department members..."
            value={memberSearch}
            onChange={(e) => onSearchChange(e.target.value)}
            className="pl-8 h-8 text-xs"
          />
        </div>
      ) : (
        <Button size="sm" onClick={onCreateRole} className="h-8 text-xs gap-1.5">
          <Plus className="h-3.5 w-3.5" /> Create Department Role
        </Button>
      )}
    </div>
  );
}