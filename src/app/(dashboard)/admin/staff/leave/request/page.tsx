'use client';

import { useState, useMemo, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  Clock,
  AlertTriangle,
  Filter,
  Check,
  X,
  Building2,
  Eye,
  Search,
  CheckSquare,
  Square,
  ArrowLeft,
  ChevronRight as BreadcrumbArrow,
  CalendarRange,
  Download,
  FileSpreadsheet,
  Table as TableIcon,
  ShieldAlert,
  Calendar,
  Paperclip,
  CheckCircle2,
  Lock,
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
import { toast } from 'sonner';

import { useStaff } from '@/hooks/useStaff';
import { LeaveRequest, LeaveStatus, LeaveType } from '@/types/staff';
import { getDepartmentIcon } from '@/lib/departmentIcons';
import { exportToCsv, exportToExcel } from '@/lib/export';

const CURRENT_USER_STAFF_ID = 'staff-alice';

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

export default function ApprovalQueuePage() {
  const router = useRouter();
  const { repo, refresh } = useStaff();

  const [mounted, setMounted] = useState(false);
  const [filterDepartment, setFilterDepartment] = useState<string>('all');
  const [filterType, setFilterType] = useState<string>('all');
  const [search, setSearch] = useState('');
  const [selectedIds, setSelectedIds] = useState<string[]>([]);

  // Modals
  const [rejectModalOpen, setRejectModalOpen] = useState(false);
  const [rejectTargetIds, setRejectTargetIds] = useState<string[]>([]);
  const [rejectReason, setRejectReason] = useState('');
  const [detailRequest, setDetailRequest] = useState<LeaveRequest | null>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  const allStaff = useMemo(() => repo.getAllStaff(), [repo]);
  const rawRequests = useMemo(() => repo.getLeaveRequests(), [repo]);

  // Enrich leave requests with employee details
  const allLeaveRequests: LeaveRequest[] = useMemo(() => {
    return rawRequests.map((r) => {
      const staff = allStaff.find((s) => s.id === r.staffId);
      const employeeName = r.employeeName || (staff ? `${staff.firstName} ${staff.lastName}` : 'Staff Member');
      const department = r.department || (staff ? staff.department : 'General');
      return {
        ...r,
        employeeName,
        department,
      };
    });
  }, [rawRequests, allStaff]);

  // Filter only pending requests for the queue
  const pendingRequests = useMemo(() => {
    return allLeaveRequests.filter((r) => r.status === 'pending');
  }, [allLeaveRequests]);

  const departments = useMemo(() => {
    const set = new Set<string>();
    allStaff.forEach((s) => s.department && set.add(s.department));
    pendingRequests.forEach((r) => r.department && set.add(r.department));
    return Array.from(set).sort();
  }, [allStaff, pendingRequests]);

  // Conflict detector: check if an overlapping request exists in the same department
  const getConflict = (req: LeaveRequest) => {
    return allLeaveRequests.some(
      (r) =>
        r.id !== req.id &&
        r.department === req.department &&
        r.status !== 'rejected' &&
        isOverlapping(r, req)
    );
  };

  const getConflictingPeers = (req: LeaveRequest) => {
    return allLeaveRequests.filter(
      (r) =>
        r.id !== req.id &&
        r.department === req.department &&
        r.status !== 'rejected' &&
        isOverlapping(r, req)
    );
  };

  // Filtered pending list
  const filteredRequests = useMemo(() => {
    return pendingRequests.filter((r) => {
      const searchTarget = `${r.employeeName || ''} ${r.department || ''} ${r.reason || ''} ${r.id || ''}`.toLowerCase();
      const matchesSearch = searchTarget.includes(search.toLowerCase());
      const matchesDept = filterDepartment === 'all' || r.department === filterDepartment;
      const matchesType = filterType === 'all' || r.type === filterType;
      return matchesSearch && matchesDept && matchesType;
    });
  }, [pendingRequests, search, filterDepartment, filterType]);

  // Approvals (Enforces Zowasel SSO Backend Track, line 1188 self-review block)
  const handleApprove = (ids: string[]) => {
    const selfRequests = pendingRequests.filter(
      (r) => ids.includes(r.id) && r.staffId === CURRENT_USER_STAFF_ID
    );
    if (selfRequests.length > 0) {
      toast.error('Self-review blocked: You cannot approve your own leave request.');
      return;
    }

    ids.forEach((id) => {
      repo.updateLeaveStatus(id, 'approved', CURRENT_USER_STAFF_ID, 'Alice Johnson');
    });
    refresh();
    toast.success(`Approved ${ids.length} leave request${ids.length === 1 ? '' : 's'}.`);
    setSelectedIds((prev) => prev.filter((id) => !ids.includes(id)));
    if (detailRequest && ids.includes(detailRequest.id)) {
      setDetailRequest(null);
    }
  };

  // Rejections
  const openRejectModal = (ids: string[]) => {
    const selfRequests = pendingRequests.filter(
      (r) => ids.includes(r.id) && r.staffId === CURRENT_USER_STAFF_ID
    );
    if (selfRequests.length > 0) {
      toast.error('Self-review blocked: You cannot reject your own leave request.');
      return;
    }

    setRejectTargetIds(ids);
    setRejectReason('');
    setRejectModalOpen(true);
  };

  const handleConfirmReject = () => {
    if (!rejectReason.trim()) {
      toast.error('Please specify a rejection reason');
      return;
    }
    rejectTargetIds.forEach((id) => {
      repo.updateLeaveRequest(id, {
        status: 'rejected',
        rejectionReason: rejectReason.trim(),
      });
    });
    refresh();
    toast.success(`Rejected ${rejectTargetIds.length} request${rejectTargetIds.length === 1 ? '' : 's'}.`);
    setSelectedIds((prev) => prev.filter((id) => !rejectTargetIds.includes(id)));
    setRejectModalOpen(false);
    setRejectReason('');
    setRejectTargetIds([]);
    if (detailRequest && rejectTargetIds.includes(detailRequest.id)) {
      setDetailRequest(null);
    }
  };

  // Select all / toggle
  const toggleSelectAll = () => {
    if (selectedIds.length === filteredRequests.length) {
      setSelectedIds([]);
    } else {
      setSelectedIds(filteredRequests.map((r) => r.id));
    }
  };

  const toggleSelectOne = (id: string) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  };

  // Export queue
  const handleExportQueue = () => {
    const headers = ['Request ID', 'Employee', 'Department', 'Leave Type', 'Start Date', 'End Date', 'Days', 'Reason'];
    const rows = filteredRequests.map((r) => [
      r.id,
      r.employeeName || '',
      r.department || '',
      r.type,
      formatDate(r.startDate),
      formatDate(r.endDate),
      r.workingDays,
      r.reason,
    ]);
    exportToCsv({
      title: 'Zowasel_Pending_Leave_Queue',
      headers,
      rows,
    });
    toast.success('Approval queue exported to CSV');
  };

  if (!mounted) return null;

  const totalPending = pendingRequests.length;
  const conflictCount = pendingRequests.filter(getConflict).length;

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12">
      {/* 1. Page Header & Breadcrumbs */}
      <div className="space-y-3 pb-1 border-b border-border/60">
        <nav className="flex items-center gap-1.5 text-xs text-muted-foreground font-medium">
          <Link href="/admin/staff/directory" className="hover:text-foreground transition-colors">
            Staff Management
          </Link>
          <BreadcrumbArrow className="h-3.5 w-3.5 opacity-50" />
          <Link href="/admin/staff/leave" className="hover:text-foreground transition-colors">
            Leave Management
          </Link>
          <BreadcrumbArrow className="h-3.5 w-3.5 opacity-50" />
          <span className="text-foreground font-semibold">Approval Queue</span>
        </nav>

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
              Leave Approval Queue
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-0.5">
              Review pending absence requests, resolve concurrent staffing overlaps, and authorize official time off.
            </p>
          </div>

          <div className="flex items-center gap-2 self-start sm:self-center shrink-0">
            <Link href="/admin/staff/leave">
              <Button
                type="button"
                variant="outline"
                size="sm"
                className="h-9 px-3 text-xs font-medium gap-1.5 cursor-pointer shadow-2xs"
              >
                <ArrowLeft className="h-3.5 w-3.5" /> Back to Leave Hub
              </Button>
            </Link>

            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={handleExportQueue}
              className="h-9 px-3 text-xs font-medium gap-1.5 cursor-pointer shadow-2xs"
            >
              <Download className="h-3.5 w-3.5 text-muted-foreground" /> Export Queue
            </Button>
          </div>
        </div>
      </div>

      {/* 2. Overview Strip */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
        <div className="border border-border/60 rounded-2xl bg-card p-4 shadow-2xs flex items-center justify-between">
          <div className="space-y-0.5">
            <span className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider block">
              Pending Authorization
            </span>
            <p className="text-2xl font-extrabold text-amber-600 dark:text-amber-400 font-mono">
              {totalPending}
            </p>
            <span className="text-[10.5px] text-muted-foreground block">
              {filteredRequests.length} matching current filter
            </span>
          </div>
          <div className="h-10 w-10 rounded-xl bg-amber-500/10 text-amber-600 dark:text-amber-400 flex items-center justify-center shrink-0">
            <Clock className="h-5 w-5" />
          </div>
        </div>

        <div className="border border-border/60 rounded-2xl bg-card p-4 shadow-2xs flex items-center justify-between">
          <div className="space-y-0.5">
            <span className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider block">
              Department Overlaps
            </span>
            <p className="text-2xl font-extrabold text-rose-600 dark:text-rose-400 font-mono">
              {conflictCount}
            </p>
            <span className="text-[10.5px] text-rose-600 dark:text-rose-400 font-medium block">
              {conflictCount > 0 ? 'Concurrent absence alert active' : 'No schedule clashes'}
            </span>
          </div>
          <div className="h-10 w-10 rounded-xl bg-rose-500/10 text-rose-600 dark:text-rose-400 flex items-center justify-center shrink-0">
            <ShieldAlert className="h-5 w-5" />
          </div>
        </div>

        <div className="border border-border/60 rounded-2xl bg-card p-4 shadow-2xs flex items-center justify-between">
          <div className="space-y-0.5">
            <span className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider block">
              Departments Affected
            </span>
            <p className="text-2xl font-extrabold text-slate-900 dark:text-white font-mono">
              {Array.from(new Set(pendingRequests.map((r) => r.department))).length}
            </p>
            <span className="text-[10.5px] text-muted-foreground block">
              Requiring supervisor sign-off
            </span>
          </div>
          <div className="h-10 w-10 rounded-xl bg-blue-500/10 text-blue-600 dark:text-blue-400 flex items-center justify-center shrink-0">
            <Building2 className="h-5 w-5" />
          </div>
        </div>
      </div>

      {/* 3. Filters & Batch Operations */}
      <div className="border border-border/60 rounded-2xl bg-card p-4 shadow-2xs space-y-3.5">
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
          <div className="flex flex-wrap items-center gap-2">
            {/* Dept Filter */}
            <Select value={filterDepartment} onValueChange={setFilterDepartment}>
              <SelectTrigger className="h-9 w-[180px] text-xs">
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

            {/* Leave Type Filter */}
            <Select value={filterType} onValueChange={setFilterType}>
              <SelectTrigger className="h-9 w-[160px] text-xs">
                <SelectValue placeholder="All Leave Types" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all" className="text-xs">All Leave Types</SelectItem>
                <SelectItem value="Annual" className="text-xs">Annual</SelectItem>
                <SelectItem value="Sick" className="text-xs">Sick</SelectItem>
                <SelectItem value="Casual" className="text-xs">Casual</SelectItem>
                <SelectItem value="Unpaid" className="text-xs">Unpaid</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Search */}
          <div className="relative sm:w-72">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by employee or reason..."
              className="pl-9 h-9 text-xs bg-muted/20"
            />
          </div>
        </div>

        {/* Batch Action Bar */}
        {selectedIds.length > 0 && (
          <div className="flex items-center justify-between p-2.5 rounded-xl bg-muted/50 border border-border/60 text-xs animate-in fade-in duration-150">
            <span className="font-semibold text-slate-900 dark:text-white flex items-center gap-2">
              <CheckSquare className="h-4 w-4 text-[#00A651]" />
              {selectedIds.length} request{selectedIds.length === 1 ? '' : 's'} selected for bulk action
            </span>

            <div className="flex items-center gap-2">
              <Button
                type="button"
                size="sm"
                variant="outline"
                onClick={() => setSelectedIds([])}
                className="h-8 text-xs cursor-pointer"
              >
                Clear
              </Button>
              <Button
                type="button"
                size="sm"
                variant="destructive"
                onClick={() => openRejectModal(selectedIds)}
                className="h-8 text-xs font-semibold gap-1 cursor-pointer"
              >
                <X className="h-3.5 w-3.5" /> Reject Selected ({selectedIds.length})
              </Button>
              <Button
                type="button"
                size="sm"
                onClick={() => handleApprove(selectedIds)}
                className="h-8 bg-[#00A651] hover:bg-[#008C44] text-white font-bold text-xs gap-1 cursor-pointer shadow-2xs"
              >
                <Check className="h-3.5 w-3.5" /> Approve Selected ({selectedIds.length})
              </Button>
            </div>
          </div>
        )}
      </div>

      {/* 4. Queue Table */}
      <div className="border border-border/60 rounded-2xl bg-card overflow-hidden shadow-2xs">
        <Table>
          <TableHeader>
            <TableRow className="bg-muted/30 hover:bg-muted/30 border-b border-border/60">
              <TableHead className="w-12 pl-4">
                <input
                  type="checkbox"
                  onChange={toggleSelectAll}
                  checked={filteredRequests.length > 0 && selectedIds.length === filteredRequests.length}
                  className="h-4 w-4 rounded border-border text-[#00A651] focus:ring-[#00A651] cursor-pointer"
                />
              </TableHead>
              <TableHead className="text-xs font-bold uppercase tracking-wider text-muted-foreground h-11">
                Employee
              </TableHead>
              <TableHead className="text-xs font-bold uppercase tracking-wider text-muted-foreground h-11">
                Department
              </TableHead>
              <TableHead className="text-xs font-bold uppercase tracking-wider text-muted-foreground h-11">
                Type
              </TableHead>
              <TableHead className="text-xs font-bold uppercase tracking-wider text-muted-foreground h-11">
                Dates Requested
              </TableHead>
              <TableHead className="text-xs font-bold uppercase tracking-wider text-muted-foreground h-11">
                Working Days
              </TableHead>
              <TableHead className="text-xs font-bold uppercase tracking-wider text-muted-foreground h-11">
                Overlap Analysis
              </TableHead>
              <TableHead className="text-xs font-bold uppercase tracking-wider text-muted-foreground h-11 text-right pr-5">
                Actions
              </TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {filteredRequests.length === 0 ? (
              <TableRow>
                <TableCell colSpan={8} className="h-56 text-center">
                  <div className="flex flex-col items-center justify-center gap-2.5 max-w-sm mx-auto text-muted-foreground">
                    <div className="h-12 w-12 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-[#00A651] flex items-center justify-center">
                      <CheckCircle2 className="h-6 w-6" />
                    </div>
                    <div>
                      <p className="font-bold text-sm text-foreground">Queue is completely clear!</p>
                      <p className="text-xs text-muted-foreground mt-0.5">
                        There are no pending employee leave requests requiring authorization.
                      </p>
                    </div>
                  </div>
                </TableCell>
              </TableRow>
            ) : (
              filteredRequests.map((req) => {
                const isSelected = selectedIds.includes(req.id);
                const hasConflict = getConflict(req);
                const conflictingPeers = getConflictingPeers(req);
                const DeptIcon = getDepartmentIcon(req.department);

                return (
                  <TableRow
                    key={req.id}
                    onClick={() => setDetailRequest(req)}
                    className={`hover:bg-muted/30 transition-colors cursor-pointer border-b border-border/50 group ${
                      isSelected ? 'bg-muted/20' : ''
                    }`}
                  >
                    {/* Checkbox */}
                    <TableCell className="pl-4 py-3.5" onClick={(e) => e.stopPropagation()}>
                      <input
                        type="checkbox"
                        checked={isSelected}
                        onChange={() => toggleSelectOne(req.id)}
                        className="h-4 w-4 rounded border-border text-[#00A651] focus:ring-[#00A651] cursor-pointer"
                      />
                    </TableCell>

                    {/* Employee */}
                    <TableCell className="py-3.5">
                      <div className="flex items-center gap-2.5">
                        <div className="h-8 w-8 rounded-xl bg-muted text-foreground font-bold text-xs flex items-center justify-center border shrink-0">
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
                          <p className="font-bold text-xs text-slate-900 dark:text-slate-100 group-hover:text-[#008C44] transition-colors truncate">
                            {req.employeeName}
                          </p>
                          <p className="text-[10.5px] text-muted-foreground font-mono">{req.id}</p>
                        </div>
                      </div>
                    </TableCell>

                    {/* Department */}
                    <TableCell className="py-3.5">
                      <div className="flex items-center gap-1.5 text-xs text-slate-700 dark:text-slate-300 font-medium">
                        <DeptIcon className="h-3.5 w-3.5 text-muted-foreground shrink-0" />
                        <span>{req.department}</span>
                      </div>
                    </TableCell>

                    {/* Type */}
                    <TableCell className="py-3.5">
                      <Badge variant="outline" className="text-[11px] font-semibold px-2 py-0.5 bg-muted/30 border-border/60">
                        {req.type}
                      </Badge>
                    </TableCell>

                    {/* Dates */}
                    <TableCell className="py-3.5">
                      <div className="text-xs font-medium text-slate-800 dark:text-slate-200">
                        {formatDate(req.startDate)} → {formatDate(req.endDate)}
                      </div>
                    </TableCell>

                    {/* Days */}
                    <TableCell className="py-3.5 text-xs font-mono font-bold text-slate-900 dark:text-slate-100">
                      {req.workingDays}d
                    </TableCell>

                    {/* Conflict Analysis */}
                    <TableCell className="py-3.5">
                      {hasConflict ? (
                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger
                              render={
                                <div className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md bg-amber-500/15 border border-amber-500/30 text-amber-700 dark:text-amber-400 font-semibold text-[11px]">
                                  <AlertTriangle className="h-3.5 w-3.5 shrink-0" />
                                  <span>{conflictingPeers.length} Peer Clashing</span>
                                </div>
                              }
                            />
                            <TooltipContent side="top" className="max-w-xs space-y-1">
                              <p className="font-bold text-xs">Concurrent Department Absence:</p>
                              {conflictingPeers.map((p) => (
                                <p key={p.id} className="text-[11px]">
                                  • {p.employeeName} ({formatDate(p.startDate)} - {formatDate(p.endDate)})
                                </p>
                              ))}
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                      ) : (
                        <span className="text-[11px] text-emerald-600 dark:text-emerald-400 font-medium flex items-center gap-1">
                          <Check className="h-3 w-3" /> Full Coverage
                        </span>
                      )}
                    </TableCell>

                    {/* Actions */}
                    <TableCell className="py-3.5 text-right pr-5" onClick={(e) => e.stopPropagation()}>
                      <div className="flex items-center justify-end gap-1.5">
                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger
                              render={
                                <Button
                                  type="button"
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => setDetailRequest(req)}
                                  className="h-8 w-8 p-0 text-muted-foreground hover:text-foreground cursor-pointer"
                                >
                                  <Eye className="h-4 w-4" />
                                </Button>
                              }
                            />
                            <TooltipContent side="top">Review Details</TooltipContent>
                          </Tooltip>
                        </TooltipProvider>

                        {req.staffId === CURRENT_USER_STAFF_ID ? (
                          <Badge variant="outline" className="text-[10px] font-semibold text-amber-600 dark:text-amber-400 border-amber-500/30 bg-amber-500/10 px-2 py-1 gap-1">
                            <Lock className="h-3 w-3" /> Self-review blocked
                          </Badge>
                        ) : (
                          <>
                            <Button
                              type="button"
                              size="sm"
                              onClick={() => handleApprove([req.id])}
                              className="h-7.5 px-2.5 bg-[#00A651] hover:bg-[#008C44] text-white font-bold text-xs gap-1 cursor-pointer shadow-2xs"
                            >
                              <Check className="h-3 w-3" /> Approve
                            </Button>

                            <Button
                              type="button"
                              size="sm"
                              variant="ghost"
                              onClick={() => openRejectModal([req.id])}
                              className="h-7.5 px-2 text-rose-600 hover:bg-rose-500/10 font-semibold text-xs gap-1 cursor-pointer"
                            >
                              <X className="h-3 w-3" /> Reject
                            </Button>
                          </>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                );
              })
            )}
          </TableBody>
        </Table>
      </div>

      {/* 5. Dialog: View Request Details */}
      <Dialog open={!!detailRequest} onOpenChange={() => setDetailRequest(null)}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-base font-bold">Leave Request Authorization</DialogTitle>
            <DialogDescription className="text-xs text-muted-foreground">
              Reviewing pending leave ticket {detailRequest?.id}
            </DialogDescription>
          </DialogHeader>

          {detailRequest && (
            <div className="space-y-3.5 py-2 text-xs">
              <div className="flex items-center justify-between p-3 rounded-xl bg-muted/40 border">
                <div>
                  <p className="font-bold text-sm text-foreground">{detailRequest.employeeName}</p>
                  <p className="text-xs text-muted-foreground">{detailRequest.department}</p>
                </div>
                <Badge variant="outline" className="text-[10px] bg-amber-500/15 text-amber-700 font-bold border-amber-500/30">
                  Pending Review
                </Badge>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="p-2.5 rounded-lg border bg-muted/20 space-y-0.5">
                  <span className="text-[10px] font-semibold text-muted-foreground uppercase">Leave Type</span>
                  <p className="font-bold text-foreground">{detailRequest.type}</p>
                </div>
                <div className="p-2.5 rounded-lg border bg-muted/20 space-y-0.5">
                  <span className="text-[10px] font-semibold text-muted-foreground uppercase">Working Days</span>
                  <p className="font-bold text-foreground">{detailRequest.workingDays} Days</p>
                </div>
              </div>

              <div className="p-2.5 rounded-lg border bg-muted/20 space-y-0.5">
                <span className="text-[10px] font-semibold text-muted-foreground uppercase">Time Off Span</span>
                <p className="font-bold text-foreground">
                  {formatDate(detailRequest.startDate)} → {formatDate(detailRequest.endDate)}
                </p>
              </div>

              <div className="p-2.5 rounded-lg border bg-muted/20 space-y-1">
                <span className="text-[10px] font-semibold text-muted-foreground uppercase">Reason / Stated Purpose</span>
                <p className="text-slate-800 dark:text-slate-200 leading-relaxed">{detailRequest.reason}</p>
              </div>

              {detailRequest.attachment && (
                <div className="flex items-center gap-2 p-2 rounded-lg border bg-muted/10 text-xs">
                  <Paperclip className="h-3.5 w-3.5 text-muted-foreground" />
                  <span className="font-medium">{detailRequest.attachment}</span>
                </div>
              )}

              <DialogFooter className="gap-2 pt-2">
                <Button
                  type="button"
                  variant="destructive"
                  size="sm"
                  onClick={() => openRejectModal([detailRequest.id])}
                  className="text-xs cursor-pointer"
                >
                  Reject Request
                </Button>
                <Button
                  type="button"
                  size="sm"
                  onClick={() => handleApprove([detailRequest.id])}
                  className="bg-[#00A651] hover:bg-[#008C44] text-white font-bold text-xs cursor-pointer shadow-xs"
                >
                  Approve Request
                </Button>
              </DialogFooter>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* 6. Dialog: Reject Reason */}
      <Dialog open={rejectModalOpen} onOpenChange={setRejectModalOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-base font-bold text-rose-600">Reject Leave Request(s)</DialogTitle>
            <DialogDescription className="text-xs text-muted-foreground">
              Provide an official rationale for declining {rejectTargetIds.length} request(s).
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-3 py-2 text-xs">
            <div className="space-y-1">
              <Label className="text-xs font-semibold">Reason for Rejection *</Label>
              <Textarea
                value={rejectReason}
                onChange={(e) => setRejectReason(e.target.value)}
                placeholder="Explain why this request is being rejected..."
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
              disabled={!rejectReason.trim()}
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
