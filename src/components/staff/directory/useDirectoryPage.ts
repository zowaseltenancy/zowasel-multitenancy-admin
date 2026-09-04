import { useState, useEffect, useMemo } from 'react';
import { toast } from 'sonner';
import { StaffMember } from '@/types/staff';
import { useDirectoryModals } from './useDirectoryModals';

export const PAGE_SIZE = 10;

export function useDirectoryPage(repo: any, refresh: () => void) {
  const [mounted, setMounted] = useState(false);
  const [search, setSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState('all');
  const [deptFilter, setDeptFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [page, setPage] = useState(1);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const { modalState, openRoleDialog, openDeptDialog, openMessageDialog } =
    useDirectoryModals(repo, refresh);

  useEffect(() => {
    setMounted(true);
  }, []);

  const staffList = useMemo(() => repo.getAllStaff(), [repo]);
  const roles = useMemo(() => repo.getRoles(), [repo]);
  const departments = useMemo(
    () => Array.from(new Set(staffList.map((s: StaffMember) => s.department).filter(Boolean))).sort(),
    [staffList]
  );

  const stats = useMemo(() => {
    const total = staffList.length;
    const active = staffList.filter((s: StaffMember) => s.status === 'active').length;
    const inactive = total - active;
    const totalDepts = departments.length;
    const activePercent = total > 0 ? Math.round((active / total) * 100) : 0;
    return { total, active, inactive, totalDepts, activePercent };
  }, [staffList, departments]);

  const filtered = useMemo(() => {
    return (staffList || []).filter((s: StaffMember) => {
      if (!s) return false;
      const target = `${s.firstName || ''} ${s.lastName || ''} ${s.email || ''} ${s.employeeId || ''}`.toLowerCase();
      return (
        target.includes((search || '').toLowerCase()) &&
        (roleFilter === 'all' || s.roleId === roleFilter) &&
        (deptFilter === 'all' || s.department === deptFilter) &&
        (statusFilter === 'all' || s.status === statusFilter)
      );
    });
  }, [staffList, search, roleFilter, deptFilter, statusFilter]);

  const totalPages = Math.ceil(filtered.length / PAGE_SIZE) || 1;
  const paginated = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  useEffect(() => {
    setPage(1);
  }, [search, roleFilter, deptFilter, statusFilter]);

  const hasActiveFilters =
    search.trim() !== '' || roleFilter !== 'all' || deptFilter !== 'all' || statusFilter !== 'all';

  const resetFilters = () => {
    setSearch('');
    setRoleFilter('all');
    setDeptFilter('all');
    setStatusFilter('all');
  };

  const handleCopyId = (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    navigator.clipboard.writeText(id);
    setCopiedId(id);
    toast.success(`Copied ${id}`);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleStatusToggle = (e: React.MouseEvent, staff: StaffMember) => {
    e.stopPropagation();
    const newStatus = staff.status === 'active' ? 'inactive' : 'active';
    repo.updateStaff(staff.id, { status: newStatus });
    refresh();
    toast.success(`${staff.firstName} ${staff.lastName} marked as ${newStatus}`);
  };

  return {
    mounted,
    search,
    setSearch,
    statusFilter,
    setStatusFilter,
    deptFilter,
    setDeptFilter,
    roleFilter,
    setRoleFilter,
    page,
    setPage,
    copiedId,
    roles,
    departments,
    stats,
    filtered,
    paginated,
    totalPages,
    hasActiveFilters,
    resetFilters,
    handleCopyId,
    handleStatusToggle,
    modalState,
    openRoleDialog,
    openDeptDialog,
    openMessageDialog,
  };
}