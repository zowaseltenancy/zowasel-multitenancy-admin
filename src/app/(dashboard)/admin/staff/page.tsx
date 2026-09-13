'use client';

import { useMemo } from 'react';
import { StaffDepartment } from '@/types/user';
import { DEPARTMENTS } from '@/components/staff/dashboard/departmentMeta';
import { StaffDashboardSummary } from '@/components/staff/dashboard/StaffDashboardSummary';
import { StaffDepartmentGrid } from '@/components/staff/dashboard/StaffDepartmentGrid';
import { useDepartments, useStaff } from '@/features/staff/hooks/useStaff';

// The extracted dashboard components come from the RVE-78 refactor; the data
// behind them is the real staff directory rather than useUsers, which reads
// mockUsers out of local React state.
//
// `meta.total` is the server's count, not the length of the fetched page — the
// two only agree while the whole directory fits in one request.
const STAFF_PAGE_SIZE = 100;

export default function ZowaselStaffOverviewPage() {
  const { staff, meta } = useStaff({ page: 1, limit: STAFF_PAGE_SIZE });
  const { departments } = useDepartments();

  const totalStaff = meta?.total ?? staff.length;
  const activeCount = staff.filter((member) => member.status === 'ACTIVE').length;

  // Keyed by department NAME, because that is what StaffDepartmentGrid indexes
  // with. Note this only lands for departments whose server-side name matches
  // the hardcoded StaffDepartment union — the seeded set is Sales, Operations,
  // Compliance, Finance and People & Culture, so Sales/Finance/Compliance count
  // and the rest of the grid reads zero. Reconciling the two vocabularies is a
  // separate change: either rename the departments server-side or widen the
  // union, both of which alter what the grid renders.
  const staffCounts = useMemo(() => {
    const counts = {} as Record<StaffDepartment, number>;
    for (const member of staff) {
      const name = member.department?.name as StaffDepartment | undefined;
      if (name) counts[name] = (counts[name] || 0) + 1;
    }
    return counts;
  }, [staff]);

  // The department count is the server's, falling back to the hardcoded list
  // only until that query resolves.
  const departmentCount = departments.length || DEPARTMENTS.length;

  // No endpoint returns a platform-wide pending-leave tally. The nearest thing
  // is GET /admin/leave/requests/overview, which is gated on leave:review and
  // returns rows rather than a count. Left at zero rather than derived from a
  // partial page, which would understate it.
  const pendingLeaveCount = 0;

  return (
    <div className="space-y-6">
      <StaffDashboardSummary
        totalStaff={totalStaff}
        activeCount={activeCount}
        departmentCount={departmentCount}
        pendingLeaveCount={pendingLeaveCount}
      />

      <StaffDepartmentGrid staffCounts={staffCounts} />
    </div>
  );
}
