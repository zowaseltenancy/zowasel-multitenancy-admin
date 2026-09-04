'use client';

import { useEffect, useState, useMemo } from 'react';
import { useStaff } from '@/hooks/useStaff';
import { Department, StaffMember, DepartmentRole } from '@/types/staff';

export function useDepartmentDetail(rawParam?: string | string[]) {
  const { repo, refresh } = useStaff();
  const [mounted, setMounted] = useState(false);
  const [dept, setDept] = useState<Department | null>(null);
  const [members, setMembers] = useState<StaffMember[]>([]);
  const [roles, setRoles] = useState<DepartmentRole[]>([]);
  const [memberSearch, setMemberSearch] = useState('');

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted) return;
    const rawId = Array.isArray(rawParam) ? rawParam[0] : rawParam;
    if (!rawId) return;

    const allDepts = repo.getDepartments();
    const decoded = decodeURIComponent(rawId).toLowerCase().trim();

    const d = (allDepts || []).find(
      (item) =>
        item &&
        (item.id === rawId ||
          (item.name || '').toLowerCase() === decoded ||
          (item.name || '').toLowerCase().replace(/\s+/g, '-') === decoded)
    );

    if (d) {
      setDept(d);
      setMembers((repo.getAllStaff() || []).filter((s) => s && s.department === d.name));
      setRoles(repo.getDepartmentRoles(d.id) || []);
    }
  }, [mounted, rawParam, repo]);

  const filteredMembers = useMemo(() => {
    if (!memberSearch.trim()) return members;
    const query = memberSearch.toLowerCase();
    return (members || []).filter(
      (m) =>
        m &&
        ((m.firstName || '').toLowerCase().includes(query) ||
          (m.lastName || '').toLowerCase().includes(query) ||
          (m.email || '').toLowerCase().includes(query))
    );
  }, [members, memberSearch]);

  const handleRoleSave = (role: DepartmentRole, editingRole: DepartmentRole | null) => {
    if (editingRole) {
      repo.updateDepartmentRole(role.id, role);
    } else {
      repo.addDepartmentRole(role);
    }
    refresh();
    if (dept) setRoles(repo.getDepartmentRoles(dept.id) || []);
  };

  const deleteRole = (roleId: string) => {
    repo.deleteDepartmentRole(roleId);
    refresh();
    if (dept) setRoles(repo.getDepartmentRoles(dept.id) || []);
  };

  const refreshDept = () => {
    refresh();
    if (dept) {
      const updated = repo.getDepartmentById(dept.id);
      if (updated) {
        setDept(updated);
        setMembers(repo.getAllStaff().filter((s) => s.department === updated.name));
      }
    }
  };

  return {
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
  };
}