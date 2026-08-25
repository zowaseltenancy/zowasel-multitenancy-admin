import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Pencil, Trash2 } from 'lucide-react';
import { DepartmentRole } from '@/types/staff';

interface Props {
  role: DepartmentRole;
  onEdit: () => void;
  onDelete: () => void;
}

export function RoleCard({ role, onEdit, onDelete }: Props) {
  const permCount = Object.keys(role.permissions).length;

  return (
    <Card className="relative group">
      <CardContent className="p-4">
        <div className="flex items-center justify-between">
          <h4 className="font-semibold text-lg">{role.name}</h4>
          <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
            <Button variant="ghost" size="icon" onClick={onEdit}><Pencil className="h-4 w-4" /></Button>
            <Button variant="ghost" size="icon" onClick={onDelete}><Trash2 className="h-4 w-4 text-destructive" /></Button>
          </div>
        </div>
        <p className="text-sm text-muted-foreground">{permCount} module{permCount !== 1 ? 's' : ''} configured</p>
      </CardContent>
    </Card>
  );
}