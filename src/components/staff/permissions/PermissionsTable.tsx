'use client';

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { ShieldAlert, Shield, Lock, FileCheck2, Building2, Layers, CreditCard, Users, ShieldCheck, SlidersHorizontal } from 'lucide-react';
import { Permission, PermissionCategory } from '@/types/permissions';
import { StaffRole } from '@/types/staff';

interface PermissionsTableProps {
  permissions: Permission[];
  roles: StaffRole[];
  getRolesForPermission: (code: string) => StaffRole[];
}

export function PermissionsTable({
  permissions,
  getRolesForPermission,
}: PermissionsTableProps) {
  const getCategoryIcon = (category: PermissionCategory) => {
    switch (category) {
      case 'organizations':
        return Building2;
      case 'kyb':
        return FileCheck2;
      case 'modules':
        return Layers;
      case 'billing':
        return CreditCard;
      case 'users':
        return Users;
      case 'roles':
        return ShieldCheck;
      case 'system':
        return SlidersHorizontal;
      default:
        return Shield;
    }
  };

  if (permissions.length === 0) {
    return (
      <div className="text-center py-16 space-y-3">
        <Lock className="h-8 w-8 text-muted-foreground mx-auto opacity-50" />
        <p className="text-sm font-semibold">No capabilities match your query</p>
        <p className="text-xs text-muted-foreground">Try clearing filters or searching another keyword.</p>
      </div>
    );
  }

  return (
    <Table>
      <TableHeader>
        <TableRow className="bg-muted/30">
          <TableHead className="w-[30%] text-xs font-semibold">Capability / Scope</TableHead>
          <TableHead className="w-[20%] text-xs font-semibold">Category Domain</TableHead>
          <TableHead className="w-[15%] text-xs font-semibold">Access Action</TableHead>
          <TableHead className="w-[35%] text-xs font-semibold">Roles Possessing Scope</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {permissions.map((perm) => {
          const CatIcon = getCategoryIcon(perm.category);
          const possessingRoles = getRolesForPermission(perm.code);

          return (
            <TableRow key={perm.id} className="hover:bg-muted/20">
              <TableCell className="py-3">
                <div className="space-y-0.5">
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-xs text-foreground">{perm.name}</span>
                    {perm.isSensitive && (
                      <Badge variant="destructive" className="text-[10px] px-1 py-0 h-4">
                        <ShieldAlert className="h-2.5 w-2.5 mr-0.5" /> High Risk
                      </Badge>
                    )}
                  </div>
                  <span className="text-[11px] font-mono text-muted-foreground">{perm.code}</span>
                  <p className="text-[11px] text-muted-foreground/80 line-clamp-1">{perm.description}</p>
                </div>
              </TableCell>

              <TableCell className="py-3">
                <div className="flex items-center gap-1.5">
                  <CatIcon className="h-3.5 w-3.5 text-muted-foreground" />
                  <span className="text-xs capitalize">{perm.category}</span>
                </div>
              </TableCell>

              <TableCell className="py-3">
                <Badge variant="outline" className="text-[10.5px] uppercase font-mono tracking-wider">
                  {perm.action}
                </Badge>
              </TableCell>

              <TableCell className="py-3">
                <div className="flex flex-wrap gap-1">
                  {possessingRoles.slice(0, 3).map((r) => (
                    <Badge key={r.id} variant="secondary" className="text-[10.5px]">
                      {r.name}
                    </Badge>
                  ))}
                  {possessingRoles.length > 3 && (
                    <Badge variant="outline" className="text-[10px] text-muted-foreground">
                      +{possessingRoles.length - 3} more
                    </Badge>
                  )}
                </div>
              </TableCell>
            </TableRow>
          );
        })}
      </TableBody>
    </Table>
  );
}
