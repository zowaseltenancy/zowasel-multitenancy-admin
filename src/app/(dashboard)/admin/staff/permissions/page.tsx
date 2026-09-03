'use client';

import { useState, useEffect, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import {
  FileCheck2,
  Shield,
  ShieldAlert,
  ShieldCheck,
  Search,
  Filter,
  ArrowLeft,
  Building2,
  Layers,
  CreditCard,
  Users,
  SlidersHorizontal,
  Lock,
  CheckCircle2,
  Info,
  ChevronRight,
  Loader2,
} from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useStaff } from '@/hooks/useStaff';
import { ALL_PERMISSIONS, PERMISSION_CATEGORIES, PERMISSION_GROUPS } from '@/constants/permissions';
import { PermissionCategory } from '@/types/permissions';

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

  // Filter permissions
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

  if (!mounted) {
    return (
      <div className="p-8 flex justify-center items-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-[#00A651]" />
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12">
      
      {/* 1. Header & Breadcrumbs */}
      <div className="space-y-3 pb-1 border-b border-border/60">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-1.5 text-xs text-muted-foreground font-medium">
          <button
            type="button"
            onClick={() => router.push('/admin/staff/directory')}
            className="hover:text-foreground transition-colors cursor-pointer"
          >
            Staff Management
          </button>
          <ChevronRight className="h-3.5 w-3.5 opacity-50" />
          <button
            type="button"
            onClick={() => router.push('/admin/staff/roles')}
            className="hover:text-foreground transition-colors cursor-pointer"
          >
            Roles & Scopes
          </button>
          <ChevronRight className="h-3.5 w-3.5 opacity-50" />
          <span className="text-foreground font-semibold">Permissions Audit</span>
        </nav>

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
              Platform Permissions Audit
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-0.5">
              Inspect all {ALL_PERMISSIONS.length} granular security actions, audit assigned roles, and review elevated privilege scopes.
            </p>
          </div>

          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => router.push('/admin/staff/roles')}
            className="h-9 px-3 text-xs font-medium gap-1.5 cursor-pointer shadow-2xs self-start sm:self-center"
          >
            <ArrowLeft className="h-3.5 w-3.5" /> Back to Roles
          </Button>
        </div>
      </div>

      {/* 2. Top Executive Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3.5">
        <div className="border border-border/60 rounded-2xl bg-card p-4 shadow-2xs flex items-center justify-between">
          <div className="space-y-0.5">
            <span className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider block">
              Total Scopes
            </span>
            <p className="text-2xl font-extrabold text-slate-900 dark:text-white font-mono">
              {ALL_PERMISSIONS.length}
            </p>
            <span className="text-[10px] text-muted-foreground block">
              Platform-wide capabilities
            </span>
          </div>
          <div className="h-10 w-10 rounded-xl bg-blue-500/10 text-blue-600 dark:text-blue-400 flex items-center justify-center shrink-0">
            <FileCheck2 className="h-5 w-5" />
          </div>
        </div>

        <div className="border border-border/60 rounded-2xl bg-card p-4 shadow-2xs flex items-center justify-between">
          <div className="space-y-0.5">
            <span className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider block">
              Sensitive Scopes
            </span>
            <p className="text-2xl font-extrabold text-amber-600 dark:text-amber-400 font-mono">
              {sensitiveCount}
            </p>
            <span className="text-[10px] text-muted-foreground block">
              Requires elevated authorization
            </span>
          </div>
          <div className="h-10 w-10 rounded-xl bg-amber-500/10 text-amber-600 dark:text-amber-400 flex items-center justify-center shrink-0">
            <ShieldAlert className="h-5 w-5" />
          </div>
        </div>

        <div className="border border-border/60 rounded-2xl bg-card p-4 shadow-2xs flex items-center justify-between">
          <div className="space-y-0.5">
            <span className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider block">
              Functional Modules
            </span>
            <p className="text-2xl font-extrabold text-slate-900 dark:text-white font-mono">
              {PERMISSION_GROUPS.length}
            </p>
            <span className="text-[10px] text-muted-foreground block">
              Domain categories
            </span>
          </div>
          <div className="h-10 w-10 rounded-xl bg-purple-500/10 text-purple-600 dark:text-purple-400 flex items-center justify-center shrink-0">
            <Layers className="h-5 w-5" />
          </div>
        </div>

        <div className="border border-border/60 rounded-2xl bg-card p-4 shadow-2xs flex items-center justify-between">
          <div className="space-y-0.5">
            <span className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider block">
              Configured Roles
            </span>
            <p className="text-2xl font-extrabold text-slate-900 dark:text-white font-mono">
              {roles.length}
            </p>
            <span className="text-[10px] text-[#008C44] dark:text-[#00C862] font-semibold block">
              RBAC templates active
            </span>
          </div>
          <div className="h-10 w-10 rounded-xl bg-emerald-500/10 text-[#00A651] flex items-center justify-center shrink-0">
            <ShieldCheck className="h-5 w-5" />
          </div>
        </div>
      </div>

      {/* 3. Search & Filter Bar */}
      <div className="border border-border/60 rounded-2xl bg-card p-4 shadow-2xs flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 flex-1">
          {/* Search */}
          <div className="relative flex-1 min-w-[220px]">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
            <Input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search permission code, name, or description..."
              className="pl-8.5 h-9 text-xs bg-muted/20"
            />
          </div>

          {/* Category Dropdown */}
          <Select value={categoryFilter} onValueChange={setCategoryFilter}>
            <SelectTrigger className="h-9 text-xs w-full sm:w-52">
              <SelectValue placeholder="All Categories" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all" className="text-xs">All Categories</SelectItem>
              {PERMISSION_GROUPS.map((g) => (
                <SelectItem key={g.category} value={g.category} className="text-xs">
                  {g.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Sensitive Toggle */}
        <button
          type="button"
          onClick={() => setOnlySensitive(!onlySensitive)}
          className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer flex items-center gap-1.5 self-start md:self-auto shrink-0 ${
            onlySensitive
              ? 'bg-amber-500 text-white shadow-2xs'
              : 'bg-muted/40 hover:bg-muted text-muted-foreground border border-border/40'
          }`}
        >
          <ShieldAlert className="h-3.5 w-3.5" />
          <span>Sensitive Scopes Only ({sensitiveCount})</span>
        </button>
      </div>

      {/* 4. Permissions Audit Table */}
      <div className="border border-border/60 rounded-2xl bg-card overflow-hidden shadow-2xs">
        <Table>
          <TableHeader>
            <TableRow className="bg-muted/30 border-b border-border/60">
              <TableHead className="text-xs font-bold uppercase tracking-wider text-muted-foreground min-w-[200px] pl-5">
                Permission Scope
              </TableHead>
              <TableHead className="text-xs font-bold uppercase tracking-wider text-muted-foreground min-w-[140px]">
                Domain Category
              </TableHead>
              <TableHead className="text-xs font-bold uppercase tracking-wider text-muted-foreground min-w-[90px]">
                Action
              </TableHead>
              <TableHead className="text-xs font-bold uppercase tracking-wider text-muted-foreground min-w-[240px]">
                Granted Corporate Roles
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredPermissions.length === 0 ? (
              <TableRow>
                <TableCell colSpan={4} className="h-48 text-center text-muted-foreground">
                  <div className="flex flex-col items-center justify-center gap-2">
                    <Info className="h-6 w-6 opacity-40" />
                    <p className="font-semibold text-xs text-foreground">No permissions found matching search filters</p>
                  </div>
                </TableCell>
              </TableRow>
            ) : (
              filteredPermissions.map((perm) => {
                const assignedRoles = getRolesForPermission(perm.code);
                const Icon = getCategoryIcon(perm.category);

                return (
                  <TableRow key={perm.id} className="hover:bg-muted/20 border-b border-border/40 text-xs">
                    {/* Permission Name & Code */}
                    <TableCell className="pl-5 py-3">
                      <div className="space-y-0.5">
                        <div className="flex items-center gap-1.5">
                          <span className="font-bold text-slate-900 dark:text-slate-100">{perm.name}</span>
                          {perm.isSensitive && (
                            <Badge variant="outline" className="text-[9px] px-1.5 py-0 text-amber-600 dark:text-amber-400 border-amber-500/30 bg-amber-500/10">
                              Sensitive Scope
                            </Badge>
                          )}
                        </div>
                        <p className="text-xs text-muted-foreground">{perm.description}</p>
                        <code className="text-[10.5px] font-mono text-slate-600 dark:text-slate-400 block pt-0.5">
                          {perm.code}
                        </code>
                      </div>
                    </TableCell>

                    {/* Domain Category */}
                    <TableCell className="py-3">
                      <div className="flex items-center gap-1.5 text-xs text-slate-700 dark:text-slate-300 font-medium">
                        <Icon className="h-3.5 w-3.5 text-muted-foreground shrink-0" />
                        <span className="capitalize">{PERMISSION_CATEGORIES[perm.category]?.label || perm.category}</span>
                      </div>
                    </TableCell>

                    {/* Action Type */}
                    <TableCell className="py-3">
                      <Badge variant="outline" className="font-mono text-[10px] capitalize px-2 py-0.5">
                        {perm.action}
                      </Badge>
                    </TableCell>

                    {/* Granted Roles */}
                    <TableCell className="py-3">
                      <div className="flex flex-wrap gap-1">
                        {assignedRoles.map((r) => (
                          <span
                            key={r.id}
                            className={`px-2 py-0.5 rounded-md text-[10.5px] font-semibold border ${
                              r.id === 'role-super-admin'
                                ? 'bg-purple-500/10 text-purple-600 dark:text-purple-400 border-purple-500/30'
                                : 'bg-muted/40 text-slate-700 dark:text-slate-300 border-border/60'
                            }`}
                          >
                            {r.name}
                          </span>
                        ))}
                      </div>
                    </TableCell>
                  </TableRow>
                );
              })
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
