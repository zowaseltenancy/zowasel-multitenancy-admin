import { z } from "zod";

export const createLeadSchema = z.object({
  businessName: z.string().min(2, "Business name must be at least 2 characters"),
  contactName: z.string().min(2, "Contact name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  phone: z.string().min(8, "Phone number is required"),
  intendedType: z.enum(["merchant", "agrodealer", "cooperative", "buyer"]),
  source: z.enum([
    "referral",
    "marketing_campaign",
    "field_agent",
    "inbound_website",
    "partner_organization",
  ]),
  notes: z.string().optional(),
});

export type CreateLeadSchema = z.infer<typeof createLeadSchema>;
