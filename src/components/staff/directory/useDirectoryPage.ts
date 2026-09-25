import { useEffect, useMemo, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { toast } from 'sonner';
import { StaffMember } from '@/types/staff';
import {
  useAdminRoles,
  useDepartments,
  useStaff,
  useStaffStats,
} from '@/features/staff/hooks/useStaff';
import { mapAdminRole, mapStaff, toApiStatus } from '@/features/staff/api/staff.mappers';
import { useDirectoryModals } from './useDirectoryModals';
import { nextStaffStatus } from '@/features/staff/utils/statusCycle';

export const PAGE_SIZE = 10;

// The staff directory, backed by GET /admin/staff.
//
// Every filter is now a query parameter rather than a browser-side pass over
// whatever page happened to be loaded — search, department, assignable role and
// status all narrow server-side, and pagination reads the server's total. The
// previous version fetched the whole store from localStorage and sliced it,
// which only worked because the store was one browser's mock data.
//
// `roleId` is a filter I had to add to the API: the directory filters by
// assignable role, while the endpoint's existing `role` parameter is the
// account's SUPER_ADMIN/ADMIN/STAFF tier — a different question.
export function useDirectoryPage() {
  // The dashboard's department cards link here as ?departmentId=<uuid>. Read as
  // the initial filter so those links land on a filtered directory — they
  // previously carried a department *name*, which nothing read, so the quick
  // action navigated here and showed everything.
  const searchParams = useSearchParams();
  const departmentParam = searchParams?.get('departmentId');

  const [search, setSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState('all');
  const [deptFilter, setDeptFilter] = useState(departmentParam ?? 'all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [page, setPage] = useState(1);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  // Typing shouldn't fire a request per keystroke, and out-of-order responses
  // would make the table flicker between result sets.
  const [debouncedSearch, setDebouncedSearch] = useState('');
  useEffect(() => {
    const timer = setTimeout(() => setDebouncedSearch(search), 300);
    return () => clearTimeout(timer);
  }, [search]);

  const query = useMemo(
    () => ({
      page,
      limit: PAGE_SIZE,
      ...(debouncedSearch.trim() ? { search: debouncedSearch.trim() } : {}),
      ...(deptFilter !== 'all' ? { departmentId: deptFilter } : {}),
      ...(roleFilter !== 'all' ? { roleId: roleFilter } : {}),
      ...(statusFilter !== 'all' ? { status: toApiStatus(statusFilter) } : {}),
    }),
    [page, debouncedSearch, deptFilter, roleFilter, statusFilter],
  );

  const {
    staff: staffDtos,
    meta,
    isLoading,
    isFetching,
    error,
    changeStatus,
    remove,
    isMutating,
  } = useStaff(query);

  // Filter options come from their own endpoints, not from the rows on screen —
  // a ten-row page would otherwise only offer the departments and roles that
  // happen to appear on it.
  const { departments: departmentDtos } = useDepartments({ limit: 100 });
  const { roles: roleDtos } = useAdminRoles({ limit: 100 });

  // Platform-wide counts. Tallying the fetched page would make every figure
  // mean "rows currently visible" and move as you filter or page.
  const { stats: apiStats } = useStaffStats();

  const { modalState, openRoleDialog, openDeptDialog, openMessageDialog } = useDirectoryModals();

  const staffList = useMemo<StaffMember[]>(() => staffDtos.map(mapStaff), [staffDtos]);
  const roles = useMemo(() => roleDtos.map(mapAdminRole), [roleDtos]);
  const departments = useMemo(
    () => departmentDtos.map((d) => ({ id: d.id, name: d.name })),
    [departmentDtos],
  );

  const stats = useMemo(() => {
    const total = apiStats?.total ?? staffList.length;
    const active = apiStats?.active ?? 0;
    const inactive = total - active;
    const totalDepts = departmentDtos.length;
    const activePercent = total > 0 ? Math.round((active / total) * 100) : 0;
    return { total, active, inactive, totalDepts, activePercent };
  }, [apiStats, staffList.length, departmentDtos.length]);

  const totalPages = Math.max(1, meta?.totalPages ?? 1);

  useEffect(() => {
    // A page number from the previous result set has no meaning in the new one.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setPage(1);
  }, [debouncedSearch, roleFilter, deptFilter, statusFilter]);

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
    void navigator.clipboard.writeText(id);
    setCopiedId(id);
    toast.success(`Copied ${id}`);
    setTimeout(() => setCopiedId(null), 2000);
  };

  // PATCH /admin/staff/{id}/status. Moving off ACTIVE revokes the account's
  // sessions server-side, and the endpoint refuses your own account and the
  // last active super admin — so the toast comes from the mutation rather than
  // being fired next to it.
  //
  // The next status is the shared cycle, not a two-way flip: this row used to
  // move ACTIVE → INACTIVE and could never suspend anybody.
  const handleStatusToggle = (e: React.MouseEvent, staff: StaffMember) => {
    e.stopPropagation();
    changeStatus(staff.id, nextStaffStatus(staff.status));
  };

  return {
    // Two distinct states, and the difference is the whole reason typing in
    // the search box no longer blanks the page:
    //
    //   isLoading  — the very first fetch, when there is nothing to show yet.
    //                Only this warrants the full-screen spinner.
    //   isFetching — a later fetch for a new filter, search term or page. The
    //                previous rows stay on screen (see keepPreviousData in
    //                useStaff) and the table just dims.
    mounted: !isLoading,
    isLoading,
    isFetching,
    error,
    isMutating,
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
    // The server already applied every filter, so these are the same list —
    // kept as two names because the page reads both.
    filtered: staffList,
    paginated: staffList,
    totalPages,
    hasActiveFilters,
    resetFilters,
    handleCopyId,
    handleStatusToggle,
    handleDelete: (id: string) => remove(id),
    modalState,
    openRoleDialog,
    openDeptDialog,
    openMessageDialog,
  };
}
