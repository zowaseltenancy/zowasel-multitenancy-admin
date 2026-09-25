'use client';

import React from 'react';
import { StaffRole } from '@/types/staff';
import { useDirectoryModals } from './useDirectoryModals';
import { ChangeRoleDialog } from './modals/ChangeRoleDialog';
import { ReassignDeptDialog } from './modals/ReassignDeptDialog';
import { SendMessageDialog } from './modals/SendMessageDialog';

interface DirectoryModalsProps {
  modalState: ReturnType<typeof useDirectoryModals>['modalState'];
  roles: StaffRole[];
  departments: { id: string; name: string }[];
}

export function DirectoryModals({
  modalState,
  roles,
  departments,
}: DirectoryModalsProps) {
  return (
    <>
      <ChangeRoleDialog
        open={modalState.roleEditOpen}
        onOpenChange={modalState.setRoleEditOpen}
        staff={modalState.roleEditStaff}
        roles={roles}
        selectedRoleId={modalState.selectedRoleId}
        onRoleIdChange={modalState.setSelectedRoleId}
        onSave={modalState.saveRoleChange}
      />

      <ReassignDeptDialog
        open={modalState.deptEditOpen}
        onOpenChange={modalState.setDeptEditOpen}
        staff={modalState.deptEditStaff}
        departments={departments}
        selectedDept={modalState.selectedDept}
        onDeptChange={modalState.setSelectedDept}
        onSave={modalState.saveDeptChange}
      />

      <SendMessageDialog
        open={modalState.messageOpen}
        onOpenChange={modalState.setMessageOpen}
        staff={modalState.messageStaff}
        subject={modalState.messageSubject}
        onSubjectChange={modalState.setMessageSubject}
        body={modalState.messageBody}
        onBodyChange={modalState.setMessageBody}
        sending={modalState.sendingMessage}
        onSend={modalState.handleSendMessage}
      />
    </>
  );
}
