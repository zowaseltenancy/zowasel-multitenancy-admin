'use client';

import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Pencil, Trash2, Shield } from 'lucide-react';
import { DepartmentRole } from '@/types/staff';

interface Props {
  role: DepartmentRole;
  onEdit: () => void;
  onDelete: () => void;
}

export function RoleCard({ role, onEdit, onDelete }: Props) {
  const isArrayPerms = Array.isArray(role?.permissions);
  const permissionsList = isArrayPerms ? (role.permissions as string[]) : [];
  const permissionsObj = !isArrayPerms && role?.permissions ? (role.permissions as Record<string, any>) : {};
  const activeModules = Object.entries(permissionsObj).filter(
    ([, permSet]) => permSet && (permSet.read || permSet.write || permSet.approve || permSet.delete)
  );

  return (
    <Card className="relative group border rounded-2xl bg-card hover:shadow-xs transition-all">
      <CardContent className="p-4 space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-lg bg-primary/10 flex items-center justify-center text-primary">
              <Shield className="h-4 w-4" />
            </div>
            <div>
              <h4 className="font-bold text-base text-foreground">{role.name}</h4>
              {role.description && (
                <p className="text-xs text-muted-foreground line-clamp-1">{role.description}</p>
              )}
            </div>
          </div>
          <div className="flex gap-1">
            <Button variant="ghost" size="icon" className="h-8 w-8 cursor-pointer" onClick={onEdit}>
              <Pencil className="h-3.5 w-3.5" />
            </Button>
            <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive hover:text-destructive cursor-pointer" onClick={onDelete}>
              <Trash2 className="h-3.5 w-3.5" />
            </Button>
          </div>
        </div>

        <div className="flex flex-wrap gap-1.5 pt-1">
          {isArrayPerms ? (
            permissionsList.length === 0 ? (
              <span className="text-xs text-muted-foreground italic">No scopes configured</span>
            ) : (
              permissionsList.map((code) => (
                <Badge key={code} variant="secondary" className="text-[10px] font-mono font-medium">
                  {code}
                </Badge>
              ))
            )
          ) : activeModules.length === 0 ? (
            <span className="text-xs text-muted-foreground italic">No permissions configured</span>
          ) : (
            activeModules.map(([modKey, perm]) => (
              <Badge key={modKey} variant="secondary" className="text-[10px] font-medium capitalize">
                {modKey}: {Object.entries(perm).filter(([, v]) => v).map(([k]) => k).join(', ')}
              </Badge>
            ))
          )}
        </div>
      </CardContent>
    </Card>
  );
}