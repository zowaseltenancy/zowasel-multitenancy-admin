"use client";

import { useState, useEffect } from "react";
import { useRouter , useParams} from "next/navigation";
import {
  Plus,
  Pencil,
  Trash2,
  Users,
  ArrowLeft,
  Search,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { useStaff } from "@/hooks/useStaff";

export default function DepartmentRolesPage() {
  const { repo, refresh } = useStaff();
  const params = useParams();
  const router = useRouter();

  const [roles, setRoles] = useState<any[]>([]);
  const [staffList, setStaffList] = useState<any[]>([]);
  const [search, setSearch] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingRole, setEditingRole] = useState<any | null>(null);
  const [roleName, setRoleName] = useState("");
  const [department, setDepartment] = useState("");
  const [selectedPermissions, setSelectedPermissions] = useState<string[]>([]);

      useEffect(() => {
    const allRoles = repo.getDepartmentRoles() || [];
    
    // Optional: Filter down to specific department if your route passes a department name context
    const targetedDept = params.id as string; 
    if (targetedDept) {
      setRoles(allRoles.filter(role => role.department === targetedDept));
    } else {
      setRoles(allRoles);
    }
    
    setStaffList(repo.getAllStaff() || []);
  }, [repo, params.id]);



  const filteredRoles = roles.filter((r) =>
    r.name.toLowerCase().includes(search.toLowerCase())
  );

  const handleCreate = () => {
    setEditingRole(null);
    setRoleName("");
    setDepartment("");
    setSelectedPermissions([]);
    setIsDialogOpen(true);
  };

  const handleEdit = (role: any) => {
    setEditingRole(role);
    setRoleName(role.name);
    setDepartment(role.department);
    setSelectedPermissions(role.permissions || []);
    setIsDialogOpen(true);
  };

  const handleDelete = (id: string) => {
    repo.deleteDepartmentalRole(id);
    setRoles(repo.getDepartmentalRoles());
    toast.success("Role deleted");
  };

  const saveRole = () => {
    if (!roleName.trim() || !department) {
      toast.error("Role name and department are required");
      return;
    }
    const data = {
      name: roleName.trim(),
      department,
      permissions: selectedPermissions,
    };
    if (editingRole) {
      repo.updateDepartmentalRole(editingRole.id, data);
      toast.success("Role updated");
    } else {
      repo.addDepartmentalRole(data);
      toast.success("Role created");
    }
    setRoles(repo.getDepartmentalRoles());
    setIsDialogOpen(false);
  };

  const togglePermission = (perm: string) => {
    setSelectedPermissions((prev) =>
      prev.includes(perm) ? prev.filter((p) => p !== perm) : [...prev, perm]
    );
  };

  return (
    <div className="p-6 space-y-6">
      <Button variant="ghost" onClick={() => router.back()} className="mb-2">
        <ArrowLeft className="h-4 w-4 mr-2" /> Back
      </Button>

      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Departmental Roles</h1>
          <p className="text-muted-foreground">
            Create custom titles specific to departments
          </p>
        </div>
        <Button onClick={handleCreate}>
          <Plus className="h-4 w-4 mr-2" />
          New Role
        </Button>
      </div>

      <div className="relative max-w-xs">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search roles..."
          className="pl-9"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {filteredRoles.map((role) => (
          <Card key={role.id}>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle>{role.name}</CardTitle>
              <Badge variant="outline">{role.department}</Badge>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mb-3">
                {role.permissions?.length || 0} permissions
              </p>
              <div className="flex gap-2">
                <Button variant="outline" size="sm" onClick={() => handleEdit(role)}>
                  <Pencil className="h-4 w-4 mr-1" /> Edit
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-destructive"
                  onClick={() => handleDelete(role.id)}
                >
                  <Trash2 className="h-4 w-4 mr-1" /> Delete
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Role Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>{editingRole ? "Edit Role" : "Create Role"}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="role-name">Role Name</Label>
                <Input
                  id="role-name"
                  value={roleName}
                  onChange={(e) => setRoleName(e.target.value)}
                  placeholder="e.g., Lead Developer"
                />
              </div>
              <div>
                <Label>Department</Label>
                <Select value={department} onValueChange={setDepartment}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select department" />
                  </SelectTrigger>
                  <SelectContent>
                    {Array.from(new Set(staffList.map((s) => s.department))).map(
                      (dept) => (
                        <SelectItem key={dept} value={dept}>
                          {dept}
                        </SelectItem>
                      )
                    )}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div>
              <Label className="mb-2 block">Permissions</Label>
              <div className="grid grid-cols-2 gap-2 max-h-64 overflow-y-auto pr-2">
                {PERMISSION_OPTIONS.map((perm) => (
                  <label
                    key={perm}
                    className="flex items-center gap-2 p-2 rounded border hover:bg-muted cursor-pointer"
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
          </div>
          <DialogFooter>
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

const PERMISSION_OPTIONS = [
  "staff.view",
  "staff.create",
  "staff.edit",
  "staff.delete",
  "leave.view",
  "leave.approve",
  "leave.request",
  "reports.view",
];