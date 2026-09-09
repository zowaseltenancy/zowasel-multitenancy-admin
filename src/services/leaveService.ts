import { staffRepository } from '@/lib/staffRepository';
import {
  ApiLeaveRequest,
  LeaveBalance,
  CreateLeaveRequestDto,
  ReviewLeaveDto,
  LeaveCalendarEvent,
} from '@/types/staff';
import { calculateWorkingDays } from '@/components/staff/leave/leaveUtils';

const DEFAULT_ENTITLEMENTS: Record<string, number> = {
  ANNUAL: 20,
  SICK: 10,
  MATERNITY: 0,
  PATERNITY: 0,
  COMPASSIONATE: 5,
  UNPAID: 0,
};

function normalizeType(type: string): 'ANNUAL' | 'SICK' | 'MATERNITY' | 'PATERNITY' | 'COMPASSIONATE' | 'UNPAID' {
  const upper = (type || '').toUpperCase();
  if (upper.includes('SICK')) return 'SICK';
  if (upper.includes('MATERNITY')) return 'MATERNITY';
  if (upper.includes('PATERNITY')) return 'PATERNITY';
  if (upper.includes('COMPASSIONATE') || upper.includes('BEREAVEMENT') || upper.includes('CASUAL')) {
    return 'COMPASSIONATE';
  }
  if (upper.includes('UNPAID')) return 'UNPAID';
  return 'ANNUAL';
}

export class LeaveApiService {
  /**
   * Task 5.1: GET /api/v1/admin/leave/balances/me?year=2026
   * "How many days does this person have left"
   */
  async getBalancesMe(staffId: string = 'staff-alice', year: number = 2026): Promise<{
    success: boolean;
    message: string;
    data: LeaveBalance[];
  }> {
    const allRequests = staffRepository.getLeaveRequests();
    const myRequests = allRequests.filter(
      (r) =>
        r.staffId === staffId &&
        (r.startDate.startsWith(String(year)) || r.endDate.startsWith(String(year)))
    );

    const categories: ('ANNUAL' | 'SICK' | 'MATERNITY' | 'PATERNITY' | 'COMPASSIONATE' | 'UNPAID')[] = [
      'ANNUAL',
      'SICK',
      'MATERNITY',
      'PATERNITY',
      'COMPASSIONATE',
      'UNPAID',
    ];

    const balances: LeaveBalance[] = categories.map((cat) => {
      const catRequests = myRequests.filter((r) => normalizeType(r.type) === cat);
      const usedDays = catRequests
        .filter((r) => (r.status || '').toLowerCase() === 'approved')
        .reduce((sum, r) => sum + (r.workingDays || r.days || 0), 0);

      const pendingDays = catRequests
        .filter((r) => (r.status || '').toLowerCase() === 'pending')
        .reduce((sum, r) => sum + (r.workingDays || r.days || 0), 0);

      const entitled = DEFAULT_ENTITLEMENTS[cat] || 0;
      const availableDays = cat === 'UNPAID' ? 0 : Math.max(0, entitled - usedDays - pendingDays);

      return {
        type: cat,
        year,
        entitledDays: entitled,
        usedDays,
        pendingDays,
        availableDays,
      };
    });

    return {
      success: true,
      message: 'Leave balances retrieved',
      data: balances,
    };
  }

  /**
   * Task 5.2: POST /api/v1/admin/leave/requests
   * "Submit a new leave request (start date, end date, type, reason)"
   * Acceptance Criteria: Rejects requests with overlapping dates or insufficient balance days.
   */
  async createRequest(
    staffId: string,
    dto: CreateLeaveRequestDto
  ): Promise<{
    success: boolean;
    message: string;
    code?: string;
    data?: ApiLeaveRequest;
  }> {
    const normType = normalizeType(dto.type);
    const startDate = dto.startDate;
    const endDate = dto.endDate;
    const days = calculateWorkingDays(startDate, endDate);

    if (startDate > endDate) {
      return {
        success: false,
        message: 'Invalid date range: Start date cannot be after end date.',
        code: 'BAD_REQUEST',
      };
    }

    if (days <= 0) {
      return {
        success: false,
        message: 'Selected date range contains 0 working days.',
        code: 'BAD_REQUEST',
      };
    }

    const allRequests = staffRepository.getLeaveRequests();
    const myRequests = allRequests.filter((r) => r.staffId === staffId);

    // 1. Acceptance Criteria: Check for overlapping dates
    const hasOverlap = myRequests.some((r) => {
      const isPendingOrApproved =
        (r.status || '').toLowerCase() === 'pending' || (r.status || '').toLowerCase() === 'approved';
      if (!isPendingOrApproved) return false;
      return r.startDate <= endDate && startDate <= r.endDate;
    });

    if (hasOverlap) {
      return {
        success: false,
        message: 'Rejection: You already have a pending or approved leave request during this date range.',
        code: 'OVERLAPPING_REQUEST',
      };
    }

    // 2. Acceptance Criteria: Check balance days (unless UNPAID)
    if (normType !== 'UNPAID') {
      const balancesResp = await this.getBalancesMe(staffId, new Date(startDate).getFullYear());
      const catBal = balancesResp.data.find((b) => b.type === normType);
      const available = catBal ? catBal.availableDays : 0;

      if (days > available) {
        return {
          success: false,
          message: `Rejection: Insufficient leave balance days. Requested: ${days} day(s), Available: ${available} day(s).`,
          code: 'INSUFFICIENT_BALANCE',
        };
      }
    }

    const staffMember = staffRepository.getStaffById(staffId);
    const applicantName = staffMember ? `${staffMember.firstName} ${staffMember.lastName}` : 'Applicant';
    const applicantDept = staffMember?.department || 'Operations';

    // Persist to repository
    const created = staffRepository.addLeaveRequest({
      staffId,
      employeeName: applicantName,
      department: applicantDept,
      type: normType,
      startDate,
      endDate,
      workingDays: days,
      days,
      reason: dto.reason,
      status: 'pending',
    });

    const apiResponseData: ApiLeaveRequest = {
      id: created.id,
      type: normType,
      startDate,
      endDate,
      days,
      reason: dto.reason,
      status: 'PENDING',
      applicant: {
        id: staffId,
        firstName: staffMember?.firstName || 'Staff',
        lastName: staffMember?.lastName || 'Member',
        email: staffMember?.email || 'staff@zowasel.com',
        department: {
          id: staffMember?.departmentId || 'dept-1',
          name: applicantDept,
        },
      },
      reviewedBy: null,
      reviewedAt: null,
      reviewNote: null,
      createdAt: created.createdAt,
      updatedAt: created.updatedAt,
    };

    return {
      success: true,
      message: 'Leave request submitted',
      data: apiResponseData,
    };
  }

  /**
   * Task 5.2: GET /api/v1/admin/leave/requests/me?page=1&limit=20
   * "view your own past/pending requests"
   */
  async getRequestsMe(staffId: string = 'staff-alice'): Promise<{
    success: boolean;
    message: string;
    data: ApiLeaveRequest[];
    meta: { page: number; limit: number; total: number; totalPages: number };
  }> {
    const allStaff = staffRepository.getAllStaff();
    const allRequests = staffRepository.getLeaveRequests();

    const myRequests = allRequests.filter((r) => r.staffId === staffId);
    const staffMember = allStaff.find((s) => s.id === staffId);

    const formatted: ApiLeaveRequest[] = myRequests.map((r) => {
      const normType = normalizeType(r.type);
      const statusUpper = (r.status || 'PENDING').toUpperCase() as 'PENDING' | 'APPROVED' | 'REJECTED';

      return {
        id: r.id,
        type: normType,
        startDate: r.startDate,
        endDate: r.endDate,
        days: r.workingDays || r.days || 0,
        reason: r.reason,
        status: statusUpper,
        applicant: {
          id: staffId,
          firstName: staffMember?.firstName || 'Staff',
          lastName: staffMember?.lastName || 'Member',
          email: staffMember?.email || 'staff@zowasel.com',
          department: {
            id: staffMember?.departmentId || 'dept-1',
            name: staffMember?.department || r.department || 'Operations',
          },
        },
        reviewedBy: r.approvedBy
          ? {
              id: 'manager-1',
              firstName: r.approvedBy.split(' ')[0] || 'Manager',
              lastName: r.approvedBy.split(' ')[1] || 'Lead',
            }
          : null,
        reviewedAt: r.reviewedAt || null,
        reviewNote: r.reviewNote || r.rejectionReason || null,
        createdAt: r.createdAt,
        updatedAt: r.updatedAt,
      };
    });

    return {
      success: true,
      message: 'Leave requests retrieved',
      data: formatted,
      meta: {
        page: 1,
        limit: 20,
        total: formatted.length,
        totalPages: 1,
      },
    };
  }

  /**
   * Task 5.3: GET /api/v1/admin/leave/requests/overview?page=1&limit=20
   * "managers see all pending/team requests needing review"
   */
  async getOverview(): Promise<{
    success: boolean;
    message: string;
    data: ApiLeaveRequest[];
    meta: { page: number; limit: number; total: number; totalPages: number };
  }> {
    const allStaff = staffRepository.getAllStaff();
    const allRequests = staffRepository.getLeaveRequests();

    const formatted: ApiLeaveRequest[] = allRequests.map((r) => {
      const staffMember = allStaff.find((s) => s.id === r.staffId);
      const normType = normalizeType(r.type);
      const statusUpper = (r.status || 'PENDING').toUpperCase() as 'PENDING' | 'APPROVED' | 'REJECTED';

      return {
        id: r.id,
        type: normType,
        startDate: r.startDate,
        endDate: r.endDate,
        days: r.workingDays || r.days || 0,
        reason: r.reason,
        status: statusUpper,
        applicant: {
          id: r.staffId,
          firstName: staffMember?.firstName || r.employeeName?.split(' ')[0] || 'Staff',
          lastName: staffMember?.lastName || r.employeeName?.split(' ')[1] || 'Member',
          email: staffMember?.email || 'staff@zowasel.com',
          department: staffMember?.department
            ? {
                id: staffMember.departmentId || 'dept-1',
                name: staffMember.department,
              }
            : r.department
            ? { id: 'dept-1', name: r.department }
            : null,
        },
        reviewedBy: r.approvedBy
          ? {
              id: 'manager-1',
              firstName: r.approvedBy.split(' ')[0] || 'Manager',
              lastName: r.approvedBy.split(' ')[1] || 'Lead',
            }
          : null,
        reviewedAt: r.reviewedAt || null,
        reviewNote: r.reviewNote || r.rejectionReason || null,
        createdAt: r.createdAt,
        updatedAt: r.updatedAt,
      };
    });

    return {
      success: true,
      message: 'Leave overview retrieved',
      data: formatted,
      meta: {
        page: 1,
        limit: 20,
        total: formatted.length,
        totalPages: 1,
      },
    };
  }

  /**
   * Task 5.3: PATCH /api/v1/admin/leave/requests/:id/review
   * "approve or reject a specific request"
   * Acceptance Criteria: Self-review is strictly blocked (applicant_id !== reviewer_id).
   * Approvals automatically deduct leave balance.
   */
  async reviewRequest(
    id: string,
    dto: ReviewLeaveDto,
    reviewer: { id: string; firstName: string; lastName: string }
  ): Promise<{
    success: boolean;
    message: string;
    code?: string;
    data?: ApiLeaveRequest;
  }> {
    const allRequests = staffRepository.getLeaveRequests();
    const req = allRequests.find((r) => r.id === id);

    if (!req) {
      return {
        success: false,
        message: 'Leave request not found',
        code: 'NOT_FOUND',
      };
    }

    // STRICT SELF-REVIEW BLOCK: 403 Forbidden
    if (req.staffId === reviewer.id) {
      return {
        success: false,
        message: 'Missing permission: leave:review (Self-review blocked: You cannot review your own leave request)',
        code: 'FORBIDDEN',
      };
    }

    const reviewerFullName = `${reviewer.firstName} ${reviewer.lastName}`;
    const nextStatus = dto.decision === 'APPROVED' ? 'approved' : 'rejected';

    const result = staffRepository.updateLeaveStatus(
      id,
      nextStatus,
      reviewer.id,
      reviewerFullName,
      dto.note
    );

    if (!result.success) {
      return {
        success: false,
        message: result.message,
        code: 'FORBIDDEN',
      };
    }

    // Record review metadata
    staffRepository.updateLeaveRequest(id, {
      reviewNote: dto.note,
      reviewedAt: new Date().toISOString(),
    });

    const updated = staffRepository.getLeaveRequests().find((r) => r.id === id);
    const allStaff = staffRepository.getAllStaff();
    const staffMember = allStaff.find((s) => s.id === req.staffId);

    const apiData: ApiLeaveRequest = {
      id,
      type: normalizeType(req.type),
      startDate: req.startDate,
      endDate: req.endDate,
      days: req.workingDays || req.days || 0,
      reason: req.reason,
      status: dto.decision,
      applicant: {
        id: req.staffId,
        firstName: staffMember?.firstName || req.employeeName?.split(' ')[0] || 'Staff',
        lastName: staffMember?.lastName || req.employeeName?.split(' ')[1] || 'Member',
        email: staffMember?.email || 'staff@zowasel.com',
        department: staffMember?.department
          ? { id: staffMember.departmentId || 'dept-1', name: staffMember.department }
          : null,
      },
      reviewedBy: {
        id: reviewer.id,
        firstName: reviewer.firstName,
        lastName: reviewer.lastName,
      },
      reviewedAt: new Date().toISOString(),
      reviewNote: dto.note || null,
      createdAt: updated?.createdAt || req.createdAt,
      updatedAt: new Date().toISOString(),
    };

    return {
      success: true,
      message: 'Leave request reviewed',
      data: apiData,
    };
  }

  /**
   * Task 5.3: GET /api/v1/admin/leave/calendar?from=...&to=...&includePending=true
   * "calendar-style view of who's on leave when (useful for team planning)"
   */
  async getCalendar(
    from: string,
    to: string,
    includePending: boolean = true,
    departmentId?: string
  ): Promise<{
    success: boolean;
    message: string;
    data: LeaveCalendarEvent[];
  }> {
    const allStaff = staffRepository.getAllStaff();
    const allRequests = staffRepository.getLeaveRequests();

    const filtered = allRequests.filter((r) => {
      const isApproved = (r.status || '').toLowerCase() === 'approved';
      const isPending = (r.status || '').toLowerCase() === 'pending';
      if (!isApproved && !(includePending && isPending)) return false;

      // Date range overlap check: [r.startDate, r.endDate] overlaps with [from, to]
      const overlaps = r.startDate <= to && from <= r.endDate;
      if (!overlaps) return false;

      if (departmentId && departmentId !== 'all') {
        const staffMember = allStaff.find((s) => s.id === r.staffId);
        const dept = staffMember?.department || r.department;
        if ((dept || '').toLowerCase() !== departmentId.toLowerCase()) return false;
      }

      return true;
    });

    const data: LeaveCalendarEvent[] = filtered.map((r) => {
      const staffMember = allStaff.find((s) => s.id === r.staffId);
      const isPending = (r.status || '').toLowerCase() === 'pending';

      return {
        id: r.id,
        type: normalizeType(r.type),
        status: isPending ? 'PENDING' : 'APPROVED',
        startDate: r.startDate,
        endDate: r.endDate,
        days: r.workingDays || r.days || 0,
        admin: {
          id: r.staffId,
          firstName: staffMember?.firstName || r.employeeName?.split(' ')[0] || 'Staff',
          lastName: staffMember?.lastName || r.employeeName?.split(' ')[1] || 'Member',
          department: staffMember?.department
            ? {
                id: staffMember.departmentId || 'dept-1',
                name: staffMember.department,
              }
            : r.department
            ? { id: 'dept-1', name: r.department }
            : null,
        },
      };
    });

    return {
      success: true,
      message: 'Leave calendar retrieved',
      data,
    };
  }
}

export const leaveService = new LeaveApiService();
