'use client';

import { useState, useEffect, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import {
  Search,
  Mail,
  Download,
  FileSpreadsheet,
  FileText,
  Table as TableIcon,
  Plus,
  Eye,
  Pencil,
  Loader2,
  UserX,
  UserCheck,
  ChevronLeft,
  ChevronRight,
  MoreHorizontal,
  Users,
  Building2,
  Clock,
  Copy,
  Check,
  RotateCcw,
  Send,
  ShieldCheck,
  ChevronRight as BreadcrumbArrow,
} from 'lucide-react';

import { exportToCsv, exportToExcel, exportToPdf } from '@/lib/export';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Badge } from '@/components/ui/badge';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { toast } from 'sonner';
import { useStaff } from '@/hooks/useStaff';
import { StaffMember } from '@/types/staff';
import { getDepartmentIcon } from '@/lib/departmentIcons';

const PAGE_SIZE = 10;

export default function StaffDirectoryPage() {
  const { repo, refresh } = useStaff();
  const router = useRouter();

  const [mounted, setMounted] = useState(false);
  const [search, setSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState('all');
  const [deptFilter, setDeptFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [page, setPage] = useState(1);

  // Modals state
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

  const [copiedId, setCopiedId] = useState<string | null>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  const staffList = useMemo(() => repo.getAllStaff(), [repo]);
  const roles = useMemo(() => repo.getRoles(), [repo]);
  const departments = useMemo(
    () => Array.from(new Set(staffList.map((s) => s.department).filter(Boolean))).sort(),
    [staffList]
  );

  // Statistics calculation
  const stats = useMemo(() => {
    const total = staffList.length;
    const active = staffList.filter((s) => s.status === 'active').length;
    const inactive = total - active;
    const totalDepts = departments.length;
    const activePercent = total > 0 ? Math.round((active / total) * 100) : 0;
    return { total, active, inactive, totalDepts, activePercent };
  }, [staffList, departments]);

  // Filtering
  const filtered = useMemo(() => {
    return (staffList || []).filter((s) => {
      if (!s) return false;
      const searchTarget = `${s.firstName || ''} ${s.lastName || ''} ${s.email || ''} ${s.employeeId || ''}`.toLowerCase();
      const matchesSearch = searchTarget.includes((search || '').toLowerCase());
      const matchesRole = roleFilter === 'all' || s.roleId === roleFilter;
      const matchesDept = deptFilter === 'all' || s.department === deptFilter;
      const matchesStatus = statusFilter === 'all' || s.status === statusFilter;
      return matchesSearch && matchesRole && matchesDept && matchesStatus;
    });
  }, [staffList, search, roleFilter, deptFilter, statusFilter]);

  const totalPages = Math.ceil(filtered.length / PAGE_SIZE) || 1;
  const paginated = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  useEffect(() => {
    setPage(1);
  }, [search, roleFilter, deptFilter, statusFilter]);

  const hasActiveFilters = search.trim() !== '' || roleFilter !== 'all' || deptFilter !== 'all' || statusFilter !== 'all';

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

  const getExportDataset = () => {
    const headers = ['Staff ID', 'First Name', 'Last Name', 'Email', 'Phone', 'Department', 'Role', 'Status', 'Date Joined', 'Location'];
    const rows = filtered.map((s) => {
      const roleName = roles.find((r) => r.id === s.roleId)?.name || s.roleId || '';
      const employeeId = s.employeeId || `STA-${s.id.slice(-5).toUpperCase()}`;
      return [
        employeeId,
        s.firstName || '',
        s.lastName || '',
        s.email || '',
        s.phone || '',
        s.department || '',
        roleName,
        s.status || '',
        formatDate(s.dateJoined),
        s.workLocation || '',
      ];
    });
    return { headers, rows };
  };

  const handleExportCSV = () => {
    try {
      const { headers, rows } = getExportDataset();
      exportToCsv({
        title: 'Zowasel_Staff_Directory',
        headers,
        rows,
      });
      toast.success('CSV Export downloaded successfully');
    } catch (err) {
      console.error('Failed to export CSV:', err);
      toast.error('Failed to export CSV');
    }
  };

  const handleExportExcel = async () => {
    try {
      const { headers, rows } = getExportDataset();
      await exportToExcel({
        title: 'Zowasel_Staff_Directory',
        headers,
        rows,
      });
      toast.success('Excel spreadsheet downloaded successfully');
    } catch (err) {
      console.error('Failed to export Excel:', err);
      toast.error('Failed to export Excel');
    }
  };

  const handleExportPDF = async () => {
    try {
      const headers = ['Staff ID', 'Name', 'Email', 'Department', 'Role', 'Status', 'Date Joined'];
      const rows = filtered.map((s) => {
        const roleName = roles.find((r) => r.id === s.roleId)?.name || s.roleId || '';
        const employeeId = s.employeeId || `STA-${s.id.slice(-5).toUpperCase()}`;
        return [
          employeeId,
          `${s.firstName || ''} ${s.lastName || ''}`.trim(),
          s.email || '',
          s.department || '',
          roleName,
          s.status || '',
          formatDate(s.dateJoined),
        ];
      });
      await exportToPdf({
        title: 'Zowasel Staff Directory',
        headers,
        rows,
      });
      toast.success('PDF document downloaded successfully');
    } catch (err) {
      console.error('Failed to export PDF:', err);
      toast.error('Failed to export PDF');
    }
  };


  const handleStatusToggle = (e: React.MouseEvent, staff: StaffMember) => {
    e.stopPropagation();
    const newStatus = staff.status === 'active' ? 'inactive' : 'active';
    repo.updateStaff(staff.id, { status: newStatus });
    refresh();
    toast.success(`${staff.firstName} ${staff.lastName} marked as ${newStatus}`);
  };

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

  const formatDate = (dateStr?: string) => {
    if (!dateStr) return '—';
    try {
      return new Date(dateStr).toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
      });
    } catch {
      return dateStr;
    }
  };

  if (!mounted) {
    return (
      <div className="p-8 flex justify-center items-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-[#00A651]" />
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12">
      
      {/* 1. Page Header & Actions */}
      <div className="space-y-3 pb-1 border-b border-border/60">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-1.5 text-xs text-muted-foreground font-medium">
          <button
            type="button"
            onClick={() => router.push('/admin/staff/directory')}
            className="hover:text-foreground transition-colors cursor-pointer"
          >
            Staff Management
          </button>
          <BreadcrumbArrow className="h-3.5 w-3.5 opacity-50" />
          <span className="text-foreground font-semibold">Staff Directory</span>
        </nav>

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
              Staff Directory
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-0.5">
              Manage platform personnel, active field officers, corporate designations, and departmental teams.
            </p>
          </div>

          {/* Action CTAs */}
          <div className="flex items-center gap-2 self-start sm:self-center shrink-0">
            <DropdownMenu>
              <DropdownMenuTrigger
                render={
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    className="h-9 px-3 text-xs font-medium gap-1.5 cursor-pointer shadow-2xs"
                  >
                    <Download className="h-3.5 w-3.5 text-muted-foreground" />
                    Export
                  </Button>
                }
              />
              <DropdownMenuContent align="end" className="w-52 p-1.5">
                <DropdownMenuLabel className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider px-2 py-1">
                  Export Personnel Data
                </DropdownMenuLabel>
                <DropdownMenuItem
                  onClick={handleExportCSV}
                  className="text-xs cursor-pointer flex items-center gap-2 py-2 px-2 rounded-md"
                >
                  <TableIcon className="h-3.5 w-3.5 text-emerald-600 shrink-0" />
                  <span>Export as CSV (.csv)</span>
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={handleExportExcel}
                  className="text-xs cursor-pointer flex items-center gap-2 py-2 px-2 rounded-md"
                >
                  <FileSpreadsheet className="h-3.5 w-3.5 text-emerald-600 shrink-0" />
                  <span>Export as Excel (.xlsx)</span>
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={handleExportPDF}
                  className="text-xs cursor-pointer flex items-center gap-2 py-2 px-2 rounded-md"
                >
                  <FileText className="h-3.5 w-3.5 text-rose-600 shrink-0" />
                  <span>Export as PDF (.pdf)</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            <Button
              type="button"
              size="sm"
              onClick={() => router.push('/admin/staff/onboarding')}
              className="h-9 px-3.5 bg-[#00A651] hover:bg-[#008C44] text-white font-bold shadow-xs gap-1.5 cursor-pointer text-xs sm:text-sm"
            >
              <Plus className="h-4 w-4" /> Add New Staff
            </Button>
          </div>
        </div>
      </div>

      {/* 2. Top Executive Metric Summary Strip */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3.5">
        <div className="border border-border/60 rounded-2xl bg-card p-4 shadow-2xs flex items-center justify-between">
          <div className="space-y-0.5">
            <span className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider block">
              Total Personnel
            </span>
            <p className="text-2xl font-extrabold text-slate-900 dark:text-white font-mono">
              {stats.total}
            </p>
            <span className="text-[10px] text-muted-foreground block">
              {filtered.length} showing on grid
            </span>
          </div>
          <div className="h-10 w-10 rounded-xl bg-blue-500/10 text-blue-600 dark:text-blue-400 flex items-center justify-center shrink-0">
            <Users className="h-5 w-5" />
          </div>
        </div>

        <div className="border border-border/60 rounded-2xl bg-card p-4 shadow-2xs flex items-center justify-between">
          <div className="space-y-0.5">
            <span className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider block">
              Active Personnel
            </span>
            <p className="text-2xl font-extrabold text-slate-900 dark:text-white font-mono">
              {stats.active}
            </p>
            <span className="text-[10px] font-bold text-[#008C44] dark:text-[#00C862] flex items-center gap-1">
              <span className="h-1.5 w-1.5 rounded-full bg-[#00A651]" /> {stats.activePercent}% Operational
            </span>
          </div>
          <div className="h-10 w-10 rounded-xl bg-emerald-500/10 text-[#00A651] flex items-center justify-center shrink-0">
            <UserCheck className="h-5 w-5" />
          </div>
        </div>

        <div className="border border-border/60 rounded-2xl bg-card p-4 shadow-2xs flex items-center justify-between">
          <div className="space-y-0.5">
            <span className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider block">
              Departments
            </span>
            <p className="text-2xl font-extrabold text-slate-900 dark:text-white font-mono">
              {stats.totalDepts}
            </p>
            <span className="text-[10px] text-muted-foreground block">
              Functional business units
            </span>
          </div>
          <div className="h-10 w-10 rounded-xl bg-purple-500/10 text-purple-600 dark:text-purple-400 flex items-center justify-center shrink-0">
            <Building2 className="h-5 w-5" />
          </div>
        </div>

        <div className="border border-border/60 rounded-2xl bg-card p-4 shadow-2xs flex items-center justify-between">
          <div className="space-y-0.5">
            <span className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider block">
              On Leave / Inactive
            </span>
            <p className="text-2xl font-extrabold text-slate-900 dark:text-white font-mono">
              {stats.inactive}
            </p>
            <span className="text-[10px] text-amber-600 dark:text-amber-400 font-medium block">
              {stats.inactive > 0 ? 'Requires attention / leave active' : 'All staff active'}
            </span>
          </div>
          <div className="h-10 w-10 rounded-xl bg-amber-500/10 text-amber-600 dark:text-amber-400 flex items-center justify-center shrink-0">
            <Clock className="h-5 w-5" />
          </div>
        </div>
      </div>

      {/* 3. Filter, Search & Status Bar */}
      <div className="border border-border/60 rounded-2xl bg-card p-4 shadow-2xs space-y-3.5">
        <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
          
          {/* Status Quick Pills */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 md:pb-0">
            {[
              { label: 'All Staff', value: 'all', count: stats.total },
              { label: 'Active', value: 'active', count: stats.active },
              { label: 'Inactive / On Leave', value: 'inactive', count: stats.inactive },
            ].map((st) => (
              <button
                key={st.value}
                type="button"
                onClick={() => setStatusFilter(st.value)}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer flex items-center gap-1.5 ${
                  statusFilter === st.value
                    ? 'bg-[#00A651] text-white shadow-2xs'
                    : 'bg-muted/40 hover:bg-muted text-muted-foreground border border-border/40'
                }`}
              >
                <span>{st.label}</span>
                <span
                  className={`text-[10px] font-mono px-1.5 py-0.2 rounded-full font-bold ${
                    statusFilter === st.value
                      ? 'bg-white/20 text-white'
                      : 'bg-muted text-muted-foreground'
                  }`}
                >
                  {st.count}
                </span>
              </button>
            ))}
          </div>

          {/* Reset Filters CTA if active */}
          {hasActiveFilters && (
            <button
              type="button"
              onClick={resetFilters}
              className="text-xs font-semibold text-muted-foreground hover:text-foreground flex items-center gap-1 cursor-pointer self-end md:self-auto"
            >
              <RotateCcw className="h-3 w-3" /> Reset Filters
            </button>
          )}
        </div>

        {/* Search & Dropdown Selectors */}
        <div className="grid grid-cols-1 sm:grid-cols-12 gap-3">
          {/* Search Input */}
          <div className="sm:col-span-6 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by name, official email, or Staff ID..."
              className="pl-9 h-9.5 text-xs bg-muted/20"
            />
          </div>

          {/* Department Filter */}
          <div className="sm:col-span-3">
            <Select value={deptFilter} onValueChange={setDeptFilter}>
              <SelectTrigger className="h-9.5 text-xs">
                <SelectValue placeholder="All Departments" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all" className="text-xs">All Departments</SelectItem>
                {departments.map((dept) => (
                  <SelectItem key={dept} value={dept} className="text-xs">
                    {dept}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Role Filter */}
          <div className="sm:col-span-3">
            <Select value={roleFilter} onValueChange={setRoleFilter}>
              <SelectTrigger className="h-9.5 text-xs">
                <SelectValue placeholder="All Corporate Roles" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all" className="text-xs">All Corporate Roles</SelectItem>
                {roles.map((r) => (
                  <SelectItem key={r.id} value={r.id} className="text-xs">
                    {r.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      {/* 4. Enterprise Staff Table */}
      <div className="border border-border/60 rounded-2xl bg-card overflow-hidden shadow-2xs">
        <Table>
          <TableHeader>
            <TableRow className="bg-muted/30 hover:bg-muted/30 border-b border-border/60">
              <TableHead className="text-xs font-bold uppercase tracking-wider text-muted-foreground h-11 pl-5">
                Staff Member
              </TableHead>
              <TableHead className="text-xs font-bold uppercase tracking-wider text-muted-foreground h-11">
                Staff ID
              </TableHead>
              <TableHead className="text-xs font-bold uppercase tracking-wider text-muted-foreground h-11">
                Department
              </TableHead>
              <TableHead className="text-xs font-bold uppercase tracking-wider text-muted-foreground h-11">
                Designation
              </TableHead>
              <TableHead className="text-xs font-bold uppercase tracking-wider text-muted-foreground h-11">
                Status
              </TableHead>
              <TableHead className="text-xs font-bold uppercase tracking-wider text-muted-foreground h-11">
                Date Joined
              </TableHead>
              <TableHead className="text-xs font-bold uppercase tracking-wider text-muted-foreground h-11 text-right pr-5">
                Actions
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {paginated.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="h-56 text-center">
                  <div className="flex flex-col items-center justify-center gap-2.5 max-w-sm mx-auto text-muted-foreground">
                    <div className="h-12 w-12 rounded-2xl bg-muted/40 border flex items-center justify-center text-muted-foreground">
                      <UserX className="h-6 w-6 opacity-60" />
                    </div>
                    <div>
                      <p className="font-bold text-sm text-foreground">No personnel records found</p>
                      <p className="text-xs text-muted-foreground mt-0.5">
                        {hasActiveFilters
                          ? 'No staff members match the current search or filter query. Try clearing filters.'
                          : 'No staff members exist in the repository yet. Onboard your first staff member.'}
                      </p>
                    </div>
                    {hasActiveFilters && (
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={resetFilters}
                        className="h-8 text-xs mt-1 cursor-pointer"
                      >
                        Reset Search Filters
                      </Button>
                    )}
                  </div>
                </TableCell>
              </TableRow>
            ) : (
              paginated.map((staff) => {
                const roleName = roles.find((r) => r.id === staff.roleId)?.name || staff.roleId || 'Staff Member';
                const initials = `${staff.firstName?.[0] || ''}${staff.lastName?.[0] || ''}`.toUpperCase() || 'ZS';
                const DeptIcon = getDepartmentIcon(staff.department);
                const employeeId = staff.employeeId || `STA-${staff.id.slice(-5).toUpperCase()}`;

                return (
                  <TableRow
                    key={staff.id}
                    onClick={() => router.push(`/admin/staff/${staff.id}`)}
                    className="hover:bg-muted/30 transition-colors cursor-pointer border-b border-border/50 group"
                  >
                    {/* Staff Name & Avatar */}
                    <TableCell className="pl-5 py-3.5">
                      <div className="flex items-center gap-3">
                        <div className="relative shrink-0">
                          {staff.avatarUrl ? (
                            <img
                              src={staff.avatarUrl}
                              alt={`${staff.firstName} ${staff.lastName}`}
                              className="h-9 w-9 rounded-xl object-cover border border-border shadow-2xs"
                            />
                          ) : (
                            <div className="h-9 w-9 rounded-xl bg-muted text-foreground font-bold text-xs flex items-center justify-center border shadow-2xs">
                              {initials}
                            </div>
                          )}
                          <span
                            className={`absolute -bottom-0.5 -right-0.5 h-2.5 w-2.5 rounded-full border-2 border-card ${
                              staff.status === 'active' ? 'bg-[#00A651]' : 'bg-amber-500'
                            }`}
                          />
                        </div>

                        <div className="min-w-0">
                          <p className="font-bold text-xs sm:text-sm text-slate-900 dark:text-slate-100 group-hover:text-[#008C44] dark:group-hover:text-[#00C862] transition-colors truncate">
                            {staff.firstName} {staff.lastName}
                          </p>
                          <p className="text-[11px] text-muted-foreground font-mono truncate">
                            {staff.email}
                          </p>
                        </div>
                      </div>
                    </TableCell>

                    {/* Staff ID */}
                    <TableCell className="py-3.5">
                      <button
                        type="button"
                        onClick={(e) => handleCopyId(e, employeeId)}
                        className="inline-flex items-center gap-1 font-mono text-xs px-2 py-0.5 rounded-md bg-muted/40 hover:bg-muted text-slate-800 dark:text-slate-200 border border-border/50 transition-colors cursor-pointer"
                        title="Click to copy Staff ID"
                      >
                        <span>{employeeId}</span>
                        {copiedId === employeeId ? (
                          <Check className="h-3 w-3 text-[#00A651]" />
                        ) : (
                          <Copy className="h-3 w-3 opacity-40 group-hover:opacity-80" />
                        )}
                      </button>
                    </TableCell>

                    {/* Department */}
                    <TableCell className="py-3.5">
                      <div className="flex items-center gap-1.5 text-xs text-slate-700 dark:text-slate-300 font-medium">
                        <DeptIcon className="h-3.5 w-3.5 text-muted-foreground shrink-0" />
                        <span className="truncate max-w-[140px]">{staff.department || 'General'}</span>
                      </div>
                    </TableCell>

                    {/* Corporate Role */}
                    <TableCell className="py-3.5">
                      <span className="text-xs font-semibold text-slate-900 dark:text-slate-100 block truncate max-w-[150px]">
                        {roleName}
                      </span>
                    </TableCell>

                    {/* Status Badge */}
                    <TableCell className="py-3.5">
                      <Badge
                        variant="outline"
                        className={`text-[10.5px] font-semibold px-2 py-0.5 ${
                          staff.status === 'active'
                            ? 'text-[#008C44] dark:text-[#00C862] border-[#00A651]/30 bg-[#00A651]/10'
                            : 'text-amber-600 dark:text-amber-400 border-amber-500/30 bg-amber-500/10'
                        }`}
                      >
                        <span
                          className={`h-1.5 w-1.5 rounded-full mr-1.5 ${
                            staff.status === 'active' ? 'bg-[#00A651]' : 'bg-amber-500'
                          }`}
                        />
                        {staff.status === 'active' ? 'Active' : 'Inactive'}
                      </Badge>
                    </TableCell>

                    {/* Date Joined */}
                    <TableCell className="py-3.5 text-xs text-muted-foreground font-medium">
                      {formatDate(staff.dateJoined)}
                    </TableCell>

                    {/* Row Actions */}
                    <TableCell className="py-3.5 text-right pr-5" onClick={(e) => e.stopPropagation()}>
                      <div className="flex items-center justify-end gap-1">
                        
                        {/* View Profile Action */}
                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger
                              render={
                                <Button
                                  type="button"
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => router.push(`/admin/staff/${staff.id}`)}
                                  className="h-8 w-8 p-0 text-muted-foreground hover:text-[#00A651] hover:bg-[#00A651]/10 cursor-pointer"
                                >
                                  <Eye className="h-4 w-4" />
                                </Button>
                              }
                            />
                            <TooltipContent side="top">View Full Profile</TooltipContent>
                          </Tooltip>
                        </TooltipProvider>

                        {/* Edit Staff Action */}
                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger
                              render={
                                <Button
                                  type="button"
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => router.push(`/admin/staff/${staff.id}/edit`)}
                                  className="h-8 w-8 p-0 text-muted-foreground hover:text-foreground cursor-pointer"
                                >
                                  <Pencil className="h-3.5 w-3.5" />
                                </Button>
                              }
                            />
                            <TooltipContent side="top">Edit Staff Information</TooltipContent>
                          </Tooltip>
                        </TooltipProvider>

                        {/* More Actions Dropdown */}
                        <DropdownMenu>
                          <DropdownMenuTrigger
                            render={
                              <Button
                                type="button"
                                variant="ghost"
                                size="sm"
                                className="h-8 w-8 p-0 text-muted-foreground hover:text-foreground cursor-pointer"
                              >
                                <MoreHorizontal className="h-4 w-4" />
                              </Button>
                            }
                          />
                          <DropdownMenuContent align="end" className="w-48">
                            <DropdownMenuLabel className="text-[10px] font-bold uppercase text-muted-foreground tracking-wider">
                              Actions
                            </DropdownMenuLabel>
                            <DropdownMenuItem
                              onClick={() => router.push(`/admin/staff/${staff.id}`)}
                              className="gap-2 text-xs cursor-pointer"
                            >
                              <Eye className="h-3.5 w-3.5 text-muted-foreground" /> View Profile
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onClick={() => router.push(`/admin/staff/${staff.id}/edit`)}
                              className="gap-2 text-xs cursor-pointer"
                            >
                              <Pencil className="h-3.5 w-3.5 text-muted-foreground" /> Edit Details
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onClick={(e) => openRoleDialog(e, staff)}
                              className="gap-2 text-xs cursor-pointer"
                            >
                              <ShieldCheck className="h-3.5 w-3.5 text-muted-foreground" /> Change Role
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onClick={(e) => openDeptDialog(e, staff)}
                              className="gap-2 text-xs cursor-pointer"
                            >
                              <Building2 className="h-3.5 w-3.5 text-muted-foreground" /> Reassign Dept
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onClick={(e) => openMessageDialog(e, staff)}
                              className="gap-2 text-xs cursor-pointer"
                            >
                              <Mail className="h-3.5 w-3.5 text-muted-foreground" /> Send Message
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem
                              onClick={(e) => handleStatusToggle(e, staff)}
                              className={`gap-2 text-xs cursor-pointer ${
                                staff.status === 'active'
                                  ? 'text-amber-600 dark:text-amber-400'
                                  : 'text-[#00A651]'
                              }`}
                            >
                              {staff.status === 'active' ? (
                                <>
                                  <UserX className="h-3.5 w-3.5" /> Deactivate Staff
                                </>
                              ) : (
                                <>
                                  <UserCheck className="h-3.5 w-3.5" /> Activate Staff
                                </>
                              )}
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    </TableCell>
                  </TableRow>
                );
              })
            )}
          </TableBody>
        </Table>

        {/* 5. Pagination Footer */}
        <div className="p-4 border-t border-border/60 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-muted-foreground bg-muted/10">
          <p>
            Showing{' '}
            <strong className="text-foreground font-mono">
              {filtered.length > 0 ? (page - 1) * PAGE_SIZE + 1 : 0}–{Math.min(page * PAGE_SIZE, filtered.length)}
            </strong>{' '}
            of <strong className="text-foreground font-mono">{filtered.length}</strong> personnel records
          </p>

          <div className="flex items-center gap-1.5">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page === 1}
              className="h-8 px-2.5 text-xs gap-1 cursor-pointer"
            >
              <ChevronLeft className="h-3.5 w-3.5" /> Previous
            </Button>

            <span className="px-2 font-mono font-bold text-foreground">
              {page} / {totalPages}
            </span>

            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              disabled={page === totalPages || filtered.length === 0}
              className="h-8 px-2.5 text-xs gap-1 cursor-pointer"
            >
              Next <ChevronRight className="h-3.5 w-3.5" />
            </Button>
          </div>
        </div>
      </div>

      {/* 6. Role Change Dialog */}
      <Dialog open={roleEditOpen} onOpenChange={setRoleEditOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-base font-bold">
              Change Corporate Designation
            </DialogTitle>
            <DialogDescription className="text-xs text-muted-foreground">
              Update role assignment for {roleEditStaff?.firstName} {roleEditStaff?.lastName}.
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={saveRoleChange} className="space-y-4 py-2 text-xs">
            <div className="space-y-1.5">
              <Label className="text-xs font-semibold">Select Designation / Role</Label>
              <Select value={selectedRoleId} onValueChange={setSelectedRoleId}>
                <SelectTrigger className="h-9 text-xs">
                  <SelectValue placeholder="Select role" />
                </SelectTrigger>
                <SelectContent>
                  {roles.map((r) => (
                    <SelectItem key={r.id} value={r.id} className="text-xs">
                      {r.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <DialogFooter className="gap-2 pt-2">
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => setRoleEditOpen(false)}
                className="text-xs cursor-pointer"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                size="sm"
                className="bg-[#00A651] hover:bg-[#008C44] text-white font-bold text-xs cursor-pointer"
              >
                Save Role
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* 7. Department Reassignment Dialog */}
      <Dialog open={deptEditOpen} onOpenChange={setDeptEditOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-base font-bold">
              Reassign Department
            </DialogTitle>
            <DialogDescription className="text-xs text-muted-foreground">
              Move {deptEditStaff?.firstName} {deptEditStaff?.lastName} to a new organizational unit.
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={saveDeptChange} className="space-y-4 py-2 text-xs">
            <div className="space-y-1.5">
              <Label className="text-xs font-semibold">Select Department</Label>
              <Select value={selectedDept} onValueChange={setSelectedDept}>
                <SelectTrigger className="h-9 text-xs">
                  <SelectValue placeholder="Select department" />
                </SelectTrigger>
                <SelectContent>
                  {departments.map((dept) => (
                    <SelectItem key={dept} value={dept} className="text-xs">
                      {dept}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <DialogFooter className="gap-2 pt-2">
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => setDeptEditOpen(false)}
                className="text-xs cursor-pointer"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                size="sm"
                className="bg-[#00A651] hover:bg-[#008C44] text-white font-bold text-xs cursor-pointer"
              >
                Save Department
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* 8. Send Direct Message Dialog */}
      <Dialog open={messageOpen} onOpenChange={setMessageOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-base font-bold">
              Send Direct Message
            </DialogTitle>
            <DialogDescription className="text-xs text-muted-foreground">
              Dispatch an official email or message to {messageStaff?.firstName} {messageStaff?.lastName}.
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleSendMessage} className="space-y-3.5 py-2 text-xs">
            <div className="space-y-1">
              <Label className="text-xs font-semibold">Recipient</Label>
              <Input
                value={`${messageStaff?.firstName || ''} ${messageStaff?.lastName || ''} <${messageStaff?.email || ''}>`}
                disabled
                className="h-9 text-xs bg-muted/40 font-mono"
              />
            </div>

            <div className="space-y-1">
              <Label className="text-xs font-semibold">Subject</Label>
              <Input
                value={messageSubject}
                onChange={(e) => setMessageSubject(e.target.value)}
                placeholder="e.g. Schedule Update"
                required
                className="h-9 text-xs"
              />
            </div>

            <div className="space-y-1">
              <Label className="text-xs font-semibold">Message</Label>
              <Textarea
                value={messageBody}
                onChange={(e) => setMessageBody(e.target.value)}
                placeholder="Type your message here..."
                rows={4}
                required
                className="text-xs"
              />
            </div>

            <DialogFooter className="gap-2 pt-2">
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => setMessageOpen(false)}
                className="text-xs cursor-pointer"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                size="sm"
                disabled={sendingMessage}
                className="bg-[#00A651] hover:bg-[#008C44] text-white font-bold text-xs gap-1.5 cursor-pointer"
              >
                {sendingMessage && <Loader2 className="h-3.5 w-3.5 animate-spin" />}
                <Send className="h-3.5 w-3.5" /> Send
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}