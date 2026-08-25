"use client";

import { useMemo, useState } from "react";
import {
  CalendarDays,
  Clock,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  Plus,
  Upload,
  Trash2,
  ChevronLeft,
  ChevronRight,
  Filter,
  User,
  Building2,
  CalendarRange,
  FileText,
  Check,
  X,
} from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

// ---------- Types & Mock Data ----------
type LeaveType = "Annual" | "Sick" | "Casual" | "Unpaid";
type LeaveStatus = "Pending" | "Approved" | "Rejected";

interface LeaveRequest {
  id: string;
  employeeName: string;
  department: string;
  type: LeaveType;
  startDate: string; // ISO date
  endDate: string;
  reason: string;
  status: LeaveStatus;
  workingDays: number;
  attachment?: string;
  submittedAt: string;
}

const CURRENT_USER = {
  name: "Alice Johnson",
  department: "Technology",
};

// Initial mock leave requests
const INITIAL_REQUESTS: LeaveRequest[] = [
  {
    id: "LR-001",
    employeeName: "Alice Johnson",
    department: "Technology",
    type: "Annual",
    startDate: "2025-03-10",
    endDate: "2025-03-14",
    reason: "Family vacation",
    status: "Approved",
    workingDays: 5,
    submittedAt: "2025-02-20",
  },
  {
    id: "LR-002",
    employeeName: "Bob Smith",
    department: "Technology",
    type: "Sick",
    startDate: "2025-03-17",
    endDate: "2025-03-18",
    reason: "Flu",
    status: "Pending",
    workingDays: 2,
    submittedAt: "2025-03-15",
  },
  {
    id: "LR-003",
    employeeName: "Carol White",
    department: "Finance",
    type: "Casual",
    startDate: "2025-03-12",
    endDate: "2025-03-12",
    reason: "Personal errand",
    status: "Pending",
    workingDays: 1,
    submittedAt: "2025-03-10",
  },
  {
    id: "LR-004",
    employeeName: "David Brown",
    department: "Technology",
    type: "Annual",
    startDate: "2025-03-20",
    endDate: "2025-03-25",
    reason: "Vacation",
    status: "Pending",
    workingDays: 5,
    submittedAt: "2025-03-14",
  },
  {
    id: "LR-005",
    employeeName: "Eva Green",
    department: "Sales",
    type: "Unpaid",
    startDate: "2025-04-01",
    endDate: "2025-04-05",
    reason: "Personal leave",
    status: "Approved",
    workingDays: 5,
    submittedAt: "2025-03-01",
  },
];

// Leave balance mock (per user)
const LEAVE_BALANCES = {
  Annual: { total: 20, taken: 5 },
  Sick: { total: 10, taken: 2 },
  Casual: { total: 5, taken: 1 },
  Unpaid: { total: 0, taken: 0 }, // unpaid has no limit
};

// ---------- Helper Functions ----------
function calculateWorkingDays(start: string, end: string): number {
  const startDate = new Date(start);
  const endDate = new Date(end);
  let count = 0;
  const current = new Date(startDate);
  while (current <= endDate) {
    const day = current.getDay();
    if (day !== 0 && day !== 6) count++; // skip weekends
    current.setDate(current.getDate() + 1);
  }
  return count;
}

function formatDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

function isOverlapping(req1: LeaveRequest, req2: LeaveRequest): boolean {
  return (
    req1.startDate <= req2.endDate && req2.startDate <= req1.endDate
  );
}

// ---------- Components ----------
function LeaveBalanceCards() {
  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {Object.entries(LEAVE_BALANCES).map(([type, { total, taken }]) => {
        const available = type === "Unpaid" ? "∞" : total - taken;
        return (
          <Card key={type}>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <h3 className="font-semibold">{type}</h3>
                {type === "Unpaid" ? (
                  <Badge variant="outline">No limit</Badge>
                ) : (
                  <Badge variant="secondary">{available} left</Badge>
                )}
              </div>
              <div className="mt-3 flex items-end justify-between">
                <div>
                  <p className="text-2xl font-bold">{available}</p>
                  <p className="text-sm text-muted-foreground">
                    {taken} taken / {total} total
                  </p>
                </div>
                <div className="h-2 w-24 rounded-full bg-muted">
                  <div
                    className="h-2 rounded-full bg-primary"
                    style={{
                      width:
                        type === "Unpaid"
                          ? "0%"
                          : `${Math.min((taken / total) * 100, 100)}%`,
                    }}
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}

function StatusBadge({ status }: { status: LeaveStatus }) {
  const variant =
    status === "Approved"
      ? "success"
      : status === "Rejected"
      ? "destructive"
      : "warning";
  return <Badge variant={variant}>{status}</Badge>;
}

// ---------- Main Page ----------
export default function LeaveManagementPage() {
  const [activeTab, setActiveTab] = useState<
    "my-leave" | "approvals" | "calendar"
  >("my-leave");
  const [requests, setRequests] = useState<LeaveRequest[]>(INITIAL_REQUESTS);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [rejectModal, setRejectModal] = useState<{
    open: boolean;
    requestIds: string[];
  }>({ open: false, requestIds: [] });
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [filterDepartment, setFilterDepartment] = useState<string>("all");
  const [calendarMonth, setCalendarMonth] = useState(new Date());

  // ----- Form state for new request -----
  const [form, setForm] = useState({
    type: "Annual" as LeaveType,
    startDate: "",
    endDate: "",
    reason: "",
    attachment: null as File | null,
  });

  const workingDays = useMemo(() => {
    if (form.startDate && form.endDate) {
      return calculateWorkingDays(form.startDate, form.endDate);
    }
    return 0;
  }, [form.startDate, form.endDate]);

  // Derived data
  const myRequests = requests.filter(
    (r) => r.employeeName === CURRENT_USER.name
  );
  const pendingRequests = requests.filter((r) => r.status === "Pending");
  const filteredApprovals =
    filterDepartment === "all"
      ? pendingRequests
      : pendingRequests.filter((r) => r.department === filterDepartment);

  // Conflict detection: a request conflicts if dates overlap with any other pending/approved request in same department (excluding itself)
  const getConflict = (req: LeaveRequest) => {
    return requests.some(
      (r) =>
        r.id !== req.id &&
        r.department === req.department &&
        r.status !== "Rejected" &&
        isOverlapping(r, req)
    );
  };

  // Handlers
  const handleSubmitRequest = () => {
    const newReq: LeaveRequest = {
      id: `LR-${String(requests.length + 1).padStart(3, "0")}`,
      employeeName: CURRENT_USER.name,
      department: CURRENT_USER.department,
      type: form.type,
      startDate: form.startDate,
      endDate: form.endDate,
      reason: form.reason,
      status: "Pending",
      workingDays,
      attachment: form.attachment?.name,
      submittedAt: new Date().toISOString().split("T")[0],
    };
    setRequests([newReq, ...requests]);
    setIsModalOpen(false);
    setForm({
      type: "Annual",
      startDate: "",
      endDate: "",
      reason: "",
      attachment: null,
    });
  };

  const handleWithdraw = (id: string) => {
    setRequests(requests.filter((r) => r.id !== id));
  };

  const handleApprove = (ids: string[]) => {
    setRequests(
      requests.map((r) => (ids.includes(r.id) ? { ...r, status: "Approved" as LeaveStatus } : r))
    );
    setSelectedIds([]);
  };

  const handleReject = (ids: string[], reason: string) => {
    setRequests(
      requests.map((r) =>
        ids.includes(r.id) ? { ...r, status: "Rejected" as LeaveStatus, reason } : r
      )
    );
    setRejectModal({ open: false, requestIds: [] });
    setSelectedIds([]);
  };

  const openRejectModal = (ids: string[]) => {
    setRejectModal({ open: true, requestIds: ids });
  };

  // Calendar helpers
  const daysInMonth = (date: Date) =>
    new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
  const monthStartDay = (date: Date) =>
    new Date(date.getFullYear(), date.getMonth(), 1).getDay(); // 0=Sun

  const calendarDays = useMemo(() => {
    const year = calendarMonth.getFullYear();
    const month = calendarMonth.getMonth();
    const totalDays = daysInMonth(calendarMonth);
    const startDay = monthStartDay(calendarMonth);
    const days: (number | null)[] = Array(startDay).fill(null);
    for (let d = 1; d <= totalDays; d++) days.push(d);
    // fill remaining to complete weeks
    while (days.length % 7 !== 0) days.push(null);
    return days;
  }, [calendarMonth]);

  const getLeavesForDate = (day: number) => {
    const dateStr = `${calendarMonth.getFullYear()}-${String(
      calendarMonth.getMonth() + 1
    ).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
    return requests.filter(
      (r) =>
        r.status === "Approved" &&
        r.startDate <= dateStr &&
        r.endDate >= dateStr
    );
  };

  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Leave Management</h1>
          <p className="text-sm text-muted-foreground">
            Request time off, approve team absences, and view the department calendar.
          </p>
        </div>
        <Button onClick={() => setIsModalOpen(true)}>
          <Plus className="mr-2 h-4 w-4" />
          Request Leave
        </Button>
      </div>

      {/* Tabs */}
      <div className="flex space-x-1 rounded-lg bg-muted p-1">
        {[
          { key: "my-leave", label: "My Leave", icon: User },
          { key: "approvals", label: "Approval Queue", icon: CheckCircle2 },
          { key: "calendar", label: "Department Calendar", icon: CalendarDays },
        ].map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key as any)}
            className={`flex flex-1 items-center justify-center gap-2 rounded-md px-3 py-2 text-sm font-medium transition-colors ${
              activeTab === tab.key
                ? "bg-background text-foreground shadow"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            <tab.icon className="h-4 w-4" />
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      {activeTab === "my-leave" && (
        <div className="space-y-6">
          {/* Balance Cards */}
          <LeaveBalanceCards />

          {/* My Requests Table */}
          <Card>
            <CardHeader>
              <CardTitle>My Requests</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Type</TableHead>
                    <TableHead>Dates</TableHead>
                    <TableHead>Working Days</TableHead>
                    <TableHead>Reason</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {myRequests.map((req) => (
                    <TableRow key={req.id}>
                      <TableCell>{req.type}</TableCell>
                      <TableCell>
                        {formatDate(req.startDate)} → {formatDate(req.endDate)}
                      </TableCell>
                      <TableCell>{req.workingDays}</TableCell>
                      <TableCell className="max-w-[200px] truncate">
                        {req.reason}
                      </TableCell>
                      <TableCell>
                        <StatusBadge status={req.status} />
                      </TableCell>
                      <TableCell className="text-right">
                        {req.status === "Pending" && (
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleWithdraw(req.id)}
                          >
                            <Trash2 className="mr-1 h-4 w-4" />
                            Withdraw
                          </Button>
                        )}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </div>
      )}

      {activeTab === "approvals" && (
        <div className="space-y-4">
          {/* Filters & Batch Actions */}
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-2">
              <Filter className="h-4 w-4 text-muted-foreground" />
              <Select value={filterDepartment} onValueChange={setFilterDepartment}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="All Departments" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Departments</SelectItem>
                  <SelectItem value="Technology">Technology</SelectItem>
                  <SelectItem value="Finance">Finance</SelectItem>
                  <SelectItem value="Sales">Sales</SelectItem>
                </SelectContent>
              </Select>
            </div>
            {selectedIds.length > 0 && (
              <div className="flex items-center gap-2">
                <Button
                  size="sm"
                  onClick={() => handleApprove(selectedIds)}
                >
                  <Check className="mr-1 h-4 w-4" />
                  Approve ({selectedIds.length})
                </Button>
                <Button
                  size="sm"
                  variant="destructive"
                  onClick={() => openRejectModal(selectedIds)}
                >
                  <X className="mr-1 h-4 w-4" />
                  Reject
                </Button>
              </div>
            )}
          </div>

          {/* Approval Table */}
          <Card>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-12">
                      <input
                        type="checkbox"
                        onChange={(e) =>
                          setSelectedIds(
                            e.target.checked
                              ? filteredApprovals.map((r) => r.id)
                              : []
                          )
                        }
                        checked={
                          filteredApprovals.length > 0 &&
                          selectedIds.length === filteredApprovals.length
                        }
                        className="h-4 w-4"
                      />
                    </TableHead>
                    <TableHead>Employee</TableHead>
                    <TableHead>Department</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Dates</TableHead>
                    <TableHead>Days</TableHead>
                    <TableHead>Conflict</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredApprovals.map((req) => {
                    const hasConflict = getConflict(req);
                    return (
                      <TableRow key={req.id}>
                        <TableCell>
                          <input
                            type="checkbox"
                            checked={selectedIds.includes(req.id)}
                            onChange={(e) =>
                              setSelectedIds(
                                e.target.checked
                                  ? [...selectedIds, req.id]
                                  : selectedIds.filter((id) => id !== req.id)
                              )
                            }
                            className="h-4 w-4"
                          />
                        </TableCell>
                        <TableCell>{req.employeeName}</TableCell>
                        <TableCell>{req.department}</TableCell>
                        <TableCell>{req.type}</TableCell>
                        <TableCell>
                          {formatDate(req.startDate)} → {formatDate(req.endDate)}
                        </TableCell>
                        <TableCell>{req.workingDays}</TableCell>
                        <TableCell>
                          {hasConflict ? (
                            <span className="inline-flex items-center gap-1 text-amber-600">
                              <AlertTriangle className="h-4 w-4" />
                              Overlap
                            </span>
                          ) : (
                            <span className="text-muted-foreground">None</span>
                          )}
                        </TableCell>
                        <TableCell className="text-right">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleApprove([req.id])}
                          >
                            Approve
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="text-destructive"
                            onClick={() => openRejectModal([req.id])}
                          >
                            Reject
                          </Button>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </div>
      )}

      {activeTab === "calendar" && (
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>
              {calendarMonth.toLocaleDateString("en-US", {
                month: "long",
                year: "numeric",
              })}
            </CardTitle>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="icon"
                onClick={() =>
                  setCalendarMonth(
                    new Date(
                      calendarMonth.getFullYear(),
                      calendarMonth.getMonth() - 1,
                      1
                    )
                  )
                }
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <Button
                variant="outline"
                size="icon"
                onClick={() =>
                  setCalendarMonth(
                    new Date(
                      calendarMonth.getFullYear(),
                      calendarMonth.getMonth() + 1,
                      1
                    )
                  )
                }
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-7 gap-px overflow-hidden rounded-lg border bg-muted">
              {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((d) => (
                <div
                  key={d}
                  className="bg-background p-2 text-center text-sm font-medium text-muted-foreground"
                >
                  {d}
                </div>
              ))}
              {calendarDays.map((day, idx) => {
                const leaves = day ? getLeavesForDate(day) : [];
                return (
                  <div
                    key={idx}
                    className="min-h-[80px] bg-background p-1 text-sm"
                  >
                    {day && (
                      <>
                        <div className="text-right text-xs text-muted-foreground">
                          {day}
                        </div>
                        <div className="mt-1 space-y-1">
                          {leaves.slice(0, 2).map((leave) => (
                            <div
                              key={leave.id}
                              className="rounded bg-primary/10 px-1 py-0.5 text-[10px] text-primary"
                            >
                              {leave.employeeName.split(" ")[0]} - {leave.type}
                            </div>
                          ))}
                          {leaves.length > 2 && (
                            <div className="text-[10px] text-muted-foreground">
                              +{leaves.length - 2} more
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

      {/* Request Leave Modal */}
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Request Leave</DialogTitle>
            <DialogDescription>
              Fill in the details for your time off request.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="type">Leave Type</Label>
              <Select
                value={form.type}
                onValueChange={(value) =>
                  setForm({ ...form, type: value as LeaveType })
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Annual">Annual</SelectItem>
                  <SelectItem value="Sick">Sick</SelectItem>
                  <SelectItem value="Casual">Casual</SelectItem>
                  <SelectItem value="Unpaid">Unpaid</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="startDate">Start Date</Label>
                <Input
                  id="startDate"
                  type="date"
                  value={form.startDate}
                  onChange={(e) =>
                    setForm({ ...form, startDate: e.target.value })
                  }
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="endDate">End Date</Label>
                <Input
                  id="endDate"
                  type="date"
                  value={form.endDate}
                  onChange={(e) =>
                    setForm({ ...form, endDate: e.target.value })
                  }
                />
              </div>
            </div>
            {workingDays > 0 && (
              <div className="rounded-lg bg-muted p-2 text-sm">
                <span className="font-medium">Net working days:</span>{" "}
                {workingDays} (weekends excluded)
              </div>
            )}
            <div className="grid gap-2">
              <Label htmlFor="reason">Reason</Label>
              <Textarea
                id="reason"
                placeholder="Explain the reason for your leave..."
                value={form.reason}
                onChange={(e) => setForm({ ...form, reason: e.target.value })}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="attachment">Attachment (optional)</Label>
              <Input
                id="attachment"
                type="file"
                onChange={(e) =>
                  setForm({
                    ...form,
                    attachment: e.target.files?.[0] || null,
                  })
                }
              />
              {form.attachment && (
                <p className="text-xs text-muted-foreground">
                  <FileText className="mr-1 inline h-3 w-3" />
                  {form.attachment.name}
                </p>
              )}
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsModalOpen(false)}>
              Cancel
            </Button>
            <Button
              onClick={handleSubmitRequest}
              disabled={!form.startDate || !form.endDate || !form.reason}
            >
              Submit Request
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Reject Modal */}
      <Dialog
        open={rejectModal.open}
        onOpenChange={(open) => !open && setRejectModal({ open: false, requestIds: [] })}
      >
        <DialogContent className="sm:max-w-[400px]">
          <DialogHeader>
            <DialogTitle>Reject Request(s)</DialogTitle>
            <DialogDescription>
              Please provide a reason for rejection (mandatory).
            </DialogDescription>
          </DialogHeader>
          <Textarea
            placeholder="Reason for rejection..."
            onChange={(e) => {
              // Store reason temporarily in a ref or state; we'll use a local variable
              // But for simplicity we'll store in a hidden state inside component
              // In a real app, use a separate state
              // Here we'll use a closure variable:
              (window as any).rejectReason = e.target.value;
            }}
          />
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setRejectModal({ open: false, requestIds: [] })}
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={() => {
                const reason = (window as any).rejectReason || "";
                if (reason.trim()) {
                  handleReject(rejectModal.requestIds, reason);
                }
              }}
            >
              Confirm Reject
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}