"use client";

import { useState, useEffect, useMemo } from "react";
import { useRouter } from "next/navigation";
import {
  Search,
  Download,
  Plus,
  Eye,
  Pencil,
  Ban,
  CheckCircle,
  KeyRound,
  Loader2,
  UserX,
  UserCog,
  ChevronLeft,
  ChevronRight,
  Shield,
  MoreHorizontal,
  Users,
  UserCheck,
  UserMinus,
  Clock,
  ImageIcon,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { useStaff } from "@/hooks/useStaff";

const PAGE_SIZE = 10;

// Helper to get initials
const getInitials = (firstName: string, lastName: string) => {
  return `${firstName?.charAt(0) || ""}${lastName?.charAt(0) || ""}`.toUpperCase();
};

export default function StaffDirectoryPage() {
  const { repo, refresh } = useStaff();
  const router = useRouter();

  const [mounted, setMounted] = useState(false);
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState("all");
  const [deptFilter, setDeptFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [page, setPage] = useState(1);
  const [viewStaff, setViewStaff] = useState<any | null>(null);

  const [roleEditStaff, setRoleEditStaff] = useState<any | null>(null);
  const [roleEditOpen, setRoleEditOpen] = useState(false);
  const [selectedRoleId, setSelectedRoleId] = useState("");

  useEffect(() => {
    setMounted(true);
  }, []);

  const staffList = useMemo(() => repo.getAllStaff(), [repo]);
  const roles = useMemo(() => repo.getRoles(), [repo]);
  const departments = useMemo(
    () => Array.from(new Set(staffList.map((s) => s.department))).sort(),
    [staffList]
  );

  const filtered = useMemo(() => {
    return staffList.filter((s) => {
      const fullName = `${s.firstName} ${s.lastName} ${s.email}`.toLowerCase();
      const matchesSearch = fullName.includes(search.toLowerCase());
      const matchesRole = roleFilter === "all" || s.roleId === roleFilter;
      const matchesDept = deptFilter === "all" || s.department === deptFilter;
      const matchesStatus = statusFilter === "all" || s.status === statusFilter;
      return matchesSearch && matchesRole && matchesDept && matchesStatus;
    });
  }, [staffList, search, roleFilter, deptFilter, statusFilter]);

  const totalPages = Math.ceil(filtered.length / PAGE_SIZE);
  const paginated = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  useEffect(() => {
    setPage(1);
  }, [search, roleFilter, deptFilter, statusFilter]);

  if (!mounted) {
    return (
      <div className="p-6 flex justify-center items-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  const handleExportCSV = () => {
    const headers = ["Name", "Email", "Phone", "Department", "Role", "Status"];
    const rows = filtered.map((s) => {
      const roleName = roles.find((r) => r.id === s.roleId)?.name || "";
      return [
        `${s.firstName} ${s.lastName}`,
        s.email,
        s.phone,
        s.department,
        roleName,
        s.status,
      ];
    });
    const csv = [headers, ...rows].map((row) => row.join(",")).join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `staff_directory_${new Date().toISOString().split("T")[0]}.csv`;
    a.click();
    URL.revokeObjectURL(url);
    toast.success("CSV exported");
  };

  const handleExportJSON = () => {
    const data = filtered.map((s) => ({
      ...s,
      roleName: roles.find((r) => r.id === s.roleId)?.name,
    }));
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `staff_directory_${new Date().toISOString().split("T")[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
    toast.success("JSON exported");
  };

  const handleStatusToggle = (staff: any) => {
    const newStatus = staff.status === "active" ? "inactive" : "active";
    repo.updateStaff(staff.id, { status: newStatus });
    refresh();
    toast.success(`Staff ${newStatus === "active" ? "activated" : "deactivated"}`);
  };

  const handleResetPassword = (staff: any) => {
    // Simulate API call – replace with real endpoint
    toast.success(`Password reset link sent to ${staff.email}`);
  };

  const handleEdit = (staff: any) => {
    router.push(`/admin/staff/${staff.id}`); // or `/admin/staff/${staff.id}/edit`
  };

  const handleView = (staff: any) => {
    setViewStaff(staff);
  };

  const handleAddNew = () => {
    router.push("/admin/staff/onboarding");
  };

  const handleManageRoles = () => {
    router.push("/admin/staff/roles");
  };

  const openRoleEdit = (staff: any) => {
    setRoleEditStaff(staff);
    setSelectedRoleId(staff.roleId);
    setRoleEditOpen(true);
  };

  const saveRoleChange = () => {
    if (!roleEditStaff || !selectedRoleId) return;
    repo.updateStaff(roleEditStaff.id, { roleId: selectedRoleId });
    refresh();
    toast.success(`Role updated for ${roleEditStaff.firstName} ${roleEditStaff.lastName}`);
    setRoleEditOpen(false);
  };

  // Quick view tabs (set status filter)
  const quickViews = [
    { label: "All", value: "all", icon: Users },
    { label: "Active", value: "active", icon: UserCheck },
    { label: "Inactive", value: "inactive", icon: UserMinus },
    { label: "Pending", value: "pending", icon: Clock },
  ];

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Staff Directory</h2>
          <p className="text-muted-foreground">
            {staffList.length} total staff · {filtered.length} shown
          </p>
        </div>
        <div className="flex gap-2">
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="outline" size="sm" onClick={handleManageRoles}>
                  <Shield className="h-4 w-4 mr-2" />
                  Roles
                </Button>
              </TooltipTrigger>
              <TooltipContent>Manage roles & permissions</TooltipContent>
            </Tooltip>
          </TooltipProvider>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm">
                <Download className="h-4 w-4 mr-2" />
                Export
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={handleExportCSV}>CSV</DropdownMenuItem>
              <DropdownMenuItem onClick={handleExportJSON}>JSON</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          <Button onClick={handleAddNew}>
            <Plus className="h-4 w-4 mr-2" />
            Add Staff
          </Button>
        </div>
      </div>

      {/* Quick view tabs */}
      <div className="flex flex-wrap gap-2">
        {quickViews.map((view) => {
          const Icon = view.icon;
          const isActive = statusFilter === view.value;
          return (
            <Button
              key={view.value}
              variant={isActive ? "default" : "outline"}
              size="sm"
              onClick={() => setStatusFilter(view.value)}
              className="flex items-center gap-1"
            >
              <Icon className="h-4 w-4" />
              {view.label}
            </Button>
          );
        })}
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-3">
        <div className="relative flex-1 min-w-[200px] max-w-xs">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search name, email..."
            className="pl-9"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        <Select value={roleFilter} onValueChange={(value) => setRoleFilter(value ?? "")}>
          <SelectTrigger className="w-[160px]">
            <SelectValue placeholder="All Roles" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Roles</SelectItem>
            {roles.map((role) => (
              <SelectItem key={role.id} value={role.id}>
                {role.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select value={deptFilter} onValueChange={(value) => setDeptFilter(value ?? "")}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="All Departments" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Departments</SelectItem>
            {departments.map((dept) => (
              <SelectItem key={dept} value={dept}>
                {dept}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select value={statusFilter} onValueChange={(value) => setStatusFilter(value ?? "")}>
          <SelectTrigger className="w-[140px]">
            <SelectValue placeholder="All Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Status</SelectItem>
            <SelectItem value="active">Active</SelectItem>
            <SelectItem value="inactive">Inactive</SelectItem>
            <SelectItem value="pending">Pending</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Table */}
      <div className="rounded-lg border bg-card">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Phone</TableHead>
              <TableHead>Department</TableHead>
              <TableHead>Role</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {paginated.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="text-center py-8">
                  <div className="flex flex-col items-center gap-2 text-muted-foreground">
                    <UserX className="h-8 w-8" />
                    <p>No staff found matching your filters</p>
                  </div>
                </TableCell>
              </TableRow>
            ) : (
              paginated.map((staff) => {
                const role = roles.find((r) => r.id === staff.roleId);
                const avatarUrl = staff.personalInfo?.avatarUrl || staff.avatarUrl;
                return (
                  <TableRow key={staff.id} className="hover:bg-muted/50">
                    <TableCell className="font-medium">
                      <div className="flex items-center gap-3">
                        {avatarUrl ? (
                          <img
                            src={avatarUrl}
                            alt={`${staff.firstName} ${staff.lastName}`}
                            className="h-8 w-8 rounded-full object-cover border"
                          />
                        ) : (
                          <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center text-xs font-bold text-primary">
                            {getInitials(staff.firstName, staff.lastName)}
                          </div>
                        )}
                        <span>
                          {staff.firstName} {staff.lastName}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell>{staff.email}</TableCell>
                    <TableCell>{staff.phone}</TableCell>
                    <TableCell>{staff.department}</TableCell>
                    <TableCell>
                      <Badge variant="secondary">{role?.name || "—"}</Badge>
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant={
                          staff.status === "active"
                            ? "success"
                            : staff.status === "inactive"
                            ? "destructive"
                            : "warning"
                        }
                      >
                        {staff.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-1">
                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => handleView(staff)}
                              >
                                <Eye className="h-4 w-4" />
                              </Button>
                            </TooltipTrigger>
                            <TooltipContent>View details</TooltipContent>
                          </Tooltip>
                        </TooltipProvider>

                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => handleEdit(staff)}
                              >
                                <Pencil className="h-4 w-4" />
                              </Button>
                            </TooltipTrigger>
                            <TooltipContent>Edit staff</TooltipContent>
                          </Tooltip>
                        </TooltipProvider>

                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                  <Button variant="ghost" size="icon">
                                    <MoreHorizontal className="h-4 w-4" />
                                  </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end">
                                  <DropdownMenuItem onClick={() => openRoleEdit(staff)}>
                                    <UserCog className="h-4 w-4 mr-2" /> Change Role
                                  </DropdownMenuItem>
                                  <DropdownMenuItem onClick={() => handleStatusToggle(staff)}>
                                    {staff.status === "active" ? (
                                      <>
                                        <Ban className="h-4 w-4 mr-2" /> Deactivate
                                      </>
                                    ) : (
                                      <>
                                        <CheckCircle className="h-4 w-4 mr-2" /> Activate
                                      </>
                                    )}
                                  </DropdownMenuItem>
                                  <DropdownMenuItem onClick={() => handleResetPassword(staff)}>
                                    <KeyRound className="h-4 w-4 mr-2" /> Reset Password
                                  </DropdownMenuItem>
                                </DropdownMenuContent>
                              </DropdownMenu>
                            </TooltipTrigger>
                            <TooltipContent>More actions</TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                      </div>
                    </TableCell>
                  </TableRow>
                );
              })
            )}
          </TableBody>
        </Table>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between">
          <p className="text-sm text-muted-foreground">
            Page {page} of {totalPages}
          </p>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              disabled={page === 1}
              onClick={() => setPage(page - 1)}
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              size="sm"
              disabled={page === totalPages}
              onClick={() => setPage(page + 1)}
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      )}

      {/* View Staff Dialog */}
      <Dialog open={!!viewStaff} onOpenChange={() => setViewStaff(null)}>
        <DialogContent className="sm:max-w-[450px]">
          <DialogHeader>
            <DialogTitle>Staff Details</DialogTitle>
            <DialogDescription>Overview of employee information</DialogDescription>
          </DialogHeader>
          {viewStaff && (
            <div className="space-y-4">
              {/* Profile picture */}
              <div className="flex items-center gap-4">
                {viewStaff.personalInfo?.avatarUrl || viewStaff.avatarUrl ? (
                  <img
                    src={viewStaff.personalInfo?.avatarUrl || viewStaff.avatarUrl}
                    alt={`${viewStaff.firstName} ${viewStaff.lastName}`}
                    className="h-16 w-16 rounded-full object-cover border"
                  />
                ) : (
                  <div className="h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center text-xl font-bold text-primary">
                    {getInitials(viewStaff.firstName, viewStaff.lastName)}
                  </div>
                )}
                <div>
                  <p className="font-semibold text-lg">
                    {viewStaff.firstName} {viewStaff.lastName}
                  </p>
                  <p className="text-sm text-muted-foreground">{viewStaff.email}</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="flex justify-between">
                  <span className="font-medium">Phone</span>
                  <span>{viewStaff.phone}</span>
                </div>
                <div className="flex justify-between">
                  <span className="font-medium">Department</span>
                  <span>{viewStaff.department}</span>
                </div>
                <div className="flex justify-between">
                  <span className="font-medium">Role</span>
                  <span>{roles.find((r) => r.id === viewStaff.roleId)?.name}</span>
                </div>
                <div className="flex justify-between">
                  <span className="font-medium">Status</span>
                  <Badge variant={viewStaff.status === "active" ? "success" : "destructive"}>
                    {viewStaff.status}
                  </Badge>
                </div>
                {viewStaff.managerId && (
                  <div className="flex justify-between col-span-2">
                    <span className="font-medium">Manager</span>
                    <span>
                      {staffList.find((s) => s.id === viewStaff.managerId)?.firstName}{" "}
                      {staffList.find((s) => s.id === viewStaff.managerId)?.lastName}
                    </span>
                  </div>
                )}
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Role Edit Dialog */}
      <Dialog open={roleEditOpen} onOpenChange={setRoleEditOpen}>
        <DialogContent className="sm:max-w-[400px]">
          <DialogHeader>
            <DialogTitle>Change Role</DialogTitle>
            <DialogDescription>
              {roleEditStaff && (
                <>
                  Update role for <strong>{roleEditStaff.firstName} {roleEditStaff.lastName}</strong>
                </>
              )}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="role-select">New Role</Label>
              <Select value={selectedRoleId} onValueChange={(value) => setSelectedRoleId(value ?? "")}>
                <SelectTrigger id="role-select">
                  <SelectValue placeholder="Select a role" />
                </SelectTrigger>
                <SelectContent>
                  {roles.map((role) => (
                    <SelectItem key={role.id} value={role.id}>
                      {role.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setRoleEditOpen(false)}>
              Cancel
            </Button>
            <Button onClick={saveRoleChange}>Save</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}