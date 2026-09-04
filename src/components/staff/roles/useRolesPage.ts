import { useState, useEffect, useMemo } from 'react';
import { toast } from 'sonner';
import { useStaff } from '@/hooks/useStaff';
import { StaffRole, StaffMember } from '@/types/staff';
import { ALL_PERMISSIONS } from '@/constants/permissions';
import { TabView } from './RolesTabBar';

export function useRolesPage() {
  const { repo, refresh, version } = useStaff();

  const [mounted, setMounted] = useState(false);
  const [activeTab, setActiveTab] = useState<TabView>('cards');
  const [search, setSearch] = useState('');

  const [isRoleModalOpen, setIsRoleModalOpen] = useState(false);
  const [editingRole, setEditingRole] = useState<StaffRole | null>(null);

  const [assignedStaffRole, setAssignedStaffRole] = useState<StaffRole | null>(null);
  const [isAssignedStaffOpen, setIsAssignedStaffOpen] = useState(false);
  const [newlyCreatedRoleId, setNewlyCreatedRoleId] = useState<string | null>(null);
  const [roles, setRoles] = useState<StaffRole[]>([]);

  useEffect(() => {
    setMounted(true);
    setRoles(repo.getRoles());
  }, [repo, version]);

  const staffList = useMemo(() => repo.getAllStaff(), [repo, version]);

  const stats = useMemo(() => {
    const total = roles.length;
    const system = roles.filter((r) => r.isSystemRole).length;
    const custom = total - system;
    const totalScopes = ALL_PERMISSIONS.length;
    return { total, system, custom, totalScopes };
  }, [roles]);

  const filteredRoles = useMemo(() => {
    return roles.filter((r) => {
      if (r.isArchived) return false;
      const match = `${r.name || ''} ${r.description || ''}`.toLowerCase();
      return match.includes(search.toLowerCase());
    });
  }, [roles, search]);

  const getStaffForRole = (roleId: string): StaffMember[] => {
    return staffList.filter((s) => s.roleId === roleId || (s.roleIds || []).includes(roleId));
  };

  const handleOpenCreateRole = () => {
    setEditingRole(null);
    setIsRoleModalOpen(true);
  };

  const handleOpenEditRole = (role: StaffRole) => {
    setEditingRole(role);
    setIsRoleModalOpen(true);
  };

  const handleDeleteRole = (role: StaffRole) => {
    const res = repo.deleteRole(role.id);
    if (!res.success) {
      toast.error(res.message);
      return;
    }
    setRoles((prev) => prev.filter((r) => r.id !== role.id));
    if (newlyCreatedRoleId === role.id) setNewlyCreatedRoleId(null);
    refresh();
    toast.success(res.message);
  };

  const handleToggleMatrixPermission = (role: StaffRole, permCode: string) => {
    const current = role.permissions || [];
    const updated = current.includes(permCode) ? current.filter((c) => c !== permCode) : [...current, permCode];
    repo.updateRole(role.id, { permissions: updated });
    setRoles((prev) => prev.map((r) => (r.id === role.id ? { ...r, permissions: updated } : r)));
    refresh();
  };

  const handleSaveRole = (roleData: { name: string; description: string; departmentId?: string; permissions: string[] }) => {
    if (editingRole) {
      repo.updateRole(editingRole.id, roleData);
      setRoles((prev) => prev.map((r) => (r.id === editingRole.id ? { ...r, ...roleData } : r)));
      toast.success(`Role "${roleData.name}" updated successfully.`);
    } else {
      const newRole = repo.addRole({ ...roleData, isSystemRole: false });
      setRoles((prev) => [...prev, newRole]);
      setNewlyCreatedRoleId(newRole.id);
      toast.success(`Role "${roleData.name}" created successfully.`);
    }
    refresh();
    setIsRoleModalOpen(false);
  };

  return {
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
  };
}