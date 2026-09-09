import { ApiMeta } from "@/lib/api-response";

export type LeadStageDto =
  | "NEW"
  | "CONTACTED"
  | "QUALIFIED"
  | "PROPOSAL"
  | "NEGOTIATION"
  | "CLOSED_WON"
  | "CLOSED_LOST";

export type LeadStatusDto = "OPEN" | "CLOSED" | "DISQUALIFIED" | "CONVERTED";

export interface LeadDto {
  id: string;
  name: string;
  email: string | null;
  phone: string | null;
  source: string | null;
  type: string | null;
  typeMetadata: Record<string, unknown> | null;
  stage: LeadStageDto;
  status: LeadStatusDto;
  assignedTo: { id: string; firstName: string | null; lastName: string | null } | null;
  department: { id: string; name: string } | null;
  convertedTenantId: string | null;
  convertedAt: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface ListLeadsQuery {
  page?: number;
  limit?: number;
  search?: string;
  type?: string;
  stage?: LeadStageDto | string;
  status?: LeadStatusDto | string;
  assignedToId?: string;
  departmentId?: string;
}

export interface LeadsListResult {
  items: LeadDto[];
  meta: ApiMeta;
}

export interface UpdateLeadStageRequest {
  stage: LeadStageDto;
  status?: LeadStatusDto;
  disqualificationReason?: string;
  note?: string;
}

/**
 * Two modes, and the difference is whether the business already exists.
 *
 * Sending `tenantId` links the lead to an existing business. Omitting it makes
 * the server provision one from the lead — tenant, owner account, OWNER
 * membership, and a single-use onboarding invitation emailed to the owner. The
 * console takes the second path: it has a won lead and no business to link.
 */
export interface ConvertLeadRequest {
  tenantId?: string;
  note?: string;
  /** Overrides for what the lead itself cannot supply. */
  owner?: {
    email?: string;
    firstName?: string;
    lastName?: string;
  };
  business?: {
    name?: string;
    type?: string;
    email?: string;
    phone?: string;
  };
}

// ── Create ───────────────────────────────────────────────────────────────────
// Discriminated on `type`: the server validates typeMetadata `.strict()` per
// classification, so the wrong shape is a 422 rather than a partial save.

export interface CorporateLeadMetadata {
  cacNumber: string;
  taxId: string;
  annualTurnover: number;
  decisionMaker: { name: string; title?: string; phone?: string; email?: string };
}

export interface MerchantLeadMetadata {
  storeName: string;
  outletGps: { lat: number; lng: number };
  posCount: number;
  monthlyVolume: number;
}

export interface AgroDealerLeadMetadata {
  licenseNo: string;
  storageMt: number;
  inputSpecialties: string[];
  lgaCoverage: string[];
}

export type CreateLeadRequest =
  | { name: string; email?: string; phone?: string; source?: string; assignedToId?: string; departmentId?: string; type: "CORPORATE"; typeMetadata: CorporateLeadMetadata }
  | { name: string; email?: string; phone?: string; source?: string; assignedToId?: string; departmentId?: string; type: "MERCHANT"; typeMetadata: MerchantLeadMetadata }
  | { name: string; email?: string; phone?: string; source?: string; assignedToId?: string; departmentId?: string; type: "AGRO_DEALER"; typeMetadata: AgroDealerLeadMetadata };
