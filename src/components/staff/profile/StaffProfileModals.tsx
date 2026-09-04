'use client';

import { StaffMember, StaffRole } from '@/types/staff';
import { ResetPasswordModal } from './modals/ResetPasswordModal';
import { SendMessageModal } from './modals/SendMessageModal';
import { ChangeRoleModal } from './modals/ChangeRoleModal';
import { ReassignDeptModal } from './modals/ReassignDeptModal';
import { RequestLeaveModal } from './modals/RequestLeaveModal';
import { SuspendStaffModal } from './modals/SuspendStaffModal';
import { EditPhotoModal } from './modals/EditPhotoModal';

interface StaffProfileModalsProps {
  staff: StaffMember;
  roles: StaffRole[];
  allDepartments: string[];
  resetPasswordOpen: boolean;
  setResetPasswordOpen: (open: boolean) => void;
  sendMessageOpen: boolean;
  setSendMessageOpen: (open: boolean) => void;
  changeRoleOpen?: boolean;
  setChangeRoleOpen?: (open: boolean) => void;
  reassignDeptOpen: boolean;
  setReassignDeptOpen: (open: boolean) => void;
  requestLeaveOpen?: boolean;
  setRequestLeaveOpen?: (open: boolean) => void;
  suspendModalOpen: boolean;
  setSuspendModalOpen: (open: boolean) => void;
  editPhotoOpen: boolean;
  setEditPhotoOpen: (open: boolean) => void;
  onRefresh: () => void;
  onPhotoUpdated: (url: string) => void;
  onStatusUpdated: () => void;
}

export function StaffProfileModals({
  staff,
  roles,
  allDepartments,
  resetPasswordOpen,
  setResetPasswordOpen,
  sendMessageOpen,
  setSendMessageOpen,
  changeRoleOpen,
  setChangeRoleOpen,
  reassignDeptOpen,
  setReassignDeptOpen,
  requestLeaveOpen,
  setRequestLeaveOpen,
  suspendModalOpen,
  setSuspendModalOpen,
  editPhotoOpen,
  setEditPhotoOpen,
  onRefresh,
  onPhotoUpdated,
  onStatusUpdated,
}: StaffProfileModalsProps) {
  return (
    <>
      <ResetPasswordModal
        open={resetPasswordOpen}
        onOpenChange={setResetPasswordOpen}
        staff={staff}
      />
      <SendMessageModal
        open={sendMessageOpen}
        onOpenChange={setSendMessageOpen}
        staff={staff}
      />
      {changeRoleOpen !== undefined && setChangeRoleOpen && (
        <ChangeRoleModal
          open={changeRoleOpen}
          onOpenChange={setChangeRoleOpen}
          staff={staff}
          roles={roles}
          onSuccess={onRefresh}
        />
      )}
      <ReassignDeptModal
        open={reassignDeptOpen}
        onOpenChange={setReassignDeptOpen}
        staff={staff}
        departments={allDepartments}
        onSuccess={onRefresh}
      />
      {requestLeaveOpen !== undefined && setRequestLeaveOpen && (
        <RequestLeaveModal
          open={requestLeaveOpen}
          onOpenChange={setRequestLeaveOpen}
          staff={staff}
          onSuccess={onRefresh}
        />
      )}
      <SuspendStaffModal
        open={suspendModalOpen}
        onOpenChange={setSuspendModalOpen}
        staff={staff}
        onSuccess={onStatusUpdated}
      />
      <EditPhotoModal
        open={editPhotoOpen}
        onOpenChange={setEditPhotoOpen}
        staff={staff}
        onPhotoUpdated={onPhotoUpdated}
      />
    </>
  );
}
