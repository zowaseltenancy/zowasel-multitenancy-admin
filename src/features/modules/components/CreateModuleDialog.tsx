"use client";

import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Package, DollarSign } from "lucide-react";
import { toast } from "sonner";

import { ModuleCategory } from "@/types/module";
import {
  createModuleSchema,
  CreateModuleFormValues,
} from "@/schemas/module.schema";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface CreateModuleDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmitModule: (values: CreateModuleFormValues) => void;
}

export default function CreateModuleDialog({
  open,
  onOpenChange,
  onSubmitModule,
}: CreateModuleDialogProps) {
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<CreateModuleFormValues>({
    resolver: zodResolver(createModuleSchema),
    defaultValues: {
      name: "",
      description: "",
      category: "croppilot",
      requiresKyb: false,
      isPaid: false,
      pricePerMonth: 0,
      parentId: null,
    },
  });

  const isPaid = watch("isPaid");
  const category = watch("category");

  useEffect(() => {
    if (open) {
      reset({
        name: "",
        description: "",
        category: "croppilot",
        requiresKyb: false,
        isPaid: false,
        pricePerMonth: 0,
        parentId: null,
      });
    }
  }, [open, reset]);

  const onSubmit = (values: CreateModuleFormValues) => {
    try {
      onSubmitModule(values);
      toast.success(`Core Module "${values.name}" created successfully`);
      onOpenChange(false);
    } catch {
      toast.error("Failed to create module");
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-xl">
            <Package className="h-5 w-5 text-primary" />
            Create Core Module
          </DialogTitle>
          <DialogDescription>
            Core modules represent top-level platform product capabilities. Configure pricing, KYB requirements, and categories.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 py-2">
          <div className="space-y-1.5">
            <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Module Name <span className="text-destructive">*</span>
            </label>
            <Input
              {...register("name")}
              placeholder="e.g. Soil Carbon & Agroforestry"
            />
            {errors.name && (
              <p className="text-xs text-destructive">{errors.name.message}</p>
            )}
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Category <span className="text-destructive">*</span>
            </label>
            <Select
              value={category}
              onValueChange={(val) => setValue("category", val as ModuleCategory)}
            >
              <SelectTrigger className="text-xs">
                <SelectValue placeholder="Select Category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="croppilot">CropPilot Core</SelectItem>
                <SelectItem value="marketplace">Marketplace</SelectItem>
                <SelectItem value="analytics">Analytics</SelectItem>
                <SelectItem value="export_management">Export Management</SelectItem>
                <SelectItem value="supply_chain">Supply Chain</SelectItem>
                <SelectItem value="carbon_sustainability">Carbon & Sustainability</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Description <span className="text-destructive">*</span>
            </label>
            <Textarea
              {...register("description")}
              placeholder="Briefly describe what capability this module unlocks for tenant agribusinesses..."
              rows={3}
            />
            {errors.description && (
              <p className="text-xs text-destructive">{errors.description.message}</p>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2 border-t">
            <div className="flex items-center gap-2 p-3 rounded-lg border bg-accent/20">
              <Checkbox
                id="requiresKyb"
                checked={watch("requiresKyb")}
                onCheckedChange={(v) => setValue("requiresKyb", !!v)}
              />
              <label htmlFor="requiresKyb" className="text-xs font-medium cursor-pointer">
                Requires KYB Approval
              </label>
            </div>

            <div className="flex items-center gap-2 p-3 rounded-lg border bg-accent/20">
              <Checkbox
                id="isPaid"
                checked={isPaid}
                onCheckedChange={(v) => {
                  setValue("isPaid", !!v);
                  if (!v) setValue("pricePerMonth", 0);
                }}
              />
              <label htmlFor="isPaid" className="text-xs font-medium cursor-pointer">
                Paid Subscription Module
              </label>
            </div>
          </div>

          {isPaid && (
            <div className="space-y-1.5 p-3 rounded-lg bg-emerald-500/5 border border-emerald-500/20">
              <label className="text-xs font-semibold uppercase tracking-wider text-emerald-700 dark:text-emerald-400">
                Monthly Price (USD) <span className="text-destructive">*</span>
              </label>
              <div className="relative">
                <DollarSign className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  type="number"
                  min="0"
                  step="1"
                  className="pl-8 text-xs"
                  placeholder="e.g. 49"
                  {...register("pricePerMonth", { valueAsNumber: true })}
                />
              </div>
              {errors.pricePerMonth && (
                <p className="text-xs text-destructive">{errors.pricePerMonth.message}</p>
              )}
            </div>
          )}

          <DialogFooter className="pt-4 border-t">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              Create Core Module
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
