'use client';

import { useState, useMemo, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import {
  CalendarDays,
  Clock,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  Plus,
  FileText,
  Eye,
  Trash2,
  Building2,
  User,
  Users,
  Search,
  Download,
  Filter,
  Check,
  X,
  RotateCcw,
  FileSpreadsheet,
  Table as TableIcon,
  ChevronLeft,
  ChevronRight,
  ChevronRight as BreadcrumbArrow,
  CalendarRange,
  Paperclip,
  CheckSquare,
} from 'lucide-react';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { toast } from 'sonner';

import { useStaff } from '@/hooks/useStaff';
import { LeaveRequest, LeaveType, LeaveStatus, StaffMember } from '@/types/staff';
import { exportToCsv, exportToExcel, exportToPdf } from '@/lib/export';
import { getDepartmentIcon } from '@/lib/departmentIcons';

const CURRENT_USER_STAFF_ID = 'staff-alice'; // Current authenticated admin/lead
const PAGE_SIZE = 10;

const LEAVE_ALLOWANCES: Record<LeaveType, number> = {
  Annual: 20,
  Sick: 10,
  Casual: 5,
  'Maternity/Paternity': 90,
  Bereavement: 5,
  Unpaid: 0,
};

function calculateWorkingDays(startDateStr: string, endDateStr: string): number {
  if (!startDateStr || !endDateStr) return 0;
  const start = new Date(startDateStr);
  const end = new Date(endDateStr);
  if (isNaN(start.getTime()) || isNaN(end.getTime()) || start > end) return 0;

  let count = 0;
  const curr = new Date(start);
  while (curr <= end) {
    const day = curr.getDay();
    if (day !== 0 && day !== 6) {
      count++;
    }
    curr.setDate(curr.getDate() + 1);
  }
  return count;
}

function formatDate(dateStr?: string): string {
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
}

function isOverlapping(req1: { startDate: string; endDate: string }, req2: { startDate: string; endDate: string }) {
  return req1.startDate <= req2.endDate && req2.startDate <= req1.endDate;
}

export default function LeaveManagementPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { repo, refresh } = useStaff();

  const [mounted, setMounted] = useState(false);
  const [activeTab, setActiveTab] = useState<'all' | 'my-leave' | 'calendar'>('all');

  // Filters
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [typeFilter, setTypeFilter] = useState<string>('all');
  const [deptFilter, setDeptFilter] = useState<string>(searchParams.get('department') || 'all');
  const [page, setPage] = useState(1);

  // Calendar Controls
  const [calendarMonth, setCalendarMonth] = useState<Date>(new Date(2026, 8, 1)); // September 2026
  const [calendarDept, setCalendarDept] = useState<string>('all');

  // Modals
  const [requestModalOpen, setRequestModalOpen] = useState(false);
  const [detailRequest, setDetailRequest] = useState<LeaveRequest | null>(null);
  const [rejectModalOpen, setRejectModalOpen] = useState(false);
  const [rejectTargetId, setRejectTargetId] = useState<string | null>(null);
  const [rejectionReason, setRejectionReason] = useState('');

  // Form state
  const [formData, setFormData] = useState({
    staffId: CURRENT_USER_STAFF_ID,
    type: 'Annual' as LeaveType,
    startDate: '',
    endDate: '',
    reason: '',
    attachmentName: '',
  });

  useEffect(() => {
    setMounted(true);
  }, []);

  const allStaff = useMemo(() => repo.getAllStaff(), [repo]);
  const rawRequests = useMemo(() => repo.getLeaveRequests(), [repo]);

  // Synchronize employee name & department from staff list if missing
  const leaveRequests: LeaveRequest[] = useMemo(() => {
    return rawRequests.map((r) => {
      const staff = allStaff.find((s) => s.id === r.staffId);
      const employeeName = r.employeeName || (staff ? `${staff.firstName} ${staff.lastName}` : 'Staff Member');
      const department = r.department || (staff ? staff.department : 'General');
      const workingDays = r.workingDays || calculateWorkingDays(r.startDate, r.endDate) || 1;
      return {
        ...r,
        employeeName,
        department,
        workingDays,
      };
    });
  }, [rawRequests, allStaff]);

  const departments = useMemo(() => {
    const set = new Set<string>();
    allStaff.forEach((s) => s.department && set.add(s.department));
    leaveRequests.forEach((r) => r.department && set.add(r.department));
    return Array.from(set).sort();
  }, [allStaff, leaveRequests]);

  // Conflict detector: check if an overlapping active/pending leave exists in the same department
  const getConflict = (req: LeaveRequest) => {
    return leaveRequests.some(
      (r) =>
        r.id !== req.id &&
        r.department === req.department &&
        r.status !== 'rejected' &&
        isOverlapping(r, req)
    );
  };

  // Metrics
  const stats = useMemo(() => {
    const total = leaveRequests.length;
    const pending = leaveRequests.filter((r) => r.status === 'pending').length;
    const approved = leaveRequests.filter((r) => r.status === 'approved').length;

    // Currently on leave today (2026-09-03)
    const today = new Date().toISOString().split('T')[0];
    const currentlyOnLeave = leaveRequests.filter(
      (r) => r.status === 'approved' && r.startDate <= today && r.endDate >= today
    ).length;

    const conflicts = leaveRequests.filter((r) => r.status === 'pending' && getConflict(r)).length;

    return { total, pending, approved, currentlyOnLeave, conflicts };
  }, [leaveRequests]);

  // Leave balances for current user
  const myBalances = useMemo(() => {
    const myApproved = leaveRequests.filter(
      (r) => r.staffId === CURRENT_USER_STAFF_ID && r.status === 'approved'
    );

    const takenByType: Partial<Record<LeaveType, number>> = {};
    myApproved.forEach((r) => {
      takenByType[r.type] = (takenByType[r.type] || 0) + (r.workingDays || 0);
    });

    return [
      {
        type: 'Annual' as LeaveType,
        total: LEAVE_ALLOWANCES.Annual,
        taken: takenByType.Annual || 0,
        color: 'text-emerald-600 dark:text-emerald-400',
        bg: 'bg-emerald-500/10',
      },
      {
        type: 'Sick' as LeaveType,
        total: LEAVE_ALLOWANCES.Sick,
        taken: takenByType.Sick || 0,
        color: 'text-rose-600 dark:text-rose-400',
        bg: 'bg-rose-500/10',
      },
      {
        type: 'Casual' as LeaveType,
        total: LEAVE_ALLOWANCES.Casual,
        taken: takenByType.Casual || 0,
        color: 'text-purple-600 dark:text-purple-400',
        bg: 'bg-purple-500/10',
      },
      {
        type: 'Unpaid' as LeaveType,
        total: 0,
        taken: takenByType.Unpaid || 0,
        color: 'text-amber-600 dark:text-amber-400',
        bg: 'bg-amber-500/10',
      },
    ];
  }, [leaveRequests]);

  // Filtering
  const filteredRequests = useMemo(() => {
    return leaveRequests.filter((r) => {
      if (activeTab === 'my-leave' && r.staffId !== CURRENT_USER_STAFF_ID) {
        return false;
      }
      const searchTarget = `${r.employeeName || ''} ${r.department || ''} ${r.reason || ''} ${r.id || ''}`.toLowerCase();
      const matchesSearch = searchTarget.includes(search.toLowerCase());
      const matchesStatus = statusFilter === 'all' || r.status === statusFilter;
      const matchesType = typeFilter === 'all' || r.type === typeFilter;
      const matchesDept = deptFilter === 'all' || r.department === deptFilter;
      return matchesSearch && matchesStatus && matchesType && matchesDept;
    });
  }, [leaveRequests, activeTab, search, statusFilter, typeFilter, deptFilter]);

  const totalPages = Math.ceil(filteredRequests.length / PAGE_SIZE) || 1;
  const paginatedRequests = filteredRequests.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  useEffect(() => {
    setPage(1);
  }, [search, statusFilter, typeFilter, deptFilter, activeTab]);

  // Quick Actions
  const handleApprove = (id: string, employeeName: string) => {
    repo.updateLeaveRequest(id, { status: 'approved', approvedBy: CURRENT_USER_STAFF_ID });
    refresh();
    toast.success(`Leave request for ${employeeName} approved.`);
    if (detailRequest?.id === id) {
      setDetailRequest((prev) => (prev ? { ...prev, status: 'approved' } : null));
    }
  };

  const openRejectDialog = (id: string) => {
    setRejectTargetId(id);
    setRejectionReason('');
    setRejectModalOpen(true);
  };

  const handleConfirmReject = () => {
    if (!rejectTargetId) return;
    if (!rejectionReason.trim()) {
      toast.error('Please specify a rejection reason');
      return;
    }
    repo.updateLeaveRequest(rejectTargetId, {
      status: 'rejected',
      rejectionReason: rejectionReason.trim(),
    });
    refresh();
    toast.success('Leave request rejected with notification sent.');
    setRejectModalOpen(false);
    if (detailRequest?.id === rejectTargetId) {
      setDetailRequest((prev) => (prev ? { ...prev, status: 'rejected', rejectionReason } : null));
    }
    setRejectTargetId(null);
  };

  const handleDeleteRequest = (id: string) => {
    if (confirm('Are you sure you want to withdraw and delete this leave request?')) {
      repo.deleteLeaveRequest(id);
      refresh();
      toast.success('Leave request withdrawn.');
      if (detailRequest?.id === id) setDetailRequest(null);
    }
  };

  // Submit New Leave Request
  const handleCreateRequest = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.startDate || !formData.endDate || !formData.reason.trim()) {
      toast.error('Please complete all required fields');
      return;
    }

    const workingDays = calculateWorkingDays(formData.startDate, formData.endDate);
    if (workingDays === 0) {
      toast.error('Selected date range contains 0 working days');
      return;
    }

    const selectedStaff = allStaff.find((s) => s.id === formData.staffId);
    repo.addLeaveRequest({
      staffId: formData.staffId,
      employeeName: selectedStaff ? `${selectedStaff.firstName} ${selectedStaff.lastName}` : 'Staff Member',
      department: selectedStaff ? selectedStaff.department : 'General',
      type: formData.type,
      startDate: formData.startDate,
      endDate: formData.endDate,
      workingDays,
      reason: formData.reason.trim(),
      status: 'pending',
      attachment: formData.attachmentName || undefined,
    });
    refresh();
    toast.success('Leave request submitted successfully.');
    setRequestModalOpen(false);
    setFormData({
      staffId: CURRENT_USER_STAFF_ID,
      type: 'Annual',
      startDate: '',
      endDate: '',
      reason: '',
      attachmentName: '',
    });
  };

  // Calendar Calculations
  const daysInMonth = (date: Date) =>
    new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
  const monthStartDay = (date: Date) =>
    new Date(date.getFullYear(), date.getMonth(), 1).getDay();

  const calendarGrid = useMemo(() => {
    const totalDays = daysInMonth(calendarMonth);
    const startOffset = monthStartDay(calendarMonth);
    const days: (number | null)[] = Array(startOffset).fill(null);
    for (let d = 1; d <= totalDays; d++) days.push(d);
    while (days.length % 7 !== 0) days.push(null);
    return days;
  }, [calendarMonth]);

  const getLeavesForDate = (day: number) => {
    const dateStr = `${calendarMonth.getFullYear()}-${String(
      calendarMonth.getMonth() + 1
    ).padStart(2, '0')}-${String(day).padStart(2, '0')}`;

    return leaveRequests.filter((r) => {
      const matchStatus = r.status === 'approved';
      const matchDept = calendarDept === 'all' || r.department === calendarDept;
      const inRange = r.startDate <= dateStr && r.endDate >= dateStr;
      return matchStatus && matchDept && inRange;
    });
  };

  // Exports
  const handleExportCSV = () => {
    const headers = ['Request ID', 'Employee Name', 'Department', 'Leave Type', 'Start Date', 'End Date', 'Days', 'Status', 'Reason'];
    const rows = filteredRequests.map((r) => [
      r.id,
      r.employeeName || '',
      r.department || '',
      r.type,
      formatDate(r.startDate),
      formatDate(r.endDate),
      r.workingDays,
      r.status,
      r.reason,
    ]);
    exportToCsv({
      title: 'Zowasel_Leave_Report',
      headers,
      rows,
    });
    toast.success('Leave records exported as CSV');
  };

  const handleExportExcel = async () => {
    const headers = ['Request ID', 'Employee Name', 'Department', 'Leave Type', 'Start Date', 'End Date', 'Working Days', 'Status', 'Reason'];
    const rows = filteredRequests.map((r) => [
      r.id,
      r.employeeName || '',
      r.department || '',
      r.type,
      formatDate(r.startDate),
      formatDate(r.endDate),
      r.workingDays,
      r.status,
      r.reason,
    ]);
    await exportToExcel({
      title: 'Zowasel Staff Leave Roster',
      headers,
      rows,
    });
    toast.success('Leave report exported as Excel');
  };

  const handleExportPDF = async () => {
    const headers = ['Request ID', 'Employee', 'Department', 'Type', 'Dates', 'Days', 'Status'];
    const rows = filteredRequests.map((r) => [
      r.id,
      r.employeeName || '',
      r.department || '',
      r.type,
      `${formatDate(r.startDate)} - ${formatDate(r.endDate)}`,
      r.workingDays,
      r.status,
    ]);
    await exportToPdf({
      title: 'Zowasel Staff Leave Roster',
      headers,
      rows,
    });
    toast.success('Leave report exported as PDF');
  };

  if (!mounted) return null;

  const currentWorkingDaysPreview = calculateWorkingDays(formData.startDate, formData.endDate);

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12">
      {/* 1. Page Header & Breadcrumb */}
      <div className="space-y-3 pb-1 border-b border-border/60">
        <nav className="flex items-center gap-1.5 text-xs text-muted-foreground font-medium">
          <Link href="/admin/staff/directory" className="hover:text-foreground transition-colors">
            Staff Management
          </Link>
          <BreadcrumbArrow className="h-3.5 w-3.5 opacity-50" />
          <span className="text-foreground font-semibold">Leave & Scheduling</span>
        </nav>

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
              Leave & Absence Management
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-0.5">
              Review platform staff absences, analyze departmental coverage overlaps, and authorize time-off requests.
            </p>
          </div>

          {/* Action CTAs */}
          <div className="flex items-center gap-2 self-start sm:self-center shrink-0">
            <Link href="/admin/staff/leave/request">
              <Button
                type="button"
                variant="outline"
                size="sm"
                className="h-9 px-3 text-xs font-medium gap-2 cursor-pointer shadow-2xs relative"
              >
                <CheckSquare className="h-3.5 w-3.5 text-muted-foreground" />
                Approval Queue
                {stats.pending > 0 && (
                  <span className="flex h-5 min-w-5 items-center justify-center rounded-full bg-amber-500 px-1 text-[10px] font-bold text-white shadow-2xs">
                    {stats.pending}
                  </span>
                )}
              </Button>
            </Link>

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
                  Export Leave Data
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
              onClick={() => setRequestModalOpen(true)}
              className="h-9 px-3.5 bg-[#00A651] hover:bg-[#008C44] text-white font-bold shadow-xs gap-1.5 cursor-pointer text-xs sm:text-sm"
            >
              <Plus className="h-4 w-4" /> Request Leave
            </Button>
          </div>
        </div>
      </div>

      {/* 2. Executive Metric Strip */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3.5">
        <div className="border border-border/60 rounded-2xl bg-card p-4 shadow-2xs flex items-center justify-between">
          <div className="space-y-0.5">
            <span className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider block">
              Total Recorded Leaves
            </span>
            <p className="text-2xl font-extrabold text-slate-900 dark:text-white font-mono">
              {stats.total}
            </p>
            <span className="text-[10px] text-muted-foreground block">
              {stats.approved} approved across teams
            </span>
          </div>
          <div className="h-10 w-10 rounded-xl bg-blue-500/10 text-blue-600 dark:text-blue-400 flex items-center justify-center shrink-0">
            <CalendarRange className="h-5 w-5" />
          </div>
        </div>

        <div className="border border-border/60 rounded-2xl bg-card p-4 shadow-2xs flex items-center justify-between">
          <div className="space-y-0.5">
            <span className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider block">
              Pending Approvals
            </span>
            <p className="text-2xl font-extrabold text-amber-600 dark:text-amber-400 font-mono">
              {stats.pending}
            </p>
            <span className="text-[10px] text-amber-600 dark:text-amber-400 font-medium block">
              {stats.conflicts > 0 ? `⚠ ${stats.conflicts} departmental overlap` : 'Awaiting review'}
            </span>
          </div>
          <div className="h-10 w-10 rounded-xl bg-amber-500/10 text-amber-600 dark:text-amber-400 flex items-center justify-center shrink-0">
            <Clock className="h-5 w-5" />
          </div>
        </div>

        <div className="border border-border/60 rounded-2xl bg-card p-4 shadow-2xs flex items-center justify-between">
          <div className="space-y-0.5">
            <span className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider block">
              On Leave Today
            </span>
            <p className="text-2xl font-extrabold text-[#008C44] dark:text-[#00C862] font-mono">
              {stats.currentlyOnLeave}
            </p>
            <span className="text-[10px] text-muted-foreground block">
              Active authorized absence
            </span>
          </div>
          <div className="h-10 w-10 rounded-xl bg-emerald-500/10 text-[#00A651] flex items-center justify-center shrink-0">
            <CheckCircle2 className="h-5 w-5" />
          </div>
        </div>

        <div className="border border-border/60 rounded-2xl bg-card p-4 shadow-2xs flex items-center justify-between">
          <div className="space-y-0.5">
            <span className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider block">
              Departments Covered
            </span>
            <p className="text-2xl font-extrabold text-slate-900 dark:text-white font-mono">
              {departments.length}
            </p>
            <span className="text-[10px] text-muted-foreground block">
              Organizational business units
            </span>
          </div>
          <div className="h-10 w-10 rounded-xl bg-purple-500/10 text-purple-600 dark:text-purple-400 flex items-center justify-center shrink-0">
            <Building2 className="h-5 w-5" />
          </div>
        </div>
      </div>

      {/* 3. Leave Balance Overview (Personal Allowance Track) */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold text-muted-foreground uppercase tracking-wider">
            Personal Leave Entitlement & Balance (Alice Johnson)
          </span>
          <span className="text-xs text-muted-foreground">Standard 2026 Fiscal Cycle</span>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3.5">
          {myBalances.map((b) => {
            const available = b.type === 'Unpaid' ? '∞' : Math.max(0, b.total - b.taken);
            const percent = b.total > 0 ? Math.min(100, Math.round((b.taken / b.total) * 100)) : 0;
            return (
              <div key={b.type} className="border border-border/60 rounded-2xl bg-card p-3.5 shadow-2xs space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-slate-900 dark:text-white">
                    {b.type} Leave
                  </span>
                  <Badge variant="outline" className={`text-[10px] px-1.5 py-0 font-bold ${b.color} ${b.bg}`}>
                    {available} left
                  </Badge>
                </div>
                <div className="flex items-baseline justify-between text-xs">
                  <span className="text-xl font-extrabold font-mono text-slate-900 dark:text-white">
                    {available} <span className="text-[11px] font-normal text-muted-foreground">days</span>
                  </span>
                  <span className="text-[10.5px] text-muted-foreground font-medium">
                    {b.taken} of {b.total || '∞'} used
                  </span>
                </div>
                <div className="h-1.5 w-full rounded-full bg-muted/60 overflow-hidden">
                  <div
                    className="h-full rounded-full bg-[#00A651] transition-all"
                    style={{ width: `${percent}%` }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* 4. Tab Navigation Strip */}
      <div className="flex items-center justify-between border-b border-border/60 pb-3">
        <div className="flex items-center gap-2">
          {[
            { id: 'all', label: 'All Requests', icon: Users, count: leaveRequests.length },
            { id: 'my-leave', label: 'My Requests', icon: User, count: leaveRequests.filter((r) => r.staffId === CURRENT_USER_STAFF_ID).length },
            { id: 'calendar', label: 'Department Calendar', icon: CalendarDays },
          ].map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                  isActive
                    ? 'bg-[#00A651] text-white shadow-2xs'
                    : 'bg-muted/40 hover:bg-muted text-muted-foreground border border-border/40'
                }`}
              >
                <Icon className="h-3.5 w-3.5" />
                <span>{tab.label}</span>
                {tab.count !== undefined && (
                  <span
                    className={`text-[10px] font-mono px-1.5 py-0.2 rounded-full font-bold ${
                      isActive ? 'bg-white/20 text-white' : 'bg-muted text-muted-foreground'
                    }`}
                  >
                    {tab.count}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* 5. Tab Content */}
      {activeTab !== 'calendar' ? (
        <div className="space-y-4">
          {/* Filter & Search Bar */}
          <div className="border border-border/60 rounded-2xl bg-card p-4 shadow-2xs space-y-3">
            <div className="grid grid-cols-1 sm:grid-cols-12 gap-3">
              {/* Search */}
              <div className="sm:col-span-5 relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search by staff name, reason, or Request ID..."
                  className="pl-9 h-9.5 text-xs bg-muted/20"
                />
              </div>

              {/* Status */}
              <div className="sm:col-span-2">
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger className="h-9.5 text-xs">
                    <SelectValue placeholder="All Statuses" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all" className="text-xs">All Statuses</SelectItem>
                    <SelectItem value="pending" className="text-xs">Pending</SelectItem>
                    <SelectItem value="approved" className="text-xs">Approved</SelectItem>
                    <SelectItem value="rejected" className="text-xs">Rejected</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Leave Type */}
              <div className="sm:col-span-2">
                <Select value={typeFilter} onValueChange={setTypeFilter}>
                  <SelectTrigger className="h-9.5 text-xs">
                    <SelectValue placeholder="All Types" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all" className="text-xs">All Leave Types</SelectItem>
                    <SelectItem value="Annual" className="text-xs">Annual</SelectItem>
                    <SelectItem value="Sick" className="text-xs">Sick</SelectItem>
                    <SelectItem value="Casual" className="text-xs">Casual</SelectItem>
                    <SelectItem value="Maternity/Paternity" className="text-xs">Maternity/Paternity</SelectItem>
                    <SelectItem value="Unpaid" className="text-xs">Unpaid</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Department */}
              <div className="sm:col-span-3">
                <Select value={deptFilter} onValueChange={setDeptFilter}>
                  <SelectTrigger className="h-9.5 text-xs">
                    <SelectValue placeholder="All Departments" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all" className="text-xs">All Departments</SelectItem>
                    {departments.map((d) => (
                      <SelectItem key={d} value={d} className="text-xs">
                        {d}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          {/* Leave Table */}
          <div className="border border-border/60 rounded-2xl bg-card overflow-hidden shadow-2xs">
            <Table>
              <TableHeader>
                <TableRow className="bg-muted/30 hover:bg-muted/30 border-b border-border/60">
                  <TableHead className="text-xs font-bold uppercase tracking-wider text-muted-foreground h-11 pl-5">
                    Employee
                  </TableHead>
                  <TableHead className="text-xs font-bold uppercase tracking-wider text-muted-foreground h-11">
                    Leave Type
                  </TableHead>
                  <TableHead className="text-xs font-bold uppercase tracking-wider text-muted-foreground h-11">
                    Period & Duration
                  </TableHead>
                  <TableHead className="text-xs font-bold uppercase tracking-wider text-muted-foreground h-11">
                    Coverage & Conflicts
                  </TableHead>
                  <TableHead className="text-xs font-bold uppercase tracking-wider text-muted-foreground h-11">
                    Status
                  </TableHead>
                  <TableHead className="text-xs font-bold uppercase tracking-wider text-muted-foreground h-11 text-right pr-5">
                    Actions
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {paginatedRequests.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} className="h-48 text-center">
                      <div className="flex flex-col items-center justify-center gap-2 max-w-sm mx-auto text-muted-foreground">
                        <CalendarRange className="h-8 w-8 opacity-40" />
                        <p className="font-bold text-sm text-foreground">No leave records found</p>
                        <p className="text-xs text-muted-foreground">
                          No leave requests match your criteria or active filters.
                        </p>
                      </div>
                    </TableCell>
                  </TableRow>
                ) : (
                  paginatedRequests.map((req) => {
                    const hasConflict = req.status === 'pending' && getConflict(req);
                    const DeptIcon = getDepartmentIcon(req.department);

                    return (
                      <TableRow
                        key={req.id}
                        onClick={() => setDetailRequest(req)}
                        className="hover:bg-muted/30 transition-colors cursor-pointer border-b border-border/50 group"
                      >
                        {/* Employee Name & Dept */}
                        <TableCell className="pl-5 py-3.5">
                          <div className="flex items-center gap-3">
                            <div className="h-8.5 w-8.5 rounded-xl bg-muted text-foreground font-bold text-xs flex items-center justify-center border shadow-2xs shrink-0">
                              {req.employeeName
                                ? req.employeeName
                                    .split(' ')
                                    .map((n) => n[0])
                                    .join('')
                                    .slice(0, 2)
                                    .toUpperCase()
                                : 'ST'}
                            </div>
                            <div className="min-w-0">
                              <p className="font-bold text-xs sm:text-sm text-slate-900 dark:text-slate-100 group-hover:text-[#008C44] transition-colors truncate">
                                {req.employeeName}
                              </p>
                              <div className="flex items-center gap-1.5 text-[11px] text-muted-foreground">
                                <DeptIcon className="h-3 w-3 shrink-0" />
                                <span className="truncate">{req.department}</span>
                              </div>
                            </div>
                          </div>
                        </TableCell>

                        {/* Leave Type */}
                        <TableCell className="py-3.5">
                          <Badge
                            variant="outline"
                            className="text-[11px] font-semibold px-2 py-0.5 border-border/60 bg-muted/40"
                          >
                            {req.type}
                          </Badge>
                        </TableCell>

                        {/* Dates & Working Days */}
                        <TableCell className="py-3.5">
                          <div>
                            <p className="text-xs font-medium text-slate-900 dark:text-slate-100">
                              {formatDate(req.startDate)} → {formatDate(req.endDate)}
                            </p>
                            <p className="text-[11px] font-mono text-muted-foreground">
                              {req.workingDays} business {req.workingDays === 1 ? 'day' : 'days'}
                            </p>
                          </div>
                        </TableCell>

                        {/* Conflict Status */}
                        <TableCell className="py-3.5">
                          {hasConflict ? (
                            <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-amber-600 bg-amber-500/10 border border-amber-500/20 px-2 py-0.5 rounded-md">
                              <AlertTriangle className="h-3 w-3 shrink-0" />
                              Overlap Warning
                            </span>
                          ) : (
                            <span className="text-[11px] text-muted-foreground font-medium flex items-center gap-1">
                              <Check className="h-3 w-3 text-[#00A651]" />
                              Clear coverage
                            </span>
                          )}
                        </TableCell>

                        {/* Status Badge */}
                        <TableCell className="py-3.5">
                          <Badge
                            variant="outline"
                            className={`text-[10.5px] font-semibold px-2 py-0.5 capitalize ${
                              req.status === 'approved'
                                ? 'text-[#008C44] border-[#00A651]/30 bg-[#00A651]/10'
                                : req.status === 'rejected'
                                ? 'text-rose-600 border-rose-500/30 bg-rose-500/10'
                                : 'text-amber-600 border-amber-500/30 bg-amber-500/10'
                            }`}
                          >
                            <span
                              className={`h-1.5 w-1.5 rounded-full mr-1.5 ${
                                req.status === 'approved'
                                  ? 'bg-[#00A651]'
                                  : req.status === 'rejected'
                                  ? 'bg-rose-500'
                                  : 'bg-amber-500'
                              }`}
                            />
                            {req.status}
                          </Badge>
                        </TableCell>

                        {/* Actions */}
                        <TableCell className="py-3.5 text-right pr-5" onClick={(e) => e.stopPropagation()}>
                          <div className="flex items-center justify-end gap-1">
                            <TooltipProvider>
                              <Tooltip>
                                <TooltipTrigger
                                  render={
                                    <Button
                                      type="button"
                                      variant="ghost"
                                      size="sm"
                                      onClick={() => setDetailRequest(req)}
                                      className="h-8 w-8 p-0 text-muted-foreground hover:text-[#00A651] cursor-pointer"
                                    >
                                      <Eye className="h-4 w-4" />
                                    </Button>
                                  }
                                />
                                <TooltipContent side="top">View Request Details</TooltipContent>
                              </Tooltip>
                            </TooltipProvider>

                            {req.status === 'pending' && (
                              <>
                                <TooltipProvider>
                                  <Tooltip>
                                    <TooltipTrigger
                                      render={
                                        <Button
                                          type="button"
                                          variant="ghost"
                                          size="sm"
                                          onClick={() => handleApprove(req.id, req.employeeName || 'Staff')}
                                          className="h-8 w-8 p-0 text-emerald-600 hover:bg-emerald-500/10 cursor-pointer"
                                        >
                                          <Check className="h-4 w-4" />
                                        </Button>
                                      }
                                    />
                                    <TooltipContent side="top">Approve Request</TooltipContent>
                                  </Tooltip>
                                </TooltipProvider>

                                <TooltipProvider>
                                  <Tooltip>
                                    <TooltipTrigger
                                      render={
                                        <Button
                                          type="button"
                                          variant="ghost"
                                          size="sm"
                                          onClick={() => openRejectDialog(req.id)}
                                          className="h-8 w-8 p-0 text-rose-600 hover:bg-rose-500/10 cursor-pointer"
                                        >
                                          <X className="h-4 w-4" />
                                        </Button>
                                      }
                                    />
                                    <TooltipContent side="top">Reject Request</TooltipContent>
                                  </Tooltip>
                                </TooltipProvider>
                              </>
                            )}

                            {req.staffId === CURRENT_USER_STAFF_ID && req.status === 'pending' && (
                              <TooltipProvider>
                                <Tooltip>
                                  <TooltipTrigger
                                    render={
                                      <Button
                                        type="button"
                                        variant="ghost"
                                        size="sm"
                                        onClick={() => handleDeleteRequest(req.id)}
                                        className="h-8 w-8 p-0 text-muted-foreground hover:text-destructive cursor-pointer"
                                      >
                                        <Trash2 className="h-3.5 w-3.5" />
                                      </Button>
                                    }
                                  />
                                  <TooltipContent side="top">Withdraw Request</TooltipContent>
                                </Tooltip>
                              </TooltipProvider>
                            )}
                          </div>
                        </TableCell>
                      </TableRow>
                    );
                  })
                )}
              </TableBody>
            </Table>

            {/* Pagination */}
            <div className="p-4 border-t border-border/60 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-muted-foreground bg-muted/10">
              <p>
                Showing{' '}
                <strong className="text-foreground font-mono">
                  {filteredRequests.length > 0 ? (page - 1) * PAGE_SIZE + 1 : 0}–
                  {Math.min(page * PAGE_SIZE, filteredRequests.length)}
                </strong>{' '}
                of <strong className="text-foreground font-mono">{filteredRequests.length}</strong> leave
                records
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
                  disabled={page === totalPages || filteredRequests.length === 0}
                  className="h-8 px-2.5 text-xs gap-1 cursor-pointer"
                >
                  Next <ChevronRight className="h-3.5 w-3.5" />
                </Button>
              </div>
            </div>
          </div>
        </div>
      ) : (
        /* Department Absence Calendar */
        <Card className="border-border/60 rounded-2xl shadow-2xs">
          <CardHeader className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b border-border/50 pb-4">
            <div>
              <CardTitle className="text-base font-bold">Department Absence Calendar</CardTitle>
              <p className="text-xs text-muted-foreground mt-0.5">
                Overview of approved staff absences to plan shift coverage and operational resilience.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              {/* Month Selector */}
              <Select
                value={String(calendarMonth.getMonth())}
                onValueChange={(val) => {
                  setCalendarMonth(new Date(calendarMonth.getFullYear(), parseInt(val), 1));
                }}
              >
                <SelectTrigger className="h-8.5 w-[130px] text-xs">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {[
                    'January', 'February', 'March', 'April', 'May', 'June',
                    'July', 'August', 'September', 'October', 'November', 'December',
                  ].map((m, idx) => (
                    <SelectItem key={m} value={String(idx)} className="text-xs">
                      {m}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              {/* Year Selector */}
              <Select
                value={String(calendarMonth.getFullYear())}
                onValueChange={(val) => {
                  setCalendarMonth(new Date(parseInt(val), calendarMonth.getMonth(), 1));
                }}
              >
                <SelectTrigger className="h-8.5 w-[90px] text-xs">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {[2025, 2026, 2027].map((y) => (
                    <SelectItem key={y} value={String(y)} className="text-xs">
                      {y}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              {/* Dept Filter */}
              <Select value={calendarDept} onValueChange={setCalendarDept}>
                <SelectTrigger className="h-8.5 w-[150px] text-xs">
                  <SelectValue placeholder="All Departments" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all" className="text-xs">All Departments</SelectItem>
                  {departments.map((d) => (
                    <SelectItem key={d} value={d} className="text-xs">
                      {d}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </CardHeader>

          <CardContent className="p-4">
            <div className="grid grid-cols-7 gap-1 border border-border/60 rounded-xl overflow-hidden bg-muted/20">
              {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((d) => (
                <div
                  key={d}
                  className="bg-muted/40 p-2 text-center text-xs font-bold text-muted-foreground uppercase tracking-wider"
                >
                  {d}
                </div>
              ))}

              {calendarGrid.map((day, idx) => {
                const leaves = day ? getLeavesForDate(day) : [];
                const isToday =
                  day === 3 &&
                  calendarMonth.getMonth() === 8 &&
                  calendarMonth.getFullYear() === 2026;

                return (
                  <div
                    key={idx}
                    className={`min-h-[100px] p-2 border border-border/30 rounded-lg transition-colors flex flex-col justify-between ${
                      day ? 'bg-card hover:bg-muted/30' : 'bg-muted/10 opacity-30'
                    } ${isToday ? 'ring-2 ring-[#00A651] bg-[#00A651]/5' : ''}`}
                  >
                    {day && (
                      <>
                        <div className="flex items-center justify-between">
                          <span
                            className={`text-xs font-bold font-mono ${
                              isToday ? 'text-[#00A651]' : 'text-slate-700 dark:text-slate-300'
                            }`}
                          >
                            {day}
                          </span>
                          {isToday && (
                            <span className="text-[9.5px] font-bold text-[#00A651] uppercase">Today</span>
                          )}
                        </div>

                        <div className="mt-1 space-y-1 overflow-hidden">
                          {leaves.slice(0, 3).map((leave) => (
                            <TooltipProvider key={leave.id}>
                              <Tooltip>
                                <TooltipTrigger
                                  render={
                                    <div
                                      onClick={() => setDetailRequest(leave)}
                                      className={`px-1.5 py-0.5 rounded text-[10px] font-medium truncate cursor-pointer transition-all ${
                                        leave.type === 'Annual'
                                          ? 'bg-blue-500/15 text-blue-700 dark:text-blue-300 hover:bg-blue-500/25'
                                          : leave.type === 'Sick'
                                          ? 'bg-rose-500/15 text-rose-700 dark:text-rose-300 hover:bg-rose-500/25'
                                          : 'bg-purple-500/15 text-purple-700 dark:text-purple-300 hover:bg-purple-500/25'
                                      }`}
                                    >
                                      {leave.employeeName?.split(' ')[0]} ({leave.type})
                                    </div>
                                  }
                                />
                                <TooltipContent side="top">
                                  <p className="font-bold text-xs">{leave.employeeName}</p>
                                  <p className="text-[11px] text-muted-foreground">{leave.department} · {leave.type}</p>
                                  <p className="text-[10.5px] mt-0.5">{formatDate(leave.startDate)} → {formatDate(leave.endDate)}</p>
                                </TooltipContent>
                              </Tooltip>
                            </TooltipProvider>
                          ))}
                          {leaves.length > 3 && (
                            <div className="text-[10px] text-muted-foreground font-semibold pl-0.5">
                              +{leaves.length - 3} more
                            </div>
                          )}
                        </div>
                      </>
                    )}
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      )}

      {/* 6. Dialog: Request Time Off */}
      <Dialog open={requestModalOpen} onOpenChange={setRequestModalOpen}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle className="text-base font-bold">Request Time Off</DialogTitle>
            <DialogDescription className="text-xs text-muted-foreground">
              Submit a scheduled absence for departmental review and team coverage authorization.
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleCreateRequest} className="space-y-4 py-2 text-xs">
            {/* Staff Selector */}
            <div className="space-y-1.5">
              <Label className="text-xs font-semibold">Staff Member</Label>
              <Select
                value={formData.staffId}
                onValueChange={(val) => setFormData({ ...formData, staffId: val })}
              >
                <SelectTrigger className="h-9 text-xs">
                  <SelectValue placeholder="Select Staff Member" />
                </SelectTrigger>
                <SelectContent>
                  {allStaff.map((s) => (
                    <SelectItem key={s.id} value={s.id} className="text-xs">
                      {s.firstName} {s.lastName} ({s.department})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Leave Type */}
            <div className="space-y-1.5">
              <Label className="text-xs font-semibold">Leave Type</Label>
              <Select
                value={formData.type}
                onValueChange={(val) => setFormData({ ...formData, type: val as LeaveType })}
              >
                <SelectTrigger className="h-9 text-xs">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Annual" className="text-xs">Annual Leave (Paid Vacation)</SelectItem>
                  <SelectItem value="Sick" className="text-xs">Sick Leave (Medical Recovery)</SelectItem>
                  <SelectItem value="Casual" className="text-xs">Casual Leave (Short Absence)</SelectItem>
                  <SelectItem value="Maternity/Paternity" className="text-xs">Maternity / Paternity Leave</SelectItem>
                  <SelectItem value="Bereavement" className="text-xs">Bereavement / Compassionate</SelectItem>
                  <SelectItem value="Unpaid" className="text-xs">Unpaid Leave</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Dates */}
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label className="text-xs font-semibold">Start Date</Label>
                <Input
                  type="date"
                  value={formData.startDate}
                  onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                  required
                  className="h-9 text-xs"
                />
              </div>

              <div className="space-y-1.5">
                <Label className="text-xs font-semibold">End Date</Label>
                <Input
                  type="date"
                  value={formData.endDate}
                  min={formData.startDate}
                  onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                  required
                  className="h-9 text-xs"
                />
              </div>
            </div>

            {/* Net working days preview */}
            {currentWorkingDaysPreview > 0 && (
              <div className="p-2.5 rounded-xl bg-muted/40 border border-border/50 flex items-center justify-between text-xs">
                <span className="text-muted-foreground font-medium">Business Working Days:</span>
                <span className="font-mono font-bold text-foreground">
                  {currentWorkingDaysPreview} business {currentWorkingDaysPreview === 1 ? 'day' : 'days'}{' '}
                  <span className="font-normal text-muted-foreground">(weekends excluded)</span>
                </span>
              </div>
            )}

            {/* Reason */}
            <div className="space-y-1.5">
              <Label className="text-xs font-semibold">Reason & Justification</Label>
              <Textarea
                value={formData.reason}
                onChange={(e) => setFormData({ ...formData, reason: e.target.value })}
                placeholder="Explain the purpose of this absence request..."
                rows={3}
                required
                className="text-xs"
              />
            </div>

            {/* Optional attachment */}
            <div className="space-y-1.5">
              <Label className="text-xs font-semibold flex items-center justify-between">
                <span>Attachment / Medical Note (optional)</span>
                <span className="text-[10px] text-muted-foreground">PDF, JPG up to 5MB</span>
              </Label>
              <Input
                type="file"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) setFormData({ ...formData, attachmentName: file.name });
                }}
                className="h-9 text-xs"
              />
            </div>

            <DialogFooter className="gap-2 pt-2">
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => setRequestModalOpen(false)}
                className="text-xs cursor-pointer"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                size="sm"
                className="bg-[#00A651] hover:bg-[#008C44] text-white font-bold text-xs cursor-pointer shadow-xs"
              >
                Submit Leave Request
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* 7. Dialog: View Request Details */}
      <Dialog open={!!detailRequest} onOpenChange={() => setDetailRequest(null)}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-base font-bold">Leave Request Details</DialogTitle>
            <DialogDescription className="text-xs text-muted-foreground">
              Official request log {detailRequest?.id}
            </DialogDescription>
          </DialogHeader>

          {detailRequest && (
            <div className="space-y-3.5 py-2 text-xs">
              <div className="flex items-center justify-between p-3 rounded-xl bg-muted/40 border">
                <div>
                  <p className="font-bold text-sm text-foreground">{detailRequest.employeeName}</p>
                  <p className="text-xs text-muted-foreground">{detailRequest.department}</p>
                </div>
                <Badge
                  variant="outline"
                  className={`text-[10.5px] font-semibold px-2 py-0.5 capitalize ${
                    detailRequest.status === 'approved'
                      ? 'text-[#008C44] border-[#00A651]/30 bg-[#00A651]/10'
                      : detailRequest.status === 'rejected'
                      ? 'text-rose-600 border-rose-500/30 bg-rose-500/10'
                      : 'text-amber-600 border-amber-500/30 bg-amber-500/10'
                  }`}
                >
                  {detailRequest.status}
                </Badge>
              </div>

              <div className="grid grid-cols-2 gap-3 text-xs">
                <div className="p-2.5 rounded-lg border bg-muted/20 space-y-0.5">
                  <span className="text-[10.5px] font-semibold text-muted-foreground uppercase">Leave Type</span>
                  <p className="font-bold text-foreground">{detailRequest.type}</p>
                </div>
                <div className="p-2.5 rounded-lg border bg-muted/20 space-y-0.5">
                  <span className="text-[10.5px] font-semibold text-muted-foreground uppercase">Working Days</span>
                  <p className="font-bold text-foreground">{detailRequest.workingDays} Business Days</p>
                </div>
              </div>

              <div className="p-2.5 rounded-lg border bg-muted/20 space-y-0.5">
                <span className="text-[10.5px] font-semibold text-muted-foreground uppercase">Dates Requested</span>
                <p className="font-bold text-foreground">
                  {formatDate(detailRequest.startDate)} → {formatDate(detailRequest.endDate)}
                </p>
              </div>

              <div className="p-2.5 rounded-lg border bg-muted/20 space-y-1">
                <span className="text-[10.5px] font-semibold text-muted-foreground uppercase">Reason / Justification</span>
                <p className="text-slate-800 dark:text-slate-200 leading-relaxed">{detailRequest.reason}</p>
              </div>

              {detailRequest.rejectionReason && (
                <div className="p-2.5 rounded-lg border border-rose-500/30 bg-rose-500/5 space-y-1 text-rose-700 dark:text-rose-300">
                  <span className="text-[10.5px] font-bold uppercase">Rejection Reason</span>
                  <p className="text-xs">{detailRequest.rejectionReason}</p>
                </div>
              )}

              {detailRequest.attachment && (
                <div className="flex items-center gap-2 p-2 rounded-lg border bg-muted/10 text-xs">
                  <Paperclip className="h-3.5 w-3.5 text-muted-foreground" />
                  <span className="font-medium">{detailRequest.attachment}</span>
                </div>
              )}

              <DialogFooter className="gap-2 pt-2">
                {detailRequest.status === 'pending' ? (
                  <>
                    <Button
                      type="button"
                      variant="destructive"
                      size="sm"
                      onClick={() => openRejectDialog(detailRequest.id)}
                      className="text-xs cursor-pointer"
                    >
                      Reject Request
                    </Button>
                    <Button
                      type="button"
                      size="sm"
                      onClick={() => handleApprove(detailRequest.id, detailRequest.employeeName || 'Staff')}
                      className="bg-[#00A651] hover:bg-[#008C44] text-white font-bold text-xs cursor-pointer"
                    >
                      Approve Request
                    </Button>
                  </>
                ) : (
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => setDetailRequest(null)}
                    className="text-xs cursor-pointer"
                  >
                    Close
                  </Button>
                )}
              </DialogFooter>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* 8. Dialog: Reject Reason */}
      <Dialog open={rejectModalOpen} onOpenChange={setRejectModalOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-base font-bold text-rose-600">Reject Leave Request</DialogTitle>
            <DialogDescription className="text-xs text-muted-foreground">
              Please enter the official reason for turning down this time off request.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-3 py-2 text-xs">
            <div className="space-y-1">
              <Label className="text-xs font-semibold">Reason for Rejection *</Label>
              <Textarea
                value={rejectionReason}
                onChange={(e) => setRejectionReason(e.target.value)}
                placeholder="e.g. Insufficient team operational coverage during critical agronomy harvest audit..."
                rows={3}
                required
                className="text-xs"
              />
            </div>
          </div>

          <DialogFooter className="gap-2 pt-2">
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => setRejectModalOpen(false)}
              className="text-xs cursor-pointer"
            >
              Cancel
            </Button>
            <Button
              type="button"
              variant="destructive"
              size="sm"
              onClick={handleConfirmReject}
              disabled={!rejectionReason.trim()}
              className="text-xs font-bold cursor-pointer"
            >
              Confirm Rejection
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
