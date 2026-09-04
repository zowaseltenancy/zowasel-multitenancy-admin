'use client';

import { Suspense, useState } from 'react';
import { useParams, useSearchParams } from 'next/navigation';
import { Tabs, TabsContent } from '@/components/ui/tabs';
import { Loader2 } from 'lucide-react';
import { DepartmentRole } from '@/types/staff';
import { DepartmentDrawer } from '@/components/staff/DepartmentDrawer';
import { RoleBuilderDialog } from '@/components/staff/RoleBuilderDialog';
import { DepartmentDetailHeader } from '@/components/staff/department/DepartmentDetailHeader';
import { DepartmentRolesList } from '@/components/staff/department/DepartmentRolesList';
import { DepartmentMembersTab } from '@/components/staff/department/DepartmentMembersTab';
import { DepartmentNotFound } from '@/components/staff/department/DepartmentNotFound';
import { DepartmentTabControls } from '@/components/staff/department/DepartmentTabControls';
import { useDepartmentDetail } from '@/components/staff/department/useDepartmentDetail';

function DepartmentDetailContent() {
  const params = useParams();
  const searchParams = useSearchParams();
  const tabParam = searchParams?.get('tab');

  const {
    repo,
    mounted,
    dept,
    members,
    roles,
    filteredMembers,
    memberSearch,
    setMemberSearch,
    handleRoleSave,
    deleteRole,
    refreshDept,
  } = useDepartmentDetail(params?.id);

  const [activeTab, setActiveTab] = useState(tabParam === 'roles' ? 'roles' : 'members');
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [roleDialogOpen, setRoleDialogOpen] = useState(false);
  const [editingRole, setEditingRole] = useState<DepartmentRole | null>(null);

  if (!mounted) {
    return (
      <div className="p-8 flex justify-center items-center min-h-[400px]">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!dept) {
    return <DepartmentNotFound />;
  }

  const head = dept.headId ? repo.getStaffById(dept.headId) : null;

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-6 max-w-6xl mx-auto">
      <DepartmentDetailHeader
        dept={dept}
        head={head}
        membersCount={members.length}
        onEditDept={() => setDrawerOpen(true)}
      />

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <DepartmentTabControls
          activeTab={activeTab}
          membersCount={members.length}
          rolesCount={roles.length}
          memberSearch={memberSearch}
          onSearchChange={setMemberSearch}
          onCreateRole={() => {
            setEditingRole(null);
            setRoleDialogOpen(true);
          }}
        />

        <TabsContent value="members" className="space-y-4 mt-0">
          <DepartmentMembersTab
            deptName={dept.name}
            filteredMembers={filteredMembers}
            roles={repo.getRoles()}
          />
        </TabsContent>

        <TabsContent value="roles" className="space-y-4 mt-0">
          <DepartmentRolesList
            deptName={dept.name}
            roles={roles}
            onCreateRole={() => {
              setEditingRole(null);
              setRoleDialogOpen(true);
            }}
            onEditRole={(role) => {
              setEditingRole(role);
              setRoleDialogOpen(true);
            }}
            onDeleteRole={deleteRole}
          />
        </TabsContent>
      </Tabs>

      <DepartmentDrawer
        open={drawerOpen}
        onOpenChange={setDrawerOpen}
        department={dept}
        onSuccess={() => {
          refreshDept();
          setDrawerOpen(false);
        }}
      />

      <RoleBuilderDialog
        open={roleDialogOpen}
        onOpenChange={setRoleDialogOpen}
        departmentId={dept.id}
        existingRole={editingRole}
        onSave={(role) => {
          handleRoleSave(role, editingRole);
          setRoleDialogOpen(false);
          setEditingRole(null);
        }}
      />
    </div>
  );
}

export default function DepartmentDetailPage() {
  return (
    <Suspense
      fallback={
        <div className="p-8 flex justify-center items-center min-h-[400px]">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      }
    >
      <DepartmentDetailContent />
    </Suspense>
  );
}