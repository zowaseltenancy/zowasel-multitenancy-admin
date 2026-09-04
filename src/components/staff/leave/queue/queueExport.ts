import { exportToCsv } from '@/lib/export';
import { LeaveRequest } from '@/types/staff';
import { toast } from 'sonner';
import { formatDate } from '../leaveUtils';

export function isOverlapping(
  req1: { startDate: string; endDate: string },
  req2: { startDate: string; endDate: string }
) {
  return req1.startDate <= req2.endDate && req2.startDate <= req1.endDate;
}

export function handleExportQueue(filteredRequests: LeaveRequest[]) {
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
}
