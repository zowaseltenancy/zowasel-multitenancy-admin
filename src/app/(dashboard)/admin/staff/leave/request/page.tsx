"use client";

import { useMemo, useState } from "react";
import {
  Clock,
  AlertTriangle,
  Filter,
  Check,
  X,
  Building2,
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

// ---------- Types ----------
type LeaveStatus = "Pending" | "Approved" | "Rejected";

interface LeaveRequest {
  id: string;
  employeeName: string;
  department: string;
  type: string;
  startDate: string;
  endDate: string;
  reason: string;
  status: LeaveStatus;
  workingDays: number;
  attachment?: string;
  submittedAt: string;
}

const INITIAL_PENDING: LeaveRequest[] = [
  {
    id: "LR-1001",
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
    id: "LR-1002",
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
    id: "LR-1003",
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
    id: "LR-1004",
    employeeName: "Eva Green",
    department: "Sales",
    type: "Unpaid",
    startDate: "2025-04-01",
    endDate: "2025-04-05",
    reason: "Personal leave",
    status: "Pending",
    workingDays: 5,
    submittedAt: "2025-03-01",
  },
  {
    id: "LR-1005",
    employeeName: "Frank Miller",
    department: "Technology",
    type: "Annual",
    startDate: "2025-03-21",
    endDate: "2025-03-23",
    reason: "Family event",
    status: "Pending",
    workingDays: 3,
    submittedAt: "2025-03-16",
  },
];

function formatDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

function isOverlapping(req1: LeaveRequest, req2: LeaveRequest): boolean {
  return req1.startDate <= req2.endDate && req2.startDate <= req1.endDate;
}

export default function ApprovalQueuePage() {
  const [pendingRequests, setPendingRequests] =
    useState<LeaveRequest[]>(INITIAL_PENDING);
  const [filterDepartment, setFilterDepartment] = useState<string>("all");
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [rejectModalOpen, setRejectModalOpen] = useState(false);
  const [rejectTargetIds, setRejectTargetIds] = useState<string[]>([]);
  const [rejectReason, setRejectReason] = useState("");
  const [detailRequest, setDetailRequest] = useState<LeaveRequest | null>(null);

  const filteredRequests = useMemo(() => {
    if (filterDepartment === "all") return pendingRequests;
    return pendingRequests.filter((r) => r.department === filterDepartment);
  }, [pendingRequests, filterDepartment]);

  const getConflict = (req: LeaveRequest) => {
    return pendingRequests.some(
      (r) =>
        r.id !== req.id &&
        r.department === req.department &&
        r.status === "Pending" &&
        isOverlapping(r, req)
    );
  };

  const handleApprove = (ids: string[]) => {
    setPendingRequests((prev) =>
      prev.map((r) =>
        ids.includes(r.id) ? { ...r, status: "Approved" as LeaveStatus } : r
      )
    );
    setSelectedIds([]);
  };

  const openRejectModal = (ids: string[]) => {
    setRejectTargetIds(ids);
    setRejectReason("");
    setRejectModalOpen(true);
  };

  const handleReject = () => {
    if (!rejectReason.trim()) return;
    setPendingRequests((prev) =>
      prev.map((r) =>
        rejectTargetIds.includes(r.id)
          ? { ...r, status: "Rejected" as LeaveStatus, reason: rejectReason }
          : r
      )
    );
    setRejectModalOpen(false);
    setSelectedIds([]);
    setRejectReason("");
  };

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

  const totalPending = pendingRequests.length;
  const conflictCount = pendingRequests.filter(getConflict).length;

  return (
    <div className="space-y-6 p-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Approval Queue</h1>
          <p className="text-sm text-muted-foreground">
            Review and manage all pending leave requests.
          </p>
        </div>
        <div className="flex gap-3">
          <Card className="px-4 py-2">
            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm font-medium">{totalPending} pending</span>
            </div>
          </Card>
          {conflictCount > 0 && (
            <Card className="px-4 py-2 border-amber-500/30 bg-amber-500/5">
              <div className="flex items-center gap-2 text-amber-600">
                <AlertTriangle className="h-4 w-4" />
                <span className="text-sm font-medium">
                  {conflictCount} conflicts
                </span>
              </div>
            </Card>
          )}
        </div>
      </div>

      <div className="flex items-center gap-2">
        <Filter className="h-4 w-4 text-muted-foreground" />
        <Select value={filterDepartment} onValueChange={setFilterDepartment}>
          <SelectTrigger className="w-[200px]">
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

      {selectedIds.length > 0 && (
        <div className="flex items-center gap-2 rounded-lg border bg-muted/50 p-2">
          <span className="text-sm font-medium">
            {selectedIds.length} selected
          </span>
          <div className="ml-auto flex gap-2">
            <Button size="sm" onClick={() => handleApprove(selectedIds)}>
              <Check className="mr-1 h-4 w-4" />
              Approve
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
        </div>
      )}

      <Card>
        <CardHeader>
          <CardTitle>Pending Leave Requests</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-12">
                  <input
                    type="checkbox"
                    onChange={toggleSelectAll}
                    checked={
                      filteredRequests.length > 0 &&
                      selectedIds.length === filteredRequests.length
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
              {filteredRequests.map((req) => {
                const hasConflict = getConflict(req);
                return (
                  <TableRow key={req.id} className="hover:bg-muted/50">
                    <TableCell>
                      <input
                        type="checkbox"
                        checked={selectedIds.includes(req.id)}
                        onChange={() => toggleSelectOne(req.id)}
                        className="h-4 w-4"
                      />
                    </TableCell>
                    <TableCell className="font-medium">
                      {req.employeeName}
                    </TableCell>
                    <TableCell>
                      <span className="inline-flex items-center gap-1">
                        <Building2 className="h-3.5 w-3.5 text-muted-foreground" />
                        {req.department}
                      </span>
                    </TableCell>
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
                      <div className="flex justify-end gap-1">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => setDetailRequest(req)}
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="text-emerald-600 hover:text-emerald-700"
                          onClick={() => handleApprove([req.id])}
                        >
                          <Check className="mr-1 h-4 w-4" />
                          Approve
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="text-destructive hover:text-destructive/90"
                          onClick={() => openRejectModal([req.id])}
                        >
                          <X className="mr-1 h-4 w-4" />
                          Reject
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Rejection Modal */}
      <Dialog open={rejectModalOpen} onOpenChange={setRejectModalOpen}>
        <DialogContent className="sm:max-w-[450px]">
          <DialogHeader>
            <DialogTitle>Reject Leave Request(s)</DialogTitle>
            <DialogDescription>
              You are about to reject {rejectTargetIds.length} request(s). A
              reason is required.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="rejectReason">Reason for Rejection *</Label>
              <Textarea
                id="rejectReason"
                placeholder="Explain why this request is being rejected..."
                value={rejectReason}
                onChange={(e) => setRejectReason(e.target.value)}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setRejectModalOpen(false)}>
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={handleReject}
              disabled={!rejectReason.trim()}
            >
              Confirm Rejection
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Detail Modal */}
      <Dialog open={!!detailRequest} onOpenChange={() => setDetailRequest(null)}>
        <DialogContent className="sm:max-w-[450px]">
          <DialogHeader>
            <DialogTitle>Request Details</DialogTitle>
          </DialogHeader>
          {detailRequest && (
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-sm font-medium">Employee:</span>
                <span>{detailRequest.employeeName}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm font-medium">Department:</span>
                <span>{detailRequest.department}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm font-medium">Type:</span>
                <span>{detailRequest.type}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm font-medium">Dates:</span>
                <span>
                  {formatDate(detailRequest.startDate)} →{" "}
                  {formatDate(detailRequest.endDate)}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm font-medium">Working Days:</span>
                <span>{detailRequest.workingDays}</span>
              </div>
              <div>
                <span className="text-sm font-medium">Reason:</span>
                <p className="mt-1 text-sm">{detailRequest.reason}</p>
              </div>
              {detailRequest.attachment && (
                <div>
                  <span className="text-sm font-medium">Attachment:</span>
                  <p className="mt-1 text-sm">
                    📎 {detailRequest.attachment}
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