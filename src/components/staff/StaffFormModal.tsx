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
import { useStaff } from '@/hooks/useStaff';
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
  const { repo } = useStaff();
  const [submitting, setSubmitting] = useState(false);
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

  const onSubmit = async (data: StaffFormValues) => {
    setSubmitting(true);
    setError(null);
    try {
      if (staff) {
        repo.updateStaff(staff.id, data);
      } else {
        repo.addStaff(data);
      }
      onSaved?.();
      reset();
    } catch (err: any) {
      setError(err.message || 'Something went wrong');
    } finally {
      setSubmitting(false);
    }
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