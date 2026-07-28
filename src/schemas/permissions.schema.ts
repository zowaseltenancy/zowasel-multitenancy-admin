import { z } from "zod";

export const roleFormSchema = z.object({
  name: z.string().min(2, "Role name must be at least 2 characters").max(50, "Role name cannot exceed 50 characters"),
  description: z.string().min(5, "Description must be at least 5 characters").max(200, "Description cannot exceed 200 characters"),
  permissions: z.array(z.string()).min(1, "Select at least one permission scope for this role"),
});

export type RoleFormValues = z.infer<typeof roleFormSchema>;
