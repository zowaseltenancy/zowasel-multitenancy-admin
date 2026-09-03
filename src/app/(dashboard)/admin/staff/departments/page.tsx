'use client';

import { useState, useEffect, useMemo } from 'react';
import { useStaff } from '@/hooks/useStaff';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Building2,
  Plus,
  Users,
  UserCheck,
  UserX,
  Search,
  MoreVertical,
  Edit3,
  Settings,
  ArrowRight,
  ShieldCheck,
  Loader2,
} from 'lucide-react';
import { Department } from '@/types/staff';
import { useRouter } from 'next/navigation';
import { DepartmentDrawer } from '@/components/staff/DepartmentDrawer';
import { getDepartmentIcon } from '@/lib/departmentIcons';

export default function DepartmentsPage() {
  const { repo, refresh } = useStaff();
  const [mounted, setMounted] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [selectedDept, setSelectedDept] = useState<Department | null>(null);
  const router = useRouter();

  useEffect(() => {
    setMounted(true);
  }, []);

  const departments = repo.getDepartments();
  const staffList = repo.getAllStaff();

  const deptData = useMemo(() => {
    return (departments || []).map((dept) => {
      const assignedStaff = (staffList || []).filter((s) => s && s.department === dept.name);
      const head = dept.headId ? (staffList || []).find((s) => s && s.id === dept.headId) : null;
      return {
        ...dept,
        staffCount: assignedStaff.length,
        head,
      };
    });
  }, [departments, staffList]);

  const filteredDepts = useMemo(() => {
    if (!searchQuery.trim()) return deptData;
    const query = searchQuery.toLowerCase();
    return deptData.filter(
      (d) =>
        (d.name || '').toLowerCase().includes(query) ||
        (d.description || '').toLowerCase().includes(query) ||
        (d.head && `${d.head.firstName || ''} ${d.head.lastName || ''}`.toLowerCase().includes(query))
    );
  }, [deptData, searchQuery]);

  const totalUnits = deptData.length;
  const assignedHeadsCount = deptData.filter((d) => Boolean(d.head)).length;
  const unassignedCount = totalUnits - assignedHeadsCount;
  const totalDepartmentStaff = deptData.reduce((acc, curr) => acc + curr.staffCount, 0);

  const handleEdit = (dept: Department) => {
    setSelectedDept(dept);
    setDrawerOpen(true);
  };

  const handleCreate = () => {
    setSelectedDept(null);
    setDrawerOpen(true);
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
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">
            Departments & Units
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            Organize operational units, assign appointed leaders, and configure scoped permissions.
          </p>
        </div>

        <Button onClick={handleCreate} className="gap-2 shadow-xs shrink-0">
          <Plus className="h-4 w-4" /> New Department
        </Button>
      </div>

      {/* KPI Overview Metric Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card className="bg-card border rounded-xl shadow-2xs">
          <CardContent className="p-4 flex items-center justify-between">
            <div>
              <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Total Units</p>
              <p className="text-2xl font-bold text-foreground mt-1">{totalUnits}</p>
            </div>
            <div className="h-9 w-9 rounded-lg bg-muted flex items-center justify-center text-muted-foreground">
              <Building2 className="h-4 w-4" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-card border rounded-xl shadow-2xs">
          <CardContent className="p-4 flex items-center justify-between">
            <div>
              <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Appointed Leads</p>
              <p className="text-2xl font-bold text-foreground mt-1">{assignedHeadsCount}</p>
            </div>
            <div className="h-9 w-9 rounded-lg bg-muted flex items-center justify-center text-muted-foreground">
              <UserCheck className="h-4 w-4" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-card border rounded-xl shadow-2xs">
          <CardContent className="p-4 flex items-center justify-between">
            <div>
              <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Unassigned Units</p>
              <p className="text-2xl font-bold text-foreground mt-1">{unassignedCount}</p>
            </div>
            <div className="h-9 w-9 rounded-lg bg-muted flex items-center justify-center text-muted-foreground">
              <UserX className="h-4 w-4" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-card border rounded-xl shadow-2xs">
          <CardContent className="p-4 flex items-center justify-between">
            <div>
              <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Total Staff</p>
              <p className="text-2xl font-bold text-foreground mt-1">{totalDepartmentStaff}</p>
            </div>
            <div className="h-9 w-9 rounded-lg bg-muted flex items-center justify-center text-muted-foreground">
              <Users className="h-4 w-4" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filter & Search Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="relative w-full sm:w-80">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search by name, description, or head..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9 h-9 w-full rounded-lg border border-input bg-card px-3 text-sm text-foreground outline-none placeholder:text-muted-foreground focus:border-ring focus:ring-1 focus:ring-ring transition-colors"
          />
        </div>
        <p className="text-xs text-muted-foreground self-end sm:self-center">
          Showing {filteredDepts.length} of {totalUnits} departments
        </p>
      </div>

      {/* Departments Grid */}
      {filteredDepts.length === 0 ? (
        <div className="text-center py-16 border border-dashed rounded-xl bg-muted/10 space-y-3">
          <Building2 className="h-10 w-10 text-muted-foreground mx-auto opacity-40" />
          <p className="text-sm font-semibold">No departments found</p>
          <p className="text-xs text-muted-foreground">Try adjusting your search criteria or create a new department.</p>
          <Button onClick={handleCreate} size="sm" variant="outline" className="gap-1.5 mt-2">
            <Plus className="h-3.5 w-3.5" /> Create Department
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredDepts.map((dept) => {
            const Icon = getDepartmentIcon(dept.name);
            const headInitials = dept.head
              ? `${dept.head.firstName?.[0] || ''}${dept.head.lastName?.[0] || ''}`.toUpperCase()
              : null;

            return (
              <Card
                key={dept.id}
                className="border rounded-xl bg-card hover:border-border/80 transition-all flex flex-col justify-between overflow-hidden shadow-2xs"
              >
                <div className="p-5 space-y-4">
                  {/* Card Header */}
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 rounded-lg bg-muted flex items-center justify-center text-foreground shrink-0 border">
                        <Icon className="h-5 w-5" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-base text-foreground leading-tight">
                          {dept.name}
                        </h3>
                        <Badge variant="secondary" className="mt-1 text-[11px] font-medium">
                          {dept.staffCount} {dept.staffCount === 1 ? 'member' : 'members'}
                        </Badge>
                      </div>
                    </div>

                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground">
                          <MoreVertical className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="w-48">
                        <DropdownMenuLabel>Actions</DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem onClick={() => router.push(`/admin/staff/departments/${dept.id}`)}>
                          <Users className="h-4 w-4 mr-2" /> View Members
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => router.push(`/admin/staff/departments/${dept.id}?tab=roles`)}>
                          <Settings className="h-4 w-4 mr-2" /> Manage Roles
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleEdit(dept)}>
                          <Edit3 className="h-4 w-4 mr-2" /> Edit Department
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>

                  {/* Description */}
                  <p className="text-xs text-muted-foreground line-clamp-2 min-h-[32px]">
                    {dept.description || 'No description set.'}
                  </p>

                  {/* Department Head Section */}
                  <div className="p-3 bg-muted/40 rounded-lg border border-border/60 space-y-1">
                    <p className="text-[10px] uppercase font-semibold text-muted-foreground tracking-wider">
                      Department Head
                    </p>

                    {dept.head ? (
                      <div className="flex items-center gap-2.5 pt-0.5">
                        {dept.head.avatarUrl ? (
                          <img
                            src={dept.head.avatarUrl}
                            alt={dept.head.firstName}
                            className="h-7 w-7 rounded-full object-cover border shrink-0"
                          />
                        ) : (
                          <div className="h-7 w-7 rounded-full bg-muted-foreground/10 text-foreground font-semibold text-[11px] flex items-center justify-center shrink-0 border">
                            {headInitials}
                          </div>
                        )}
                        <div className="min-w-0 flex-1">
                          <p className="text-xs font-medium text-foreground truncate">
                            {dept.head.firstName} {dept.head.lastName}
                          </p>
                          <p className="text-[10px] text-muted-foreground truncate">{dept.head.email}</p>
                        </div>
                      </div>
                    ) : (
                      <div className="flex items-center justify-between pt-0.5">
                        <span className="text-xs text-muted-foreground italic">No Head Appointed</span>
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          className="h-6 text-[11px] px-2 text-foreground hover:bg-muted"
                          onClick={() => handleEdit(dept)}
                        >
                          Appoint
                        </Button>
                      </div>
                    )}
                  </div>
                </div>

                {/* Card Action Footer */}
                <div className="p-3 px-5 bg-muted/20 border-t flex items-center justify-between text-xs">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-xs text-muted-foreground hover:text-foreground gap-1.5 p-0 h-auto font-medium"
                    onClick={() => router.push(`/admin/staff/departments/${dept.id}?tab=roles`)}
                  >
                    <Settings className="h-3.5 w-3.5" /> Roles
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-xs text-foreground hover:text-foreground gap-1 p-0 h-auto font-medium"
                    onClick={() => router.push(`/admin/staff/departments/${dept.id}`)}
                  >
                    View Details <ArrowRight className="h-3.5 w-3.5" />
                  </Button>
                </div>
              </Card>
            );
          })}
        </div>
      )}

      {/* Create / Edit Department Drawer */}
      <DepartmentDrawer
        open={drawerOpen}
        onOpenChange={setDrawerOpen}
        department={selectedDept}
        onSuccess={() => {
          refresh();
          setDrawerOpen(false);
        }}
      />
    </div>
  );
}
