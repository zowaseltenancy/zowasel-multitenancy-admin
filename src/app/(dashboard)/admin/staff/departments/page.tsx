'use client';

import { useEffect, useMemo, useState } from 'react';
import { useDepartments } from '@/features/staff/hooks/useStaff';
import { mapDepartment } from '@/features/staff/api/staff.mappers';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Plus, Search, Loader2 } from 'lucide-react';
import { Department } from '@/types/staff';
import { DepartmentDrawer } from '@/components/staff/DepartmentDrawer';
import { DepartmentStatsCards } from '@/components/staff/department/DepartmentStatsCards';
import { DepartmentCardGrid, DepartmentWithMeta } from '@/components/staff/department/DepartmentCardGrid';

export default function DepartmentsPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [selectedDept, setSelectedDept] = useState<Department | null>(null);

  // Search is a server-side filter on GET /admin/departments, debounced so
  // typing doesn't fire a request per keystroke.
  const [debouncedSearch, setDebouncedSearch] = useState('');
  useEffect(() => {
    const timer = setTimeout(() => setDebouncedSearch(searchQuery), 300);
    return () => clearTimeout(timer);
  }, [searchQuery]);

  const { departments: departmentDtos, meta, isLoading } = useDepartments({
    limit: 100,
    ...(debouncedSearch.trim() ? { search: debouncedSearch.trim() } : {}),
  });

  // adminCount and the head both come from the endpoint, so there is no second
  // pass over a staff list to count assignments — which is what the previous
  // version did, and which only counted the staff its local store happened to
  // hold.
  const deptData: DepartmentWithMeta[] = useMemo(
    () =>
      departmentDtos.map((dto) => ({
        ...mapDepartment(dto),
        staffCount: dto.adminCount,
        head: dto.head
          ? {
              id: dto.head.id,
              firstName: dto.head.firstName ?? '',
              lastName: dto.head.lastName ?? '',
              email: dto.head.email,
            }
          : null,
      })),
    [departmentDtos],
  );

  // The server already applied the search.
  const filteredDepts = deptData;

  // The unfiltered total, so the "showing X of Y" line stays meaningful while
  // a search is active.
  const totalUnits = meta?.total ?? deptData.length;
  const assignedHeadsCount = deptData.filter((d) => Boolean(d.head)).length;
  const unassignedCount = totalUnits - assignedHeadsCount;
  const totalDepartmentStaff = deptData.reduce((acc, curr) => acc + curr.staffCount, 0);

  const handleEdit = (dept: Department) => {
    setSelectedDept(dept);
    setDrawerOpen(true);
  };

  const handleCreate = () => {
    setSelectedDept(null);
    setDrawerOpen(true);
  };

  if (isLoading) {
    return (
      <div className="p-8 flex justify-center items-center min-h-[400px]">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-6 max-w-7xl mx-auto">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground">Departments</h1>
          <p className="text-xs text-muted-foreground mt-1">
            Organize staff members into functional units, appoint leadership, and manage department scopes.
          </p>
        </div>
        <Button onClick={handleCreate} className="gap-2 shadow-xs shrink-0">
          <Plus className="h-4 w-4" /> New Department
        </Button>
      </div>

      {/* KPI Overview Metric Cards */}
      <DepartmentStatsCards
        totalUnits={totalUnits}
        assignedHeadsCount={assignedHeadsCount}
        unassignedCount={unassignedCount}
        totalDepartmentStaff={totalDepartmentStaff}
      />

      {/* Filter & Search Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-2">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search departments by name, description, or head..."
            className="pl-9 text-xs"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <p className="text-xs text-muted-foreground">
          Showing {filteredDepts.length} of {totalUnits} departments
        </p>
      </div>

      {/* Departments Grid */}
      <DepartmentCardGrid
        departments={filteredDepts}
        onCreate={handleCreate}
        onEdit={handleEdit}
      />

      <DepartmentDrawer
        open={drawerOpen}
        onOpenChange={setDrawerOpen}
        department={selectedDept}
        onSuccess={() => {
          // The drawer's mutations invalidate the department queries, so
          // there is nothing to refresh by hand — just close.
          setDrawerOpen(false);
        }}
      />
    </div>
  );
}
