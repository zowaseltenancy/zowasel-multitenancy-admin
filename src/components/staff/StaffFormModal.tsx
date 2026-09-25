'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Loader2 } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { useDepartments, useStaff } from '@/features/staff/hooks/useStaff';
import { toApiStatus } from '@/features/staff/api/staff.mappers';
import { staffSchema, StaffFormValues } from './modal/staffFormSchema';
import { StaffFormFields } from './modal/StaffFormFields';

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  staff?: any | null;
  roles: any[];
  onSaved?: () => void;
}

export default function StaffFormModal({ open, onOpenChange, staff, roles, onSaved }: Props) {
  // Backed by the staff endpoints. Note what they will and will not accept:
  //
  //   POST  /admin/staff        email, firstName, lastName, departmentId, role
  //   PATCH /admin/staff/{id}   departmentId, managerId — and nothing else
  //   PUT   /admin/staff/{id}/roles    the assignable role set
  //   PATCH /admin/staff/{id}/status   the lifecycle state
  //
  // So name and email are settable only at creation, and role and status are
  // separate calls sequenced after it. `phone` cannot be saved at all — the
  // admins table has no phone column — which is why it is reported rather
  // than silently dropped.
  const { onboard, edit, assignRoles, changeStatus, isMutating: submitting } = useStaff();
  const { departments } = useDepartments({ limit: 100 });
  const [error, setError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
    reset,
  } = useForm<StaffFormValues>({
    resolver: zodResolver(staffSchema),
    defaultValues: staff
      ? {
          firstName: staff.firstName,
          lastName: staff.lastName,
          email: staff.email,
          phone: staff.phone || '',
          department: staff.department,
          roleId: staff.roleId,
          status: staff.status,
        }
      : {
          firstName: '',
          lastName: '',
          email: '',
          phone: '',
          department: '',
          roleId: '',
          status: 'active',
        },
  });

  const onSubmit = (data: StaffFormValues) => {
    setError(null);

    if (data.phone?.trim()) {
      setError('Phone numbers cannot be saved yet — the staff record has no phone field.');
    }

    // Applied after the placement write lands, so a refusal on the first call
    // does not leave the three half-saved.
    const applyRoleAndStatus = (id: string) => {
      if (data.roleId) assignRoles(id, [data.roleId]);
      changeStatus(id, toApiStatus(data.status), undefined, {
        onSuccess: () => {
          onSaved?.();
          reset();
        },
      });
    };

    if (staff) {
      edit(
        staff.id,
        { departmentId: data.department || null },
        { onSuccess: () => applyRoleAndStatus(staff.id) },
      );
      return;
    }

    onboard(
      {
        email: data.email,
        firstName: data.firstName,
        lastName: data.lastName,
        // The account's privilege tier, not the assignable role below — new
        // staff always start at the lowest tier and are promoted separately.
        role: 'STAFF',
        ...(data.department ? { departmentId: data.department } : {}),
      },
      {
        onSuccess: () => {
          onSaved?.();
          reset();
        },
      },
    );
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>{staff ? 'Edit Staff' : 'Add New Staff'}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <StaffFormFields
            register={register}
            errors={errors}
            setValue={setValue}
            watch={watch}
            roles={roles}
            departments={departments.map((d) => ({ id: d.id, name: d.name }))}
          />

          {error && <p className="text-sm text-destructive">{error}</p>}

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={submitting}>
              {submitting && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
              {staff ? 'Save Changes' : 'Create Staff'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}