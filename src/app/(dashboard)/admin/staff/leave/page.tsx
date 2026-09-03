'use client';

import { useMemo, useState, useEffect, Suspense } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import {
  CalendarDays,
  Clock,
  CheckCircle2,
  XCircle,
  Plus,
  ChevronLeft,
  ChevronRight,
  ChevronDown,
  ChevronUp,
  User,
  Building2,
  CalendarRange,
  FileText,
  Filter,
  Check,
  Calendar as CalendarIcon,
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
import { toast } from 'sonner';

import { useStaff } from '@/hooks/useStaff';
import { LeaveRequest, LeaveType } from '@/types/staff';
import { getDepartmentIcon } from '@/lib/departmentIcons';

const CURRENT_USER = {
  id: 'staff-alice',
  name: 'Alice Johnson',
  department: 'Technology',
};

const LEAVE_BALANCES = {
  Annual: { total: 20, taken: 4 },
  Sick: { total: 10, taken: 0 },
  Casual: { total: 5, taken: 1 },
  Unpaid: { total: 0, taken: 0 },
};

function calculateWorkingDays(start: string, end: string): number {
  const startDate = new Date(start);
  const endDate = new Date(end);
  let count = 0;
  const current = new Date(startDate);
  while (current <= endDate) {
    const day = current.getDay();
    if (day !== 0 && day !== 6) count++;
    current.setDate(current.getDate() + 1);
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

function StatusBadge({ status }: { status: string }) {
  const lower = (status || '').toLowerCase();
  if (lower === 'approved') {
    return (
      <Badge className="bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/30 text-[11px] font-semibold gap-1">
        <CheckCircle2 className="h-3 w-3" /> Approved
      </Badge>
    );
  }
  if (lower === 'rejected') {
    return (
      <Badge variant="destructive" className="text-[11px] font-semibold gap-1">
        <XCircle className="h-3 w-3" /> Rejected
      </Badge>
    );
  }
  return (
    <Badge variant="outline" className="bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/30 text-[11px] font-semibold gap-1">
      <Clock className="h-3 w-3" /> Pending
    </Badge>
  );
}

function LeaveManagementContent() {
  const searchParams = useSearchParams();
  const tabParam = searchParams?.get('tab');

  const { repo, refresh, version } = useStaff();

  // Controlled dropdown calendar state: clicking the button drops it down and clicking again goes back up
  const [isCalendarOpen, setIsCalendarOpen] = useState<boolean>(tabParam === 'calendar');

  // Synchronized requests from repo
  const [requests, setRequests] = useState<LeaveRequest[]>([]);
  const [departments, setDepartments] = useState<{ id: string; name: string }[]>([]);

  // Modals state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedAbsence, setSelectedAbsence] = useState<LeaveRequest | null>(null);

  // Calendar State (Defaults to current demo month)
  const [calendarMonth, setCalendarMonth] = useState(new Date(2026, 8, 1)); // Sept 2026
  const [calendarDepartment, setCalendarDepartment] = useState<string>('all');
  const [includePending, setIncludePending] = useState<boolean>(true); // Backend Spec: includePending toggle

  // Form State
  const [form, setForm] = useState({
    type: 'Annual' as LeaveType,
    startDate: '',
    endDate: '',
    reason: '',
    attachment: null as File | null,
  });

  useEffect(() => {
    setRequests(repo.getLeaveRequests());
    setDepartments(repo.getDepartments());
  }, [repo, version]);

  const workingDays = useMemo(() => {
    if (form.startDate && form.endDate) {
      return calculateWorkingDays(form.startDate, form.endDate);
    }
    return 0;
  }, [form.startDate, form.endDate]);

  const myRequests = useMemo(() => {
    return requests.filter(
      (r) =>
        r.staffId === CURRENT_USER.id ||
        (r.employeeName && r.employeeName.toLowerCase().includes(CURRENT_USER.name.toLowerCase()))
    );
  }, [requests]);

  const pendingApprovalCount = useMemo(() => {
    return requests.filter((r) => (r.status || '').toLowerCase() === 'pending').length;
  }, [requests]);

  const handleSubmitRequest = () => {
    if (!form.startDate || !form.endDate || !form.reason.trim()) {
      toast.error('Please complete all required fields.');
      return;
    }

    repo.addLeaveRequest({
      staffId: CURRENT_USER.id,
      employeeName: CURRENT_USER.name,
      department: CURRENT_USER.department,
      type: form.type,
      startDate: form.startDate,
      endDate: form.endDate,
      reason: form.reason.trim(),
      status: 'pending',
      workingDays,
      attachment: form.attachment?.name,
    });

    refresh();
    setIsModalOpen(false);
    setForm({ type: 'Annual', startDate: '', endDate: '', reason: '', attachment: null });
    toast.success('Leave request submitted successfully and queued for managerial review.');
  };

  const handleWithdraw = (id: string) => {
    repo.deleteLeaveRequest(id);
    refresh();
    toast.success('Leave request withdrawn.');
  };

  // Calendar Helpers
  const daysInMonth = (date: Date) =>
    new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
  const monthStartDay = (date: Date) =>
    new Date(date.getFullYear(), date.getMonth(), 1).getDay();

  const calendarDays = useMemo(() => {
    const totalDays = daysInMonth(calendarMonth);
    const startDay = monthStartDay(calendarMonth);
    const days: (number | null)[] = Array(startDay).fill(null);
    for (let d = 1; d <= totalDays; d++) days.push(d);
    while (days.length % 7 !== 0) days.push(null);
    return days;
  }, [calendarMonth]);

  // Filter leaves for given date according to Zowasel SSO Backend Track spec
  // GET /api/v1/admin/leave/calendar?from=...&to=...&includePending=true
  const getLeavesForDate = (day: number) => {
    const year = calendarMonth.getFullYear();
    const monthStr = String(calendarMonth.getMonth() + 1).padStart(2, '0');
    const dayStr = String(day).padStart(2, '0');
    const dateStr = `${year}-${monthStr}-${dayStr}`;

    return requests.filter((r) => {
      const isStatusOk =
        (r.status || '').toLowerCase() === 'approved' ||
        (includePending && (r.status || '').toLowerCase() === 'pending');
      if (!isStatusOk) return false;

      const inDateRange = r.startDate <= dateStr && r.endDate >= dateStr;
      if (!inDateRange) return false;

      if (calendarDepartment !== 'all') {
        const matchesDept =
          (r.department || '').toLowerCase() === calendarDepartment.toLowerCase();
        if (!matchesDept) return false;
      }

      return true;
    });
  };

  const months = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December',
  ];
  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 7 }, (_, i) => currentYear - 2 + i);

  const prevMonth = () => {
    setCalendarMonth(new Date(calendarMonth.getFullYear(), calendarMonth.getMonth() - 1, 1));
  };

  const nextMonth = () => {
    setCalendarMonth(new Date(calendarMonth.getFullYear(), calendarMonth.getMonth() + 1, 1));
  };

  const jumpToToday = () => {
    setCalendarMonth(new Date(2026, 8, 1));
  };

  return (
    <div className="space-y-6 p-4 sm:p-6 max-w-7xl mx-auto">
      {/* 1. Header Banner */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900 dark:text-white">
            Leave Requests
          </h1>
          <p className="text-xs sm:text-sm text-muted-foreground mt-0.5">
            Request time off, view personal leave history, and track team absence schedules.
          </p>
        </div>

        <div className="flex items-center gap-2 sm:gap-3 flex-wrap">
          {/* Approval Queue Link */}
          <Link
            href="/admin/staff/leave/request"
            className="inline-flex items-center gap-2 rounded-xl border border-border/70 bg-card px-3.5 py-2 text-xs font-bold text-slate-900 dark:text-white shadow-2xs hover:bg-muted/40 transition-colors cursor-pointer"
          >
            <CheckCircle2 className="h-4 w-4 text-[#00A651]" />
            <span>Approval Queue</span>
            {pendingApprovalCount > 0 && (
              <Badge variant="outline" className="ml-1 text-[10px] px-1.5 py-0 bg-amber-500/10 text-amber-600 border-amber-500/30 font-mono">
                {pendingApprovalCount}
              </Badge>
            )}
          </Link>

          {/* Department Calendar Dropdown Button */}
          <Button
            type="button"
            variant="outline"
            onClick={() => setIsCalendarOpen((prev) => !prev)}
            className={`rounded-xl border px-3.5 py-2 text-xs font-bold gap-2 cursor-pointer shadow-2xs transition-all ${
              isCalendarOpen
                ? 'bg-[#00A651]/15 text-[#00A651] border-[#00A651]/50'
                : 'bg-card text-foreground border-border/70 hover:bg-muted/40'
            }`}
            title={isCalendarOpen ? 'Click to fold calendar back up' : 'Click to drop down calendar'}
          >
            <CalendarDays className="h-4 w-4 text-[#00A651]" />
            <span>Department Calendar</span>
            {isCalendarOpen ? (
              <ChevronUp className="h-4 w-4 text-[#00A651] transition-transform duration-200" />
            ) : (
              <ChevronDown className="h-4 w-4 text-muted-foreground transition-transform duration-200" />
            )}
          </Button>

          {/* Request Time Off CTA */}
          <Button
            onClick={() => setIsModalOpen(true)}
            className="bg-[#00A651] hover:bg-[#008C44] text-white font-bold text-xs gap-1.5 h-9 rounded-xl shadow-xs cursor-pointer"
          >
            <Plus className="h-4 w-4" />
            <span>Request Time Off</span>
          </Button>
        </div>
      </div>

      {/* 2. Leave Quota Balances (Always accessible) */}
      <div className="grid gap-3 sm:gap-4 grid-cols-2 lg:grid-cols-4">
        {Object.entries(LEAVE_BALANCES).map(([type, { total, taken }]) => {
          const available = type === 'Unpaid' ? '∞' : total - taken;
          return (
            <Card key={type} className="border border-border/60 rounded-2xl bg-card shadow-2xs">
              <CardContent className="p-3.5 sm:p-4 space-y-1.5">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-xs text-foreground uppercase tracking-wider">{type}</span>
                  {type === 'Unpaid' ? (
                    <Badge variant="outline" className="text-[10px]">Uncapped</Badge>
                  ) : (
                    <Badge variant="secondary" className="text-[10px] font-bold text-[#008C44]">
                      {available} left
                    </Badge>
                  )}
                </div>
                <div className="flex items-baseline justify-between pt-0.5">
                  <span className="text-xl sm:text-2xl font-extrabold text-foreground">{available}</span>
                  <span className="text-[10.5px] text-muted-foreground">
                    {taken} used / {total} total
                  </span>
                </div>
                <div className="h-1.5 w-full rounded-full bg-muted overflow-hidden">
                  <div
                    className="h-full bg-[#00A651] rounded-full"
                    style={{ width: type === 'Unpaid' ? '0%' : `${Math.min((taken / total) * 100, 100)}%` }}
                  />
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* 3. Collapsible Department Calendar (Compact, sleek size) */}
      {isCalendarOpen && (
        <Card className="max-w-4xl mx-auto border border-border/60 rounded-xl shadow-xs overflow-hidden animate-in fade-in slide-in-from-top-2 duration-150">
          <CardHeader className="p-2.5 sm:p-3 border-b border-border/50 bg-card/90">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              {/* Navigation Controls */}
              <div className="flex items-center gap-1.5 flex-wrap">
                <div className="flex items-center gap-0.5 bg-muted/40 p-0.5 rounded-lg border border-border/60">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={prevMonth}
                    className="h-6.5 w-6.5 rounded cursor-pointer hover:bg-card"
                    title="Previous month"
                  >
                    <ChevronLeft className="h-3 w-3" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={jumpToToday}
                    className="h-6.5 px-2 text-[11px] font-semibold rounded cursor-pointer hover:bg-card"
                  >
                    Today
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={nextMonth}
                    className="h-6.5 w-6.5 rounded cursor-pointer hover:bg-card"
                    title="Next month"
                  >
                    <ChevronRight className="h-3 w-3" />
                  </Button>
                </div>

                {/* Month Selector */}
                <Select
                  value={String(calendarMonth.getMonth())}
                  onValueChange={(val) => {
                    if (val !== null) {
                      setCalendarMonth(new Date(calendarMonth.getFullYear(), parseInt(val), 1));
                    }
                  }}
                >
                  <SelectTrigger className="h-7 w-[105px] text-[11px] font-medium">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {months.map((m, idx) => (
                      <SelectItem key={idx} value={String(idx)} className="text-xs">
                        {m}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                {/* Year Selector */}
                <Select
                  value={String(calendarMonth.getFullYear())}
                  onValueChange={(val) => {
                    if (val !== null) {
                      setCalendarMonth(new Date(parseInt(val), calendarMonth.getMonth(), 1));
                    }
                  }}
                >
                  <SelectTrigger className="h-7 w-[78px] text-[11px] font-medium">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {years.map((y) => (
                      <SelectItem key={y} value={String(y)} className="text-xs">
                        {y}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Filters, Toggle, and Go Back Up Action */}
              <div className="flex items-center gap-1.5 flex-wrap">
                {/* Department Filter */}
                <Select
                  value={calendarDepartment}
                  onValueChange={(val) => {
                    if (val !== null) setCalendarDepartment(val);
                  }}
                >
                  <SelectTrigger className="h-7 w-[145px] text-[11px]">
                    <div className="flex items-center gap-1 truncate">
                      <Filter className="h-2.5 w-2.5 text-muted-foreground" />
                      <SelectValue placeholder="All Departments" />
                    </div>
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all" className="text-xs font-semibold">
                      All Departments
                    </SelectItem>
                    {departments.map((d) => (
                      <SelectItem key={d.id} value={d.name} className="text-xs">
                        {d.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                {/* includePending Toggle */}
                <button
                  type="button"
                  onClick={() => setIncludePending((prev) => !prev)}
                  className={`h-7 px-2 rounded-lg border text-[10.5px] font-medium flex items-center gap-1.5 cursor-pointer transition-colors ${
                    includePending
                      ? 'bg-amber-500/10 border-amber-500/30 text-amber-700 dark:text-amber-400 font-bold'
                      : 'bg-card border-border/70 text-muted-foreground hover:bg-muted/40'
                  }`}
                  title="Include pending leave applications"
                >
                  <div className={`h-2.5 w-2.5 rounded border flex items-center justify-center ${
                    includePending ? 'bg-amber-500 border-amber-600 text-white' : 'border-border'
                  }`}>
                    {includePending && <Check className="h-2 w-2 stroke-[3]" />}
                  </div>
                  <span>Pending</span>
                </button>

                {/* Go Back Up (Collapse Button) */}
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => setIsCalendarOpen(false)}
                  className="h-7 px-2 text-[11px] text-muted-foreground hover:text-foreground gap-1 cursor-pointer rounded-lg hover:bg-muted/60"
                  title="Collapse calendar back up"
                >
                  <ChevronUp className="h-3 w-3" />
                  <span>Fold Up</span>
                </Button>
              </div>
            </div>

            {/* Subheader legend */}
            <div className="flex items-center justify-between pt-1.5 text-[10.5px] text-muted-foreground border-t border-border/40 mt-1">
              <span className="flex items-center gap-1.5">
                <span className="inline-block h-1.5 w-1.5 rounded-full bg-emerald-500" />
                <strong className="text-foreground">Approved</strong>
                <span className="inline-block h-1.5 w-1.5 rounded-full bg-amber-500 ml-1.5" />
                <strong className="text-foreground">Pending</strong>
              </span>
              <span className="font-mono text-[10px]">
                {calendarMonth.toLocaleString('default', { month: 'short' })} {calendarMonth.getFullYear()}
              </span>
            </div>
          </CardHeader>

          <CardContent className="p-0">
            {/* Calendar Grid Header */}
            <div className="grid grid-cols-7 border-b border-border/60 bg-muted/20 text-center text-[10.5px] font-semibold text-muted-foreground">
              {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((d, i) => (
                <div key={d} className={`py-1 ${i === 0 || i === 6 ? 'text-muted-foreground/60' : 'text-foreground'}`}>
                  {d}
                </div>
              ))}
            </div>

            {/* Calendar Days Matrix (Compact height: ~48px per row) */}
            <div className="grid grid-cols-7 gap-px bg-border/50">
              {calendarDays.map((day, idx) => {
                const leaves = day ? getLeavesForDate(day) : [];
                const isWeekend = idx % 7 === 0 || idx % 7 === 6;
                const isToday =
                  day === new Date().getDate() &&
                  calendarMonth.getMonth() === new Date().getMonth() &&
                  calendarMonth.getFullYear() === new Date().getFullYear();

                return (
                  <div
                    key={idx}
                    className={`h-12 sm:h-13 p-1 transition-colors overflow-hidden ${
                      day
                        ? isWeekend
                          ? 'bg-muted/10'
                          : 'bg-card hover:bg-muted/10'
                        : 'bg-muted/25 opacity-30'
                    }`}
                  >
                    {day && (
                      <>
                        <div className="flex items-center justify-between text-[10px] leading-none mb-0.5">
                          <span
                            className={`inline-flex items-center justify-center h-3.5 w-3.5 rounded-full text-[9.5px] font-bold ${
                              isToday
                                ? 'bg-[#00A651] text-white'
                                : 'text-muted-foreground'
                            }`}
                          >
                            {day}
                          </span>
                          {leaves.length > 0 && (
                            <span className="text-[8.5px] font-mono text-muted-foreground">
                              {leaves.length}
                            </span>
                          )}
                        </div>

                        {/* Leaves for this day (Compact 1-row pill) */}
                        <div className="space-y-0.5">
                          {leaves.slice(0, 1).map((leave) => {
                            const isPending = (leave.status || '').toLowerCase() === 'pending';
                            const DeptIcon = getDepartmentIcon(leave.department);

                            return (
                              <button
                                key={leave.id}
                                type="button"
                                onClick={() => setSelectedAbsence(leave)}
                                className={`w-full text-left px-1 py-0.5 rounded text-[8.5px] transition-all cursor-pointer truncate flex items-center gap-0.5 border ${
                                  isPending
                                    ? 'bg-amber-500/10 border-dashed border-amber-500/40 text-amber-800 dark:text-amber-300 hover:bg-amber-500/20'
                                    : 'bg-emerald-500/10 border-emerald-500/30 text-emerald-800 dark:text-emerald-300 hover:bg-emerald-500/20 font-medium'
                                }`}
                              >
                                <DeptIcon className="h-2 w-2 shrink-0 opacity-70" />
                                <span className="truncate font-semibold">
                                  {leave.employeeName?.split(' ')[0] || 'Staff'}
                                </span>
                                <span className="opacity-70 shrink-0 font-mono text-[8px]">
                                  ({leave.type[0]})
                                </span>
                              </button>
                            );
                          })}

                          {leaves.length > 1 && (
                            <button
                              type="button"
                              onClick={() => setSelectedAbsence(leaves[1])}
                              className="w-full text-center text-[8px] font-semibold text-muted-foreground hover:text-foreground py-0"
                            >
                              +{leaves.length - 1} more
                            </button>
                          )}
                        </div>
                      </>
                    )}
                  </div>
                );
              })}
            </div>
          </CardContent>

          {/* Bottom collapse bar */}
          <div className="py-1 border-t border-border/40 bg-muted/15 flex items-center justify-center">
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => setIsCalendarOpen(false)}
              className="h-5 text-[10.5px] text-muted-foreground hover:text-foreground gap-1 cursor-pointer"
            >
              <ChevronUp className="h-2.5 w-2.5" />
              <span>Fold calendar back up</span>
            </Button>
          </div>
        </Card>
      )}

      {/* 4. My Submissions & History (Always in view below) */}
      <Card className="border border-border/60 rounded-2xl bg-card shadow-2xs overflow-hidden">
        <CardHeader className="p-4 sm:p-5 border-b border-border/50 flex flex-row items-center justify-between">
          <div>
            <CardTitle className="text-base font-bold text-foreground">
              My Submissions & History
            </CardTitle>
            <p className="text-xs text-muted-foreground mt-0.5">
              Records of leave applications submitted by {CURRENT_USER.name} ({CURRENT_USER.department}).
            </p>
          </div>
          <Badge variant="secondary" className="text-xs font-bold">
            {myRequests.length} Record{myRequests.length === 1 ? '' : 's'}
          </Badge>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow className="bg-muted/30 border-b border-border/60">
                <TableHead className="text-xs font-bold pl-4">Type</TableHead>
                <TableHead className="text-xs font-bold">Date Range</TableHead>
                <TableHead className="text-xs font-bold text-center">Working Days</TableHead>
                <TableHead className="text-xs font-bold">Reason & Justification</TableHead>
                <TableHead className="text-xs font-bold">Status</TableHead>
                <TableHead className="text-xs font-bold text-right pr-4">Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {myRequests.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-8 text-xs text-muted-foreground">
                    No leave requests submitted yet. Click &quot;Request Time Off&quot; to apply.
                  </TableCell>
                </TableRow>
              ) : (
                myRequests.map((req) => (
                  <TableRow key={req.id} className="hover:bg-muted/20 border-b border-border/40 text-xs">
                    <TableCell className="pl-4 font-semibold text-foreground">
                      {req.type}
                    </TableCell>
                    <TableCell className="font-mono text-muted-foreground text-[11.5px]">
                      {formatDate(req.startDate)} → {formatDate(req.endDate)}
                    </TableCell>
                    <TableCell className="text-center font-semibold font-mono">
                      {req.workingDays}d
                    </TableCell>
                    <TableCell className="max-w-xs truncate text-muted-foreground">
                      {req.reason}
                    </TableCell>
                    <TableCell>
                      <StatusBadge status={req.status} />
                    </TableCell>
                    <TableCell className="text-right pr-4">
                      {(req.status || '').toLowerCase() === 'pending' ? (
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={() => handleWithdraw(req.id)}
                          className="h-7 text-xs text-rose-600 hover:bg-rose-500/10 cursor-pointer"
                        >
                          Withdraw
                        </Button>
                      ) : (
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={() => setSelectedAbsence(req)}
                          className="h-7 text-xs text-muted-foreground hover:text-foreground cursor-pointer"
                        >
                          View
                        </Button>
                      )}
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* 5. Absence Details Modal */}
      <Dialog open={!!selectedAbsence} onOpenChange={() => setSelectedAbsence(null)}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <div className="flex items-center gap-2">
              <div className="h-8 w-8 rounded-lg bg-[#00A651]/10 text-[#00A651] flex items-center justify-center">
                <CalendarRange className="h-4 w-4" />
              </div>
              <div>
                <DialogTitle className="text-base font-bold text-slate-900 dark:text-white">
                  Absence Event Details
                </DialogTitle>
                <DialogDescription className="text-xs text-muted-foreground">
                  Task 5.2: Calendar schedule overview for team availability
                </DialogDescription>
              </div>
            </div>
          </DialogHeader>

          {selectedAbsence && (
            <div className="space-y-4 py-2 text-xs">
              <div className="p-3 rounded-xl bg-muted/40 border border-border/60 flex items-center justify-between">
                <div>
                  <h4 className="font-bold text-sm text-foreground">
                    {selectedAbsence.employeeName}
                  </h4>
                  <p className="text-[11px] text-muted-foreground flex items-center gap-1 mt-0.5">
                    <Building2 className="h-3 w-3" />
                    {selectedAbsence.department || 'Corporate'}
                  </p>
                </div>
                <StatusBadge status={selectedAbsence.status} />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="p-2.5 rounded-lg border border-border/50 bg-card">
                  <span className="text-[10px] text-muted-foreground uppercase font-semibold block">
                    Leave Category
                  </span>
                  <span className="font-bold text-xs text-foreground mt-0.5 block">
                    {selectedAbsence.type} Leave
                  </span>
                </div>
                <div className="p-2.5 rounded-lg border border-border/50 bg-card">
                  <span className="text-[10px] text-muted-foreground uppercase font-semibold block">
                    Absence Duration
                  </span>
                  <span className="font-bold text-xs text-foreground mt-0.5 block">
                    {selectedAbsence.workingDays} working days
                  </span>
                </div>
              </div>

              <div className="space-y-1">
                <span className="text-[11px] text-muted-foreground block font-medium">
                  Date Range:
                </span>
                <p className="font-semibold text-xs text-foreground bg-muted/30 p-2 rounded-lg border font-mono">
                  {formatDate(selectedAbsence.startDate)} → {formatDate(selectedAbsence.endDate)}
                </p>
              </div>

              <div className="space-y-1">
                <span className="text-[11px] text-muted-foreground block font-medium">
                  Stated Reason:
                </span>
                <p className="text-xs text-slate-700 dark:text-slate-300 bg-muted/30 p-2.5 rounded-lg border">
                  {selectedAbsence.reason || 'No description provided.'}
                </p>
              </div>

              {selectedAbsence.approvedBy && (
                <div className="text-[11px] text-muted-foreground flex items-center gap-1.5 pt-1">
                  <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600" />
                  <span>Approved & Authorized by: <strong className="text-foreground">{selectedAbsence.approvedBy}</strong></span>
                </div>
              )}

              <DialogFooter className="pt-2">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => setSelectedAbsence(null)}
                  className="w-full text-xs cursor-pointer"
                >
                  Close
                </Button>
              </DialogFooter>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* 6. Request Leave Submission Modal */}
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <div className="flex items-center gap-2">
              <div className="h-8 w-8 rounded-lg bg-[#00A651]/10 text-[#00A651] flex items-center justify-center">
                <Plus className="h-4 w-4" />
              </div>
              <div>
                <DialogTitle className="text-base font-bold text-slate-900 dark:text-white">
                  Submit Leave Application
                </DialogTitle>
                <DialogDescription className="text-xs text-muted-foreground">
                  Task 5.2: POST /api/v1/leave/requests
                </DialogDescription>
              </div>
            </div>
          </DialogHeader>

          <div className="space-y-4 py-2 text-xs">
            <div className="space-y-1.5">
              <Label className="font-semibold text-xs">Leave Classification</Label>
              <Select
                value={form.type}
                onValueChange={(val) => {
                  if (val !== null) setForm({ ...form, type: val as LeaveType });
                }}
              >
                <SelectTrigger className="h-9 text-xs">
                  <SelectValue placeholder="Select classification" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Annual" className="text-xs">Annual Vacation (20d Entitled)</SelectItem>
                  <SelectItem value="Sick" className="text-xs">Sick Leave (Medical Cert required &gt; 2 days)</SelectItem>
                  <SelectItem value="Casual" className="text-xs">Casual / Personal Emergency</SelectItem>
                  <SelectItem value="Maternity/Paternity" className="text-xs">Maternity / Paternity</SelectItem>
                  <SelectItem value="Unpaid" className="text-xs">Unpaid Leave</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label htmlFor="startDate" className="font-semibold text-xs">Start Date</Label>
                <Input
                  id="startDate"
                  type="date"
                  value={form.startDate}
                  onChange={(e) => setForm({ ...form, startDate: e.target.value })}
                  className="h-9 text-xs"
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="endDate" className="font-semibold text-xs">End Date</Label>
                <Input
                  id="endDate"
                  type="date"
                  value={form.endDate}
                  onChange={(e) => setForm({ ...form, endDate: e.target.value })}
                  className="h-9 text-xs"
                />
              </div>
            </div>

            {workingDays > 0 && (
              <div className="rounded-xl bg-emerald-500/10 border border-emerald-500/20 p-2.5 text-xs text-emerald-800 dark:text-emerald-300 font-medium flex items-center justify-between">
                <span>Calculated business days:</span>
                <span className="font-bold font-mono">{workingDays} working days</span>
              </div>
            )}

            <div className="space-y-1.5">
              <Label htmlFor="reason" className="font-semibold text-xs">Reason & Context</Label>
              <Textarea
                id="reason"
                placeholder="Detail reason for absence, handover arrangements, and emergency contacts..."
                value={form.reason}
                onChange={(e) => setForm({ ...form, reason: e.target.value })}
                rows={3}
                className="text-xs resize-none"
              />
            </div>

            <DialogFooter className="gap-2 pt-2">
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => setIsModalOpen(false)}
                className="text-xs cursor-pointer"
              >
                Cancel
              </Button>
              <Button
                type="button"
                size="sm"
                onClick={handleSubmitRequest}
                disabled={!form.startDate || !form.endDate || !form.reason.trim()}
                className="bg-[#00A651] hover:bg-[#008C44] text-white font-bold text-xs gap-1.5 shadow-xs cursor-pointer"
              >
                Submit Application
              </Button>
            </DialogFooter>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}

export default function LeaveManagementPage() {
  return (
    <Suspense fallback={<div className="p-8 text-center text-xs text-muted-foreground">Loading...</div>}>
      <LeaveManagementContent />
    </Suspense>
  );
}
