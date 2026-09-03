'use client';

import { useParams, useRouter } from 'next/navigation';
import { useStaff } from '@/hooks/useStaff';
import { StaffProfileView } from '@/components/staff/StaffProfileView';
import { Loader2 } from 'lucide-react';
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
      const allDeptRoles = repo.getDepartmentRoles() || [];
      const assignedRoleIds = data.departmentRoleIds || [];
      const assignedRoles = allDeptRoles.filter((r) => assignedRoleIds.includes(r.id));
      setDepartmentRoles(assignedRoles);
    } else {
      router.push('/admin/staff/directory');
    }
    setLoading(false);
  }, [params.id, mounted]);

  const roles = repo.getRoles();

  if (!mounted || loading || !staff) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-[#00A651]" />
      </div>
    );
  }

  return (
    <div className="w-full max-w-6xl mx-auto py-2 px-1 sm:px-4">
      <StaffProfileView
        staff={staff}
        roles={roles}
        departmentRoles={departmentRoles}
        onRefresh={refresh}
      />
    </div>
  );
}