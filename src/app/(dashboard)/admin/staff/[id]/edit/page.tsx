'use client';

import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { StaffOnboardingForm } from '@/components/staff/StaffOnboardingForm';
import { useStaff } from '@/hooks/useStaff';
import { toast } from 'sonner';
import { Loader2, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { StaffFormValues } from '@/lib/validations/staff';

export default function EditStaffPage() {
  const router = useRouter();
  const params = useParams();
  const { repo, refresh } = useStaff();
  const [defaultValues, setDefaultValues] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  const roles = repo.getRoles();
  const departments = Array.from(new Set(repo.getAllStaff().map(s => s.department)));

  useEffect(() => {
    const staff = repo.getStaffById(params.id as string);
    if (!staff) {
      toast.error('Staff not found');
      router.push('/admin/staff/directory');
      return;
    }

    // Map flat staff object to nested form structure
    setDefaultValues({
      personalInfo: {
        firstName: staff.firstName,
        lastName: staff.lastName,
        email: staff.email,
        phone: staff.phone,
        dateOfBirth: staff.dateOfBirth,
        gender: staff.gender || 'male',
        maritalStatus: staff.maritalStatus,
        nationality: staff.nationality,
      },
      employment: {
        roleId: staff.roleId,
        department: staff.department,
        managerId: staff.managerId,
        employeeId: staff.employeeId,
        dateOfJoining: staff.dateJoined || '',
        employmentType: staff.employmentType || 'full-time',
        workLocation: staff.workLocation,
      },
      address: staff.address || { line1: '', city: '', state: '', country: 'Nigeria' },
      nextOfKin: staff.nextOfKin || { fullName: '', relationship: '', phone: '' },
      education: staff.education || [],
      workExperience: staff.workExperience || [],
      bank: staff.bank || {},
      documents: staff.documents || [],
    });
    setLoading(false);
  }, [params.id]);

  const handleUpdate = async (data: StaffFormValues) => {
    setSubmitting(true);
    try {
      // Flatten and keep id/status unchanged
      const updated = {
        ...data.personalInfo,
        ...data.employment,
        address: data.address,
        nextOfKin: data.nextOfKin,
        education: data.education,
        workExperience: data.workExperience,
        bank: data.bank,
        documents: data.documents,
      };
      // Update only the fields that exist
      repo.updateStaff(params.id as string, updated);
      refresh();
      toast.success('Staff updated successfully');
      router.push(`/admin/staff/${params.id}`);
    } catch (error) {
      toast.error('Update failed');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto p-4 sm:p-6 space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => router.push(`/admin/staff/${params.id}`)}
            className="mb-2 -ml-2 text-muted-foreground hover:text-foreground gap-1.5"
          >
            <ArrowLeft className="h-4 w-4" /> Back to Staff Profile
          </Button>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">Edit Staff Member</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Update employee personal details, department placement, emergency contacts, or background records.
          </p>
        </div>
      </div>

      <StaffOnboardingForm
        defaultValues={defaultValues}
        roles={roles}
        departments={departments}
        onSubmit={handleUpdate}
        isSubmitting={submitting}
      />
    </div>
  );
}