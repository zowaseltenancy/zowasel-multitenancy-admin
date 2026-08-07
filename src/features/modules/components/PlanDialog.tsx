"use client";

import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Layers, DollarSign } from "lucide-react";

import { createPlanSchema, CreatePlanFormValues } from "@/schemas/module.schema";
import { Module, ModuleProduct } from "@/types/module";

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

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  product: ModuleProduct | "platform";
  // Every core + sub-module that product actually has, so the admin can
  // pick exactly what's in the bundle — flexible, per Busayo's Aug 7 spec.
  availableModules: Module[];
  onSubmitPlan: (values: CreatePlanFormValues) => void;
  initialValues?: CreatePlanFormValues;
  title?: string;
}

export default function PlanDialog({
  open,
  onOpenChange,
  product,
  availableModules,
  onSubmitPlan,
  initialValues,
  title,
}: Props) {
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<CreatePlanFormValues>({
    resolver: zodResolver(createPlanSchema),
    defaultValues: initialValues ?? {
      product,
      name: "",
      description: "",
      pricePerMonth: 0,
      includedModuleIds: [],
    },
  });

  const includedModuleIds = watch("includedModuleIds") ?? [];

  useEffect(() => {
    if (open) {
      reset(
        initialValues ?? {
          product,
          name: "",
          description: "",
          pricePerMonth: 0,
          includedModuleIds: [],
        }
      );
    }
  }, [open, reset, product, initialValues]);

  const toggleModule = (moduleId: string) => {
    const next = includedModuleIds.includes(moduleId)
      ? includedModuleIds.filter((id) => id !== moduleId)
      : [...includedModuleIds, moduleId];
    setValue("includedModuleIds", next);
  };

  const onSubmit = (values: CreatePlanFormValues) => {
    onSubmitPlan(values);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-xl">
            <Layers className="h-5 w-5 text-primary" />
            {title ?? "Create Plan"}
          </DialogTitle>
          <DialogDescription>
            Pick which core modules and/or sub-modules this plan bundles, and set its price.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 py-2">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Plan Name <span className="text-destructive">*</span>
              </label>
              <Input {...register("name")} placeholder="e.g. Growth" />
              {errors.name && <p className="text-xs text-destructive">{errors.name.message}</p>}
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Price / Month (USD) <span className="text-destructive">*</span>
              </label>
              <div className="relative">
                <DollarSign className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  type="number"
                  min="0"
                  className="pl-8 text-xs"
                  {...register("pricePerMonth", { valueAsNumber: true })}
                />
              </div>
              {errors.pricePerMonth && (
                <p className="text-xs text-destructive">{errors.pricePerMonth.message}</p>
              )}
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Description <span className="text-destructive">*</span>
            </label>
            <Textarea {...register("description")} rows={2} placeholder="What this plan is for..." />
            {errors.description && (
              <p className="text-xs text-destructive">{errors.description.message}</p>
            )}
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Included Modules
            </label>
            {availableModules.length === 0 ? (
              <p className="text-xs text-muted-foreground italic p-3 border rounded-lg">
                This product has no modules yet to bundle.
              </p>
            ) : (
              <div className="max-h-56 overflow-y-auto space-y-1 border rounded-lg p-2">
                {availableModules.map((mod) => (
                  <label
                    key={mod.id}
                    className="flex items-center gap-2 p-2 rounded-md hover:bg-accent/40 cursor-pointer text-xs"
                  >
                    <Checkbox
                      checked={includedModuleIds.includes(mod.id)}
                      onCheckedChange={() => toggleModule(mod.id)}
                    />
                    <span className={mod.parentId ? "text-muted-foreground pl-3" : "font-semibold text-foreground"}>
                      {mod.parentId ? "↳ " : ""}
                      {mod.name}
                    </span>
                  </label>
                ))}
              </div>
            )}
          </div>

          <DialogFooter className="pt-4 border-t">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {title?.startsWith("Edit") ? "Save Changes" : "Create Plan"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
