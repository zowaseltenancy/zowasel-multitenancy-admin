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
import { useStaff } from '@/hooks/useStaff';
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
  const { repo } = useStaff();
  const [name, setName] = useState(department?.name || '');
  const [description, setDescription] = useState(department?.description || '');
  const [headId, setHeadId] = useState(department?.headId || 'none');
  const [submitting, setSubmitting] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);

  const staffList = repo.getAllStaff();

  useEffect(() => {
    if (open) {
      setName(department?.name || '');
      setDescription(department?.description || '');
      setHeadId(department?.headId || 'none');
      setConfirmDelete(false);
    }
  }, [open, department]);

  const handleSubmit = async () => {
    if (!name.trim()) return toast.error('Please enter a department name');
    if (!description.trim()) return toast.error('Please provide a brief department description');

    setSubmitting(true);
    try {
      const selectedHead = headId && headId !== 'none' ? headId : null;
      if (department) {
        repo.updateDepartment(department.id, {
          name: name.trim(),
          description: description.trim(),
          headId: selectedHead,
          updatedAt: new Date().toISOString(),
        });
        toast.success(`Department "${name}" updated successfully`);
      } else {
        repo.addDepartment({
          name: name.trim(),
          description: description.trim(),
          headId: selectedHead,
        });
        toast.success(`Department "${name}" created successfully`);
      }
      onSuccess();
    } catch {
      toast.error('Failed to save department details');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = () => {
    if (!department) return;
    try {
      repo.deleteDepartment(department.id);
      toast.success(`Department "${department.name}" archived`);
      onSuccess();
    } catch {
      toast.error('Failed to archive department');
    }
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
          <Button onClick={handleSubmit} disabled={submitting} size="sm" className="h-8.5 text-xs gap-1.5">
            {submitting ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <UserCheck className="h-3.5 w-3.5" />}
            {department ? 'Save Changes' : 'Create Department'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}