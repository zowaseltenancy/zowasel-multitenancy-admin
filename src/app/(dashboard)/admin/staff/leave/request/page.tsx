'use client';

import { useState, useMemo, useEffect } from 'react';
import { useStaff } from '@/hooks/useStaff';
import { LeaveRequest } from '@/types/staff';
import { QueueHeader } from '@/components/staff/leave/queue/QueueHeader';
import { QueueOverviewStrip } from '@/components/staff/leave/queue/QueueOverviewStrip';
import { QueueFilterBar } from '@/components/staff/leave/queue/QueueFilterBar';
import { QueueTable } from '@/components/staff/leave/queue/QueueTable';
import { QueueModals } from '@/components/staff/leave/queue/QueueModals';
import { handleExportQueue } from '@/components/staff/leave/queue/queueExport';
import { useQueueApproval } from '@/components/staff/leave/queue/useQueueApproval';

const CURRENT_USER_STAFF_ID = 'staff-alice';

export default function ApprovalQueuePage() {
  const { repo, refresh } = useStaff();

  const [mounted, setMounted] = useState(false);
  const [filterDepartment, setFilterDepartment] = useState<string>('all');
  const [filterType, setFilterType] = useState<string>('all');
  const [search, setSearch] = useState('');
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [detailRequest, setDetailRequest] = useState<LeaveRequest | null>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  const allStaff = useMemo(() => repo.getAllStaff(), [repo]);
  const rawRequests = useMemo(() => repo.getLeaveRequests(), [repo]);

  const allLeaveRequests: LeaveRequest[] = useMemo(() => {
    return rawRequests.map((r) => {
      const staff = allStaff.find((s) => s.id === r.staffId);
      return {
        ...r,
        employeeName: r.employeeName || (staff ? `${staff.firstName} ${staff.lastName}` : 'Staff Member'),
        department: r.department || (staff ? staff.department : 'General'),
      };
    });
  }, [rawRequests, allStaff]);

  const pendingRequests = useMemo(() => {
    return allLeaveRequests.filter((r) => r.status === 'pending');
  }, [allLeaveRequests]);

  const departments = useMemo(() => {
    const set = new Set<string>();
    allStaff.forEach((s) => s.department && set.add(s.department));
    pendingRequests.forEach((r) => r.department && set.add(r.department));
    return Array.from(set).sort();
  }, [allStaff, pendingRequests]);

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
    repo,
    refresh,
    pendingRequests,
    allLeaveRequests,
    currentUserId: CURRENT_USER_STAFF_ID,
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
        (filterDepartment === 'all' || r.department === filterDepartment) &&
        (filterType === 'all' || r.type === filterType)
      );
    });
  }, [pendingRequests, search, filterDepartment, filterType]);

  const toggleSelectAll = () => {
    setSelectedIds(selectedIds.length === filteredRequests.length ? [] : filteredRequests.map((r) => r.id));
  };

  const toggleSelectOne = (id: string) => {
    setSelectedIds((prev) => prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]);
  };

  if (!mounted) return null;

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
        currentUserId={CURRENT_USER_STAFF_ID}
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
