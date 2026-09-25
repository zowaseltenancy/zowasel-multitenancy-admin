'use client';

import { Suspense, useEffect, useState } from 'react';
import { useRouter, useParams, useSearchParams } from 'next/navigation';
import { StaffOnboardingForm } from '@/components/staff/StaffOnboardingForm';
import {
  useAdminRoles,
  useDepartments,
  useStaff,
  useStaffMember,
} from '@/features/staff/hooks/useStaff';
import { mapAdminRole, mapStaff } from '@/features/staff/api/staff.mappers';
import { toast } from 'sonner';
import { Loader2, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { StaffFormValues } from '@/lib/validations/staff';
import { StaffMember } from '@/types/staff';

function EditStaffContent() {
  const router = useRouter();
  const params = useParams();
  const searchParams = useSearchParams();
  const stepParam = searchParams.get('step');
  // Default to 3 (the final stage of onboarding: Final Dossier Review & Provisioning)
  const initialStep = stepParam !== null ? parseInt(stepParam, 10) : 3;

  const staffId = params.id as string;

  const { edit, assignRoles, isMutating: submitting } = useStaff();
  const memberQuery = useStaffMember(staffId);
  const { roles: roleDtos } = useAdminRoles({ limit: 100 });
  const { departments: departmentDtos } = useDepartments({ limit: 100 });

  const [defaultValues, setDefaultValues] = useState<any>(null);

  const roles = roleDtos.map(mapAdminRole);
  const departments = departmentDtos.map((d) => ({ id: d.id, name: d.name }));
  const loading = memberQuery.isLoading || !defaultValues;

  useEffect(() => {
    if (memberQuery.isLoading) return;

    if (!memberQuery.data) {
      toast.error('Staff not found');
      router.push('/admin/staff/directory');
      return;
    }

    const staff = mapStaff(memberQuery.data);

    // Seeded from the server record, not from local state: the headshot, next
    // of kin and payroll account are columns on the staff record now, so the
    // form shows what is actually stored. The sections still without a home
    // server-side (biodata, education, work history, documents) stay empty
    // rather than showing a value the server does not hold.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setDefaultValues({
      personalInfo: {
        firstName: staff.firstName,
        lastName: staff.lastName,
        email: staff.email,
        phone: staff.phone ?? '',
        avatarUrl: staff.avatarUrl ?? '',
        dateOfBirth: '',
        gender: 'male',
        maritalStatus: '',
        nationality: '',
      },
      employment: {
        roleId: staff.roleId,
        // The id, matching the option values in the placement select.
        department: staff.departmentId ?? '',
        managerId: staff.manager?.id ?? '',
        employeeId: '',
        dateOfJoining: staff.dateJoined ?? '',
        employmentType: 'full-time',
        workLocation: '',
      },
      address: { line1: '', city: '', state: '', country: 'Nigeria' },
      // '' rather than undefined for each absent field: react-hook-form treats
      // undefined as "uncontrolled", which warns and leaves the input unbound.
      nextOfKin: {
        fullName:     staff.nextOfKin?.fullName ?? '',
        relationship: staff.nextOfKin?.relationship ?? '',
        phone:        staff.nextOfKin?.phone ?? '',
        email:        staff.nextOfKin?.email ?? '',
        address:      staff.nextOfKin?.address ?? '',
      },
      education: [],
      workExperience: [],
      bank: {
        bankName:      staff.bank?.bankName ?? '',
        accountNumber: staff.bank?.accountNumber ?? '',
        sortCode:      staff.bank?.sortCode ?? '',
        taxId:         staff.bank?.taxId ?? '',
      },
      documents: [],
    });
  }, [memberQuery.isLoading, memberQuery.data, router]);

  // PATCH /admin/staff/{id} takes the placement plus the headshot, next of kin
  // and payroll account. Name, email and the remaining HR sections (biodata,
  // education, work history, documents) still have no columns on the staff
  // record, so they are not sent. The assignable role is its own PUT,
  // sequenced after the placement write so a refusal on the first does not
  // leave the two half-applied.
  //
  // The sub-sections are sent as they appear on screen, blanks included: the
  // endpoint reads a wholly blank section as "clear it", which is what an
  // operator who emptied those inputs is asking for. Filtering the blanks out
  // here would make clearing a field impossible.
  const handleUpdate = (data: StaffFormValues) => {
    edit(
      staffId,
      {
        departmentId: data.employment.department || null,
        managerId: data.employment.managerId || null,
        avatarUrl: data.personalInfo.avatarUrl || null,
        nextOfKin: {
          fullName: data.nextOfKin?.fullName ?? '',
          relationship: data.nextOfKin?.relationship ?? '',
          phone: data.nextOfKin?.phone ?? '',
          email: data.nextOfKin?.email ?? '',
          address: data.nextOfKin?.address ?? '',
        },
        bank: {
          bankName: data.bank?.bankName ?? '',
          accountNumber: data.bank?.accountNumber ?? '',
          sortCode: data.bank?.sortCode ?? '',
          taxId: data.bank?.taxId ?? '',
        },
      },
      {
        onSuccess: () => {
          const finish = () => router.push(`/admin/staff/${staffId}`);
          if (data.employment.roleId) {
            assignRoles(staffId, [data.employment.roleId], { onSuccess: finish });
          } else {
            finish();
          }
        },
      },
    );
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-[#44883C]" />
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
            className="mb-2 -ml-2 text-muted-foreground hover:text-foreground gap-1.5 cursor-pointer"
          >
            <ArrowLeft className="h-4 w-4" /> Back to Staff Profile
          </Button>
        </div>
      </div>

      <StaffOnboardingForm
        // Editing an existing record validates only what this screen can save;
        // the strict onboarding schema demands six fields the staff record has
        // no column for, which made Save Changes unsubmittable.
        mode="edit"
        initialStep={initialStep}
        title="Edit Staff Member"
        submitLabel="Save Changes"
        onCancel={() => router.push(`/admin/staff/${params.id}`)}
        defaultValues={defaultValues}
        roles={roles}
        departments={departments}
        onSubmit={handleUpdate}
        isSubmitting={submitting}
      />
    </div>
  );
}

// The form schema types gender as a free string and the seeded sample data
// uses 'Male' (see onboardingConstants), while StaffMember.gender is the
// lower-case union — which is also what the profile screens assume, since they
// render it with CSS `capitalize`. Normalised here, at the one place a form
// payload becomes a StaffMember.
function toGender(value: string | undefined): StaffMember['gender'] {
  switch (value?.trim().toLowerCase()) {
    case 'male':   return 'male';
    case 'female': return 'female';
    case 'other':  return 'other';
    default:       return undefined;
  }
}

export default function EditStaffPage() {
  return (
    <Suspense
      fallback={
        <div className="flex justify-center items-center h-64">
          <Loader2 className="h-8 w-8 animate-spin text-[#44883C]" />
        </div>
      }
    >
      <EditStaffContent />
    </Suspense>
  );
}