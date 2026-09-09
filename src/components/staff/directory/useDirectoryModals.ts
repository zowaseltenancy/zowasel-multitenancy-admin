'use client';

import { useState } from 'react';
import { toast } from 'sonner';
import { StaffMember } from '@/types/staff';

export function useDirectoryModals(repo: any, refresh: () => void) {
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
  const [sendingMessage, setSendingMessage] = useState(false);

  const openRoleDialog = (e: React.MouseEvent, staff: StaffMember) => {
    e.stopPropagation();
    setRoleEditStaff(staff);
    setSelectedRoleId(staff.roleId);
    setRoleEditOpen(true);
  };

  const saveRoleChange = (e: React.FormEvent) => {
    e.preventDefault();
    if (!roleEditStaff || !selectedRoleId) return;
    repo.updateStaff(roleEditStaff.id, { roleId: selectedRoleId });
    refresh();
    toast.success(`Role updated for ${roleEditStaff.firstName} ${roleEditStaff.lastName}`);
    setRoleEditOpen(false);
  };

  const openDeptDialog = (e: React.MouseEvent, staff: StaffMember) => {
    e.stopPropagation();
    setDeptEditStaff(staff);
    setSelectedDept(staff.department);
    setDeptEditOpen(true);
  };

  const saveDeptChange = (e: React.FormEvent) => {
    e.preventDefault();
    if (!deptEditStaff || !selectedDept) return;
    repo.updateStaff(deptEditStaff.id, { department: selectedDept });
    refresh();
    toast.success(`Department updated for ${deptEditStaff.firstName} ${deptEditStaff.lastName}`);
    setDeptEditOpen(false);
  };

  const openMessageDialog = (e: React.MouseEvent, staff: StaffMember) => {
    e.stopPropagation();
    setMessageStaff(staff);
    setMessageSubject('');
    setMessageBody('');
    setMessageOpen(true);
  };

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!messageStaff || !messageSubject.trim() || !messageBody.trim()) return;
    setSendingMessage(true);
    try {
      await new Promise((r) => setTimeout(r, 600));
      toast.success(`Message sent to ${messageStaff.firstName} (${messageStaff.email})`);
      setMessageOpen(false);
    } catch {
      toast.error('Failed to send message');
    } finally {
      setSendingMessage(false);
    }
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
      sendingMessage,
      handleSendMessage,
    },
    openRoleDialog,
    openDeptDialog,
    openMessageDialog,
  };
}
