import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Checkbox } from '@/components/ui/checkbox';
import { toast } from 'sonner';
import { useStaff } from '@/hooks/useStaff';
import { PERMISSION_MODULES } from '@/config/permissions';
import { DepartmentRole, PermissionSet } from '@/types/staff';

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  departmentId: string;
  existingRole: DepartmentRole | null;
  onSave: (role: DepartmentRole) => void;
}

const EMPTY_PERMISSION: PermissionSet = {
  read: false,
  write: false,
  approve: false,
  delete: false,
};

export function RoleBuilderDialog({
  open,
  onOpenChange,
  departmentId,
  existingRole,
  onSave,
}: Props) {
  const { repo } = useStaff(); // ✅ now available
  const [name, setName] = useState(existingRole?.name || '');
  const [permissions, setPermissions] = useState<Record<string, PermissionSet>>({});

  useEffect(() => {
    if (open) {
      setName(existingRole?.name || '');
      const initPerms: Record<string, PermissionSet> = {};
      PERMISSION_MODULES.forEach((mod) => {
        initPerms[mod.key] =
          existingRole?.permissions?.[mod.key] ?? { ...EMPTY_PERMISSION };
      });
      setPermissions(initPerms);
    }
  }, [open, existingRole]);

  const togglePermission = (moduleKey: string, action: keyof PermissionSet) => {
    setPermissions((prev) => ({
      ...prev,
      [moduleKey]: {
        ...prev[moduleKey],
        [action]: !prev[moduleKey]?.[action],
      },
    }));
  };

  const handleSave = () => {
    if (!name.trim()) return toast.error('Role name required');
    const newRole: DepartmentRole = {
      id: existingRole?.id || `drole-${Date.now()}`,
      departmentId,
      name,
      permissions,
    };
    onSave(newRole);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {existingRole ? 'Edit Role' : 'Create Department Role'}
          </DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div>
            <Label htmlFor="roleName">Role Name *</Label>
            <Input
              id="roleName"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Lead Developer"
            />
          </div>

          <div className="border rounded-lg">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-40">Module</TableHead>
                  <TableHead className="text-center">Read</TableHead>
                  <TableHead className="text-center">Write</TableHead>
                  <TableHead className="text-center">Approve</TableHead>
                  <TableHead className="text-center">Delete</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {PERMISSION_MODULES.map((mod) => (
                  <TableRow key={mod.key}>
                    <TableCell className="font-medium">
                      <div className="flex items-center gap-2">
                        {mod.icon && <mod.icon className="h-4 w-4 text-muted-foreground" />}
                        {mod.label}
                      </div>
                    </TableCell>
                    <TableCell className="text-center">
                      <Checkbox
                        checked={permissions[mod.key]?.read || false}
                        onCheckedChange={() => togglePermission(mod.key, 'read')}
                      />
                    </TableCell>
                    {/* … other actions … */}
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          <Button onClick={handleSave} className="w-full">
            Save Role
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}