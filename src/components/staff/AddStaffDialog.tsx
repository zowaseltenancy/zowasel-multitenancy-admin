'use client';
import { useState } from 'react';
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useStaff } from '@/hooks/useStaff';

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess: () => void;
}

export function AddStaffDialog({ open, onOpenChange, onSuccess }: Props) {
  const { repo } = useStaff();
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [department, setDepartment] = useState('Technology');
  const [roleId, setRoleId] = useState('');

  const roles = repo.getRoles();
  const departments = ['Technology', 'Programs', 'Fintech', 'Sales', 'Finance', 'Administration', 'Compliance', 'Regional Operations'];

  // Handlers that accept string | null and provide a safe default
  const handleDepartmentChange = (value: string | null) => {
    setDepartment(value ?? 'Technology');
  };
  const handleRoleChange = (value: string | null) => {
    setRoleId(value ?? '');
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!firstName || !lastName || !email || !roleId) return;
    repo.addStaff({
      firstName,
      lastName,
      email,
      phone,
      department,
      roleId,
      status: 'active',
    });
    onSuccess();
    // reset form
    setFirstName('');
    setLastName('');
    setEmail('');
    setPhone('');
    setDepartment('Technology');
    setRoleId('');
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Add New Staff</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4 mt-2">
          <div className="grid grid-cols-2 gap-3">
            <Input placeholder="First Name" value={firstName} onChange={e => setFirstName(e.target.value)} required />
            <Input placeholder="Last Name" value={lastName} onChange={e => setLastName(e.target.value)} required />
          </div>
          <Input type="email" placeholder="Email" value={email} onChange={e => setEmail(e.target.value)} required />
          <Input type="tel" placeholder="Phone" value={phone} onChange={e => setPhone(e.target.value)} />
          <Select value={department} onValueChange={handleDepartmentChange}>
            <SelectTrigger><SelectValue placeholder="Department" /></SelectTrigger>
            <SelectContent>
              {departments.map(d => <SelectItem key={d} value={d}>{d}</SelectItem>)}
            </SelectContent>
          </Select>
          <Select value={roleId} onValueChange={handleRoleChange}>
            <SelectTrigger><SelectValue placeholder="Select Role" /></SelectTrigger>
            <SelectContent>
              {roles.map(r => <SelectItem key={r.id} value={r.id}>{r.name}</SelectItem>)}
            </SelectContent>
          </Select>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
            <Button type="submit">Add Staff</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}