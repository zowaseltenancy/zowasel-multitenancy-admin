"use client";

import { useState } from "react";
import {
  Shield,
  Plus,
  Search,
  Filter,
  SlidersHorizontal,
  Edit,
  Trash2,
  Lock,
} from "lucide-react";
import { toast } from "sonner";

import { Role, PermissionCategoryGroup } from "@/types/permissions";
import { usePermissions } from "../hooks/usePermissions";
import RoleCard from "./RoleCard";
import PermissionMatrix from "./PermissionMatrix";
import RoleFormDialog from "./RoleFormDialog";
import { RoleFormValues } from "@/schemas/permissions.schema";
import { PERMISSION_CATEGORIES, ALL_PERMISSIONS } from "@/constants/permissions";
import { ExportTable } from "@/lib/export";

import { Card, CardContent } from "@/components/ui/card";
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
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import ExportMenu from "@/components/shared/ExportMenu";

export default function PermissionsListView() {
  const {
    roles,
    selectedRole,
    selectedRoleId,
    setSelectedRoleId,
    searchQuery,
    setSearchQuery,
    categoryFilter,
    setCategoryFilter,
    filteredGroups,
    togglePermissionForRole,
    createRole,
    updateRoleInfo,
    deleteRole,
  } = usePermissions();

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [roleToEdit, setRoleToEdit] = useState<Role | null>(null);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

  const handleOpenCreateModal = () => {
    setRoleToEdit(null);
    setIsDialogOpen(true);
  };

  const handleOpenEditModal = () => {
    setRoleToEdit(selectedRole);
    setIsDialogOpen(true);
  };

  const handleSubmitRoleForm = (values: RoleFormValues) => {
    if (roleToEdit) {
      updateRoleInfo(roleToEdit.id, values);
    } else {
      createRole(values);
    }
  };

  const handleDeleteRoleConfirm = () => {
    if (selectedRole.isSystemRole) {
      toast.error("System roles cannot be deleted.");
      return;
    }
    deleteRole(selectedRole.id);
    toast.success(`Role "${selectedRole.name}" deleted.`);
    setIsDeleteDialogOpen(false);
  };

  const exportTable: ExportTable = {
    title: "Platform Roles & Permissions",
    headers: ["Role Name", "Role Type", "Description", "Assigned Users", "Granted Scopes Count", "Last Updated"],
    rows: roles.map((r) => [
      r.name,
      r.isSystemRole ? "System Role" : "Custom Role",
      r.description,
      r.userCount,
      r.permissions.length,
      r.updatedAt,
    ]),
  };

  const totalSystemRoles = roles.filter((r) => r.isSystemRole).length;
  const totalCustomRoles = roles.filter((r) => !r.isSystemRole).length;
  const sensitiveScopesCount = ALL_PERMISSIONS.filter((p) => p.isSensitive).length;

  return (
    <div className="space-y-6">
      {/* Metrics Banner */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="bg-card">
          <CardContent className="p-4 flex items-center justify-between">
            <div>
              <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                Configured Roles
              </p>
              <h3 className="text-2xl font-bold mt-1">{roles.length}</h3>
              <p className="text-[11px] text-muted-foreground mt-0.5">
                {totalSystemRoles} system, {totalCustomRoles} custom
              </p>
            </div>
            <div className="p-2.5 rounded-xl bg-primary/10 text-primary">
              <Shield className="h-5 w-5" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-card">
          <CardContent className="p-4 flex items-center justify-between">
            <div>
              <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                Granular Scopes
              </p>
              <h3 className="text-2xl font-bold mt-1">{ALL_PERMISSIONS.length}</h3>
              <p className="text-[11px] text-muted-foreground mt-0.5">
                Across 7 system categories
              </p>
            </div>
            <div className="p-2.5 rounded-xl bg-blue-500/10 text-blue-600 dark:text-blue-400">
              <SlidersHorizontal className="h-5 w-5" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-card">
          <CardContent className="p-4 flex items-center justify-between">
            <div>
              <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                Sensitive Scopes
              </p>
              <h3 className="text-2xl font-bold mt-1">{sensitiveScopesCount}</h3>
              <p className="text-[11px] text-muted-foreground mt-0.5">
                Requires elevated audit privileges
              </p>
            </div>
            <div className="p-2.5 rounded-xl bg-amber-500/10 text-amber-600 dark:text-amber-400">
              <Lock className="h-5 w-5" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-card">
          <CardContent className="p-4 flex items-center justify-between">
            <div>
              <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                Active Selection
              </p>
              <h3 className="text-lg font-semibold truncate mt-1">{selectedRole.name}</h3>
              <p className="text-[11px] text-muted-foreground mt-0.5">
                {selectedRole.permissions.length} active permissions
              </p>
            </div>
            <div className="flex items-center gap-1">
              <Button
                variant="outline"
                size="icon"
                onClick={handleOpenEditModal}
                className="h-8 w-8"
                title="Edit Role"
              >
                <Edit className="h-4 w-4" />
              </Button>
              {!selectedRole.isSystemRole && (
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => setIsDeleteDialogOpen(true)}
                  className="h-8 w-8 text-destructive hover:bg-destructive/10"
                  title="Delete Role"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Role Cards Grid */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">
            Select Role to Inspect
          </h3>
          <Button onClick={handleOpenCreateModal} size="sm" className="gap-2">
            <Plus className="h-4 w-4" />
            Create Custom Role
          </Button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3">
          {roles.map((role) => (
            <RoleCard
              key={role.id}
              role={role}
              isSelected={role.id === selectedRoleId}
              onSelect={setSelectedRoleId}
            />
          ))}
        </div>
      </div>

      {/* Filter & Action Controls */}
      <Card className="bg-card">
        <CardContent className="p-4 space-y-4">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex flex-1 items-center gap-3 w-full md:w-auto">
              <div className="relative flex-1 md:max-w-xs">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search scopes by code or name..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-9 text-xs"
                />
              </div>

              <Select
                value={categoryFilter}
                onValueChange={(value) => setCategoryFilter(value ?? "all")}
              >
                <SelectTrigger className="w-[200px] text-xs">
                  <div className="flex items-center gap-2">
                    <Filter className="h-3.5 w-3.5 text-muted-foreground" />
                    <SelectValue placeholder="All Categories" />
                  </div>
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Categories (7)</SelectItem>
                  {Object.entries(PERMISSION_CATEGORIES).map(([key, cat]) => (
                    <SelectItem key={key} value={key}>
                      {cat.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="flex items-center gap-2 w-full md:w-auto justify-end">
              <ExportMenu table={exportTable} />
            </div>
          </div>

          {/* Matrix Component */}
          <PermissionMatrix
            roles={roles}
            selectedRole={selectedRole}
            filteredGroups={filteredGroups as PermissionCategoryGroup[]}
            onTogglePermission={togglePermissionForRole}
          />
        </CardContent>
      </Card>

      {/* Dialog Modals */}
      <RoleFormDialog
        open={isDialogOpen}
        onOpenChange={setIsDialogOpen}
        roleToEdit={roleToEdit}
        onSubmitRole={handleSubmitRoleForm}
      />

      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Custom Role?</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete the role &quot;{selectedRole.name}&quot;? Any user
              currently assigned this role will lose its permission scopes.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteRoleConfirm}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Delete Role
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
