"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  Plus,
  Shield,
  Trash2,
  Pencil,
  ArrowLeft,
  Check,
  X,
  Users,
  Lock,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { toast } from "sonner";
import { useStaff } from "@/hooks/useStaff";

// Group permissions by category for better UX
const PERMISSION_GROUPS = [
  {
    category: "Staff Management",
    permissions: ["staff.view", "staff.create", "staff.edit", "staff.delete"],
  },
  {
    category: "Leave Management",
    permissions: ["leave.view", "leave.approve", "leave.request"],
  },
  {
    category: "Access Control",
    permissions: ["roles.manage"],
  },
  {
    category: "Reports & Settings",
    permissions: ["reports.view", "settings.manage"],
  },
];

export default function RoleManagementPage() {
  const { repo, refresh } = useStaff();
  const router = useRouter();

  const [roles, setRoles] = useState(repo.getRoles());
  const [editingRole, setEditingRole] = useState<any | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [roleName, setRoleName] = useState("");
  const [selectedPermissions, setSelectedPermissions] = useState<string[]>([]);

  const handleCreateRole = () => {
    setEditingRole(null);
    setRoleName("");
    setSelectedPermissions([]);
    setIsDialogOpen(true);
  };

  const handleEditRole = (role: any) => {
    setEditingRole(role);
    setRoleName(role.name);
    setSelectedPermissions(role.permissions || []);
    setIsDialogOpen(true);
  };

  const handleDeleteRole = (roleId: string) => {
    const role = roles.find((r) => r.id === roleId);
    if (role?.isSystem) {
      toast.error("Cannot delete system roles");
      return;
    }
    repo.deleteRole(roleId);
    setRoles(repo.getRoles());
    refresh();
    toast.success("Role deleted");
  };

  const saveRole = () => {
    if (!roleName.trim()) {
      toast.error("Role name required");
      return;
    }
    if (editingRole) {
      repo.updateRole(editingRole.id, {
        name: roleName,
        permissions: selectedPermissions,
      });
      toast.success("Role updated");
    } else {
      repo.addRole({ name: roleName, permissions: selectedPermissions });
      toast.success("Role created");
    }
    setRoles(repo.getRoles());
    refresh();
    setIsDialogOpen(false);
  };

  const togglePermission = (perm: string) => {
    setSelectedPermissions((prev) =>
      prev.includes(perm) ? prev.filter((p) => p !== perm) : [...prev, perm]
    );
  };

  const toggleGroup = (perms: string[]) => {
    const allSelected = perms.every((p) => selectedPermissions.includes(p));
    if (allSelected) {
      setSelectedPermissions((prev) => prev.filter((p) => !perms.includes(p)));
    } else {
      setSelectedPermissions((prev) => [...new Set([...prev, ...perms])]);
    }
  };

  const getStaffCountForRole = (roleId: string) => {
    // This would be better from an API, but we'll approximate using repo
    const staff = repo.getAllStaff();
    return staff.filter((s) => s.roleId === roleId).length;
  };

  return (
    <div className="p-6 space-y-6">

      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Role Management</h2>
          <p className="text-muted-foreground">
            Define roles, assign permissions, and control access
          </p>
        </div>
        <Button onClick={handleCreateRole}>
          <Plus className="h-4 w-4 mr-2" />
          New Role
        </Button>
      </div>

      {/* Role Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {roles.map((role) => {
          const staffCount = getStaffCountForRole(role.id);
          return (
            <Card key={role.id} className="flex flex-col">
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center gap-2">
                    <Shield className="h-5 w-5 text-primary" />
                    {role.name}
                  </CardTitle>
                  <Badge variant={role.isSystem ? "secondary" : "outline"}>
                    {role.isSystem ? "System" : "Custom"}
                  </Badge>
                </div>
                <CardDescription className="flex items-center gap-2">
                  <Users className="h-4 w-4" />
                  {staffCount} staff assigned
                </CardDescription>
              </CardHeader>
              <CardContent className="flex-1">
                <div className="flex flex-wrap gap-1 mb-4">
                  {role.permissions?.slice(0, 3).map((perm) => (
                    <Badge key={perm} variant="secondary" className="text-xs">
                      {perm}
                    </Badge>
                  ))}
                  {role.permissions?.length > 3 && (
                    <Badge variant="outline" className="text-xs">
                      +{role.permissions.length - 3} more
                    </Badge>
                  )}
                </div>
                <div className="flex gap-2 mt-auto">
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleEditRole(role)}
                        >
                          <Pencil className="h-4 w-4 mr-1" /> Edit
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>Edit role</TooltipContent>
                    </Tooltip>
                  </TooltipProvider>

                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="text-destructive"
                          disabled={role.isSystem}
                          onClick={() => handleDeleteRole(role.id)}
                        >
                          <Trash2 className="h-4 w-4 mr-1" /> Delete
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>
                        {role.isSystem
                          ? "System roles cannot be deleted"
                          : "Delete role"}
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Role Edit/Create Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-[700px] max-h-[90vh] flex flex-col">
          <DialogHeader>
            <DialogTitle>{editingRole ? "Edit Role" : "Create Role"}</DialogTitle>
          </DialogHeader>

          <div className="space-y-6 overflow-y-auto pr-2">
            {/* Role Name */}
            <div>
              <Label htmlFor="roleName">Role Name</Label>
              <Input
                id="roleName"
                value={roleName}
                onChange={(e) => setRoleName(e.target.value)}
                placeholder="e.g., HR Manager"
              />
            </div>

            {/* Permissions Matrix */}
            <div>
              <div className="flex items-center justify-between mb-3">
                <Label className="text-base font-medium">Permissions</Label>
                <span className="text-sm text-muted-foreground">
                  {selectedPermissions.length} selected
                </span>
              </div>

              <div className="space-y-5">
                {PERMISSION_GROUPS.map((group) => {
                  const groupPerms = group.permissions;
                  const allSelected = groupPerms.every((p) =>
                    selectedPermissions.includes(p)
                  );
                  const someSelected = groupPerms.some((p) =>
                    selectedPermissions.includes(p)
                  );

                  return (
                    <div key={group.category}>
                      {/* Group Header */}
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="font-semibold text-sm">
                          {group.category}
                        </h4>
                        <button
                          type="button"
                          onClick={() => toggleGroup(groupPerms)}
                          className="text-xs text-primary hover:underline"
                        >
                          {allSelected
                            ? "Deselect all"
                            : someSelected
                            ? "Select all"
                            : "Select all"}
                        </button>
                      </div>

                      {/* Permission Grid */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                        {groupPerms.map((perm) => (
                          <label
                            key={perm}
                            className={`flex items-center gap-2 p-2 rounded-md border cursor-pointer transition-colors ${
                              selectedPermissions.includes(perm)
                                ? "border-primary bg-primary/5"
                                : "border-border hover:bg-muted"
                            }`}
                          >
                            <input
                              type="checkbox"
                              checked={selectedPermissions.includes(perm)}
                              onChange={() => togglePermission(perm)}
                              className="h-4 w-4"
                            />
                            <span className="text-sm">{perm}</span>
                          </label>
                        ))}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          <DialogFooter className="mt-6">
            <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={saveRole}>Save</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}