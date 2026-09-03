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
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useStaff } from '@/hooks/useStaff';
import { toast } from 'sonner';
import { Department } from '@/types/staff';
import { Building2, User, UserCheck, Trash2, Loader2, AlertCircle } from 'lucide-react';

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
          <DialogDescription>
            {department
              ? 'Update department details, description scope, or reassign the head of unit.'
              : 'Define a new corporate unit, set its functional scope, and appoint its leader.'}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-2">
          <div className="space-y-1.5">
            <Label htmlFor="dept-name">Department Name <span className="text-destructive">*</span></Label>
            <Input
              id="dept-name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Field Agents, Technology, Finance"
            />
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="dept-desc">Functional Description <span className="text-destructive">*</span></Label>
            <Textarea
              id="dept-desc"
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Describe the department's core responsibilities and focus..."
            />
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="dept-head">Department Head / Unit Lead</Label>
            <Select value={headId} onValueChange={setHeadId}>
              <SelectTrigger id="dept-head">
                <SelectValue placeholder="Select an appointed leader..." />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="none">
                  <span className="text-muted-foreground italic">No Head Appointed (Unassigned)</span>
                </SelectItem>
                {staffList.map((s) => (
                  <SelectItem key={s.id} value={s.id}>
                    {s.firstName} {s.lastName} — ({s.department || 'Staff'})
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <p className="text-[11px] text-muted-foreground">
              Department heads can review departmental requests and manage unit roles.
            </p>
          </div>

          {department && (
            <div className="pt-3 border-t">
              {confirmDelete ? (
                <div className="p-3 bg-destructive/10 border border-destructive/20 rounded-xl space-y-2">
                  <p className="text-xs font-semibold text-destructive flex items-center gap-1.5">
                    <AlertCircle className="h-4 w-4" /> Are you sure you want to archive this department?
                  </p>
                  <p className="text-[11px] text-muted-foreground">
                    This unit will be soft-deleted. Staff records linked to this department will be preserved.
                  </p>
                  <div className="flex gap-2 pt-1">
                    <Button size="sm" variant="destructive" className="h-7 text-xs" onClick={handleDelete}>
                      Yes, Archive Unit
                    </Button>
                    <Button size="sm" variant="outline" className="h-7 text-xs" onClick={() => setConfirmDelete(false)}>
                      Cancel
                    </Button>
                  </div>
                </div>
              ) : (
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="text-xs text-destructive hover:bg-destructive/10 hover:text-destructive w-full justify-start gap-2"
                  onClick={() => setConfirmDelete(true)}
                >
                  <Trash2 className="h-3.5 w-3.5" /> Archive Department
                </Button>
              )}
            </div>
          )}
        </div>

        <DialogFooter className="gap-2 sm:gap-0">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={handleSubmit} disabled={submitting} className="gap-2">
            {submitting ? <Loader2 className="h-4 w-4 animate-spin" /> : <UserCheck className="h-4 w-4" />}
            {department ? 'Save Changes' : 'Create Department'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}