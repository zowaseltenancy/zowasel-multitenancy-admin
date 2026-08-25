"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
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
  User,
  Building2,
  CalendarRange,
  FileText,
  Eye,
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
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

// ---------- Types & Mock Data ----------
type LeaveType = "Annual" | "Sick" | "Casual" | "Unpaid";
type LeaveStatus = "Pending" | "Approved" | "Rejected";

interface LeaveRequest {
  id: string;
  employeeName: string;
  department: string;
  type: LeaveType;
  startDate: string;
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

// Mock data – replace with API calls
const INITIAL_REQUESTS: LeaveRequest[] = [
    {
    id: "LR-006",
    employeeName: "Grace Lee",
    department: "Technology",
    type: "Annual",
    startDate: "2026-08-10",
    endDate: "2026-08-12",
    reason: "Conference",
    status: "Approved",
    workingDays: 3,
    submittedAt: "2026-07-25",
  },
  {
    id: "LR-007",
    employeeName: "Henry Wilson",
    department: "Sales",
    type: "Casual",
    startDate: "2026-08-20",
    endDate: "2026-08-21",
    reason: "Personal",
    status: "Approved",
    workingDays: 2,
    submittedAt: "2026-08-01",
  },
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
    attachment: "doctor_note.pdf",
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

const LEAVE_BALANCES = {
  Annual: { total: 20, taken: 5 },
  Sick: { total: 10, taken: 2 },
  Casual: { total: 5, taken: 1 },
  Unpaid: { total: 0, taken: 0 },
};

// ---------- Helper Functions ----------
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

function formatDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
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
  const [activeTab, setActiveTab] = useState<"my-leave" | "calendar">("my-leave");
  const [requests, setRequests] = useState<LeaveRequest[]>(INITIAL_REQUESTS);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedRequest, setSelectedRequest] = useState<LeaveRequest | null>(null);

  // Calendar state
  const [calendarMonth, setCalendarMonth] = useState(new Date());
  const [calendarDepartment, setCalendarDepartment] = useState<string>("all");

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

  const myRequests = requests.filter((r) => r.employeeName === CURRENT_USER.name);
  const pendingCount = requests.filter((r) => r.status === "Pending").length;

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
    setForm({ type: "Annual", startDate: "", endDate: "", reason: "", attachment: null });
  };

  const handleWithdraw = (id: string) => {
    setRequests(requests.filter((r) => r.id !== id));
  };

  // Calendar helpers
  const daysInMonth = (date: Date) =>
    new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
  const monthStartDay = (date: Date) =>
    new Date(date.getFullYear(), date.getMonth(), 1).getDay();

  const calendarDays = useMemo(() => {
    const year = calendarMonth.getFullYear();
    const month = calendarMonth.getMonth();
    const totalDays = daysInMonth(calendarMonth);
    const startDay = monthStartDay(calendarMonth);
    const days: (number | null)[] = Array(startDay).fill(null);
    for (let d = 1; d <= totalDays; d++) days.push(d);
    while (days.length % 7 !== 0) days.push(null);
    return days;
  }, [calendarMonth]);

  const getLeavesForDate = (day: number) => {
    const dateStr = `${calendarMonth.getFullYear()}-${String(
      calendarMonth.getMonth() + 1
    ).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
    let filtered = requests.filter(
      (r) =>
        r.status === "Approved" &&
        r.startDate <= dateStr &&
        r.endDate >= dateStr
    );
    if (calendarDepartment !== "all") {
      filtered = filtered.filter((r) => r.department === calendarDepartment);
    }
    return filtered;
  };

  // Month and Year options
  const months = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December",
  ];
  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 11 }, (_, i) => currentYear - 5 + i);

  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">My Leave</h1>
          <p className="text-sm text-muted-foreground">
            Request time off and view your leave history.
          </p>
        </div>
        <div className="flex gap-3">
          <Link
            href="/admin/staff/leave/request"
            className="inline-flex items-center gap-2 rounded-lg border border-input bg-background px-4 py-2 text-sm font-semibold shadow-sm transition-colors hover:bg-accent hover:text-accent-foreground"
          >
            <CheckCircle2 className="h-4 w-4" />
            Approval Queue
            {pendingCount > 0 && (
              <Badge variant="warning" className="ml-1">
                {pendingCount}
              </Badge>
            )}
          </Link>
          <Button onClick={() => setIsModalOpen(true)}>
            <Plus className="mr-2 h-4 w-4" />
            Request Leave
          </Button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex space-x-1 rounded-lg bg-muted p-1">
        {[
          { key: "my-leave", label: "My Requests", icon: User },
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
          <LeaveBalanceCards />

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
                      <TableCell>
                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <span className="cursor-help underline decoration-dotted">
                                {req.reason.length > 20
                                  ? req.reason.substring(0, 20) + "..."
                                  : req.reason}
                              </span>
                            </TooltipTrigger>
                            <TooltipContent>
                              <p>{req.reason}</p>
                              {req.attachment && (
                                <p className="mt-1 text-xs">
                                  Attachment: {req.attachment}
                                </p>
                              )}
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                      </TableCell>
                      <TableCell>
                        <StatusBadge status={req.status} />
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-1">
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => setSelectedRequest(req)}
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                          {req.status === "Pending" && (
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => handleWithdraw(req.id)}
                            >
                              <Trash2 className="h-4 w-4 text-destructive" />
                            </Button>
                          )}
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </div>
      )}

      {activeTab === "calendar" && (
        <Card>
          <CardHeader className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <CardTitle>Department Calendar</CardTitle>
            <div className="flex flex-wrap items-center gap-2">
              {/* Month Selector */}
              <Select
                value={String(calendarMonth.getMonth())}
                onValueChange={(value) => {
                  const newMonth = parseInt(value);
                  setCalendarMonth(
                    new Date(calendarMonth.getFullYear(), newMonth, 1)
                  );
                }}
              >
                <SelectTrigger className="w-[140px]">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {months.map((month, idx) => (
                    <SelectItem key={idx} value={String(idx)}>
                      {month}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              {/* Year Selector */}
              <Select
                value={String(calendarMonth.getFullYear())}
                onValueChange={(value) => {
                  const newYear = parseInt(value);
                  setCalendarMonth(
                    new Date(newYear, calendarMonth.getMonth(), 1)
                  );
                }}
              >
                <SelectTrigger className="w-[100px]">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {years.map((year) => (
                    <SelectItem key={year} value={String(year)}>
                      {year}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              {/* Department Filter */}
              <Select
                value={calendarDepartment}
                onValueChange={setCalendarDepartment}
              >
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="All Departments" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Departments</SelectItem>
                  <SelectItem value="Technology">Technology</SelectItem>
                  <SelectItem value="Finance">Finance</SelectItem>
                  <SelectItem value="Sales">Sales</SelectItem>
                  <SelectItem value="Marketing">Marketing</SelectItem>
                  <SelectItem value="HR">HR</SelectItem>
                </SelectContent>
              </Select>
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
                    className="min-h-[90px] bg-background p-1 text-sm"
                  >
                    {day && (
                      <>
                        <div className="text-right text-xs text-muted-foreground">
                          {day}
                        </div>
                        <div className="mt-1 space-y-1">
                          {leaves.slice(0, 3).map((leave) => (
                            <TooltipProvider key={leave.id}>
                              <Tooltip>
                                <TooltipTrigger asChild>
                                  <div className="cursor-pointer rounded bg-primary/10 px-1 py-0.5 text-[10px] text-primary hover:bg-primary/20">
                                    {leave.employeeName.split(" ")[0]} - {leave.type}
                                  </div>
                                </TooltipTrigger>
                                <TooltipContent side="top">
                                  <p className="font-medium">
                                    {leave.employeeName}
                                  </p>
                                  <p className="text-xs">
                                    {leave.type} · {formatDate(leave.startDate)} →{" "}
                                    {formatDate(leave.endDate)}
                                  </p>
                                  <p className="text-xs text-muted-foreground">
                                    {leave.workingDays} working days
                                  </p>
                                </TooltipContent>
                              </Tooltip>
                            </TooltipProvider>
                          ))}
                          {leaves.length > 3 && (
                            <div className="text-[10px] text-muted-foreground">
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

      {/* Detail Modal */}
      <Dialog open={!!selectedRequest} onOpenChange={() => setSelectedRequest(null)}>
        <DialogContent className="sm:max-w-[450px]">
          <DialogHeader>
            <DialogTitle>Request Details</DialogTitle>
          </DialogHeader>
          {selectedRequest && (
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-sm font-medium">Type:</span>
                <span>{selectedRequest.type}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm font-medium">Dates:</span>
                <span>
                  {formatDate(selectedRequest.startDate)} →{" "}
                  {formatDate(selectedRequest.endDate)}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm font-medium">Working Days:</span>
                <span>{selectedRequest.workingDays}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm font-medium">Status:</span>
                <StatusBadge status={selectedRequest.status} />
              </div>
              <div>
                <span className="text-sm font-medium">Reason:</span>
                <p className="mt-1 text-sm">{selectedRequest.reason}</p>
              </div>
              {selectedRequest.attachment && (
                <div>
                  <span className="text-sm font-medium">Attachment:</span>
                  <p className="mt-1 text-sm">
                    <FileText className="mr-1 inline h-4 w-4" />
                    {selectedRequest.attachment}
                  </p>
                </div>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}