"use client";

import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { UserPlus, Loader2 } from "lucide-react";

import { createUserSchema, CreateUserSchema } from "@/schemas/user.schema";
import { CATEGORY_ROLE_OPTIONS, USER_CATEGORY_LABELS } from "@/constants/user";
import { PlatformUserCategory } from "@/types/user";
import { Organization } from "@/types/organization";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  organizations: Organization[];
  onCreate: (values: CreateUserSchema) => void;
  /** The create request is in flight; the dialog stays open until it settles. */
  isCreating?: boolean;
}

// Staff are a separate domain — not creatable from the Platform Users dialog.
const CATEGORIES = (Object.keys(USER_CATEGORY_LABELS) as PlatformUserCategory[]).filter(
  (category) => category !== "staff"
);

export default function CreateUserDialog({
  open,
  onOpenChange,
  organizations,
  onCreate,
  isCreating = false,
}: Props) {
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<CreateUserSchema>({
    resolver: zodResolver(createUserSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      phone: "",
      gender: "female",
      userCategory: "merchant",
      role: "Input Merchant",
      organizationId: "",
    },
  });

  useEffect(() => {
    if (open) {
      reset();
    }
  }, [open, reset]);

  const category = watch("userCategory");
  const roleOptions = CATEGORY_ROLE_OPTIONS[category] ?? [];

  const handleCategoryChange = (value: PlatformUserCategory | null) => {
    if (!value) return;
    setValue("userCategory", value);
    // Staff-only roles (Continental/Regional/Country directors) never appear
    // in these category lists, so this is always a schema-valid role.
    setValue("role", CATEGORY_ROLE_OPTIONS[value][0] as CreateUserSchema["role"]);
  };

  // No close here. onCreate starts a request; closing on the click reported
  // success for a duplicate email that the server went on to reject, and threw
  // away everything the operator had typed. The parent closes this on the
  // mutation settling.
  const onSubmit = (values: CreateUserSchema) => {
    onCreate(values);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <UserPlus className="h-4 w-4 text-primary" />
            Add Platform User
          </DialogTitle>
          <DialogDescription>
            Create a new agent, merchant, agrodealer, cooperative leader, or buyer account.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-semibold text-muted-foreground">First Name</label>
              <Input {...register("firstName")} placeholder="Chinelo" />
              {errors.firstName && (
                <p className="mt-1 text-xs text-destructive">{errors.firstName.message}</p>
              )}
            </div>
            <div>
              <label className="text-xs font-semibold text-muted-foreground">Last Name</label>
              <Input {...register("lastName")} placeholder="Umeh" />
              {errors.lastName && (
                <p className="mt-1 text-xs text-destructive">{errors.lastName.message}</p>
              )}
            </div>
          </div>

          <div>
            <label className="text-xs font-semibold text-muted-foreground">Email</label>
            <Input {...register("email")} placeholder="chinelo@example.com" />
            {errors.email && (
              <p className="mt-1 text-xs text-destructive">{errors.email.message}</p>
            )}
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-semibold text-muted-foreground">Phone</label>
              <Input {...register("phone")} placeholder="+234 801 234 5678" />
              {errors.phone && (
                <p className="mt-1 text-xs text-destructive">{errors.phone.message}</p>
              )}
            </div>

            <div>
              <label className="text-xs font-semibold text-muted-foreground">Gender</label>
              <Select
                value={watch("gender")}
                onValueChange={(value) => setValue("gender", value as CreateUserSchema["gender"])}
              >
                <SelectTrigger className="w-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="female">Female</SelectItem>
                  <SelectItem value="male">Male</SelectItem>
                  <SelectItem value="other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-semibold text-muted-foreground">Entity Type</label>
              <Select value={category} onValueChange={handleCategoryChange}>
                <SelectTrigger className="w-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {CATEGORIES.map((key) => (
                    <SelectItem key={key} value={key}>
                      {USER_CATEGORY_LABELS[key]}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="text-xs font-semibold text-muted-foreground">Role</label>
              <Select
                value={watch("role")}
                onValueChange={(value) => setValue("role", value as CreateUserSchema["role"])}
              >
                <SelectTrigger className="w-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {roleOptions.map((role) => (
                    <SelectItem key={role} value={role}>
                      {role}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div>
            <label className="text-xs font-semibold text-muted-foreground">Organization</label>
            <Select
              value={watch("organizationId")}
              onValueChange={(value) => setValue("organizationId", value ?? "")}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select an organization" />
              </SelectTrigger>
              <SelectContent>
                {organizations.map((org) => (
                  <SelectItem key={org.id} value={org.id}>
                    {org.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.organizationId && (
              <p className="mt-1 text-xs text-destructive">{errors.organizationId.message}</p>
            )}
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={isSubmitting || isCreating}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting || isCreating} className="gap-1.5">
              {isCreating && <Loader2 className="h-4 w-4 animate-spin" />}
              Create User
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
