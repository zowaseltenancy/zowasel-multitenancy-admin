'use client';

import { useState } from 'react';
import { toast } from 'sonner';
import { StaffMember } from '@/types/staff';
import { useStaff } from '@/features/staff/hooks/useStaff';

// The directory's row actions, backed by auth-service.
//
// Both writes used to be `repo.updateStaff(id, { roleId })` and
// `repo.updateStaff(id, { department })` against a localStorage store. Each now
// maps to the endpoint that actually owns that change:
//
//   role       → PUT   /admin/staff/{id}/roles      (replaces the whole set)
//   department → PATCH /admin/staff/{id}            (placement)
//
// Both dialogs now close on the server's answer rather than on submit, so a
// rejection leaves them open instead of reporting success.
export function useDirectoryModals() {
  const { assignRoles, edit, isMutating } = useStaff();

  const [roleEditStaff, setRoleEditStaff] = useState<StaffMember | null>(null);
  const [roleEditOpen, setRoleEditOpen] = useState(false);
  const [selectedRoleId, setSelectedRoleId] = useState('');

  const [deptEditStaff, setDeptEditStaff] = useState<StaffMember | null>(null);
  const [deptEditOpen, setDeptEditOpen] = useState(false);
  const [selectedDept, setSelectedDept] = useState('');

  const [messageStaff, setMessageStaff] = useState<StaffMember | null>(null);
  const [messageOpen, setMessageOpen] = useState(false);
  const [messageSubject, setMessageSubject] = useState('');
  const [messageBody, setMessageBody] = useState('');

  const openRoleDialog = (e: React.MouseEvent, staff: StaffMember) => {
    e.stopPropagation();
    setRoleEditStaff(staff);
    setSelectedRoleId(staff.roleId);
    setRoleEditOpen(true);
  };

  // PUT replaces the assignment set, so a single-select dialog sends a
  // one-element array. Picking a role here therefore *replaces* any others the
  // member held — which is what a single-select control means.
  const saveRoleChange = (e: React.FormEvent) => {
    e.preventDefault();
    if (!roleEditStaff || !selectedRoleId) return;
    assignRoles(roleEditStaff.id, [selectedRoleId], {
      onSuccess: () => setRoleEditOpen(false),
    });
  };

  const openDeptDialog = (e: React.MouseEvent, staff: StaffMember) => {
    e.stopPropagation();
    setDeptEditStaff(staff);
    // The dialog's value is now the department id, not its name — the PATCH
    // takes departmentId.
    setSelectedDept(staff.departmentId ?? '');
    setDeptEditOpen(true);
  };

  const saveDeptChange = (e: React.FormEvent) => {
    e.preventDefault();
    if (!deptEditStaff || !selectedDept) return;
    edit(deptEditStaff.id, { departmentId: selectedDept }, {
      onSuccess: () => setDeptEditOpen(false),
    });
  };

  const openMessageDialog = (e: React.MouseEvent, staff: StaffMember) => {
    e.stopPropagation();
    setMessageStaff(staff);
    setMessageSubject('');
    setMessageBody('');
    setMessageOpen(true);
  };

  // No endpoint sends an ad-hoc message to a staff member. This was a
  // setTimeout that reported "Message sent" without one, which is worse than
  // saying so — an admin would believe a colleague had been contacted.
  //
  // notification-service sends templated mail off Kafka events; a free-text
  // admin-to-staff message would need its own route.
  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    toast.error("Messaging isn't available yet — there's no endpoint for it.");
  };

  return {
    modalState: {
      roleEditOpen,
      setRoleEditOpen,
      roleEditStaff,
      selectedRoleId,
      setSelectedRoleId,
      saveRoleChange,
      deptEditOpen,
      setDeptEditOpen,
      deptEditStaff,
      selectedDept,
      setSelectedDept,
      saveDeptChange,
      messageOpen,
      setMessageOpen,
      messageStaff,
      messageSubject,
      setMessageSubject,
      messageBody,
      setMessageBody,
      sendingMessage: isMutating,
      handleSendMessage,
    },
    openRoleDialog,
    openDeptDialog,
    openMessageDialog,
  };
}
