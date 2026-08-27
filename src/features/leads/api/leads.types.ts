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

export interface ConvertLeadRequest {
  tenantId: string;
  note?: string;
}
