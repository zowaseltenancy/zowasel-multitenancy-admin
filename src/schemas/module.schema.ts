import { z } from "zod";

export const moduleCategoryEnum = z.enum([
  "croppilot",
  "marketplace",
  "analytics",
  "export_management",
  "supply_chain",
  "carbon_sustainability",
]);

export const createModuleSchema = z.object({
  name: z.string().min(2, "Module name must be at least 2 characters").max(60, "Module name cannot exceed 60 characters"),
  description: z.string().min(5, "Description must be at least 5 characters").max(300, "Description cannot exceed 300 characters"),
  category: moduleCategoryEnum,
  requiresKyb: z.boolean(),
  isPaid: z.boolean(),
  pricePerMonth: z.number().min(0, "Price cannot be negative"),
  parentId: z.string().nullable(),
});

export const updateModulePricingSchema = z.object({
  isPaid: z.boolean(),
  pricePerMonth: z.number().min(0, "Price cannot be negative"),
});

export const createSubModuleSchema = z.object({
  name: z.string().min(2, "Sub-module name must be at least 2 characters").max(60, "Sub-module name cannot exceed 60 characters"),
  description: z.string().min(5, "Description must be at least 5 characters").max(300, "Description cannot exceed 300 characters"),
  requiresKyb: z.boolean(),
  parentId: z.string().min(1, "Parent module ID is required"),
});

export type CreateModuleFormValues = z.infer<typeof createModuleSchema>;
export type UpdateModulePricingFormValues = z.infer<typeof updateModulePricingSchema>;
export type CreateSubModuleFormValues = z.infer<typeof createSubModuleSchema>;
