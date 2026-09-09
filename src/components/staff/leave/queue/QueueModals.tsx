'use client';

import { LeaveRequest } from '@/types/staff';
import { QueueDetailModal } from './QueueDetailModal';
import { QueueRejectModal } from './QueueRejectModal';

interface QueueModalsProps {
  detailRequest: LeaveRequest | null;
  onCloseDetail: () => void;
  onApprove: (id: string) => void;
  onOpenRejectModal: (id: string) => void;
  rejectModalOpen: boolean;
  onRejectModalOpenChange: (open: boolean) => void;
  rejectTargetCount: number;
  rejectReason: string;
  onRejectReasonChange: (reason: string) => void;
  onConfirmReject: () => void;
}

export function QueueModals({
  detailRequest,
  onCloseDetail,
  onApprove,
  onOpenRejectModal,
  rejectModalOpen,
  onRejectModalOpenChange,
  rejectTargetCount,
  rejectReason,
  onRejectReasonChange,
  onConfirmReject,
}: QueueModalsProps) {
  return (
    <>
      <QueueDetailModal
        detailRequest={detailRequest}
        onClose={onCloseDetail}
        onApprove={onApprove}
        onOpenRejectModal={onOpenRejectModal}
      />

      <QueueRejectModal
        open={rejectModalOpen}
        onOpenChange={onRejectModalOpenChange}
        targetCount={rejectTargetCount}
        rejectReason={rejectReason}
        onRejectReasonChange={onRejectReasonChange}
        onConfirmReject={onConfirmReject}
      />
    </>
  );
}