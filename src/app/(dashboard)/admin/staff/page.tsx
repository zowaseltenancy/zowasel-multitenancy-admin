'use client';

import { useMemo } from 'react';
import { StaffDashboardSummary } from '@/components/staff/dashboard/StaffDashboardSummary';
import { StaffDepartmentGrid } from '@/components/staff/dashboard/StaffDepartmentGrid';
import { useLeaveOverview, useStaffStats } from '@/features/staff/hooks/useStaff';

// The staff dashboard, entirely from GET /admin/staff/stats.
//
// One request rather than three: the stats endpoint computes the headcount,
// the active count and the per-department breakdown server-side with grouped
// queries. The previous version fetched a page of staff and tallied it, which
// made every figure mean "rows on the current page", and read the department
// list from a hardcoded array of nine names.
export default function ZowaselStaffOverviewPage() {
  const { stats, isLoading } = useStaffStats();

  // The only figure the stats endpoint does not carry. The overview is the
  // real source and is gated on leave:review — an admin without that
  // permission gets a 403, which the hook reports as an error and leaves the
  // list empty, so the tile reads zero rather than breaking the page.
  const { requests: leaveRequests } = useLeaveOverview({ status: 'PENDING', limit: 100 });

  // byDepartment includes departments with no staff, so an empty department
  // still gets a card — a card reading zero is information; a missing card is
  // a gap. `unassigned` is appended as its own card for the same reason: staff
  // with no department are otherwise invisible on this screen.
  const departments = useMemo(() => {
    if (!stats) return [];

    const cards = stats.byDepartment.map((d) => ({
      id: d.id,
      name: d.name,
      count: d.count,
    }));

    if (stats.unassigned > 0) {
      cards.push({
        // Not a real department, so it carries a sentinel id. The grid's quick
        // links point at ?departmentId=, which the directory reads — and
        // "unassigned" is not a uuid, so those links deliberately go nowhere
        // useful for this card rather than pretending to filter.
        id: 'unassigned',
        name: 'Unassigned',
        count: stats.unassigned,
      });
    }

    return cards;
  }, [stats]);

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="h-24 animate-pulse rounded-xl bg-muted/40" />
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="h-[140px] animate-pulse rounded-xl bg-muted/40" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <StaffDashboardSummary
        totalStaff={stats?.total ?? 0}
        activeCount={stats?.active ?? 0}
        departmentCount={stats?.byDepartment.length ?? 0}
        pendingLeaveCount={leaveRequests.length}
      />

      <StaffDepartmentGrid departments={departments} />
    </div>
  );
}
