'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { useDepartments, useStaff } from '@/features/staff/hooks/useStaff';
import { mapStaff } from '@/features/staff/api/staff.mappers';
import { toast } from 'sonner';
import { Department } from '@/types/staff';
import { Building2, UserCheck, Loader2 } from 'lucide-react';
import { DepartmentDrawerFields } from './department/DepartmentDrawerFields';
import { DepartmentArchiveSection } from './department/DepartmentArchiveSection';

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  department: Department | null;
  onSuccess: () => void;
}

export function DepartmentDrawer({ open, onOpenChange, department, onSuccess }: Props) {
  // POST/PATCH/DELETE /admin/departments. Previously local array edits against
  // a localStorage store, so nothing reached the server.
  const { create, update, remove, isMutating } = useDepartments();

  // The head picker lists real staff. `headId` is a uuid FK server-side, so the
  // option values are ids — the mock store used names interchangeably.
  const { staff } = useStaff({ limit: 100 });

  const [name, setName] = useState(department?.name || '');
  const [description, setDescription] = useState(department?.description || '');
  const [headId, setHeadId] = useState(department?.headId || 'none');
  const [confirmDelete, setConfirmDelete] = useState(false);

  // DepartmentDrawerFields types this as StaffMember[], so the DTOs go through
  // the shared mapper rather than being hand-shaped here.
  const staffList = staff.map(mapStaff);

  useEffect(() => {
    if (open) {
      setName(department?.name || '');
      setDescription(department?.description || '');
      setHeadId(department?.headId || 'none');
      setConfirmDelete(false);
    }
  }, [open, department]);

  const handleSubmit = () => {
    if (!name.trim()) return toast.error('Please enter a department name');
    if (!description.trim()) return toast.error('Please provide a brief department description');

    // 'none' is the picker's empty option. On update it means "vacate the
    // post", which the API expresses as an explicit null — omitting the field
    // would leave the current head in place instead.
    const selectedHead = headId && headId !== 'none' ? headId : null;

    if (department) {
      update(
        department.id,
        { name: name.trim(), description: description.trim(), headId: selectedHead },
        { onSuccess },
      );
      return;
    }

    create(
      {
        name: name.trim(),
        description: description.trim(),
        // On create there is no head to vacate, so null is simply omitted.
        ...(selectedHead ? { headId: selectedHead } : {}),
      },
      { onSuccess },
    );
  };

  // DELETE /admin/departments/{id}. The server refuses while staff are still
  // assigned and says how many, so that refusal surfaces as a toast from the
  // hook rather than being pre-empted here.
  const handleDelete = () => {
    if (!department) return;
    remove(department.id, { onSuccess });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-xl">
            <Building2 className="h-5 w-5 text-primary" />
            {department ? 'Edit Department' : 'Create New Department'}
          </DialogTitle>
          <DialogDescription className="text-xs">
            {department
              ? 'Update department details, description scope, or reassign the head of unit.'
              : 'Define a new corporate unit, set its functional scope, and appoint its leader.'}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-2 text-xs">
          <DepartmentDrawerFields
            name={name}
            onNameChange={setName}
            description={description}
            onDescriptionChange={setDescription}
            headId={headId}
            onHeadIdChange={setHeadId}
            staffList={staffList}
          />

          {department && (
            <DepartmentArchiveSection
              confirmDelete={confirmDelete}
              onConfirmDeleteChange={setConfirmDelete}
              onDelete={handleDelete}
            />
          )}
        </div>

        <DialogFooter className="gap-2 sm:gap-0">
          <Button variant="outline" size="sm" onClick={() => onOpenChange(false)} className="h-8.5 text-xs">
            Cancel
          </Button>
          <Button onClick={handleSubmit} disabled={isMutating} size="sm" className="h-8.5 text-xs gap-1.5">
            {isMutating ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <UserCheck className="h-3.5 w-3.5" />}
            {department ? 'Save Changes' : 'Create Department'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}