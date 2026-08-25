"use client";

import { useState, useEffect, useMemo } from "react";
import { useRouter } from "next/navigation";
import {
  Plus, Pencil, Users, ChevronRight, Search, Trash2, Loader2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card, CardContent, CardHeader, CardTitle,
} from "@/components/ui/card";
import {
  Sheet, SheetContent, SheetHeader, SheetTitle,
} from "@/components/ui/sheet";
import { Label } from "@/components/ui/label";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { useStaff } from "@/hooks/useStaff";

interface Department {
  id: string;
  name: string;
  description?: string;
  headId?: string;
  config?: {
    allowRemote?: boolean;
    maxLeaveDays?: number;
  };
}

export default function DepartmentsPage() {
  const { repo } = useStaff();
  const [mounted, setMounted] = useState(false);
  const [search, setSearch] = useState("");
  const [departments, setDepartments] = useState<Department[]>([]);
  const [staffList, setStaffList] = useState<any[]>([]);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingDept, setEditingDept] = useState<Department | null>(null);
  const [selectedDept, setSelectedDept] = useState<Department | null>(null);
  const [detailOpen, setDetailOpen] = useState(false);

  useEffect(() => {
    setMounted(true);
    loadData();
  }, []);

  const loadData = () => {
    const staff = repo.getAllStaff() || [];
    const uniqueDeptNames = Array.from(
      new Set(staff.map((s) => s.department).filter(Boolean))
    );
    const depts: Department[] = uniqueDeptNames.map((name) => ({
      id: encodeURIComponent(name),
      name: name,
      description: `All administrative records and personnel allocated to ${name}.`,
    }));
    setDepartments(depts);
    setStaffList(staff);
  };

  const filteredDepts = useMemo(() => {
    return departments.filter((d) =>
      d.name.toLowerCase().includes(search.toLowerCase())
    );
  }, [departments, search]);

  const getStaffCount = (deptName: string) =>
    staffList.filter((s) => s.department === deptName).length;

  const getHeadName = (headId?: string) => {
    if (!headId) return "—";
    const head = staffList.find((s) => s.id === headId);
    return head ? `${head.firstName} ${head.lastName}` : "—";
  };

  const openCreate = () => {
    setEditingDept(null);
    setIsFormOpen(true);
  };

  const openEdit = (dept: Department) => {
    setEditingDept(dept);
    setIsFormOpen(true);
  };

  const openDetail = (dept: Department) => {
    setSelectedDept(dept);
    setDetailOpen(true);
  };

  const handleSave = (formData: {
    name: string; description?: string; headId?: string; config?: any;
  }) => {
    if (editingDept) {
      repo.updateDepartment(editingDept.id, formData);
      toast.success("Department updated");
    } else {
      repo.addDepartment(formData);
      toast.success("Department created");
    }
    loadData();
    setIsFormOpen(false);
  };

  const handleDelete = (id: string) => {
    repo.deleteDepartment(id);
    loadData();
    toast.success("Department deleted");
  };

  if (!mounted) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="p-6 md:p-8 space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Departments</h1>
          <p className="text-muted-foreground mt-2">
            Manage organisational departments, heads, and configuration
          </p>
        </div>
        <Button onClick={openCreate} size="lg">
          <Plus className="h-5 w-5 mr-2" />
          New Department
        </Button>
      </div>

      {/* Search */}
      <div className="relative max-w-sm">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search departments..."
          className="pl-10 h-11"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      {/* Department Grid */}
      {filteredDepts.length === 0 ? (
        <div className="text-center py-16 text-muted-foreground">
          No departments found
        </div>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {filteredDepts.map((dept) => {
            const count = getStaffCount(dept.name);
            const headName = getHeadName(dept.headId);
            return (
              <Card
                key={dept.id}
                className="group cursor-pointer border-border/60 hover:border-primary/40 hover:shadow-lg transition-all duration-200"
                onClick={() => openDetail(dept)}
              >
                <CardHeader className="flex flex-row items-start justify-between pb-2">
                  <div className="space-y-1">
                    <CardTitle className="text-xl">{dept.name}</CardTitle>
                    <p className="text-sm text-muted-foreground line-clamp-2">
                      {dept.description || "No description"}
                    </p>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="opacity-0 group-hover:opacity-100 transition-opacity"
                    onClick={(e) => {
                      e.stopPropagation();
                      openEdit(dept);
                    }}
                  >
                    <Pencil className="h-4 w-4" />
                  </Button>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between text-sm">
                    <div className="flex items-center gap-2">
                      <Users className="h-4 w-4 text-muted-foreground" />
                      <span>{count} staff</span>
                    </div>
                    <div className="text-right">
                      <p className="text-xs text-muted-foreground">Head</p>
                      <p className="font-medium">{headName}</p>
                    </div>
                  </div>
                  <div className="mt-5 flex items-center justify-between text-xs text-muted-foreground">
                    <span>{dept.config?.allowRemote ? "Remote allowed" : "On-site"}</span>
                    <ChevronRight className="h-4 w-4 opacity-0 group-hover:opacity-100 transition-opacity" />
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}

      {/* Create/Edit Drawer - width overridden with inline style */}
      <Sheet open={isFormOpen} onOpenChange={setIsFormOpen}>
        <SheetContent
          className="w-full sm:max-w-md lg:max-w-lg p-0 overflow-y-auto"
          style={{ maxWidth: '600px' }}  // 👈 force wider width
        >
          <div className="p-6 sm:p-8">
            <SheetHeader className="pb-6">
              <SheetTitle className="text-2xl font-bold">
                {editingDept ? "Edit Department" : "New Department"}
              </SheetTitle>
            </SheetHeader>
            <DepartmentForm
              initialData={editingDept}
              staffOptions={staffList}
              onSave={handleSave}
              onCancel={() => setIsFormOpen(false)}
            />
          </div>
        </SheetContent>
      </Sheet>

      {/* Detail Slide-over - width overridden with inline style */}
      <Sheet open={detailOpen} onOpenChange={setDetailOpen}>
        <SheetContent
          className="w-full sm:max-w-2xl lg:max-w-4xl p-0 overflow-y-auto"
          style={{ maxWidth: '600px' }}
        >
          
          {selectedDept && (
            <div className="p-6 sm:p-8">
              <DepartmentDetail
                department={selectedDept}
                staffList={staffList}
                onEdit={() => {
                  setDetailOpen(false);
                  openEdit(selectedDept);
                }}
                onDelete={() => {
                  handleDelete(selectedDept.id);
                  setDetailOpen(false);
                }}
              />
            </div>
          )}
        </SheetContent>
      </Sheet>
    </div>
  );
}

// ---------- Department Form (unchanged except minor spacing) ----------
function DepartmentForm({
  initialData,
  staffOptions,
  onSave,
  onCancel,
}: {
  initialData: Department | null;
  staffOptions: any[];
  onSave: (data: any) => void;
  onCancel: () => void;
}) {
  const [name, setName] = useState(initialData?.name || "");
  const [description, setDescription] = useState(initialData?.description || "");
  const [headId, setHeadId] = useState(initialData?.headId || "");
  const [allowRemote, setAllowRemote] = useState(
    initialData?.config?.allowRemote ?? true
  );
  const [maxLeaveDays, setMaxLeaveDays] = useState(
    initialData?.config?.maxLeaveDays ?? 30
  );

  const handleSubmit = () => {
    if (!name.trim()) {
      toast.error("Department name is required");
      return;
    }
    onSave({
      name: name.trim(),
      description,
      headId: headId || undefined,
      config: { allowRemote, maxLeaveDays: Number(maxLeaveDays) },
    });
  };

  return (
    <div className="space-y-10 py-4">
      {/* Basic Information Section */}
      <div className="space-y-5">
        <div>
          <Label className="text-base font-semibold mb-3 block">Basic Information</Label>
          <div className="space-y-4">
            <div>
              <Label htmlFor="dept-name" className="text-sm">
                Department Name
              </Label>
              <Input
                id="dept-name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g., Engineering"
                className="mt-2 h-11"
              />
            </div>
            <div>
              <Label htmlFor="dept-desc" className="text-sm">
                Description
              </Label>
              <textarea
                id="dept-desc"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="mt-2 w-full min-h-[120px] rounded-md border border-input bg-background px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                placeholder="What does this department do?"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Leadership Section */}
      <div className="border-t pt-8 space-y-5">
        <div>
          <Label className="text-base font-semibold mb-3 block">Leadership</Label>
          <div>
            <Label className="text-sm">Department Head</Label>
            <Select value={headId} onValueChange={setHeadId}>
              <SelectTrigger className="mt-2 h-11">
                <SelectValue placeholder="Select a head" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">None</SelectItem>
                {staffOptions.map((staff) => (
                  <SelectItem key={staff.id} value={staff.id}>
                    {staff.firstName} {staff.lastName}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      {/* Configuration Section */}
      <div className="border-t pt-8 space-y-5">
        <div>
          <Label className="text-base font-semibold mb-3 block">Configuration</Label>
          <div className="space-y-5">
            <div className="flex items-center gap-3">
              <input
                type="checkbox"
                checked={allowRemote}
                onChange={(e) => setAllowRemote(e.target.checked)}
                className="h-5 w-5 rounded border-gray-300 text-primary focus:ring-primary"
              />
              <span className="text-sm">Allow remote work</span>
            </div>
            <div>
              <Label htmlFor="max-leave" className="text-sm">
                Max Leave Days
              </Label>
              <Input
                id="max-leave"
                type="number"
                value={maxLeaveDays}
                onChange={(e) => setMaxLeaveDays(e.target.value)}
                className="mt-2 h-11"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex justify-end gap-3 pt-6 border-t">
        <Button variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button onClick={handleSubmit}>Save</Button>
      </div>
    </div>
  );
}

// ---------- Department Detail (unchanged) ----------
function DepartmentDetail({
  department,
  staffList,
  onEdit,
  onDelete,
}: {
  department: Department;
  staffList: any[];
  onEdit: () => void;
  onDelete: () => void;
}) {
  const members = staffList.filter((s) => s.department === department.name);
  const head = staffList.find((s) => s.id === department.headId);

  return (
    <div className="space-y-10 py-4">
      {/* Header & Actions */}
      <div className="flex items-start justify-between gap-6">
        <div>
          <h2 className="text-3xl font-bold">{department.name}</h2>
          <p className="text-muted-foreground mt-2 leading-relaxed">
            {department.description}
          </p>
        </div>
        <div className="flex gap-2 shrink-0">
          <Button variant="outline" size="sm" onClick={onEdit}>
            <Pencil className="h-4 w-4 mr-2" /> Edit
          </Button>
          <Button
            variant="ghost"
            size="sm"
            className="text-destructive hover:text-destructive"
            onClick={onDelete}
          >
            <Trash2 className="h-4 w-4 mr-2" /> Delete
          </Button>
        </div>
      </div>

      {/* Metrics Cards */}
      <div className="grid grid-cols-3 gap-6">
        <Card className="bg-primary/5 border-primary/20">
          <CardContent className="p-6 text-center">
            <p className="text-4xl font-bold text-primary">{members.length}</p>
            <p className="text-sm text-muted-foreground mt-2">Members</p>
          </CardContent>
        </Card>
        <Card className="bg-primary/5 border-primary/20">
          <CardContent className="p-6 text-center">
            <p className="text-4xl font-bold text-primary truncate">
              {head ? `${head.firstName} ${head.lastName}` : "—"}
            </p>
            <p className="text-sm text-muted-foreground mt-2">Head</p>
          </CardContent>
        </Card>
        <Card className="bg-primary/5 border-primary/20">
          <CardContent className="p-6 text-center">
            <p className="text-4xl font-bold text-primary">
              {department.config?.allowRemote ? "Yes" : "No"}
            </p>
            <p className="text-sm text-muted-foreground mt-2">Remote</p>
          </CardContent>
        </Card>
      </div>

      {/* Members List */}
      <div className="space-y-4">
        <h3 className="text-xl font-semibold">Assigned Members</h3>
        {members.length === 0 ? (
          <p className="text-muted-foreground text-sm">
            No members in this department.
          </p>
        ) : (
          <div className="rounded-lg border overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="py-4">Name</TableHead>
                  <TableHead className="py-4">Role</TableHead>
                  <TableHead className="py-4">Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {members.map((m) => (
                  <TableRow key={m.id}>
                    <TableCell className="py-4">
                      {m.firstName} {m.lastName}
                    </TableCell>
                    <TableCell className="py-4">{m.roleId}</TableCell>
                    <TableCell className="py-4">
                      <Badge
                        variant={m.status === "active" ? "success" : "destructive"}
                      >
                        {m.status}
                      </Badge>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </div>

      {/* Configuration */}
      <div className="space-y-4">
        <h3 className="text-xl font-semibold">Configuration</h3>
        <div className="bg-muted/30 rounded-lg p-6 space-y-4">
          <div className="flex justify-between items-center">
            <span className="text-muted-foreground">Allow Remote Work</span>
            <span className="font-medium text-lg">
              {department.config?.allowRemote ? "Yes" : "No"}
            </span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-muted-foreground">Max Leave Days</span>
            <span className="font-medium text-lg">
              {department.config?.maxLeaveDays ?? "Not set"}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}