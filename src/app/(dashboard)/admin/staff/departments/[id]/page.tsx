'use client';

import { Suspense, useEffect, useState, useMemo } from 'react';
import { useParams, useRouter, useSearchParams } from 'next/navigation';
import { useStaff } from '@/hooks/useStaff';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  ArrowLeft,
  Users,
  UserCheck,
  UserX,
  Settings,
  Edit3,
  Plus,
  Mail,
  Phone,
  Building2,
  ShieldCheck,
  UserPlus,
  Search,
  Loader2,
} from 'lucide-react';
import { Department, StaffMember, DepartmentRole } from '@/types/staff';
import { StaffListTable } from '@/components/staff/StaffListTable';
import { DepartmentDrawer } from '@/components/staff/DepartmentDrawer';
import { RoleCard } from '@/components/staff/RoleCard';
import { RoleBuilderDialog } from '@/components/staff/RoleBuilderDialog';
import { getDepartmentIcon } from '@/lib/departmentIcons';
import { cn } from '@/lib/utils';

function DepartmentDetailContent() {
  const params = useParams();
  const router = useRouter();
  const searchParams = useSearchParams();
  const tabParam = searchParams?.get('tab');

  const { repo, refresh } = useStaff();
  const [mounted, setMounted] = useState(false);
  const [dept, setDept] = useState<Department | null>(null);
  const [members, setMembers] = useState<StaffMember[]>([]);
  const [roles, setRoles] = useState<DepartmentRole[]>([]);
  const [activeTab, setActiveTab] = useState(tabParam === 'roles' ? 'roles' : 'members');
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [roleDialogOpen, setRoleDialogOpen] = useState(false);
  const [editingRole, setEditingRole] = useState<DepartmentRole | null>(null);
  const [memberSearch, setMemberSearch] = useState('');

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted) return;
    const rawParam = params?.id;
    const rawId = Array.isArray(rawParam) ? rawParam[0] : (rawParam as string);
    if (!rawId) return;

    const allDepts = repo.getDepartments();
    const decoded = decodeURIComponent(rawId).toLowerCase().trim();

    const d = (allDepts || []).find(
      (item) =>
        item &&
        (item.id === rawId ||
          (item.name || '').toLowerCase() === decoded ||
          (item.name || '').toLowerCase().replace(/\s+/g, '-') === decoded)
    );

    if (d) {
      setDept(d);
      setMembers((repo.getAllStaff() || []).filter((s) => s && s.department === d.name));
      setRoles(repo.getDepartmentRoles(d.id) || []);
    }
  }, [mounted, params?.id, repo]);

  const handleRoleSave = (role: DepartmentRole) => {
    if (editingRole) {
      repo.updateDepartmentRole(role.id, role);
    } else {
      repo.addDepartmentRole(role);
    }
    refresh();
    setRoleDialogOpen(false);
    setEditingRole(null);
    if (dept) {
      setRoles(repo.getDepartmentRoles(dept.id) || []);
    }
  };

  const filteredMembers = useMemo(() => {
    if (!memberSearch.trim()) return members;
    const query = memberSearch.toLowerCase();
    return (members || []).filter(
      (m) =>
        m &&
        ((m.firstName || '').toLowerCase().includes(query) ||
          (m.lastName || '').toLowerCase().includes(query) ||
          (m.email || '').toLowerCase().includes(query))
    );
  }, [members, memberSearch]);

  if (!mounted) {
    return (
      <div className="p-8 flex justify-center items-center min-h-[400px]">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!dept) {
    return (
      <div className="p-8 max-w-lg mx-auto text-center space-y-4 py-16">
        <Building2 className="h-12 w-12 text-muted-foreground mx-auto opacity-50" />
        <h2 className="text-xl font-bold">Department Not Found</h2>
        <p className="text-sm text-muted-foreground">
          The requested department could not be located or may have been archived.
        </p>
        <Button onClick={() => router.push('/admin/staff/departments')} className="gap-2">
          <ArrowLeft className="h-4 w-4" /> Back to Departments
        </Button>
      </div>
    );
  }

  const head = dept.headId ? repo.getStaffById(dept.headId) : null;
  const headInitials = head
    ? `${head.firstName?.[0] || ''}${head.lastName?.[0] || ''}`.toUpperCase()
    : null;

  const DeptIcon = getDepartmentIcon(dept.name);

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-6 max-w-6xl mx-auto">
      {/* Back Button & Top Navigation */}
      <div>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => router.push('/admin/staff/departments')}
          className="mb-2 -ml-2 text-muted-foreground hover:text-foreground gap-1.5"
        >
          <ArrowLeft className="h-4 w-4" /> Back to Departments
        </Button>

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-xl bg-muted flex items-center justify-center text-foreground shrink-0 border">
                <DeptIcon className="h-5 w-5" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">{dept.name}</h1>
                  <Badge variant="secondary" className="text-xs">
                    {members.length} {members.length === 1 ? 'member' : 'members'}
                  </Badge>
                </div>
                <p className="text-sm text-muted-foreground mt-0.5">{dept.description || 'Department details and overview'}</p>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" onClick={() => setDrawerOpen(true)} className="gap-1.5">
              <Edit3 className="h-4 w-4" /> Edit Department
            </Button>
            <Button size="sm" onClick={() => router.push('/admin/staff/onboarding')} className="gap-1.5">
              <UserPlus className="h-4 w-4" /> Onboard Staff
            </Button>
          </div>
        </div>
      </div>

      {/* KPI Cards & Leadership Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Leadership Profile Card */}
        <Card className="bg-card border rounded-xl shadow-2xs md:col-span-2">
          <CardContent className="p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              {head ? (
                head.avatarUrl ? (
                  <img
                    src={head.avatarUrl}
                    alt={head.firstName}
                    className="h-12 w-12 rounded-full object-cover border"
                  />
                ) : (
                  <div className="h-12 w-12 rounded-full bg-muted text-foreground font-semibold text-base flex items-center justify-center border">
                    {headInitials}
                  </div>
                )
              ) : (
                <div className="h-12 w-12 rounded-full bg-muted text-muted-foreground font-semibold text-base flex items-center justify-center border border-dashed">
                  <UserX className="h-5 w-5" />
                </div>
              )}

              <div>
                <div className="flex items-center gap-2">
                  <span className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
                    Department Head
                  </span>
                  {head && (
                    <Badge variant="secondary" className="text-[10px]">
                      Appointed
                    </Badge>
                  )}
                </div>

                <p className="font-semibold text-base text-foreground mt-0.5">
                  {head ? `${head.firstName} ${head.lastName}` : 'No Department Head Appointed'}
                </p>

                {head ? (
                  <div className="flex flex-wrap items-center gap-3 text-xs text-muted-foreground mt-1">
                    <span className="flex items-center gap-1"><Mail className="h-3 w-3" /> {head.email}</span>
                    {head.phone && <span className="flex items-center gap-1"><Phone className="h-3 w-3" /> {head.phone}</span>}
                  </div>
                ) : (
                  <p className="text-xs text-muted-foreground mt-0.5">
                    Assign an appointed leader to oversee departmental approvals and team operations.
                  </p>
                )}
              </div>
            </div>

            <Button
              variant="outline"
              size="sm"
              className="shrink-0 text-xs gap-1.5"
              onClick={() => setDrawerOpen(true)}
            >
              <UserCheck className="h-3.5 w-3.5" />
              {head ? 'Reassign Head' : 'Appoint Head'}
            </Button>
          </CardContent>
        </Card>

        {/* Headcount Stat Card */}
        <Card className="bg-card border rounded-xl shadow-2xs flex flex-col justify-center">
          <CardContent className="p-5 flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Department Size</p>
              <p className="text-2xl font-bold text-foreground mt-1">{members.length}</p>
              <p className="text-xs text-muted-foreground mt-0.5">Active assigned team members</p>
            </div>
            <div className="h-10 w-10 rounded-lg bg-muted flex items-center justify-center text-muted-foreground">
              <Users className="h-5 w-5" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Tabbed Content: Members vs Roles */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b pb-3">
          <TabsList className="bg-muted/40 p-1 rounded-xl">
            <TabsTrigger value="members" className="gap-2 text-xs font-semibold rounded-lg">
              <Users className="h-3.5 w-3.5" />
              Department Members ({members.length})
            </TabsTrigger>
            <TabsTrigger value="roles" className="gap-2 text-xs font-semibold rounded-lg">
              <ShieldCheck className="h-3.5 w-3.5" />
              Scoped Roles ({roles.length})
            </TabsTrigger>
          </TabsList>

          {activeTab === 'members' ? (
            <div className="relative w-full sm:w-64">
              <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground pointer-events-none" />
              <input
                type="text"
                placeholder="Search unit members..."
                value={memberSearch}
                onChange={(e) => setMemberSearch(e.target.value)}
                className="pl-8 h-8 w-full rounded-xl border border-input bg-card px-3 text-xs text-foreground outline-none placeholder:text-muted-foreground focus:border-primary focus:ring-2 focus:ring-primary/20"
              />
            </div>
          ) : (
            <Button
              size="sm"
              onClick={() => {
                setEditingRole(null);
                setRoleDialogOpen(true);
              }}
              className="h-8 text-xs gap-1.5"
            >
              <Plus className="h-3.5 w-3.5" /> Create Department Role
            </Button>
          )}
        </div>

        {/* TAB 1: Department Members */}
        <TabsContent value="members" className="space-y-4 mt-0">
          <Card className="border rounded-2xl bg-card overflow-hidden shadow-2xs">
            <CardHeader className="py-4 px-6 border-b bg-muted/20">
              <CardTitle className="text-sm font-semibold flex items-center justify-between">
                <span>Staff Assigned to {dept.name}</span>
                <span className="text-xs text-muted-foreground font-normal">
                  {filteredMembers.length} {filteredMembers.length === 1 ? 'member' : 'members'} found
                </span>
              </CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              {filteredMembers.length === 0 ? (
                <div className="text-center py-12 space-y-3">
                  <Users className="h-8 w-8 text-muted-foreground mx-auto opacity-50" />
                  <p className="text-sm font-semibold">No members in this department yet</p>
                  <p className="text-xs text-muted-foreground">
                    Onboard new staff or update existing staff members to assign them to {dept.name}.
                  </p>
                  <Button
                    size="sm"
                    variant="outline"
                    className="gap-1.5 text-xs"
                    onClick={() => router.push('/admin/staff/onboarding')}
                  >
                    <UserPlus className="h-3.5 w-3.5" /> Onboard First Member
                  </Button>
                </div>
              ) : (
                <StaffListTable staff={filteredMembers} roles={repo.getRoles()} />
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* TAB 2: Department Roles */}
        <TabsContent value="roles" className="space-y-4 mt-0">
          {roles.length === 0 ? (
            <div className="text-center py-12 border border-dashed rounded-2xl bg-muted/10 space-y-3">
              <ShieldCheck className="h-8 w-8 text-muted-foreground mx-auto opacity-50" />
              <p className="text-sm font-semibold">No custom roles created for {dept.name}</p>
              <p className="text-xs text-muted-foreground">
                Create department-specific roles with granular permissions for team members in this unit.
              </p>
              <Button
                size="sm"
                className="gap-1.5 text-xs"
                onClick={() => {
                  setEditingRole(null);
                  setRoleDialogOpen(true);
                }}
              >
                <Plus className="h-3.5 w-3.5" /> Create First Role
              </Button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {roles.map((role) => (
                <RoleCard
                  key={role.id}
                  role={role}
                  onEdit={() => {
                    setEditingRole(role);
                    setRoleDialogOpen(true);
                  }}
                  onDelete={() => {
                    repo.deleteDepartmentRole(role.id);
                    refresh();
                    if (dept) setRoles(repo.getDepartmentRoles(dept.id));
                  }}
                />
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>

      {/* Edit Department Modal */}
      <DepartmentDrawer
        open={drawerOpen}
        onOpenChange={setDrawerOpen}
        department={dept}
        onSuccess={() => {
          refresh();
          if (dept) {
            const updated = repo.getDepartmentById(dept.id);
            if (updated) {
              setDept(updated);
              setMembers(repo.getAllStaff().filter((s) => s.department === updated.name));
            }
          }
          setDrawerOpen(false);
        }}
      />

      {/* Role Builder Modal */}
      <RoleBuilderDialog
        open={roleDialogOpen}
        onOpenChange={setRoleDialogOpen}
        departmentId={dept.id}
        existingRole={editingRole}
        onSave={handleRoleSave}
      />
    </div>
  );
}

export default function DepartmentDetailPage() {
  return (
    <Suspense
      fallback={
        <div className="p-8 flex justify-center items-center min-h-[400px]">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      }
    >
      <DepartmentDetailContent />
    </Suspense>
  );
}