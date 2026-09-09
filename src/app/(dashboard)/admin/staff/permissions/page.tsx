'use client';

import { useState, useEffect, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import {
  Search,
  ArrowLeft,
  Loader2,
} from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useStaff } from '@/hooks/useStaff';
import { ALL_PERMISSIONS, PERMISSION_CATEGORIES } from '@/constants/permissions';
import { PermissionsTable } from '@/components/staff/permissions/PermissionsTable';
import { PermissionsStatsCards } from '@/components/staff/permissions/PermissionsStatsCards';

export default function PermissionsAuditPage() {
  const { repo } = useStaff();
  const router = useRouter();

  const [mounted, setMounted] = useState(false);
  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [onlySensitive, setOnlySensitive] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const roles = useMemo(() => repo.getRoles(), [repo]);

  const filteredPermissions = useMemo(() => {
    return ALL_PERMISSIONS.filter((perm) => {
      const matchText = `${perm.name} ${perm.code} ${perm.description}`.toLowerCase();
      const matchesSearch = matchText.includes(search.toLowerCase());
      const matchesCategory = categoryFilter === 'all' || perm.category === categoryFilter;
      const matchesSensitive = onlySensitive ? Boolean(perm.isSensitive) : true;
      return matchesSearch && matchesCategory && matchesSensitive;
    });
  }, [search, categoryFilter, onlySensitive]);

  const sensitiveCount = useMemo(
    () => ALL_PERMISSIONS.filter((p) => p.isSensitive).length,
    []
  );

  const getRolesForPermission = (permCode: string) => {
    return roles.filter((role) => {
      if (role.id === 'role-super-admin') return true;
      return (role.permissions || []).includes(permCode);
    });
  };

  if (!mounted) {
    return (
      <div className="p-8 flex justify-center items-center min-h-[400px]">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-6 max-w-7xl mx-auto">
      <div>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => router.push('/admin/staff/roles')}
          className="mb-2 -ml-2 text-muted-foreground hover:text-foreground gap-1.5"
        >
          <ArrowLeft className="h-4 w-4" /> Back to Roles & Access
        </Button>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">Permissions Catalogue</h1>
            <p className="text-xs text-muted-foreground mt-0.5">
              Comprehensive registry of system permissions, access actions, and sensitive capabilities.
            </p>
          </div>
        </div>
      </div>

      <PermissionsStatsCards
        totalScopes={ALL_PERMISSIONS.length}
        sensitiveCount={sensitiveCount}
        categoriesCount={Object.keys(PERMISSION_CATEGORIES).length}
        rolesCount={roles.length}
      />

      <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="relative flex-1 w-full max-w-sm">
          <Search className="absolute left-2.5 top-2.5 h-3.5 w-3.5 text-muted-foreground" />
          <Input
            placeholder="Search capability or code..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-8 h-8.5 text-xs"
          />
        </div>
        <Select value={categoryFilter} onValueChange={setCategoryFilter}>
          <SelectTrigger className="w-full sm:w-48 h-8.5 text-xs">
            <SelectValue placeholder="All Categories" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all" className="text-xs">All Categories</SelectItem>
            {Object.entries(PERMISSION_CATEGORIES).map(([cat, meta]) => (
              <SelectItem key={cat} value={cat} className="text-xs">{meta.label}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <Card className="border rounded-xl bg-card overflow-hidden shadow-2xs">
        <CardContent className="p-0">
          <PermissionsTable
            permissions={filteredPermissions}
            roles={roles}
            getRolesForPermission={getRolesForPermission}
          />
        </CardContent>
      </Card>
    </div>
  );
}
