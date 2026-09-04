'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { StaffMember, StaffRole, DepartmentRole } from '@/types/staff';
import { useStaff } from '@/hooks/useStaff';

// Profile Subcomponents & Tabs
import { ProfileHeader } from './profile/ProfileHeader';
import { StaffIdentityCard } from './profile/StaffIdentityCard';
import { ProfileTabs, TabKey } from './profile/ProfileTabs';
import { OverviewTab } from './profile/tabs/OverviewTab';
import { DepartmentTeamTab } from './profile/tabs/DepartmentTeamTab';
import { StatusHistoryTab } from './profile/tabs/StatusHistoryTab';
import { StaffProfileModals } from './profile/StaffProfileModals';

interface StaffProfileViewProps {
  staff: StaffMember;
  roles: StaffRole[];
  departmentRoles?: DepartmentRole[];
  onRefresh?: () => void;
}

export function StaffProfileView({
  staff,
  roles,
  onRefresh,
}: StaffProfileViewProps) {
  const router = useRouter();
  const { repo, refresh } = useStaff();

  const [activeTab, setActiveTab] = useState<TabKey>('overview');
  const [resetPasswordOpen, setResetPasswordOpen] = useState(false);
  const [sendMessageOpen, setSendMessageOpen] = useState(false);
  const [reassignDeptOpen, setReassignDeptOpen] = useState(false);
  const [suspendModalOpen, setSuspendModalOpen] = useState(false);
  const [editPhotoOpen, setEditPhotoOpen] = useState(false);

  const roleName = roles.find((r) => r.id === staff.roleId)?.name || staff.roleId || 'Staff Member';
  const allDepartments = repo.getDepartments().map((d) => d.name);
  const departmentColleagues = repo
    .getAllStaff()
    .filter((s) => s.department === staff.department && s.id !== staff.id);

  const handleRefresh = () => {
    refresh();
    onRefresh?.();
  };

  return (
    <div className="space-y-5 max-w-6xl mx-auto pb-10">
      <ProfileHeader
        staff={staff}
        onEditProfile={() => router.push(`/admin/staff/${staff.id}/edit`)}
        onResetPassword={() => setResetPasswordOpen(true)}
        onReassignDept={() => setReassignDeptOpen(true)}
        onSendMessage={() => setSendMessageOpen(true)}
        onToggleStatus={() => setSuspendModalOpen(true)}
      />

      <StaffIdentityCard
        staff={staff}
        roleName={roleName}
        onEditPhoto={() => setEditPhotoOpen(true)}
      />

      <ProfileTabs
        activeTab={activeTab}
        onTabChange={setActiveTab}
      />

      <div className="min-h-[400px]">
        {activeTab === 'overview' && (
          <OverviewTab
            staff={staff}
            roleName={roleName}
            onNavigateTab={setActiveTab}
          />
        )}
        {activeTab === 'department' && (
          <DepartmentTeamTab
            staff={staff}
            onReassignDept={() => setReassignDeptOpen(true)}
            departmentColleagues={departmentColleagues}
          />
        )}
        {activeTab === 'status_history' && (
          <StatusHistoryTab
            staff={staff}
            onOpenSuspendModal={() => setSuspendModalOpen(true)}
          />
        )}
      </div>

      <StaffProfileModals
        staff={staff}
        roles={roles}
        allDepartments={allDepartments}
        resetPasswordOpen={resetPasswordOpen}
        setResetPasswordOpen={setResetPasswordOpen}
        sendMessageOpen={sendMessageOpen}
        setSendMessageOpen={setSendMessageOpen}
        reassignDeptOpen={reassignDeptOpen}
        setReassignDeptOpen={setReassignDeptOpen}
        suspendModalOpen={suspendModalOpen}
        setSuspendModalOpen={setSuspendModalOpen}
        editPhotoOpen={editPhotoOpen}
        setEditPhotoOpen={setEditPhotoOpen}
        onRefresh={handleRefresh}
        onPhotoUpdated={(url) => {
          repo.updateStaff(staff.id, { avatarUrl: url });
          handleRefresh();
        }}
        onStatusUpdated={() => {
          const nextStatus = staff.status?.toLowerCase() === 'suspended' ? 'active' : 'suspended';
          repo.updateStaff(staff.id, { status: nextStatus });
          handleRefresh();
        }}
      />
    </div>
  );
}