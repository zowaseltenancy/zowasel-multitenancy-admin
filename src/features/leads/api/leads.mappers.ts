import { Lead, LeadIntendedType, LeadSource, LeadStatus } from "@/types/lead";
import { LeadDto } from "./leads.types";

function toLeadStatus(dto: LeadDto): LeadStatus {
  if (dto.status === "CONVERTED") return "converted";
  if (dto.status === "DISQUALIFIED" || dto.stage === "CLOSED_LOST") return "lost";
  if (dto.stage === "CLOSED_WON" || dto.stage === "QUALIFIED" || dto.stage === "PROPOSAL" || dto.stage === "NEGOTIATION") {
    return "ready_to_convert";
  }
  return "incomplete";
}

function toIntendedType(value: string | null): LeadIntendedType {
  const normalized = value?.toLowerCase().replace(/[_\s-]/g, "") ?? "";
  if (normalized === "agrodealer") return "agrodealer";
  if (normalized === "cooperative") return "cooperative";
  if (normalized === "buyer" || normalized === "corporate") return "buyer";
  return "merchant";
}

function toSource(value: string | null): LeadSource {
  const normalized = value?.toLowerCase().replace(/[\s-]/g, "_") ?? "";
  if (
    normalized === "referral" ||
    normalized === "marketing_campaign" ||
    normalized === "field_agent" ||
    normalized === "inbound_website" ||
    normalized === "partner_organization"
  ) {
    return normalized;
  }
  return "inbound_website";
}

function metadataString(metadata: Record<string, unknown> | null, key: string) {
  const value = metadata?.[key];
  return typeof value === "string" ? value : "";
}

function contactName(dto: LeadDto) {
  const decisionMaker = dto.typeMetadata?.decisionMaker;
  if (decisionMaker && typeof decisionMaker === "object" && "name" in decisionMaker && typeof decisionMaker.name === "string") {
    return decisionMaker.name;
  }
  return metadataString(dto.typeMetadata, "storeName") || dto.assignedTo?.firstName || dto.name;
}

function missingFields(dto: LeadDto) {
  const missing: string[] = [];
  if (!dto.email) missing.push("email");
  if (!dto.phone) missing.push("phone");
  if (!dto.type) missing.push("type");
  return missing;
}

export function mapLead(dto: LeadDto): Lead {
  return {
    id: dto.id,
    businessName: dto.name,
    contactName: contactName(dto),
    email: dto.email ?? "",
    phone: dto.phone ?? "",
    intendedType: toIntendedType(dto.type),
    source: toSource(dto.source),
    status: toLeadStatus(dto),
    missingFields: missingFields(dto),
    notes: undefined,
    createdAt: dto.createdAt,
    convertedOrganizationId: dto.convertedTenantId ?? undefined,
  };
}

