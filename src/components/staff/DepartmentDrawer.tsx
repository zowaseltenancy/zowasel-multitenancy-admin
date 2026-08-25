'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useStaff } from '@/hooks/useStaff';
import { toast } from 'sonner';
import { Department } from '@/types/staff';


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
  const [headId, setHeadId] = useState(department?.headId || '');
  const [submitting, setSubmitting] = useState(false);

  const staffList = repo.getAllStaff();

  useEffect(() => {
    if (open) {
      setName(department?.name || '');
      setDescription(department?.description || '');
      setHeadId(department?.headId || '');
    }
  }, [open, department]);

  const handleSubmit = async () => {
    if (!name.trim()) return toast.error('Name required');
    setSubmitting(true);
    try {
      if (department) {
        repo.updateDepartment(department.id, { name, description, headId: headId || null, updatedAt: new Date().toISOString() });
      } else {
        repo.addDepartment({ name, description, headId: headId || null });
      }
      toast.success(department ? 'Department updated' : 'Department created');
      onSuccess();
    } catch {
      toast.error('Error saving department');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{department ? 'Edit Department' : 'New Department'}</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div>
            <Label htmlFor="name">Department Name *</Label>
            <Input id="name" value={name} onChange={e => setName(e.target.value)} placeholder="e.g. Technology" />
          </div>
          <div>
            <Label htmlFor="desc">Description</Label>
            <Textarea id="desc" value={description} onChange={e => setDescription(e.target.value)} placeholder="Brief description..." />
          </div>
          <div>
            <Label>Department Head</Label>
            <Select value={headId} onValueChange={setHeadId}>
              <SelectTrigger>
                <SelectValue placeholder="Select a staff member" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value=" ">None</SelectItem> {/* null value workaround */}
                {staffList.map(s => (
                  <SelectItem key={s.id} value={s.id}>
                    {s.firstName} {s.lastName} ({s.department})
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <Button onClick={handleSubmit} disabled={submitting} className="w-full">
            {submitting ? 'Saving...' : department ? 'Update Department' : 'Create Department'}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}