'use client';
import React, { useState, useEffect, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import {
  Shield,
  ShieldCheck,
  ShieldAlert,
  Plus,
  Pencil,
  Trash2,
  Users,
  Check,
  X,
  Lock,
  ChevronRight,
  Search,
  Building2,
  FileCheck2,
  Layers,
  CreditCard,
  UserCog,
  SlidersHorizontal,
  RotateCcw,
  Loader2,
  Eye,
  AlertTriangle,
  Info,
  CheckCircle2,
  ArrowRight,
  ExternalLink,
  CalendarCheck,
  Briefcase,
  Target,
  Building,
} from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { toast } from 'sonner';
import { useStaff } from '@/hooks/useStaff';
import { StaffRole, StaffMember } from '@/types/staff';
import { ALL_PERMISSIONS, PERMISSION_GROUPS, PERMISSION_CATEGORIES } from '@/constants/permissions';
import { PermissionCategory } from '@/types/permissions';
import { getDepartmentIcon } from '@/lib/departmentIcons';

type TabView = 'cards' | 'matrix' | 'catalog';

export default function RolesManagementPage() {
  const { repo, refresh, version } = useStaff();
  const router = useRouter();

  const [mounted, setMounted] = useState(false);
  const [activeTab, setActiveTab] = useState<TabView>('cards');
  const [search, setSearch] = useState('');

  // Role Form Modal State
  const [isRoleModalOpen, setIsRoleModalOpen] = useState(false);
  const [editingRole, setEditingRole] = useState<StaffRole | null>(null);
  const [roleName, setRoleName] = useState('');
  const [roleDescription, setRoleDescription] = useState('');
  const [selectedPermissions, setSelectedPermissions] = useState<string[]>([]);
  const [selectedDeptId, setSelectedDeptId] = useState<string>('');

  // Assigned Staff View Modal
  const [assignedStaffRole, setAssignedStaffRole] = useState<StaffRole | null>(null);
  const [isAssignedStaffOpen, setIsAssignedStaffOpen] = useState(false);

  const [newlyCreatedRoleId, setNewlyCreatedRoleId] = useState<string | null>(null);
  const [roles, setRoles] = useState<StaffRole[]>([]);

  useEffect(() => {
    setMounted(true);
    setRoles(repo.getRoles());
  }, [repo, version]);

  const staffList = useMemo(() => repo.getAllStaff(), [repo, version]);
  const departments = useMemo(() => repo.getDepartments(), [repo, version]);

  // Role statistics
  const stats = useMemo(() => {
    const total = roles.length;
    const system = roles.filter((r) => r.isSystemRole).length;
    const custom = total - system;
    const totalScopes = ALL_PERMISSIONS.length;
    return { total, system, custom, totalScopes };
  }, [roles]);

  // Filtered roles (excludes archived roles per soft delete backend spec)
  const filteredRoles = useMemo(() => {
    return roles.filter((r) => {
      if (r.isArchived) return false;
      const match = `${r.name || ''} ${r.description || ''}`.toLowerCase();
      return match.includes(search.toLowerCase());
    });
  }, [roles, search]);

  // Get staff count for each role (multi-role aware)
  const getStaffForRole = (roleId: string): StaffMember[] => {
    return staffList.filter((s) => s.roleId === roleId || (s.roleIds || []).includes(roleId));
  };

  const handleOpenCreateRole = () => {
    setEditingRole(null);
    setRoleName('');
    setRoleDescription('');
    setSelectedPermissions([]);
    setSelectedDeptId('');
    setIsRoleModalOpen(true);
  };

  const handleOpenEditRole = (role: StaffRole) => {
    setEditingRole(role);
    setRoleName(role.name);
    setRoleDescription(role.description || '');
    setSelectedPermissions(role.permissions || []);
    setSelectedDeptId(role.departmentId || '');
    setIsRoleModalOpen(true);
  };

  const handleOpenAssignedStaff = (role: StaffRole) => {
    setAssignedStaffRole(role);
    setIsAssignedStaffOpen(true);
  };

  const handleDeleteRole = (role: StaffRole) => {
    const res = repo.deleteRole(role.id);
    if (!res.success) {
      toast.error(res.message);
      return;
    }
    setRoles((prev) => prev.filter((r) => r.id !== role.id));
    if (newlyCreatedRoleId === role.id) setNewlyCreatedRoleId(null);
    refresh();
    toast.success(res.message);
  };

  const togglePermission = (permCode: string) => {
    setSelectedPermissions((prev) =>
      prev.includes(permCode)
        ? prev.filter((p) => p !== permCode)
        : [...prev, permCode]
    );
  };

  const toggleCategoryGroup = (category: PermissionCategory) => {
    const groupPerms = ALL_PERMISSIONS.filter((p) => p.category === category).map((p) => p.code);
    const allSelected = groupPerms.every((code) => selectedPermissions.includes(code));

    if (allSelected) {
      setSelectedPermissions((prev) => prev.filter((code) => !groupPerms.includes(code)));
    } else {
      setSelectedPermissions((prev) => Array.from(new Set([...prev, ...groupPerms])));
    }
  };

  const handleSaveRole = (e: React.FormEvent) => {
    e.preventDefault();
    if (!roleName.trim()) {
      toast.error('Please enter a role designation name.');
      return;
    }

    if (editingRole) {
      const updated = {
        name: roleName.trim(),
        description: roleDescription.trim(),
        permissions: selectedPermissions,
        departmentId: selectedDeptId || undefined,
      };
      repo.updateRole(editingRole.id, updated);
      setRoles((prev) => prev.map((r) => (r.id === editingRole.id ? { ...r, ...updated } : r)));
      toast.success(`Role "${roleName}" updated successfully.`);
    } else {
      const newRole = repo.addRole({
        name: roleName.trim(),
        description: roleDescription.trim(),
        permissions: selectedPermissions,
        isSystemRole: false,
        departmentId: selectedDeptId || undefined,
      });
      setRoles((prev) => [...prev, newRole]);
      setNewlyCreatedRoleId(newRole.id);
      setActiveTab('matrix'); // <-- Auto-switch immediately so user sees it right on the RBAC Access Matrix!
      toast.success(`New role "${roleName}" created and added to the RBAC Access Matrix.`);
    }

    refresh();
    setIsRoleModalOpen(false);
  };

  const handleToggleMatrixPermission = (role: StaffRole, permCode: string) => {
    if (role.isSystemRole) {
      toast.info('System core roles have locked scope configurations.');
      return;
    }
    const currentPerms = role.permissions || [];
    const exists = currentPerms.includes(permCode);
    const newPerms = exists
      ? currentPerms.filter((p) => p !== permCode)
      : [...currentPerms, permCode];
    repo.updateRole(role.id, { permissions: newPerms });
    setRoles((prev) => prev.map((r) => (r.id === role.id ? { ...r, permissions: newPerms } : r)));
    refresh();
    toast.success(`Updated permission "${permCode}" for ${role.name}`);
  };

  const getCategoryIcon = (category: PermissionCategory) => {
    switch (category) {
      case 'staff':
        return Users;
      case 'departments':
        return Building;
      case 'leave':
        return CalendarCheck;
      case 'leads':
        return Target;
      case 'businesses':
      case 'organizations':
        return Building2;
      case 'kyb':
        return FileCheck2;
      case 'modules':
        return Layers;
      case 'billing':
        return CreditCard;
      case 'users':
        return UserCog;
      case 'roles':
      case 'permissions':
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
      
      {/* 1. Page Header & Actions */}
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
          <span className="text-foreground font-semibold">Roles & Access Control</span>
        </nav>

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
              Roles & Scopes Management
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-0.5">
              Define corporate roles, manage RBAC permission scopes, and inspect security access matrices.
            </p>
          </div>

          {/* Action CTAs */}
          <div className="flex items-center gap-2 self-start sm:self-center shrink-0">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => router.push('/admin/staff/permissions')}
              className="h-9 px-3 text-xs font-medium gap-1.5 cursor-pointer shadow-2xs"
            >
              <FileCheck2 className="h-3.5 w-3.5 text-muted-foreground" />
              Permissions Audit
            </Button>

            <Button
              type="button"
              size="sm"
              onClick={handleOpenCreateRole}
              className="h-9 px-3.5 bg-[#00A651] hover:bg-[#008C44] text-white font-bold shadow-xs gap-1.5 cursor-pointer text-xs sm:text-sm"
            >
              <Plus className="h-4 w-4" /> Create Custom Role
            </Button>
          </div>
        </div>
      </div>

      {/* 2. Executive Metrics Summary */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3.5">
        <div className="border border-border/60 rounded-2xl bg-card p-4 shadow-2xs flex items-center justify-between">
          <div className="space-y-0.5">
            <span className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider block">
              Total Roles
            </span>
            <p className="text-2xl font-extrabold text-slate-900 dark:text-white font-mono">
              {stats.total}
            </p>
            <span className="text-[10px] text-muted-foreground block">
              Defined access templates
            </span>
          </div>
          <div className="h-10 w-10 rounded-xl bg-blue-500/10 text-blue-600 dark:text-blue-400 flex items-center justify-center shrink-0">
            <Shield className="h-5 w-5" />
          </div>
        </div>

        <div className="border border-border/60 rounded-2xl bg-card p-4 shadow-2xs flex items-center justify-between">
          <div className="space-y-0.5">
            <span className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider block">
              System Core Roles
            </span>
            <p className="text-2xl font-extrabold text-slate-900 dark:text-white font-mono">
              {stats.system}
            </p>
            <span className="text-[10px] text-[#008C44] dark:text-[#00C862] font-semibold flex items-center gap-1">
              <Lock className="h-2.5 w-2.5" /> Immutable Core
            </span>
          </div>
          <div className="h-10 w-10 rounded-xl bg-emerald-500/10 text-[#00A651] flex items-center justify-center shrink-0">
            <ShieldCheck className="h-5 w-5" />
          </div>
        </div>

        <div className="border border-border/60 rounded-2xl bg-card p-4 shadow-2xs flex items-center justify-between">
          <div className="space-y-0.5">
            <span className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider block">
              Custom Assigned
            </span>
            <p className="text-2xl font-extrabold text-slate-900 dark:text-white font-mono">
              {stats.custom}
            </p>
            <span className="text-[10px] text-muted-foreground block">
              Tenant & team defined
            </span>
          </div>
          <div className="h-10 w-10 rounded-xl bg-purple-500/10 text-purple-600 dark:text-purple-400 flex items-center justify-center shrink-0">
            <Users className="h-5 w-5" />
          </div>
        </div>

        <div className="border border-border/60 rounded-2xl bg-card p-4 shadow-2xs flex items-center justify-between">
          <div className="space-y-0.5">
            <span className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider block">
              Active Security Scopes
            </span>
            <p className="text-2xl font-extrabold text-slate-900 dark:text-white font-mono">
              {stats.totalScopes}
            </p>
            <span className="text-[10px] text-muted-foreground block">
              Granular capabilities
            </span>
          </div>
          <div className="h-10 w-10 rounded-xl bg-amber-500/10 text-amber-600 dark:text-amber-400 flex items-center justify-center shrink-0">
            <Layers className="h-5 w-5" />
          </div>
        </div>
      </div>

      {/* 3. View Switcher Tabs & Search Filter */}
      <div className="border border-border/60 rounded-2xl bg-card p-4 shadow-2xs flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        
        {/* Tab Buttons */}
        <div className="flex items-center gap-1.5 overflow-x-auto">
          {[
            { key: 'cards' as TabView, label: 'Roles Directory', icon: Shield },
            { key: 'matrix' as TabView, label: 'RBAC Access Matrix', icon: Layers },
            { key: 'catalog' as TabView, label: 'Permission Catalog', icon: FileCheck2 },
          ].map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.key;
            return (
              <button
                key={tab.key}
                type="button"
                onClick={() => setActiveTab(tab.key)}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer flex items-center gap-1.5 shrink-0 ${
                  isActive
                    ? 'bg-[#00A651] text-white shadow-2xs'
                    : 'bg-muted/40 hover:bg-muted text-muted-foreground border border-border/40'
                }`}
              >
                <Icon className="h-3.5 w-3.5" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* Search */}
        <div className="relative min-w-[220px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
          <Input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search roles or scopes..."
            className="pl-8.5 h-8.5 text-xs bg-muted/20"
          />
        </div>
      </div>

      {/* 4. Tab 1: Roles Directory (Card Grid View) */}
      {activeTab === 'cards' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredRoles.map((role) => {
            const assignedStaff = getStaffForRole(role.id);
            const permissionCount = (role.permissions || []).length;
            const isSystem = Boolean(role.isSystemRole);

            return (
              <div
                key={role.id}
                className="border border-border/60 rounded-2xl bg-card p-5 shadow-2xs flex flex-col justify-between gap-4 hover:border-border transition-all group"
              >
                {/* Card Header */}
                <div className="space-y-2">
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <div className="h-8 w-8 rounded-lg bg-[#00A651]/10 text-[#00A651] flex items-center justify-center shrink-0">
                        {isSystem ? <ShieldCheck className="h-4 w-4" /> : <Shield className="h-4 w-4" />}
                      </div>
                      <div>
                        <h3 className="font-bold text-sm text-slate-900 dark:text-slate-100">
                          {role.name}
                        </h3>
                        <span className="text-[10px] font-mono text-muted-foreground block">
                          ID: {role.id}
                        </span>
                      </div>
                    </div>

                    <Badge
                      variant="outline"
                      className={`text-[10px] font-semibold shrink-0 ${
                        isSystem
                          ? 'text-purple-600 dark:text-purple-400 border-purple-500/30 bg-purple-500/10'
                          : 'text-[#008C44] dark:text-[#00C862] border-[#00A651]/30 bg-[#00A651]/10'
                      }`}
                    >
                      {isSystem ? 'System Core' : 'Custom'}
                    </Badge>
                  </div>

                  <p className="text-xs text-slate-600 dark:text-slate-300 line-clamp-2 min-h-[32px]">
                    {role.description || 'Standard corporate access role.'}
                  </p>
                </div>

                {/* Scopes Preview Badges */}
                <div className="space-y-1.5 pt-2 border-t border-border/40">
                  <div className="flex items-center justify-between text-[11px] text-muted-foreground">
                    <span>Permission Scopes</span>
                    <span className="font-mono font-bold text-slate-800 dark:text-slate-200">
                      {isSystem && role.permissions?.length === 0 ? 'Full Root Access' : `${permissionCount} Granted`}
                    </span>
                  </div>

                  <div className="flex flex-wrap gap-1">
                    {role.permissions && role.permissions.length > 0 ? (
                      role.permissions.slice(0, 3).map((pCode) => (
                        <span
                          key={pCode}
                          className="px-2 py-0.5 rounded-md bg-muted/40 border border-border/50 font-mono text-[10px] text-muted-foreground truncate max-w-[130px]"
                        >
                          {pCode}
                        </span>
                      ))
                    ) : (
                      <span className="text-[11px] text-muted-foreground italic">
                        {isSystem ? 'All system capabilities unrestricted' : 'No explicit permissions assigned'}
                      </span>
                    )}
                    {role.permissions && role.permissions.length > 3 && (
                      <span className="px-1.5 py-0.5 rounded-md bg-muted text-[10px] font-mono text-muted-foreground font-semibold">
                        +{role.permissions.length - 3} more
                      </span>
                    )}
                  </div>
                </div>

                {/* Assigned Personnel & Card Footer Actions */}
                <div className="flex items-center justify-between pt-3 border-t border-border/40 text-xs">
                  {/* Assigned Staff Pill */}
                  <button
                    type="button"
                    onClick={() => handleOpenAssignedStaff(role)}
                    className="flex items-center gap-1.5 text-xs text-slate-700 dark:text-slate-300 font-semibold hover:text-[#00A651] transition-colors cursor-pointer"
                  >
                    <Users className="h-3.5 w-3.5 text-muted-foreground" />
                    <span>{assignedStaff.length} Assigned</span>
                  </button>

                  {/* Actions */}
                  <div className="flex items-center gap-1">
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger
                          render={
                            <Button
                              type="button"
                              variant="ghost"
                              size="sm"
                              onClick={() => handleOpenEditRole(role)}
                              className="h-7.5 px-2 text-xs text-muted-foreground hover:text-foreground cursor-pointer gap-1"
                            >
                              <Pencil className="h-3 w-3" /> Edit
                            </Button>
                          }
                        />
                        <TooltipContent side="top">Edit Role Permissions</TooltipContent>
                      </Tooltip>
                    </TooltipProvider>

                    {!isSystem && (
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger
                            render={
                              <Button
                                type="button"
                                variant="ghost"
                                size="sm"
                                onClick={() => handleDeleteRole(role)}
                                className="h-7.5 px-2 text-xs text-rose-500 hover:text-rose-600 hover:bg-rose-500/10 cursor-pointer"
                              >
                                <Trash2 className="h-3 w-3" />
                              </Button>
                            }
                          />
                          <TooltipContent side="top">Delete Custom Role</TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* 5. Tab 2: RBAC Access Control Matrix */}
      {activeTab === 'matrix' && (
        <div className="border border-border/60 rounded-2xl bg-card overflow-hidden shadow-2xs">
          <div className="p-4 border-b border-border/60 flex flex-col sm:flex-row sm:items-center justify-between gap-2 bg-muted/10">
            <div>
              <h3 className="font-bold text-sm text-slate-900 dark:text-white">
                Platform RBAC Cross-Matrix
              </h3>
              <p className="text-xs text-muted-foreground">
                Compare granted capabilities across defined roles.
              </p>
            </div>
            <div className="flex items-center gap-2 text-xs">
              <span className="flex items-center gap-1.5 text-[#008C44] dark:text-[#00C862] font-semibold">
                <CheckCircle2 className="h-3.5 w-3.5" /> Granted
              </span>
              <span className="flex items-center gap-1.5 text-muted-foreground">
                <X className="h-3.5 w-3.5 opacity-40" /> Not Allowed
              </span>
              <Button
                type="button"
                size="sm"
                onClick={handleOpenCreateRole}
                className="h-7.5 px-2.5 bg-[#00A651] hover:bg-[#008C44] text-white font-bold text-xs gap-1 cursor-pointer shadow-2xs ml-1"
              >
                <Plus className="h-3.5 w-3.5" /> Add Role
              </Button>
            </div>
          </div>

          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="bg-muted/30 border-b border-border/60">
                  <TableHead className="text-xs font-bold uppercase tracking-wider text-muted-foreground min-w-[220px] pl-5">
                    Module / Permission Scope
                  </TableHead>
                  {roles.map((r) => {
                    const isNew = r.id === newlyCreatedRoleId;
                    return (
                      <TableHead
                        key={r.id}
                        onClick={() => handleOpenEditRole(r)}
                        className={`text-xs font-bold text-center uppercase tracking-wider min-w-[130px] cursor-pointer transition-all ${
                          isNew
                            ? 'bg-emerald-500/15 text-[#008C44] dark:text-[#00C862] border-x-2 border-emerald-500/40'
                            : 'text-muted-foreground hover:bg-muted/50'
                        }`}
                        title="Click to edit role"
                      >
                        <div className="flex flex-col items-center gap-0.5">
                          <span className="block truncate font-bold hover:text-[#008C44]">{r.name}</span>
                          <div className="flex items-center gap-1">
                            <span className="text-[10px] font-mono opacity-60 normal-case">
                              {r.isSystemRole ? '(System)' : '(Custom)'}
                            </span>
                            {isNew && (
                              <Badge className="bg-[#00A651] text-white text-[9px] px-1.5 py-0 h-4 font-bold shadow-2xs">
                                New
                              </Badge>
                            )}
                          </div>
                        </div>
                      </TableHead>
                    );
                  })}
                </TableRow>
              </TableHeader>
              <TableBody>
                {PERMISSION_GROUPS.map((group) => {
                  const Icon = getCategoryIcon(group.category);
                  return (
                    <React.Fragment key={group.category}>
                      {/* Category Header Row */}
                      <TableRow className="bg-muted/40 font-semibold border-b border-border/50">
                        <TableCell colSpan={roles.length + 1} className="py-2.5 pl-5 text-xs text-slate-800 dark:text-slate-200">
                          <div className="flex items-center gap-2">
                            <Icon className="h-4 w-4 text-[#00A651]" />
                            <span>{group.label}</span>
                            <span className="text-[10px] font-mono font-normal text-muted-foreground">
                              ({group.permissions.length} capabilities)
                            </span>
                          </div>
                        </TableCell>
                      </TableRow>

                      {/* Individual Scope Rows */}
                      {group.permissions.map((perm) => (
                        <TableRow key={perm.id} className="hover:bg-muted/20 border-b border-border/40 text-xs">
                          <TableCell className="pl-6 py-2.5">
                            <div className="space-y-0.5">
                              <div className="flex items-center gap-1.5">
                                <span className="font-semibold text-slate-900 dark:text-slate-100">{perm.name}</span>
                                {perm.isSensitive && (
                                  <Badge variant="outline" className="text-[9px] px-1 py-0 text-amber-600 dark:text-amber-400 border-amber-500/30 bg-amber-500/10">
                                    Sensitive
                                  </Badge>
                                )}
                              </div>
                              <span className="text-[10.5px] text-muted-foreground font-mono block">
                                {perm.code}
                              </span>
                            </div>
                          </TableCell>

                          {roles.map((r) => {
                            const isNew = r.id === newlyCreatedRoleId;
                            const isSuperAdmin = r.id === 'role-super-admin';
                            const hasPerm = isSuperAdmin || (r.permissions || []).includes(perm.code);

                            return (
                              <TableCell
                                key={r.id}
                                className={`text-center py-2.5 ${
                                  isNew ? 'bg-emerald-500/5 border-x border-emerald-500/20' : ''
                                } ${
                                  !r.isSystemRole ? 'cursor-pointer hover:bg-muted/40 transition-colors' : ''
                                }`}
                                onClick={() => !r.isSystemRole && handleToggleMatrixPermission(r, perm.code)}
                                title={!r.isSystemRole ? `Click to toggle ${perm.name} for ${r.name}` : undefined}
                              >
                                {hasPerm ? (
                                  <span className="inline-flex items-center justify-center h-6 w-6 rounded-full bg-emerald-500/15 text-[#008C44] dark:text-[#00C862]">
                                    <Check className="h-3.5 w-3.5 stroke-[2.5]" />
                                  </span>
                                ) : (
                                  <span className="inline-flex items-center justify-center h-6 w-6 rounded-full bg-muted/30 text-muted-foreground/40">
                                    <X className="h-3 w-3" />
                                  </span>
                                )}
                              </TableCell>
                            );
                          })}
                        </TableRow>
                      ))}
                    </React.Fragment>
                  );
                })}
              </TableBody>
            </Table>
          </div>
        </div>
      )}

      {/* 6. Tab 3: Grouped Permission Catalog */}
      {activeTab === 'catalog' && (
        <div className="space-y-4">
          {PERMISSION_GROUPS.map((group) => {
            const Icon = getCategoryIcon(group.category);
            return (
              <div key={group.category} className="border border-border/60 rounded-2xl bg-card p-5 shadow-2xs space-y-3">
                <div className="flex items-start justify-between pb-2 border-b border-border/40">
                  <div className="flex items-center gap-2.5">
                    <div className="h-8 w-8 rounded-lg bg-[#00A651]/10 text-[#00A651] flex items-center justify-center shrink-0">
                      <Icon className="h-4 w-4" />
                    </div>
                    <div>
                      <h3 className="font-bold text-sm text-slate-900 dark:text-white">
                        {group.label}
                      </h3>
                      <p className="text-xs text-muted-foreground">{group.description}</p>
                    </div>
                  </div>
                  <Badge variant="outline" className="text-xs font-mono text-[#008C44] dark:text-[#00C862] border-[#00A651]/30">
                    {group.permissions.length} Scopes
                  </Badge>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {group.permissions.map((p) => (
                    <div
                      key={p.id}
                      className="p-3 rounded-xl bg-muted/20 border border-border/60 space-y-1 text-xs"
                    >
                      <div className="flex items-center justify-between gap-2">
                        <span className="font-bold text-slate-900 dark:text-slate-100">{p.name}</span>
                        <div className="flex items-center gap-1">
                          {p.isSensitive && (
                            <Badge variant="outline" className="text-[9px] px-1 py-0 text-amber-600 border-amber-500/30 bg-amber-500/10">
                              Sensitive
                            </Badge>
                          )}
                          <span className="font-mono text-[10px] text-muted-foreground px-1.5 py-0.2 rounded bg-muted">
                            {p.action}
                          </span>
                        </div>
                      </div>
                      <p className="text-xs text-muted-foreground">{p.description}</p>
                      <code className="text-[10px] font-mono text-slate-600 dark:text-slate-400 block pt-0.5">
                        {p.code}
                      </code>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* 7. Create/Edit Role Dialog */}
      <Dialog open={isRoleModalOpen} onOpenChange={setIsRoleModalOpen}>
        <DialogContent className="sm:max-w-2xl max-h-[90vh] flex flex-col p-0 overflow-hidden">
          <DialogHeader className="p-6 pb-4 border-b border-border/60">
            <div className="flex items-center gap-2">
              <div className="h-8 w-8 rounded-lg bg-[#00A651]/10 text-[#00A651] flex items-center justify-center">
                <Shield className="h-4 w-4" />
              </div>
              <div>
                <DialogTitle className="text-base font-bold">
                  {editingRole ? `Edit Role: ${editingRole.name}` : 'Create Corporate Role'}
                </DialogTitle>
                <DialogDescription className="text-xs text-muted-foreground">
                  Configure designation parameters and assign granular permission scopes.
                </DialogDescription>
              </div>
            </div>
          </DialogHeader>

          <form onSubmit={handleSaveRole} className="flex-1 overflow-y-auto p-6 space-y-4 text-xs">
            {/* Role Title & Description */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              <div className="space-y-1">
                <Label className="text-xs font-semibold">Role Name / Corporate Designation</Label>
                <Input
                  value={roleName}
                  onChange={(e) => setRoleName(e.target.value)}
                  placeholder="e.g. Agronomy Field Lead"
                  required
                  className="h-9 text-xs"
                />
              </div>

              <div className="space-y-1">
                <Label className="text-xs font-semibold">Primary Department Scope (Optional)</Label>
                <Input
                  value={selectedDeptId}
                  onChange={(e) => setSelectedDeptId(e.target.value)}
                  placeholder="e.g. Field Operations / Agronomy"
                  className="h-9 text-xs"
                />
              </div>
            </div>

            <div className="space-y-1">
              <Label className="text-xs font-semibold">Role Description</Label>
              <Textarea
                value={roleDescription}
                onChange={(e) => setRoleDescription(e.target.value)}
                placeholder="Describe responsibilities and expected platform capabilities..."
                rows={2}
                className="text-xs"
              />
            </div>

            {/* Permission Scopes Category Breakdown */}
            <div className="space-y-3 pt-2">
              <div className="flex items-center justify-between pb-1 border-b border-border/40">
                <Label className="text-xs font-bold uppercase tracking-wider text-slate-900 dark:text-white">
                  Granted Capabilities ({selectedPermissions.length} selected)
                </Label>
                <span className="text-[11px] text-muted-foreground">
                  Toggle permissions individually or select entire modules
                </span>
              </div>

              <div className="space-y-3">
                {PERMISSION_GROUPS.map((group) => {
                  const groupPermCodes = group.permissions.map((p) => p.code);
                  const isAllSelected = groupPermCodes.every((c) => selectedPermissions.includes(c));

                  return (
                    <div
                      key={group.category}
                      className="p-3.5 rounded-xl bg-muted/20 border border-border/60 space-y-2.5"
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-xs text-slate-900 dark:text-slate-100">
                          {group.label}
                        </span>
                        <button
                          type="button"
                          onClick={() => toggleCategoryGroup(group.category)}
                          className="text-[11px] font-semibold text-[#008C44] dark:text-[#00C862] hover:underline cursor-pointer"
                        >
                          {isAllSelected ? 'Deselect All' : 'Select All Module'}
                        </button>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                        {group.permissions.map((perm) => {
                          const isChecked = selectedPermissions.includes(perm.code);
                          return (
                            <label
                              key={perm.id}
                              className={`flex items-start gap-2.5 p-2 rounded-lg border transition-all cursor-pointer ${
                                isChecked
                                  ? 'bg-[#00A651]/10 border-[#00A651]/40 text-slate-900 dark:text-white'
                                  : 'bg-card border-border/60 text-muted-foreground hover:bg-muted/40'
                              }`}
                            >
                              <input
                                type="checkbox"
                                checked={isChecked}
                                onChange={() => togglePermission(perm.code)}
                                className="mt-0.5 rounded text-[#00A651] focus:ring-[#00A651] cursor-pointer"
                              />
                              <div className="min-w-0">
                                <div className="flex items-center gap-1">
                                  <span className="font-semibold text-xs text-foreground truncate">{perm.name}</span>
                                  {perm.isSensitive && (
                                    <span className="h-1.5 w-1.5 rounded-full bg-amber-500 shrink-0" title="Sensitive Scope" />
                                  )}
                                </div>
                                <span className="text-[10px] text-muted-foreground font-mono block truncate">
                                  {perm.code}
                                </span>
                              </div>
                            </label>
                          );
                        })}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            <DialogFooter className="p-4 bg-muted/20 border-t border-border/60 gap-2">
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => setIsRoleModalOpen(false)}
                className="text-xs cursor-pointer"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                size="sm"
                className="bg-[#00A651] hover:bg-[#008C44] text-white font-bold text-xs cursor-pointer"
              >
                {editingRole ? 'Save Changes' : 'Create Role'}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* 8. Assigned Staff Inspection Dialog */}
      <Dialog open={isAssignedStaffOpen} onOpenChange={setIsAssignedStaffOpen}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <div className="flex items-center gap-2">
              <div className="h-8 w-8 rounded-lg bg-blue-500/10 text-blue-600 dark:text-blue-400 flex items-center justify-center">
                <Users className="h-4 w-4" />
              </div>
              <div>
                <DialogTitle className="text-base font-bold">
                  Assigned Staff: {assignedStaffRole?.name}
                </DialogTitle>
                <DialogDescription className="text-xs text-muted-foreground">
                  Personnel currently holding this corporate role and permissions.
                </DialogDescription>
              </div>
            </div>
          </DialogHeader>

          <div className="space-y-3 py-2 text-xs">
            {assignedStaffRole && getStaffForRole(assignedStaffRole.id).length === 0 ? (
              <p className="text-muted-foreground italic text-center py-6">
                No staff members are currently assigned to this role.
              </p>
            ) : (
              <div className="space-y-2 max-h-64 overflow-y-auto pr-1">
                {assignedStaffRole &&
                  getStaffForRole(assignedStaffRole.id).map((staff) => (
                    <div
                      key={staff.id}
                      className="p-3 rounded-xl bg-muted/20 border border-border/60 flex items-center justify-between gap-3 hover:bg-muted/30 transition-colors"
                    >
                      <div className="flex items-center gap-2.5 min-w-0">
                        <div className="h-8 w-8 rounded-lg bg-muted border flex items-center justify-center font-bold text-xs uppercase">
                          {staff.firstName?.[0]}{staff.lastName?.[0]}
                        </div>
                        <div className="min-w-0">
                          <p className="font-bold text-slate-900 dark:text-slate-100 truncate">
                            {staff.firstName} {staff.lastName}
                          </p>
                          <p className="text-[11px] text-muted-foreground font-mono truncate">
                            {staff.email} · {staff.department}
                          </p>
                        </div>
                      </div>

                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => {
                          setIsAssignedStaffOpen(false);
                          router.push(`/admin/staff/${staff.id}`);
                        }}
                        className="h-7 text-xs text-[#00A651] hover:text-[#008C44] hover:bg-[#00A651]/10 gap-1 cursor-pointer shrink-0"
                      >
                        Profile <ExternalLink className="h-3 w-3" />
                      </Button>
                    </div>
                  ))}
              </div>
            )}
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => setIsAssignedStaffOpen(false)}
              className="text-xs cursor-pointer w-full"
            >
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}