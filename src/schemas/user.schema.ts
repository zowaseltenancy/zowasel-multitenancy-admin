import { z } from "zod";

export const createUserSchema = z.object({
  firstName: z.string().min(2, "First name must be at least 2 characters"),
  lastName: z.string().min(2, "Last name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  phone: z.string().min(8, "Phone number is required"),
  role: z.enum([
    "Super Admin",
    "Tenant Admin",
    "Programme Manager",
    "Field Supervisor",
    "Field Agent",
    "Agronomist",
    "Data Analyst",
    "Farmer (Self-service)",
  ]),
  organizationId: z.string().min(1, "Organization is required"),
});

export type CreateUserSchema = z.infer<typeof createUserSchema>;
