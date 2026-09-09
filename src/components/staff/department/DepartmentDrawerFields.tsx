'use client';

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
import { StaffMember } from '@/types/staff';

interface DepartmentDrawerFieldsProps {
  name: string;
  onNameChange: (val: string) => void;
  description: string;
  onDescriptionChange: (val: string) => void;
  headId: string;
  onHeadIdChange: (val: string) => void;
  staffList: StaffMember[];
}

export function DepartmentDrawerFields({
  name,
  onNameChange,
  description,
  onDescriptionChange,
  headId,
  onHeadIdChange,
  staffList,
}: DepartmentDrawerFieldsProps) {
  return (
    <>
      <div className="space-y-1.5">
        <Label htmlFor="dept-name">
          Department Name <span className="text-destructive">*</span>
        </Label>
        <Input
          id="dept-name"
          value={name}
          onChange={(e) => onNameChange(e.target.value)}
          placeholder="e.g. Field Agents, Technology, Finance"
          className="h-9 text-xs"
        />
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="dept-desc">
          Functional Description <span className="text-destructive">*</span>
        </Label>
        <Textarea
          id="dept-desc"
          rows={3}
          value={description}
          onChange={(e) => onDescriptionChange(e.target.value)}
          placeholder="Describe the department's core responsibilities and focus..."
          className="text-xs resize-none"
        />
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="dept-head">Department Head / Unit Lead</Label>
        <Select value={headId} onValueChange={onHeadIdChange}>
          <SelectTrigger id="dept-head" className="h-9 text-xs">
            <SelectValue placeholder="Select an appointed leader..." />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="none" className="text-xs">
              <span className="text-muted-foreground italic">No Head Appointed (Unassigned)</span>
            </SelectItem>
            {staffList.map((s) => (
              <SelectItem key={s.id} value={s.id} className="text-xs">
                {s.firstName} {s.lastName} — ({s.department || 'Staff'})
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </>
  );
}