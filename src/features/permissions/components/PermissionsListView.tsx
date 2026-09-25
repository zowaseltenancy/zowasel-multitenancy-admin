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
  Users,
  KeyRound,
  Loader2,
  AlertCircle,
} from "lucide-react";

import { Role } from "@/types/permissions";
import { usePermissions } from "../hooks/usePermissions";
import RoleCard from "./RoleCard";
import PermissionMatrix from "./PermissionMatrix";
import RoleFormDialog from "./RoleFormDialog";
import PermissionFormDialog from "./PermissionFormDialog";
import { RoleFormValues } from "@/schemas/permissions.schema";
import { PERMISSION_CATEGORIES } from "@/constants/permissions";
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
    catalog,
    selectedRole,
    selectedRoleId,
    setSelectedRoleId,
    searchQuery,
    setSearchQuery,
    categoryFilter,
    setCategoryFilter,
    groups,
    filteredGroups,
    stats,
    isLoading,
    isMutating,
    error,
    togglePermissionForRole,
    createRole,
    updateRoleInfo,
    deleteRole,
    createCustomPermission,
  } = usePermissions();

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [roleToEdit, setRoleToEdit] = useState<Role | null>(null);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isScopeDialogOpen, setIsScopeDialogOpen] = useState(false);

  const handleOpenCreateModal = () => {
    setRoleToEdit(null);
    setIsDialogOpen(true);
  };

  const handleOpenEditModal = () => {
    if (!selectedRole) return;
    setRoleToEdit(selectedRole);
    setIsDialogOpen(true);
  };

  // Each dialog closes on the write settling, not on the click — a rejected
  // name or a permission set the server refuses leaves the form open with the
  // operator's input intact, next to the toast saying why.
  const handleSubmitRoleForm = (values: RoleFormValues) => {
    const close = () => setIsDialogOpen(false);

    if (roleToEdit) {
      updateRoleInfo(roleToEdit.id, values, { onSettled: close });
    } else {
      createRole(values, { onSettled: close });
    }
  };

  const handleDeleteRoleConfirm = () => {
    if (!selectedRole) return;
    deleteRole(selectedRole.id, { onSettled: () => setIsDeleteDialogOpen(false) });
  };

  const handleCreateScope = (values: { key: string; description?: string }) => {
    createCustomPermission(values, { onSettled: () => setIsScopeDialogOpen(false) });
  };

  const exportTable: ExportTable = {
    title: "Platform Roles & Permissions",
    headers: ["Role Name", "Description", "Assigned Admins", "Granted Scopes", "Last Updated"],
    rows: roles.map((r) => [
      r.name,
      r.description,
      r.userCount,
      r.permissions.length,
      r.updatedAt,
    ]),
  };

  // ── First load / failure / empty ───────────────────────────────────────────

  if (isLoading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (error) {
    return (
      <Card className="border-destructive/30 bg-destructive/5">
        <CardContent className="flex items-start gap-3 p-6">
          <AlertCircle className="mt-0.5 h-5 w-5 shrink-0 text-destructive" />
          <div className="space-y-1">
            <p className="text-sm font-semibold text-foreground">
              Roles and permissions could not be loaded
            </p>
            <p className="text-sm text-muted-foreground">{error}</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Metrics — every figure below is counted from the API's own rows, not
          from a local catalogue that the platform does not enforce. */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="bg-cyan-500/5 dark:bg-cyan-500/10 border-cyan-500/20 shadow-2xs">
          <CardContent className="p-4 flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                Configured Roles
              </p>
              <h3 className="text-2xl font-bold mt-1">{stats.totalRoles}</h3>
              <p className="text-[11px] text-cyan-600 dark:text-cyan-400 font-medium mt-0.5">
                Assignable across the console
              </p>
            </div>
            <div className="p-2.5 rounded-xl bg-cyan-500/15 text-cyan-600 border border-cyan-500/30 dark:text-cyan-400">
              <Shield className="h-5 w-5" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-blue-500/5 dark:bg-blue-500/10 border-blue-500/20 shadow-2xs">
          <CardContent className="p-4 flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                Granular Scopes
              </p>
              <h3 className="text-2xl font-bold mt-1">{stats.totalScopes}</h3>
              <p className="text-[11px] text-blue-600 dark:text-blue-400 font-medium mt-0.5">
                Across {stats.totalCategories}{" "}
                {stats.totalCategories === 1 ? "category" : "categories"}
              </p>
            </div>
            <div className="p-2.5 rounded-xl bg-blue-500/15 text-blue-600 border border-blue-500/30 dark:text-blue-400">
              <SlidersHorizontal className="h-5 w-5" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-amber-500/5 dark:bg-amber-500/10 border-amber-500/20 shadow-2xs">
          <CardContent className="p-4 flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                Admins Assigned
              </p>
              <h3 className="text-2xl font-bold mt-1">{stats.assignedAdmins}</h3>
              <p className="text-[11px] text-amber-600 dark:text-amber-400 font-medium mt-0.5">
                Role holders across the platform
              </p>
            </div>
            <div className="p-2.5 rounded-xl bg-amber-500/15 text-amber-600 border border-amber-500/30 dark:text-amber-400">
              <Users className="h-5 w-5" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-emerald-500/5 dark:bg-emerald-500/10 border-emerald-500/20 shadow-2xs">
          <CardContent className="p-4 flex items-center justify-between">
            <div className="min-w-0">
              <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                Active Selection
              </p>
              <h3 className="text-lg font-semibold truncate mt-1">
                {selectedRole?.name ?? "No role selected"}
              </h3>
              <p className="text-[11px] text-emerald-600 dark:text-emerald-400 font-medium mt-0.5">
                {selectedRole
                  ? `${selectedRole.permissions.length} active permissions`
                  : "Create a role to begin"}
              </p>
            </div>
            {selectedRole && (
              <div className="flex items-center gap-1">
                <Button
                  variant="outline"
                  size="icon"
                  onClick={handleOpenEditModal}
                  disabled={isMutating}
                  className="h-8 w-8 cursor-pointer"
                  title="Edit Role"
                >
                  <Edit className="h-4 w-4" />
                </Button>
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => setIsDeleteDialogOpen(true)}
                  disabled={isMutating}
                  className="h-8 w-8 text-destructive hover:bg-destructive/10 cursor-pointer"
                  title="Delete Role"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Role Cards Grid */}
      <div className="space-y-3">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            Select Role to Inspect
          </h3>
          <div className="flex items-center gap-2">
            <Button
              onClick={() => setIsScopeDialogOpen(true)}
              size="sm"
              variant="outline"
              className="gap-2 cursor-pointer"
            >
              <KeyRound className="h-4 w-4" />
              Add Scope
            </Button>
            <Button onClick={handleOpenCreateModal} size="sm" className="gap-2 cursor-pointer">
              <Plus className="h-4 w-4" />
              Create Custom Role
            </Button>
          </div>
        </div>

        {roles.length === 0 ? (
          <Card className="border-dashed">
            <CardContent className="flex flex-col items-center gap-3 p-10 text-center">
              <Shield className="h-8 w-8 text-muted-foreground" />
              <div className="space-y-1">
                <p className="text-sm font-semibold">No roles configured yet</p>
                <p className="text-sm text-muted-foreground">
                  Create a role to start granting the {stats.totalScopes} scopes in the catalogue.
                </p>
              </div>
              <Button onClick={handleOpenCreateModal} size="sm" className="gap-2 cursor-pointer">
                <Plus className="h-4 w-4" />
                Create Custom Role
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3">
            {roles.map((role) => (
              <RoleCard
                key={role.id}
                role={role}
                isSelected={role.id === selectedRoleId}
                onSelect={setSelectedRoleId}
                totalScopes={stats.totalScopes}
              />
            ))}
          </div>
        )}
      </div>

      {/* Filter & Action Controls */}
      {roles.length > 0 && (
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
                  <SelectTrigger className="w-[220px] text-xs">
                    <div className="flex items-center gap-2">
                      <Filter className="h-3.5 w-3.5 text-muted-foreground" />
                      <SelectValue placeholder="All Categories" />
                    </div>
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Categories ({groups.length})</SelectItem>
                    {/* Only categories the catalogue actually populates — the
                        rest would filter the matrix down to nothing. */}
                    {groups.map((group) => (
                      <SelectItem key={group.category} value={group.category}>
                        {PERMISSION_CATEGORIES[group.category].label} ({group.permissions.length})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="flex items-center gap-2 w-full md:w-auto justify-end">
                <ExportMenu table={exportTable} />
              </div>
            </div>

            {selectedRole && (
              <PermissionMatrix
                roles={roles}
                selectedRole={selectedRole}
                filteredGroups={filteredGroups}
                onTogglePermission={togglePermissionForRole}
                isSaving={isMutating}
              />
            )}
          </CardContent>
        </Card>
      )}

      <RoleFormDialog
        open={isDialogOpen}
        onOpenChange={setIsDialogOpen}
        roleToEdit={roleToEdit}
        onSubmitRole={handleSubmitRoleForm}
        groups={groups}
        isSubmitting={isMutating}
      />

      <PermissionFormDialog
        open={isScopeDialogOpen}
        onOpenChange={setIsScopeDialogOpen}
        onSubmitPermission={handleCreateScope}
        existingKeys={catalog.map((p) => p.code)}
        isSubmitting={isMutating}
      />

      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete this role?</AlertDialogTitle>
            <AlertDialogDescription>
              {/* The refusal is the server's: DELETE /admin/roles/{id} rejects a
                  role that admins still hold, and names the count. */}
              &quot;{selectedRole?.name}&quot; will be removed along with its permission grants.
              {selectedRole && selectedRole.userCount > 0
                ? ` ${selectedRole.userCount} admin${selectedRole.userCount === 1 ? "" : "s"} currently hold${selectedRole.userCount === 1 ? "s" : ""} it, so the server will refuse until they are reassigned.`
                : " No admin currently holds it."}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isMutating}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={(e) => {
                // The dialog closes when the mutation settles, so the default
                // close-on-click is suppressed — otherwise a refusal would
                // dismiss the dialog before its toast explained anything.
                e.preventDefault();
                handleDeleteRoleConfirm();
              }}
              disabled={isMutating}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {isMutating && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Delete Role
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
