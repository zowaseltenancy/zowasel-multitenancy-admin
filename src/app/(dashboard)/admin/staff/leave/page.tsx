'use client';

import { useMemo, useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { toast } from 'sonner';

import { useStaff } from '@/hooks/useStaff';
import { LeaveRequest, LeaveType } from '@/types/staff';
import { CURRENT_USER, calculateWorkingDays } from '@/components/staff/leave/leaveUtils';
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

  const { repo, refresh, version } = useStaff();

  const [requests, setRequests] = useState<LeaveRequest[]>([]);
  const [departments, setDepartments] = useState<{ id: string; name: string }[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedAbsence, setSelectedAbsence] = useState<LeaveRequest | null>(null);

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

  const cal = useLeaveCalendar(requests, tabParam === 'calendar');

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

  return (
    <div className="space-y-6 p-4 sm:p-6 max-w-7xl mx-auto">
      <LeaveHeader
        pendingApprovalCount={pendingApprovalCount}
        isCalendarOpen={cal.isCalendarOpen}
        onToggleCalendar={() => cal.setIsCalendarOpen((prev) => !prev)}
        onRequestTimeOff={() => setIsModalOpen(true)}
      />

      <LeaveBalanceCards />

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
        userName={CURRENT_USER.name}
        userDepartment={CURRENT_USER.department}
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
