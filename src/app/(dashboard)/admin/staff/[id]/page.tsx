'use client';

import { useParams, useRouter } from 'next/navigation';
import { useStaff } from '@/hooks/useStaff';
import { useStaffMember } from '@/features/staff/hooks/useStaff';
import { StaffProfileView } from '@/components/staff/StaffProfileView';
import { Loader2 } from 'lucide-react';
import { useEffect, useState, useMemo } from 'react';
import { StaffMember, DepartmentRole } from '@/types/staff';
import { resolveStaffMember } from '@/components/staff/profile/resolveStaffMember';

export default function StaffProfilePage() {
  const params = useParams();
  const router = useRouter();
  const staffId = (params?.id as string) || '';

  const { repo, refresh } = useStaff();
  const [mounted, setMounted] = useState(false);

  // Optional live query against auth-service /admin/staff/:id
  const liveQuery = useStaffMember(staffId);

  useEffect(() => {
    setMounted(true);
  }, []);

  const roles = useMemo(() => repo.getRoles(), [repo]);

  // Resolve staff member either from live backend (if available) or local repository
  const resolvedStaff: StaffMember | null = useMemo(() => {
    const local = staffId && repo ? repo.getStaffById(staffId) : null;
    return resolveStaffMember(liveQuery.data, local, roles);
  }, [liveQuery.data, staffId, repo, roles]);

  const departmentRoles: DepartmentRole[] = useMemo(() => {
    if (!resolvedStaff) return [];
    const allDeptRoles = repo.getDepartmentRoles() || [];
    const assignedRoleIds = resolvedStaff.departmentRoleIds || [];
    return allDeptRoles.filter((r) => assignedRoleIds.includes(r.id));
  }, [repo, resolvedStaff]);

  if (!mounted || (liveQuery.isLoading && !resolvedStaff)) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-[#00A651]" />
      </div>
    );
  }

  if (!resolvedStaff) {
    router.push('/admin/staff/directory');
    return null;
  }

  return (
    <div className="w-full max-w-6xl mx-auto py-2 px-1 sm:px-4">
      <StaffProfileView
        staff={resolvedStaff}
        roles={roles}
        departmentRoles={departmentRoles}
        onRefresh={() => {
          liveQuery.refetch?.();
          refresh();
        }}
      />
    </div>
  );
}