'use client';

import { useMemo, useState, useEffect } from 'react';
import { useStaff } from '@/hooks/useStaff';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowRight, Plus, Building2, Users, UserCog } from 'lucide-react';
import { Department } from '@/types/staff';
import { useRouter } from 'next/navigation';
import { DepartmentDrawer } from '@/components/staff/DepartmentDrawer';

export default function DepartmentsPage() {
  const { repo, refresh } = useStaff();
  const [mounted, setMounted] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [selectedDept, setSelectedDept] = useState<Department | null>(null);
  const router = useRouter();

  useEffect(() => { setMounted(true); }, []);

  if (!mounted) return <div className="p-6"><Loader2 className="mx-auto animate-spin" /></div>;

  const departments = repo.getDepartments();
  const staffList = repo.getAllStaff();

  const deptData = departments.map(dept => ({
    ...dept,
    staffCount: staffList.filter(s => s.department === dept.name).length,
    headName: dept.headId ? staffList.find(s => s.id === dept.headId)?.firstName + ' ' + staffList.find(s => s.id === dept.headId)?.lastName : '—',
  }));

  const handleEdit = (dept: Department) => {
    setSelectedDept(dept);
    setDrawerOpen(true);
  };

  const handleCreate = () => {
    setSelectedDept(null);
    setDrawerOpen(true);
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Departments</h2>
          <p className="text-muted-foreground">Manage organizational departments and their heads</p>
        </div>
        <Button onClick={handleCreate} size="sm" className="gap-2">
          <Plus className="h-4 w-4" /> New Department
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {deptData.map(dept => (
          <Card
            key={dept.id}
            className="group cursor-pointer hover:shadow-lg transition-all"
            onClick={() => router.push(`/admin/staff/departments/${dept.id}`)}
          >
            <CardContent className="p-5">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10">
                    <Building2 className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <p className="font-semibold text-lg">{dept.name}</p>
                    <p className="text-sm text-muted-foreground line-clamp-2">{dept.description}</p>
                  </div>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={(e) => { e.stopPropagation(); handleEdit(dept); }}
                  className="opacity-0 group-hover:opacity-100"
                >
                  <UserCog className="h-4 w-4" />
                </Button>
              </div>
              <div className="mt-4 flex items-center gap-4 text-sm">
                <div className="flex items-center gap-1">
                  <Users className="h-4 w-4 text-muted-foreground" />
                  <span>{dept.staffCount} staff</span>
                </div>
                <div className="flex items-center gap-1">
                  <UserCog className="h-4 w-4 text-muted-foreground" />
                  <span>Head: {dept.headName}</span>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

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