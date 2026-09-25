'use client';

import { useState } from 'react';
import { toast } from 'sonner';
import { LeaveRequest } from '@/types/staff';
import { isOverlapping } from './queueExport';
import { useLeaveOverview } from '@/features/staff/hooks/useStaff';

interface UseQueueApprovalProps {
  pendingRequests: LeaveRequest[];
  allLeaveRequests: LeaveRequest[];
  /** From /admin/me. Used only to keep the self-review guard's message local. */
  currentUserId: string;
  onClearDetail: (ids: string[]) => void;
  onRemoveSelectedIds: (ids: string[]) => void;
}

// PATCH /admin/leave/requests/{id}/review.
//
// Approving is what deducts days from the applicant's balance, in the same
// transaction as the status change — which is why this cannot be a local edit:
// the previous version set a status string and the balance never moved.
//
// The self-review check below is a courtesy, not the enforcement. The server
// refuses it outright regardless of seniority; checking here only turns a
// round-trip into an immediate message.
export function useQueueApproval({
  pendingRequests,
  allLeaveRequests,
  currentUserId,
  onClearDetail,
  onRemoveSelectedIds,
}: UseQueueApprovalProps) {
  const { review } = useLeaveOverview();
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
    // One call per request: the endpoint reviews a single request, because
    // each approval is its own balance deduction and can fail independently
    // (insufficient balance, already reviewed). A bulk route would have to
    // define what a partial failure means.
    ids.forEach((id) => review(id, 'APPROVED'));
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
    // The reason rides on the review call as `note`, which is what the
    // request's reviewNote surfaces to the applicant.
    rejectTargetIds.forEach((id) => review(id, 'REJECTED', rejectReason.trim()));
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