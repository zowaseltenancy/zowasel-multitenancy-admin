'use client';

import { useState } from 'react';
import { toast } from 'sonner';
import { LeaveRequest } from '@/types/staff';
import { isOverlapping } from './queueExport';

interface UseQueueApprovalProps {
  repo: any;
  refresh: () => void;
  pendingRequests: LeaveRequest[];
  allLeaveRequests: LeaveRequest[];
  currentUserId: string;
  onClearDetail: (ids: string[]) => void;
  onRemoveSelectedIds: (ids: string[]) => void;
}

export function useQueueApproval({
  repo,
  refresh,
  pendingRequests,
  allLeaveRequests,
  currentUserId,
  onClearDetail,
  onRemoveSelectedIds,
}: UseQueueApprovalProps) {
  const [rejectModalOpen, setRejectModalOpen] = useState(false);
  const [rejectTargetIds, setRejectTargetIds] = useState<string[]>([]);
  const [rejectReason, setRejectReason] = useState('');

  const getConflict = (req: LeaveRequest) => {
    return allLeaveRequests.some(
      (r) =>
        r.id !== req.id &&
        r.department === req.department &&
        r.status !== 'rejected' &&
        isOverlapping(r, req)
    );
  };

  const getConflictingPeers = (req: LeaveRequest) => {
    return allLeaveRequests.filter(
      (r) =>
        r.id !== req.id &&
        r.department === req.department &&
        r.status !== 'rejected' &&
        isOverlapping(r, req)
    );
  };

  const handleApprove = (ids: string[]) => {
    const selfRequests = pendingRequests.filter(
      (r) => ids.includes(r.id) && r.staffId === currentUserId
    );
    if (selfRequests.length > 0) {
      toast.error('Self-review blocked: You cannot approve your own leave request.');
      return;
    }
    ids.forEach((id) =>
      repo.updateLeaveStatus(id, 'approved', currentUserId, 'Alice Johnson')
    );
    refresh();
    toast.success(`Approved ${ids.length} leave request${ids.length === 1 ? '' : 's'}.`);
    onRemoveSelectedIds(ids);
    onClearDetail(ids);
  };

  const openRejectModal = (ids: string[]) => {
    const selfRequests = pendingRequests.filter(
      (r) => ids.includes(r.id) && r.staffId === currentUserId
    );
    if (selfRequests.length > 0) {
      toast.error('Self-review blocked: You cannot reject your own leave request.');
      return;
    }
    setRejectTargetIds(ids);
    setRejectReason('');
    setRejectModalOpen(true);
  };

  const handleConfirmReject = () => {
    if (!rejectReason.trim()) {
      toast.error('Please specify a rejection reason');
      return;
    }
    rejectTargetIds.forEach((id) =>
      repo.updateLeaveRequest(id, {
        status: 'rejected',
        rejectionReason: rejectReason.trim(),
      })
    );
    refresh();
    toast.success(`Rejected ${rejectTargetIds.length} request${rejectTargetIds.length === 1 ? '' : 's'}.`);
    onRemoveSelectedIds(rejectTargetIds);
    onClearDetail(rejectTargetIds);
    setRejectModalOpen(false);
  };

  return {
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
  };
}