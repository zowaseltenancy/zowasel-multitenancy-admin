'use client';

import { useMemo, useState } from 'react';
import { useAdminMe } from '@/features/auth/hooks/useAuth';
import { useDepartments, useLeaveOverview } from '@/features/staff/hooks/useStaff';
import { mapLeaveRequest } from '@/features/staff/api/staff.mappers';
import { LeaveRequest, LeaveType } from '@/types/staff';
import { QueueHeader } from '@/components/staff/leave/queue/QueueHeader';
import { QueueOverviewStrip } from '@/components/staff/leave/queue/QueueOverviewStrip';
import { QueueFilterBar } from '@/components/staff/leave/queue/QueueFilterBar';
import { QueueTable } from '@/components/staff/leave/queue/QueueTable';
import { QueueModals } from '@/components/staff/leave/queue/QueueModals';
import { handleExportQueue } from '@/components/staff/leave/queue/queueExport';
import { useQueueApproval } from '@/components/staff/leave/queue/useQueueApproval';

export default function ApprovalQueuePage() {
  const [filterDepartment, setFilterDepartment] = useState<string>('all');
  // The API's enum value, or 'all'. It used to hold a display string ('Annual')
  // and was compared against the mapped row type, so no leave type ever
  // matched and the filter appeared to do nothing.
  const [filterType, setFilterType] = useState<string>('all');
  const [search, setSearch] = useState('');
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [detailRequest, setDetailRequest] = useState<LeaveRequest | null>(null);

  // GET /admin/leave/requests/overview — every admin's requests, gated on
  // leave:review. The applicant's name and department come back on each row,
  // so there is no second pass joining against a staff list.
  const { data: me } = useAdminMe();
  // Type narrows server-side, like every other list in the console — the
  // endpoint takes it, so there is no reason to fetch rows only to drop them.
  const { requests: overviewDtos, isLoading } = useLeaveOverview({
    limit: 100,
    ...(filterType !== 'all' ? { type: filterType as LeaveType } : {}),
  });
  const { departments: departmentDtos } = useDepartments({ limit: 100 });

  const allLeaveRequests = useMemo<LeaveRequest[]>(
    () => overviewDtos.map(mapLeaveRequest),
    [overviewDtos],
  );

  const pendingRequests = useMemo(
    () => allLeaveRequests.filter((r) => r.status === 'pending'),
    [allLeaveRequests],
  );

  // From the departments endpoint, not from the rows on screen — a queue with
  // no pending requests in a department would otherwise drop it from the
  // filter entirely.
  const departments = useMemo(
    () => departmentDtos.map((d) => d.name).sort(),
    [departmentDtos],
  );

  const {
    rejectModalOpen,
    setRejectModalOpen,
    rejectTargetIds,
    rejectReason,
    setRejectReason,
    getConflict,
    getConflictingPeers,
    handleApprove,
    openRejectModal,
    handleConfirmReject,
  } = useQueueApproval({
    pendingRequests,
    allLeaveRequests,
    currentUserId: me?.id ?? '',
    onClearDetail: (ids) => {
      if (detailRequest && ids.includes(detailRequest.id)) setDetailRequest(null);
    },
    onRemoveSelectedIds: (ids) => {
      setSelectedIds((prev) => prev.filter((id) => !ids.includes(id)));
    },
  });

  const filteredRequests = useMemo(() => {
    return pendingRequests.filter((r) => {
      const target = `${r.employeeName || ''} ${r.department || ''} ${r.reason || ''} ${r.id || ''}`.toLowerCase();
      return (
        target.includes(search.toLowerCase()) &&
        (filterDepartment === 'all' || r.department === filterDepartment)
      );
    });
    // filterType is not here: the query above already applied it, so the rows
    // in `pendingRequests` are the filtered ones.
  }, [pendingRequests, search, filterDepartment]);

  const toggleSelectAll = () => {
    setSelectedIds(selectedIds.length === filteredRequests.length ? [] : filteredRequests.map((r) => r.id));
  };

  const toggleSelectOne = (id: string) => {
    setSelectedIds((prev) => prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]);
  };

  if (isLoading) return null;

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12">
      <QueueHeader onExportQueue={() => handleExportQueue(filteredRequests)} />

      <QueueOverviewStrip
        totalPending={pendingRequests.length}
        filteredCount={filteredRequests.length}
        conflictCount={pendingRequests.filter(getConflict).length}
        departmentsAffectedCount={Array.from(new Set(pendingRequests.map((r) => r.department))).length}
      />

      <QueueFilterBar
        filterDepartment={filterDepartment}
        onFilterDepartmentChange={setFilterDepartment}
        filterType={filterType}
        onFilterTypeChange={setFilterType}
        search={search}
        onSearchChange={setSearch}
        departments={departments}
        selectedIds={selectedIds}
        onClearSelection={() => setSelectedIds([])}
        onRejectSelected={() => openRejectModal(selectedIds)}
        onApproveSelected={() => handleApprove(selectedIds)}
      />

      <QueueTable
        filteredRequests={filteredRequests}
        selectedIds={selectedIds}
        currentUserId={me?.id ?? ''}
        onToggleSelectAll={toggleSelectAll}
        onToggleSelectOne={toggleSelectOne}
        onSelectDetail={setDetailRequest}
        onApprove={handleApprove}
        onOpenRejectModal={openRejectModal}
        getConflict={getConflict}
        getConflictingPeers={getConflictingPeers}
      />

      <QueueModals
        detailRequest={detailRequest}
        onCloseDetail={() => setDetailRequest(null)}
        onApprove={(id) => handleApprove([id])}
        onOpenRejectModal={(id) => openRejectModal([id])}
        rejectModalOpen={rejectModalOpen}
        onRejectModalOpenChange={setRejectModalOpen}
        rejectTargetCount={rejectTargetIds.length}
        rejectReason={rejectReason}
        onRejectReasonChange={setRejectReason}
        onConfirmReject={handleConfirmReject}
      />
    </div>
  );
}
