'use client';

import { useRouter } from 'next/navigation';
import { StaffOnboardingForm } from '@/components/staff/StaffOnboardingForm';
import { useStaff } from '@/hooks/useStaff';
import { toast } from 'sonner';
import { useState, useEffect } from 'react';
import { StaffFormValues } from '@/lib/validations/staff';
import { StaffMember } from '@/types/staff';

import { Button } from '@/components/ui/button';
import { ArrowLeft, Loader2 } from 'lucide-react';

export default function StaffOnboardingPage() {
  const router = useRouter();
  const { repo, refresh } = useStaff();
  const [submitting, setSubmitting] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const roles = repo.getRoles();
  const departments = Array.from(new Set(repo.getAllStaff().map(s => s.department)));

  // Flatten nested form data into StaffMember shape
  const flattenFormData = (data: StaffFormValues): Omit<StaffMember, 'id' | 'status' | 'lastActive'> => ({
    firstName: data.personalInfo.firstName,
    lastName: data.personalInfo.lastName,
    email: data.personalInfo.email,
    phone: data.personalInfo.phone,
    avatarUrl: data.personalInfo.avatarUrl,
    dateOfBirth: data.personalInfo.dateOfBirth,
    gender: data.personalInfo.gender as any,
    maritalStatus: data.personalInfo.maritalStatus,
    nationality: data.personalInfo.nationality,
    department: data.employment.department,
    roleId: data.employment.roleId,
    managerId: data.employment.managerId,
    employeeId: data.employment.employeeId,
    dateJoined: data.employment.dateOfJoining,
    employmentType: data.employment.employmentType,
    workLocation: data.employment.workLocation,
    address: data.address,
    nextOfKin: data.nextOfKin,
    education: data.education,
    workExperience: data.workExperience,
    bank: data.bank,
    documents: data.documents?.length ? data.documents : undefined,
  });

  const handleSubmit = async (data: StaffFormValues) => {
    setSubmitting(true);
    try {
      const newStaff = flattenFormData(data) as StaffMember;
      newStaff.id = `staff-${Date.now()}`;
      newStaff.status = 'active';
      newStaff.lastActive = new Date().toISOString();
      repo.addStaff(newStaff);
      refresh();
      toast.success('Staff onboarded successfully!');
      router.push('/admin/staff/directory');
    } catch (error) {
      toast.error('Failed to onboard staff.');
    } finally {
      setSubmitting(false);
    }
  };

  if (!mounted) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-[#44883C]" />
      </div>
    );
  }

  return (
    <div className="w-full max-w-7xl mx-auto space-y-3">
      <div>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => router.push('/admin/staff/directory')}
          className="-ml-2 text-xs text-slate-600 dark:text-slate-300 hover:text-foreground gap-1.5 font-medium h-7 px-2"
        >
          <ArrowLeft className="h-3.5 w-3.5" /> Back to Staff Directory
        </Button>
      </div>

      <StaffOnboardingForm
        roles={roles}
        departments={departments}
        onSubmit={handleSubmit}
        isSubmitting={submitting}
      />
    </div>
  );
}