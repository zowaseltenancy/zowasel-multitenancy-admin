'use client';

import { useState, useEffect, useMemo } from 'react';
import { useStaff } from '@/hooks/useStaff';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Plus, Search, Loader2 } from 'lucide-react';
import { Department } from '@/types/staff';
import { DepartmentDrawer } from '@/components/staff/DepartmentDrawer';
import { DepartmentStatsCards } from '@/components/staff/department/DepartmentStatsCards';
import { DepartmentCardGrid, DepartmentWithMeta } from '@/components/staff/department/DepartmentCardGrid';

export default function DepartmentsPage() {
  const { repo, refresh } = useStaff();
  const [mounted, setMounted] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [selectedDept, setSelectedDept] = useState<Department | null>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  const departments = repo.getDepartments();
  const staffList = repo.getAllStaff();

  const deptData: DepartmentWithMeta[] = useMemo(() => {
    return (departments || []).map((dept) => {
      const assignedStaff = (staffList || []).filter((s) => s && s.department === dept.name);
      const head = dept.headId ? (staffList || []).find((s) => s && s.id === dept.headId) || null : null;
      return {
        ...dept,
        staffCount: assignedStaff.length,
        head,
      };
    });
  }, [departments, staffList]);

  const filteredDepts = useMemo(() => {
    if (!searchQuery.trim()) return deptData;
    const query = searchQuery.toLowerCase();
    return deptData.filter(
      (d) =>
        (d.name || '').toLowerCase().includes(query) ||
        (d.description || '').toLowerCase().includes(query) ||
        (d.head && `${d.head.firstName || ''} ${d.head.lastName || ''}`.toLowerCase().includes(query))
    );
  }, [deptData, searchQuery]);

  const totalUnits = deptData.length;
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

  if (!mounted) {
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
          refresh();
          setDrawerOpen(false);
        }}
      />
    </div>
  );
}
