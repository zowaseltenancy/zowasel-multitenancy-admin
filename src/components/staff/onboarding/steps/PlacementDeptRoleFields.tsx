'use client';

import { UseFormWatch, UseFormSetValue, FieldErrors } from 'react-hook-form';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { StaffFormValues } from '@/lib/validations/staff';
import { getDepartmentIcon } from '@/lib/departmentIcons';

interface PlacementDeptRoleFieldsProps {
  watch: UseFormWatch<StaffFormValues>;
  setValue: UseFormSetValue<StaffFormValues>;
  errors: FieldErrors<StaffFormValues>;
  departments: string[];
  roles: { id: string; name: string }[];
}

export function PlacementDeptRoleFields({
  watch,
  setValue,
  errors,
  departments,
  roles,
}: PlacementDeptRoleFieldsProps) {
  return (
    <>
      <div className="space-y-2">
        <Label className="text-xs sm:text-sm font-semibold text-slate-700 dark:text-slate-200 block">
          Department *
        </Label>
        <Select
          value={watch('employment.department')}
          onValueChange={(val) => {
            if (val) setValue('employment.department', val, { shouldValidate: true });
          }}
        >
          <SelectTrigger id="departmentSelect" className="h-11 text-sm rounded-xl bg-background text-slate-900 dark:text-slate-100">
            <SelectValue placeholder="Select department" />
          </SelectTrigger>
          <SelectContent>
            {departments.map((dept) => {
              const DeptIcon = getDepartmentIcon(dept);
              return (
                <SelectItem key={dept} value={dept} className="text-xs">
                  <div className="flex items-center gap-2">
                    <DeptIcon className="h-3.5 w-3.5 text-muted-foreground" />
                    <span>{dept}</span>
                  </div>
                </SelectItem>
              );
            })}
          </SelectContent>
        </Select>
        {errors.employment?.department && (
          <p className="text-[11px] text-destructive">{errors.employment.department.message}</p>
        )}
      </div>

      <div className="space-y-2">
        <Label className="text-xs sm:text-sm font-semibold text-slate-700 dark:text-slate-200 block">
          Designated Role *
        </Label>
        <Select
          value={watch('employment.roleId')}
          onValueChange={(val) => {
            if (val) setValue('employment.roleId', val, { shouldValidate: true });
          }}
        >
          <SelectTrigger id="roleSelect" className="h-11 text-sm rounded-xl bg-background text-slate-900 dark:text-slate-100">
            <SelectValue placeholder="Select corporate role" />
          </SelectTrigger>
          <SelectContent>
            {roles.map((role) => (
              <SelectItem key={role.id} value={role.id} className="text-xs">
                {role.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        {errors.employment?.roleId && (
          <p className="text-[11px] text-destructive">{errors.employment.roleId.message}</p>
        )}
      </div>
    </>
  );
}