'use client';

import { Button } from '@/components/ui/button';
import { Building2, Plus } from 'lucide-react';
import { Department } from '@/types/staff';
import { DepartmentCardItem, DepartmentWithMeta } from './DepartmentCardItem';

export type { DepartmentWithMeta };

interface DepartmentCardGridProps {
  departments: DepartmentWithMeta[];
  onCreate: () => void;
  onEdit: (dept: Department) => void;
}

export function DepartmentCardGrid({
  departments,
  onCreate,
  onEdit,
}: DepartmentCardGridProps) {
  if (departments.length === 0) {
    return (
      <div className="text-center py-16 border border-dashed rounded-xl bg-muted/10 space-y-3">
        <Building2 className="h-10 w-10 text-muted-foreground mx-auto opacity-40" />
        <p className="text-sm font-semibold">No departments found</p>
        <p className="text-xs text-muted-foreground">Try adjusting your search criteria or create a new department.</p>
        <Button onClick={onCreate} size="sm" variant="outline" className="gap-1.5 mt-2">
          <Plus className="h-3.5 w-3.5" /> Create Department
        </Button>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {departments.map((dept) => (
        <DepartmentCardItem key={dept.id} dept={dept} onEdit={onEdit} />
      ))}
    </div>
  );
}
