"use client";

import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Shield, Lock } from "lucide-react";
import { toast } from "sonner";

import { Role } from "@/types/permissions";
import { roleFormSchema, RoleFormValues } from "@/schemas/permissions.schema";
import { PERMISSION_GROUPS } from "@/constants/permissions";

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
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";

interface RoleFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  roleToEdit?: Role | null;
  onSubmitRole: (values: RoleFormValues) => void;
}

export default function RoleFormDialog({
  open,
  onOpenChange,
  roleToEdit,
  onSubmitRole,
}: RoleFormDialogProps) {
  const isEditing = !!roleToEdit;

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<RoleFormValues>({
    resolver: zodResolver(roleFormSchema),
    defaultValues: {
      name: "",
      description: "",
      permissions: [],
    },
  });

  const selectedPermissions = watch("permissions") || [];

  useEffect(() => {
    if (open) {
      if (roleToEdit) {
        reset({
          name: roleToEdit.name,
          description: roleToEdit.description,
          permissions: roleToEdit.permissions,
        });
      } else {
        reset({
          name: "",
          description: "",
          permissions: [],
        });
      }
    }
  }, [open, roleToEdit, reset]);

  const togglePermission = (code: string) => {
    if (roleToEdit?.isSystemRole) return;
    const current = new Set(selectedPermissions);
    if (current.has(code)) {
      current.delete(code);
    } else {
      current.add(code);
    }
    setValue("permissions", Array.from(current), { shouldValidate: true });
  };

  const toggleCategory = (category: string, enable: boolean) => {
    if (roleToEdit?.isSystemRole) return;
    const group = PERMISSION_GROUPS.find((g) => g.category === category);
    if (!group) return;

    const current = new Set(selectedPermissions);
    group.permissions.forEach((p) => {
      if (enable) {
        current.add(p.code);
      } else {
        current.delete(p.code);
      }
    });
    setValue("permissions", Array.from(current), { shouldValidate: true });
  };

  const onSubmit = (values: RoleFormValues) => {
    try {
      onSubmitRole(values);
      toast.success(
        isEditing
          ? `Role "${values.name}" updated successfully`
          : `Custom role "${values.name}" created successfully`
      );
      onOpenChange(false);
    } catch {
      toast.error("Failed to save role configuration");
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[85vh] flex flex-col">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-xl">
            <Shield className="h-5 w-5 text-primary" />
            {isEditing ? `Edit Role: ${roleToEdit?.name}` : "Create Custom Role"}
          </DialogTitle>
          <DialogDescription>
            {isEditing
              ? "Modify the name, description, and permission scope assignments for this role."
              : "Define a new access role and select which permission scopes are granted."}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="flex-1 overflow-y-auto space-y-6 pr-1 py-2">
          {roleToEdit?.isSystemRole && (
            <div className="flex items-center gap-2 p-3 rounded-lg bg-amber-500/10 text-amber-700 dark:text-amber-400 text-xs font-medium border border-amber-500/20">
              <Lock className="h-4 w-4 shrink-0" />
              <span>
                System roles are protected to preserve core platform operational integrity.
              </span>
            </div>
          )}

          <div className="space-y-4">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Role Name <span className="text-destructive">*</span>
              </label>
              <Input
                {...register("name")}
                placeholder="e.g. Compliance Manager"
                disabled={roleToEdit?.isSystemRole}
              />
              {errors.name && (
                <p className="text-xs text-destructive">{errors.name.message}</p>
              )}
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Description <span className="text-destructive">*</span>
              </label>
              <Textarea
                {...register("description")}
                placeholder="Briefly describe what responsibilities this role entails..."
                rows={2}
                disabled={roleToEdit?.isSystemRole}
              />
              {errors.description && (
                <p className="text-xs text-destructive">{errors.description.message}</p>
              )}
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between border-b pb-2">
              <div>
                <h4 className="text-sm font-semibold">Permission Scopes</h4>
                <p className="text-xs text-muted-foreground">
                  Select the explicit actions accounts with this role are permitted to take.
                </p>
              </div>
              <div className="text-xs text-muted-foreground font-medium">
                {selectedPermissions.length} selected
              </div>
            </div>
            {errors.permissions && (
              <p className="text-xs text-destructive font-medium">
                {errors.permissions.message}
              </p>
            )}

            <div className="space-y-6">
              {PERMISSION_GROUPS.map((group) => {
                const groupCodes = group.permissions.map((p) => p.code);
                const allSelected = groupCodes.every((c) => selectedPermissions.includes(c));

                return (
                  <div
                    key={group.category}
                    className="p-4 rounded-xl border border-border/80 bg-accent/20 space-y-3"
                  >
                    <div className="flex items-center justify-between gap-2">
                      <div className="min-w-0 flex-1">
                        <h5 className="font-semibold text-sm truncate">{group.label}</h5>
                        <p className="text-xs text-muted-foreground break-words">{group.description}</p>
                      </div>

                      {!roleToEdit?.isSystemRole && (
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={() => toggleCategory(group.category, !allSelected)}
                          className="text-xs text-primary h-7 px-2 hover:bg-primary/10 shrink-0"
                        >
                          {allSelected ? "Deselect All" : "Select All Category"}
                        </Button>
                      )}
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5 pt-1">
                      {group.permissions.map((permission) => {
                        const isChecked = selectedPermissions.includes(permission.code);
                        return (
                          <div
                            key={permission.code}
                            onClick={() => togglePermission(permission.code)}
                            className={`flex items-start gap-3 p-3 rounded-lg border-2 transition-all select-none w-full min-w-0 overflow-hidden ${
                              isChecked
                                ? "bg-primary/10 border-primary shadow-xs"
                                : "bg-card border-neutral-200 dark:border-neutral-700 hover:border-primary/50 hover:bg-muted/40"
                            } ${
                              roleToEdit?.isSystemRole
                                ? "cursor-not-allowed opacity-75"
                                : "cursor-pointer"
                            }`}
                          >
                            <Checkbox
                              checked={isChecked}
                              onCheckedChange={() => togglePermission(permission.code)}
                              disabled={roleToEdit?.isSystemRole}
                              className="mt-0.5 size-4.5 border-2 border-neutral-400 dark:border-neutral-500 shrink-0"
                            />
                            <div className="space-y-0.5 min-w-0 flex-1 overflow-hidden">
                              <div className="flex items-center gap-1.5 flex-wrap">
                                <span className="text-xs font-semibold text-foreground break-words">
                                  {permission.name}
                                </span>
                                {permission.isSensitive && (
                                  <span className="text-[10px] bg-red-500/15 text-red-600 dark:text-red-400 font-semibold px-1.5 py-0.5 rounded shrink-0">
                                    Sensitive
                                  </span>
                                )}
                              </div>
                              <p className="text-[11px] text-muted-foreground leading-normal break-words text-pretty">
                                {permission.description}
                              </p>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <DialogFooter className="pt-4 border-t">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
            >
              Cancel
            </Button>
            {!roleToEdit?.isSystemRole && (
              <Button type="submit" disabled={isSubmitting}>
                {isEditing ? "Save Changes" : "Create Role"}
              </Button>
            )}
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
