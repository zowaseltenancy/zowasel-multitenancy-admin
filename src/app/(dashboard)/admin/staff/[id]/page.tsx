'use client';

import { useParams, useRouter } from 'next/navigation';
import { useAdminRoles, useStaffMember } from '@/features/staff/hooks/useStaff';
import { mapAdminRole, mapDepartmentRole, mapStaff } from '@/features/staff/api/staff.mappers';
import { StaffProfileView } from '@/components/staff/StaffProfileView';
import { Loader2 } from 'lucide-react';
import { useMemo } from 'react';
import { DepartmentRole, StaffMember } from '@/types/staff';

// One staff member, from GET /admin/staff/{id}.
//
// This page used to resolve the record by merging the live response with a
// localStorage copy through resolveStaffMember, falling back to the local one
// when the request had not landed. That merge is what hid the API's upper-case
// systemRole behind a `| string` type and made a super admin render as
// "Admin" — the response is now the only source, mapped once.
export default function StaffProfilePage() {
  const params = useParams();
  const router = useRouter();
  const staffId = (params?.id as string) || '';

  const memberQuery = useStaffMember(staffId);
  const { roles: roleDtos } = useAdminRoles({ limit: 100 });

  const roles = useMemo(() => roleDtos.map(mapAdminRole), [roleDtos]);

  const staff: StaffMember | null = useMemo(
    () => (memberQuery.data ? mapStaff(memberQuery.data) : null),
    [memberQuery.data],
  );

  // The department-scoped roles this member holds. Their assignments come back
  // on the staff record itself, so this is a filter over the role catalogue
  // rather than a second request.
  const departmentRoles: DepartmentRole[] = useMemo(() => {
    if (!staff) return [];
    const held = new Set(staff.roleIds ?? []);
    return roleDtos
      .filter((r) => held.has(r.id) && r.department)
      .map((r) => mapDepartmentRole(r, r.department!.id));
  }, [staff, roleDtos]);

  if (memberQuery.isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-[#00A651]" />
      </div>
    );
  }

  if (!staff) {
    router.push('/admin/staff/directory');
    return null;
  }

  return (
    <div className="w-full max-w-6xl mx-auto py-2 px-1 sm:px-4">
      <StaffProfileView
        staff={staff}
        roles={roles}
        departmentRoles={departmentRoles}
        onRefresh={() => {
          void memberQuery.refetch();
        }}
      />
    </div>
  );
}
