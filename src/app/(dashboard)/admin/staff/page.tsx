'use client';

import { useMemo } from 'react';
import { useUsers } from '@/features/users/hooks/useUsers';
import { StaffDepartment } from '@/types/user';
import { DEPARTMENTS } from '@/components/staff/dashboard/departmentMeta';
import { StaffDashboardSummary } from '@/components/staff/dashboard/StaffDashboardSummary';
import { StaffDepartmentGrid } from '@/components/staff/dashboard/StaffDepartmentGrid';

export default function ZowaselStaffOverviewPage() {
  const { users } = useUsers();

  const staff = useMemo(
    () => users.filter((user) => user.userCategory === 'staff'),
    [users]
  );

  const activeCount = staff.filter((s) => s.status === 'active').length;

  const staffCounts = useMemo(() => {
    const counts = {} as Record<StaffDepartment, number>;
    for (const s of staff) {
      if (s.department) {
        counts[s.department] = (counts[s.department] || 0) + 1;
      }
    }
    return counts;
  }, [staff]);

  // Placeholder – replace with real data from your leave API
  const pendingLeaveCount = 0;

  return (
    <div className="space-y-6">
      <StaffDashboardSummary
        totalStaff={staff.length}
        activeCount={activeCount}
        departmentCount={DEPARTMENTS.length}
        pendingLeaveCount={pendingLeaveCount}
      />

      <StaffDepartmentGrid staffCounts={staffCounts} />
    </div>
  );
}