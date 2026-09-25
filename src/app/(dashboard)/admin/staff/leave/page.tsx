'use client';

import { useMemo, useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { toast } from 'sonner';

import { useAdminMe } from '@/features/auth/hooks/useAuth';
import { useDepartments, useLeaveOverview, useMyLeave } from '@/features/staff/hooks/useStaff';
import { mapLeaveRequest } from '@/features/staff/api/staff.mappers';
import { LeaveRequest, LeaveType } from '@/types/staff';
import { calculateWorkingDays } from '@/components/staff/leave/leaveUtils';
import { LeaveHeader } from '@/components/staff/leave/LeaveHeader';
import { LeaveBalanceCards } from '@/components/staff/leave/LeaveBalanceCards';
import { DepartmentCalendarView } from '@/components/staff/leave/DepartmentCalendarView';
import { MyLeaveHistoryTable } from '@/components/staff/leave/MyLeaveHistoryTable';
import { AbsenceDetailsModal } from '@/components/staff/leave/AbsenceDetailsModal';
import { RequestLeaveModal } from '@/components/staff/leave/RequestLeaveModal';
import { useLeaveCalendar } from '@/components/staff/leave/useLeaveCalendar';

function LeaveManagementContent() {
  const searchParams = useSearchParams();
  const tabParam = searchParams?.get('tab');

  // Two views, two endpoints:
  //
  //   GET /admin/leave/requests/overview  every admin's requests (leave:review)
  //   GET /admin/leave/requests/me        the signed-in admin's own
  //   GET /admin/leave/balances/me        their entitlement and what's left
  //
  // The previous version read one local array for all three and identified the
  // current user from a hardcoded CURRENT_USER constant — so "my requests" was
  // whatever matched the name "Alice Johnson".
  const { data: me } = useAdminMe();
  // ?departmentId=<uuid> from the dashboard's department cards. The overview
  // endpoint filters on it, so the card's Leave action lands on that
  // department's requests rather than everyone's.
  const departmentParam = searchParams?.get('departmentId');

  const { requests: overviewDtos } = useLeaveOverview({
    limit: 100,
    ...(departmentParam ? { departmentId: departmentParam } : {}),
  });
  const { balances, requests: myDtos, submit, withdraw } = useMyLeave({ limit: 100 });
  const { departments } = useDepartments({ limit: 100 });

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedAbsence, setSelectedAbsence] = useState<LeaveRequest | null>(null);

  const [form, setForm] = useState({
    type: 'ANNUAL' as LeaveType,
    startDate: '',
    endDate: '',
    reason: '',
    attachment: null as File | null,
  });

  const requests = useMemo(() => overviewDtos.map(mapLeaveRequest), [overviewDtos]);
  const myRequests = useMemo(() => myDtos.map(mapLeaveRequest), [myDtos]);

  const cal = useLeaveCalendar(requests, tabParam === 'calendar');

  // Kept as a preview only — the server recomputes the working days from the
  // dates, so this figure never becomes the stored value.
  const workingDays = useMemo(() => {
    if (form.startDate && form.endDate) {
      return calculateWorkingDays(form.startDate, form.endDate);
    }
    return 0;
  }, [form.startDate, form.endDate]);

  const pendingApprovalCount = useMemo(
    () => requests.filter((r) => (r.status || '').toLowerCase() === 'pending').length,
    [requests],
  );

  // POST /admin/leave/requests. The server checks the request against
  // availableDays (entitled - used - pending) and refuses an overdraw, so the
  // form does not pre-compute that — it would only disagree with the server.
  //
  // `attachment` is collected but has no endpoint: leave requests have a
  // document column server-side but no upload route, so a file cannot be sent
  // and the user is told rather than left believing it attached.
  const handleSubmitRequest = () => {
    if (!form.startDate || !form.endDate || !form.reason.trim()) {
      toast.error('Please complete all required fields.');
      return;
    }

    if (form.attachment) {
      toast.warning('The attachment cannot be uploaded yet — the request will be submitted without it.');
    }

    submit(
      {
        // The form already holds the wire value — see constants/leave.ts. It
        // used to hold a display string and upper-case it on the way out,
        // which turned 'Maternity/Paternity' into a type the enum has never
        // had and the request into a 422.
        type: form.type,
        startDate: form.startDate,
        endDate: form.endDate,
        reason: form.reason.trim(),
      },
      {
        onSuccess: () => {
          setIsModalOpen(false);
          setForm({ type: 'ANNUAL', startDate: '', endDate: '', reason: '', attachment: null });
        },
      },
    );
  };

  // PATCH /admin/leave/requests/{id}/cancel. Only a pending request, and only
  // your own — the server refuses the rest, so the button does not try to
  // decide that here.
  const handleWithdraw = (id: string) => {
    withdraw(id);
  };

  return (
    <div className="space-y-6 p-4 sm:p-6 max-w-7xl mx-auto">
      <LeaveHeader
        pendingApprovalCount={pendingApprovalCount}
        isCalendarOpen={cal.isCalendarOpen}
        onToggleCalendar={() => cal.setIsCalendarOpen((prev) => !prev)}
        onRequestTimeOff={() => setIsModalOpen(true)}
      />

      <LeaveBalanceCards balances={balances} />

      <DepartmentCalendarView
        open={cal.isCalendarOpen}
        calendarMonth={cal.calendarMonth}
        calendarDepartment={cal.calendarDepartment}
        includePending={cal.includePending}
        departments={departments}
        months={cal.months}
        years={cal.years}
        calendarDays={cal.calendarDays}
        getLeavesForDate={cal.getLeavesForDate}
        onPrevMonth={cal.prevMonth}
        onNextMonth={cal.nextMonth}
        onJumpToToday={cal.jumpToToday}
        onSelectMonth={cal.selectMonth}
        onSelectYear={cal.selectYear}
        onSelectDepartment={cal.setCalendarDepartment}
        onTogglePending={() => cal.setIncludePending((p) => !p)}
        onClose={() => cal.setIsCalendarOpen(false)}
        onSelectAbsence={setSelectedAbsence}
      />

      <MyLeaveHistoryTable
        requests={myRequests}
        userName={
          me ? [me.firstName, me.lastName].filter(Boolean).join(' ') || me.email : ''
        }
        userDepartment={me?.department?.name ?? ''}
        onWithdraw={handleWithdraw}
        onSelectAbsence={setSelectedAbsence}
      />

      <AbsenceDetailsModal
        absence={selectedAbsence}
        onClose={() => setSelectedAbsence(null)}
      />

      <RequestLeaveModal
        open={isModalOpen}
        onOpenChange={setIsModalOpen}
        form={form}
        setForm={setForm}
        workingDays={workingDays}
        onSubmit={handleSubmitRequest}
      />
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
