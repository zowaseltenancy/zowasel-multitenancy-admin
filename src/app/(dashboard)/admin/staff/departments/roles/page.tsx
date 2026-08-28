'use client';

import { useParams, useRouter } from 'next/navigation';
import { useStaff } from '@/hooks/useStaff';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Plus } from 'lucide-react';
import { useEffect, useState } from 'react';
import { Department, DepartmentRole } from '@/types/staff';
import { RoleCard } from '@/components/staff/RoleCard';
import { RoleBuilderDialog } from '@/components/staff/RoleBuilderDialog';

export default function DepartmentRolesPage() {
  const params = useParams();
  const router = useRouter();
  const { repo, refresh } = useStaff();
  const [dept, setDept] = useState<Department | null>(null);
  const [roles, setRoles] = useState<DepartmentRole[]>([]);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingRole, setEditingRole] = useState<DepartmentRole | null>(null);

  useEffect(() => {
    const d = repo.getDepartmentById(params.id as string);
    if (!d) return router.push('/admin/staff/departments');
    setDept(d);
    setRoles(repo.getDepartmentRoles(d.id));
  }, [params.id]);

  const handleSave = (role: DepartmentRole) => {
    if (editingRole) {
      repo.updateDepartmentRole(role.id, role);
    } else {
      repo.addDepartmentRole(role);
    }
    refresh();
    setDialogOpen(false);
    setEditingRole(null);
  };

  return (
    <div className="p-6 space-y-6 max-w-5xl mx-auto">
      <Button variant="ghost" onClick={() => router.back()} className="mb-2">
        <ArrowLeft className="h-4 w-4 mr-2" /> Back to Department
      </Button>
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Department Roles</h2>
          <p className="text-muted-foreground">Create custom roles with granular permissions for {dept?.name}</p>
        </div>
        <Button onClick={() => { setEditingRole(null); setDialogOpen(true); }} size="sm">
          <Plus className="h-4 w-4 mr-2" /> New Role
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {roles.map(role => (
          <RoleCard
            key={role.id}
            role={role}
            onEdit={() => { setEditingRole(role); setDialogOpen(true); }}
            onDelete={() => { repo.deleteDepartmentRole(role.id); refresh(); }}
          />
        ))}
      </div>

      <RoleBuilderDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        departmentId={dept?.id || ''}
        existingRole={editingRole}
        onSave={handleSave}
      />
    </div>
  );
}
