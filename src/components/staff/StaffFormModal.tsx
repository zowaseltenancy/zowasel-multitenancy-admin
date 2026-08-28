"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Loader2 } from "lucide-react";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useStaff } from "@/hooks/useStaff";

const staffSchema = z.object({
  firstName: z.string().min(2, "First name is required"),
  lastName: z.string().min(2, "Last name is required"),
  email: z.string().email("Invalid email"),
  phone: z.string().optional(),
  department: z.string().min(1, "Department required"),
  roleId: z.string().min(1, "Role required"),
  status: z.enum(["active", "inactive", "pending"]),
});

type StaffFormValues = z.infer<typeof staffSchema>;

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  staff?: any | null;
  roles: any[];
  onSaved?: () => void;
}

export default function StaffFormModal({ open, onOpenChange, staff, roles, onSaved }: Props) {
  const { repo } = useStaff();
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
    reset,
  } = useForm<StaffFormValues>({
    resolver: zodResolver(staffSchema),
    defaultValues: staff
      ? {
          firstName: staff.firstName,
          lastName: staff.lastName,
          email: staff.email,
          phone: staff.phone || "",
          department: staff.department,
          roleId: staff.roleId,
          status: staff.status,
        }
      : {
          firstName: "",
          lastName: "",
          email: "",
          phone: "",
          department: "",
          roleId: "",
          status: "active",
        },
  });

  const onSubmit = async (data: StaffFormValues) => {
    setSubmitting(true);
    setError(null);
    try {
      if (staff) {
        repo.updateStaff(staff.id, data);
      } else {
        repo.addStaff(data);
      }
      onSaved?.();
      reset();
    } catch (err: any) {
      setError(err.message || "Something went wrong");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>{staff ? "Edit Staff" : "Add New Staff"}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="firstName">First Name</Label>
              <Input id="firstName" {...register("firstName")} />
              {errors.firstName && (
                <p className="text-sm text-destructive mt-1">{errors.firstName.message}</p>
              )}
            </div>
            <div>
              <Label htmlFor="lastName">Last Name</Label>
              <Input id="lastName" {...register("lastName")} />
              {errors.lastName && (
                <p className="text-sm text-destructive mt-1">{errors.lastName.message}</p>
              )}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="email">Email</Label>
              <Input id="email" type="email" {...register("email")} />
              {errors.email && (
                <p className="text-sm text-destructive mt-1">{errors.email.message}</p>
              )}
            </div>
            <div>
              <Label htmlFor="phone">Phone</Label>
              <Input id="phone" {...register("phone")} />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label>Department</Label>
              <Select
                onValueChange={(value) => setValue("department", value)}
                defaultValue={watch("department")}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select department" />
                </SelectTrigger>
                <SelectContent>
                  {["Executive", "Technology", "Programs", "Fintech", "Sales", "Finance", "Administration", "Compliance", "Regional Operations"].map((dept) => (
                    <SelectItem key={dept} value={dept}>
                      {dept}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.department && (
                <p className="text-sm text-destructive mt-1">{errors.department.message}</p>
              )}
            </div>
            <div>
              <Label>Role</Label>
              <Select
                onValueChange={(value) => setValue("roleId", value)}
                defaultValue={watch("roleId")}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select role" />
                </SelectTrigger>
                <SelectContent>
                  {roles.map((role) => (
                    <SelectItem key={role.id} value={role.id}>
                      {role.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.roleId && (
                <p className="text-sm text-destructive mt-1">{errors.roleId.message}</p>
              )}
            </div>
          </div>

          <div>
            <Label>Status</Label>
            <Select
              onValueChange={(value: any) => setValue("status", value)}
              defaultValue={watch("status")}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="inactive">Inactive</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {error && <p className="text-sm text-destructive">{error}</p>}

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={submitting}>
              {submitting && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
              {staff ? "Save Changes" : "Create Staff"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}