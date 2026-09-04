'use client';

import React from 'react';
import { Loader2 } from 'lucide-react';
import { getCategoryIcon } from '@/lib/permissionIcons';
import { RolesHeader } from '@/components/staff/roles/RolesHeader';
import { RolesStatsCards } from '@/components/staff/roles/RolesStatsCards';
import { RolesTabBar } from '@/components/staff/roles/RolesTabBar';
import { RolesCardsTab } from '@/components/staff/roles/RolesCardsTab';
import { RolesMatrixTab } from '@/components/staff/roles/RolesMatrixTab';
import { RolesCatalogTab } from '@/components/staff/roles/RolesCatalogTab';
import { RoleModal } from '@/components/staff/roles/RoleModal';
import { AssignedStaffModal } from '@/components/staff/roles/AssignedStaffModal';
import { useRolesPage } from '@/components/staff/roles/useRolesPage';

export default function RolesManagementPage() {
  const {
    mounted,
    activeTab,
    setActiveTab,
    search,
    setSearch,
    isRoleModalOpen,
    setIsRoleModalOpen,
    editingRole,
    assignedStaffRole,
    setAssignedStaffRole,
    isAssignedStaffOpen,
    setIsAssignedStaffOpen,
    newlyCreatedRoleId,
    roles,
    stats,
    filteredRoles,
    getStaffForRole,
    handleOpenCreateRole,
    handleOpenEditRole,
    handleDeleteRole,
    handleToggleMatrixPermission,
    handleSaveRole,
  } = useRolesPage();

  if (!mounted) {
    return (
      <div className="p-8 flex justify-center items-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-[#00A651]" />
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12">
      <RolesHeader onOpenCreateRole={handleOpenCreateRole} />
      <RolesStatsCards stats={stats} />
      <RolesTabBar
        activeTab={activeTab}
        onTabChange={setActiveTab}
        search={search}
        onSearchChange={setSearch}
      />

      {activeTab === 'cards' && (
        <RolesCardsTab
          roles={filteredRoles}
          getStaffForRole={getStaffForRole}
          onOpenCreate={handleOpenCreateRole}
          onOpenEdit={handleOpenEditRole}
          onOpenAssigned={(role) => {
            setAssignedStaffRole(role);
            setIsAssignedStaffOpen(true);
          }}
          onDelete={handleDeleteRole}
        />
      )}

      {activeTab === 'matrix' && (
        <RolesMatrixTab
          roles={roles}
          newlyCreatedRoleId={newlyCreatedRoleId}
          getCategoryIcon={getCategoryIcon}
          onOpenCreate={handleOpenCreateRole}
          onOpenEdit={handleOpenEditRole}
          onToggleMatrixPermission={handleToggleMatrixPermission}
        />
      )}

      {activeTab === 'catalog' && <RolesCatalogTab getCategoryIcon={getCategoryIcon} />}

      <RoleModal
        open={isRoleModalOpen}
        onOpenChange={setIsRoleModalOpen}
        editingRole={editingRole}
        onSaveRole={handleSaveRole}
      />

      <AssignedStaffModal
        open={isAssignedStaffOpen}
        onOpenChange={setIsAssignedStaffOpen}
        role={assignedStaffRole}
        assignedStaff={assignedStaffRole ? getStaffForRole(assignedStaffRole.id) : []}
      />
    </div>
  );
}