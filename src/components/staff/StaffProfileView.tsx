'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { StaffMember, StaffRole, DepartmentRole } from '@/types/staff';
import { useDepartments, useStaff } from '@/features/staff/hooks/useStaff';
import { nextStaffStatus } from '@/features/staff/utils/statusCycle';
import { mapStaff } from '@/features/staff/api/staff.mappers';

// Profile Subcomponents & Tabs
import { ProfileHeader } from './profile/ProfileHeader';
import { StaffIdentityCard } from './profile/StaffIdentityCard';
import { ProfileTabs, TabKey } from './profile/ProfileTabs';
import { OverviewTab } from './profile/tabs/OverviewTab';
import { DepartmentTeamTab } from './profile/tabs/DepartmentTeamTab';
import { StatusHistoryTab } from './profile/tabs/StatusHistoryTab';
import { StaffProfileModals } from './profile/StaffProfileModals';
import { toast } from 'sonner';

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
  const { changeStatus } = useStaff();
  const { departments } = useDepartments({ limit: 100 });

  // Colleagues in the same department, from GET /admin/staff?departmentId=
  // rather than a filter over every staff record held locally.
  const { staff: colleagueDtos } = useStaff(
    staff.departmentId ? { departmentId: staff.departmentId, limit: 100 } : { limit: 1 },
  );

  const [activeTab, setActiveTab] = useState<TabKey>('overview');
  const [resetPasswordOpen, setResetPasswordOpen] = useState(false);
  const [sendMessageOpen, setSendMessageOpen] = useState(false);
  const [reassignDeptOpen, setReassignDeptOpen] = useState(false);
  const [suspendModalOpen, setSuspendModalOpen] = useState(false);
  const [editPhotoOpen, setEditPhotoOpen] = useState(false);

  const roleName = roles.find((r) => r.id === staff.roleId)?.name || staff.roleId || 'Staff Member';
  const allDepartments = departments.map((d) => ({ id: d.id, name: d.name }));
  const departmentColleagues = colleagueDtos
    .filter((c) => c.id !== staff.id)
    .map(mapStaff);

  // The mutations invalidate the staff queries themselves; onRefresh is kept
  // for callers that also need to react.
  const handleRefresh = () => {
    onRefresh?.();
  };

  return (
    <div className="space-y-5 max-w-6xl mx-auto pb-10">
      <ProfileHeader
        staff={staff}
        onEditProfile={() => router.push(`/admin/staff/${staff.id}/edit?step=3`)}
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
        // No avatar endpoint, and no avatar column on the admins table — the
        // upload cannot be persisted, so it says so rather than appearing to
        // save and silently reverting on the next fetch.
        onPhotoUpdated={() => {
          toast.error("Profile photos aren't available yet — there's no endpoint for it.");
        }}
        // PATCH /admin/staff/{id}/status. Suspending revokes the account's
        // sessions server-side; the endpoint refuses your own account and the
        // last active super admin.
        onStatusUpdated={() => {
          changeStatus(staff.id, nextStaffStatus(staff.status), undefined, {
            onSuccess: handleRefresh,
          });
        }}
      />
    </div>
  );
}