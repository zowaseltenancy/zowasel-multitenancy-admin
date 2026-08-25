'use client';

import { useRouter } from 'next/navigation';
import { StaffOnboardingForm } from '@/components/staff/StaffOnboardingForm';
import { useStaff } from '@/hooks/useStaff';
import { toast } from 'sonner';
import { useState } from 'react';
import { StaffFormValues } from '@/lib/validations/staff';
import { StaffMember } from '@/types/staff';

export default function StaffOnboardingPage() {
  const router = useRouter();
  const { repo, refresh } = useStaff();
  const [submitting, setSubmitting] = useState(false);

  const roles = repo.getRoles();
  const departments = Array.from(new Set(repo.getAllStaff().map(s => s.department)));

  // Flatten nested form data into StaffMember shape
  const flattenFormData = (data: StaffFormValues): Omit<StaffMember, 'id' | 'status' | 'lastActive'> => ({
    firstName: data.personalInfo.firstName,
    lastName: data.personalInfo.lastName,
    email: data.personalInfo.email,
    phone: data.personalInfo.phone,
    dateOfBirth: data.personalInfo.dateOfBirth,
    gender: data.personalInfo.gender,
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
      // add unique ID and status
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

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Onboard New Staff</h1>
        <p className="text-muted-foreground">Fill in all required information to add a new team member.</p>
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