import { z } from "zod";

// The create-lead payload is a discriminated union server-side: POST
// /admin/leads requires a `typeMetadata` object whose shape depends entirely on
// the classification, and it is validated `.strict()` — so extra keys are
// rejected and missing ones 422.
//
// The UI offers four intended types against the API's three. cooperative and
// buyer both map to CORPORATE, since the CORPORATE metadata (CAC number, tax
// ID, turnover, decision maker) is what an incorporated entity has; merchant
// and agrodealer map one-to-one.

const contactShared = {
  businessName: z.string().min(2, "Business name must be at least 2 characters"),
  contactName: z.string().min(2, "Contact name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  phone: z.string().min(8, "Phone number is required"),
  source: z.enum([
    "referral",
    "marketing_campaign",
    "field_agent",
    "inbound_website",
    "partner_organization",
  ]),
  countryCode: z.string().min(1, "Country is required"),
  notes: z.string().optional(),
};

// Coerced because these arrive from number inputs as strings.
const nonNegativeNumber = (label: string) =>
  z.coerce.number({ error: `${label} must be a number` }).nonnegative(`${label} cannot be negative`);

const csvList = (label: string) =>
  z
    .string()
    .min(1, `${label} is required`)
    .transform((value) => value.split(",").map((item) => item.trim()).filter(Boolean))
    .refine((list) => list.length > 0, `${label} is required`);

export const createLeadSchema = z.discriminatedUnion("intendedType", [
  z.object({
    ...contactShared,
    intendedType: z.literal("merchant"),
    storeName: z.string().min(2, "Store name is required"),
    outletLat: z.coerce.number().min(-90, "Latitude must be between -90 and 90").max(90),
    outletLng: z.coerce.number().min(-180, "Longitude must be between -180 and 180").max(180),
    posCount: z.coerce.number().int("POS count must be a whole number").nonnegative("POS count cannot be negative"),
    monthlyVolume: nonNegativeNumber("Monthly volume"),
  }),
  z.object({
    ...contactShared,
    intendedType: z.literal("agrodealer"),
    licenseNo: z.string().min(1, "License number is required"),
    storageMt: nonNegativeNumber("Storage capacity"),
    inputSpecialties: csvList("At least one input specialty"),
    lgaCoverage: csvList("At least one LGA"),
  }),
  // cooperative and buyer share the CORPORATE shape.
  z.object({
    ...contactShared,
    intendedType: z.literal("cooperative"),
    cacNumber: z.string().min(1, "CAC registration number is required"),
    taxId: z.string().min(1, "Tax ID is required"),
    annualTurnover: nonNegativeNumber("Annual turnover"),
    decisionMakerTitle: z.string().optional(),
  }),
  z.object({
    ...contactShared,
    intendedType: z.literal("buyer"),
    cacNumber: z.string().min(1, "CAC registration number is required"),
    taxId: z.string().min(1, "Tax ID is required"),
    annualTurnover: nonNegativeNumber("Annual turnover"),
    decisionMakerTitle: z.string().optional(),
  }),
]);

export type CreateLeadSchema = z.infer<typeof createLeadSchema>;
/** The form's own shape before zod's coercions — what the inputs bind to. */
export type CreateLeadFormValues = z.input<typeof createLeadSchema>;

export const updateLeadSchema = z.object({
  businessName: z.string().min(2, "Business name must be at least 2 characters"),
  contactName: z.string().min(2, "Contact name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  phone: z.string().min(8, "Phone number is required"),
  source: z.enum([
    "referral",
    "marketing_campaign",
    "field_agent",
    "inbound_website",
    "partner_organization",
  ]),
  notes: z.string().optional(),

  // Merchant fields
  storeName: z.string().optional(),
  outletLat: z.union([z.coerce.number().min(-90, "Latitude must be between -90 and 90").max(90), z.literal(""), z.nan()]).optional(),
  outletLng: z.union([z.coerce.number().min(-180, "Longitude must be between -180 and 180").max(180), z.literal(""), z.nan()]).optional(),
  posCount: z.union([z.coerce.number().int("POS count must be a whole number").nonnegative("POS count cannot be negative"), z.literal(""), z.nan()]).optional(),
  monthlyVolume: z.union([z.coerce.number().nonnegative("Monthly volume cannot be negative"), z.literal(""), z.nan()]).optional(),

  // Agrodealer fields
  licenseNo: z.string().optional(),
  storageMt: z.union([z.coerce.number().nonnegative("Storage capacity cannot be negative"), z.literal(""), z.nan()]).optional(),
  inputSpecialties: z.string().optional(),
  lgaCoverage: z.string().optional(),

  // Cooperative / Buyer fields
  cacNumber: z.string().optional(),
  taxId: z.string().optional(),
  annualTurnover: z.union([z.coerce.number().nonnegative("Annual turnover cannot be negative"), z.literal(""), z.nan()]).optional(),
  decisionMakerTitle: z.string().optional(),
});

export type UpdateLeadSchema = z.infer<typeof updateLeadSchema>;
export type UpdateLeadFormValues = z.input<typeof updateLeadSchema>;
