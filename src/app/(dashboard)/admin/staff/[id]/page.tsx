'use client';

import { useParams, useRouter } from 'next/navigation';
import { useStaff } from '@/hooks/useStaff';
import { StaffProfileView } from '@/components/staff/StaffProfileView';
import { StaffActions } from '@/components/staff/StaffActions';
import { Button } from '@/components/ui/button';
import { Loader2, ArrowLeft } from 'lucide-react';
import { useEffect, useState } from 'react';
import { StaffMember, DepartmentRole } from '@/types/staff';

export default function StaffProfilePage() {
  const params = useParams();
  const router = useRouter();
  const { repo, refresh } = useStaff();
  const [staff, setStaff] = useState<StaffMember | null>(null);
  const [loading, setLoading] = useState(true);
  const [mounted, setMounted] = useState(false);
  const [departmentRoles, setDepartmentRoles] = useState<DepartmentRole[]>([]);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted) return;
    const data = repo.getStaffById(params.id as string);
    if (data) {
      setStaff(data);
      // Fetch all department roles (could filter by staff's departmentRoleIds)
      const allDeptRoles = repo.getDepartmentRoles() || [];
      const assignedRoleIds = data.departmentRoleIds || [];
      const assignedRoles = allDeptRoles.filter(r => assignedRoleIds.includes(r.id));
      setDepartmentRoles(assignedRoles);
    } else {
      router.push('/admin/staff/directory');
    }
    setLoading(false);
  }, [params.id, mounted]);

  const roles = repo.getRoles();
  const departments = Array.from(new Set(repo.getAllStaff().map(s => s.department)));

  if (!mounted || loading || !staff) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto p-6 space-y-6">
      <Button variant="ghost" onClick={() => router.back()} className="mb-2">
        <ArrowLeft className="h-4 w-4 mr-2" /> Back
      </Button>

      <StaffProfileView
        staff={staff}
        roles={roles}
        departmentRoles={departmentRoles}   // ✅ new prop
      />
      <StaffActions staff={staff} roles={roles} departments={departments} onSuccess={refresh} />
    </div>
  );
}