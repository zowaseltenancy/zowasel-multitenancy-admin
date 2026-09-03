'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { StaffMember, StaffRole, DepartmentRole } from '@/types/staff';
import { useStaff } from '@/hooks/useStaff';
import { toast } from 'sonner';

// Profile Subcomponents & Tabs
import { ProfileHeader } from './profile/ProfileHeader';
import { StaffIdentityCard } from './profile/StaffIdentityCard';
import { ProfileTabs, TabKey } from './profile/ProfileTabs';
import { OverviewTab } from './profile/tabs/OverviewTab';
import { EmploymentTab } from './profile/tabs/EmploymentTab';
import { PersonalTab } from './profile/tabs/PersonalTab';
import { PerformanceTab } from './profile/tabs/PerformanceTab';
import { ActivityTab } from './profile/tabs/ActivityTab';

// Profile Action Modals
import { ResetPasswordModal } from './profile/modals/ResetPasswordModal';
import { SendMessageModal } from './profile/modals/SendMessageModal';
import { ChangeRoleModal } from './profile/modals/ChangeRoleModal';
import { ReassignDeptModal } from './profile/modals/ReassignDeptModal';
import { RequestLeaveModal } from './profile/modals/RequestLeaveModal';
import { EditPhotoModal } from './profile/modals/EditPhotoModal';

interface StaffProfileViewProps {
  staff: StaffMember;
  roles: StaffRole[];
  departmentRoles?: DepartmentRole[];
  onRefresh?: () => void;
}

export function StaffProfileView({
  staff,
  roles,
  departmentRoles = [],
  onRefresh,
}: StaffProfileViewProps) {
  const router = useRouter();
  const { repo, refresh } = useStaff();

  // Active Tab state (Defaults to 'overview' per condex.docx)
  const [activeTab, setActiveTab] = useState<TabKey>('overview');

  // Interactive Modals state
  const [resetPasswordOpen, setResetPasswordOpen] = useState(false);
  const [sendMessageOpen, setSendMessageOpen] = useState(false);
  const [changeRoleOpen, setChangeRoleOpen] = useState(false);
  const [reassignDeptOpen, setReassignDeptOpen] = useState(false);
  const [requestLeaveOpen, setRequestLeaveOpen] = useState(false);
  const [editPhotoOpen, setEditPhotoOpen] = useState(false);

  const roleName = roles.find((r) => r.id === staff.roleId)?.name || staff.roleId || 'Staff Member';
  const allDepartments = repo.getDepartments().map((d) => d.name);

  // Status toggle handler (Active <-> Inactive)
  const handleToggleStatus = () => {
    const nextStatus = staff.status === 'active' ? 'inactive' : 'active';
    repo.updateStaff(staff.id, { status: nextStatus });
    toast.success(`Staff status updated to ${nextStatus}.`);
    refresh();
    onRefresh?.();
  };

  // Photo update handler
  const handlePhotoUpdated = (url: string) => {
    repo.updateStaff(staff.id, { avatarUrl: url });
    refresh();
    onRefresh?.();
  };

  return (
    <div className="space-y-5 max-w-6xl mx-auto pb-10">
      {/* 1. Page Header (Breadcrumbs, Title, Subtitle, Primary Actions) */}
      <ProfileHeader
        staff={staff}
        onEditProfile={() => router.push(`/admin/staff/${staff.id}/edit`)}
        onResetPassword={() => setResetPasswordOpen(true)}
        onChangeRole={() => setChangeRoleOpen(true)}
        onReassignDept={() => setReassignDeptOpen(true)}
        onRequestLeave={() => setRequestLeaveOpen(true)}
        onSendMessage={() => setSendMessageOpen(true)}
        onToggleStatus={handleToggleStatus}
      />

      {/* 2. Staff Identity Summary Card */}
      <StaffIdentityCard
        staff={staff}
        roleName={roleName}
        onEditPhoto={() => setEditPhotoOpen(true)}
      />

      {/* 3. Horizontal Profile Tabs Navigation */}
      <ProfileTabs
        activeTab={activeTab}
        onTabChange={setActiveTab}
      />

      {/* 4. Tab Content Panels */}
      <div className="min-h-[400px]">
        {activeTab === 'overview' && (
          <OverviewTab
            staff={staff}
            roleName={roleName}
            onNavigateTab={setActiveTab}
            onSendMessage={() => setSendMessageOpen(true)}
          />
        )}

        {activeTab === 'employment' && (
          <EmploymentTab
            staff={staff}
            roleName={roleName}
            departmentRoles={departmentRoles}
          />
        )}

        {activeTab === 'personal' && <PersonalTab staff={staff} />}

        {activeTab === 'performance' && <PerformanceTab staff={staff} />}

        {activeTab === 'activity' && <ActivityTab staff={staff} />}
      </div>

      {/* 5. Modals & Action Dialogs */}
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

      <ChangeRoleModal
        open={changeRoleOpen}
        onOpenChange={setChangeRoleOpen}
        staff={staff}
        roles={roles}
        onSuccess={() => {
          refresh();
          onRefresh?.();
        }}
      />

      <ReassignDeptModal
        open={reassignDeptOpen}
        onOpenChange={setReassignDeptOpen}
        staff={staff}
        departments={allDepartments}
        onSuccess={() => {
          refresh();
          onRefresh?.();
        }}
      />

      <RequestLeaveModal
        open={requestLeaveOpen}
        onOpenChange={setRequestLeaveOpen}
        staff={staff}
        onSuccess={() => {
          refresh();
          onRefresh?.();
        }}
      />

      <EditPhotoModal
        open={editPhotoOpen}
        onOpenChange={setEditPhotoOpen}
        staff={staff}
        onPhotoUpdated={handlePhotoUpdated}
      />
    </div>
  );
}