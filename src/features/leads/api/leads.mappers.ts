import { CreateLeadSchema } from "@/schemas/lead.schema";
import { Lead, LeadIntendedType, LeadSource, LeadStatus } from "@/types/lead";
import {
  CreateLeadRequest,
  LeadDto,
} from "./leads.types";

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

function metadataNumber(metadata: Record<string, unknown> | null, key: string): number | undefined {
  const value = metadata?.[key];
  if (typeof value === "number") return value;
  if (typeof value === "string") {
    const parsed = parseFloat(value);
    return isNaN(parsed) ? undefined : parsed;
  }
  return undefined;
}

function metadataStringArray(metadata: Record<string, unknown> | null, key: string): string[] | undefined {
  const value = metadata?.[key];
  if (Array.isArray(value)) return value.map(String);
  if (typeof value === "string" && value.trim()) {
    return value.split(",").map((s) => s.trim()).filter(Boolean);
  }
  return undefined;
}

export function mapLead(dto: LeadDto): Lead {
  const meta = dto.typeMetadata;
  const outletGps = meta?.outletGps as { lat?: number; lng?: number } | undefined;
  const storeName = metadataString(meta, "storeName") || undefined;
  const outletLat = metadataNumber(meta, "outletLat") ?? outletGps?.lat;
  const outletLng = metadataNumber(meta, "outletLng") ?? outletGps?.lng;
  const posCount = metadataNumber(meta, "posCount");
  const monthlyVolume = metadataNumber(meta, "monthlyVolume");

  const licenseNo = metadataString(meta, "licenseNo") || undefined;
  const storageMt = metadataNumber(meta, "storageMt");
  const inputSpecialties = metadataStringArray(meta, "inputSpecialties");
  const lgaCoverage = metadataStringArray(meta, "lgaCoverage");

  const cacNumber = metadataString(meta, "cacNumber") || undefined;
  const taxId = metadataString(meta, "taxId") || undefined;
  const annualTurnover = metadataNumber(meta, "annualTurnover");
  const decisionMaker = meta?.decisionMaker as { title?: string } | undefined;
  const decisionMakerTitle = metadataString(meta, "decisionMakerTitle") || decisionMaker?.title || undefined;

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

    storeName,
    outletLat,
    outletLng,
    posCount,
    monthlyVolume,

    licenseNo,
    storageMt,
    inputSpecialties,
    lgaCoverage,

    cacNumber,
    taxId,
    annualTurnover,
    decisionMakerTitle,
  };
}

// ── Form -> API ──────────────────────────────────────────────────────────────
// The add-lead form speaks the UI's four intended types; the API takes three
// classifications, each with its own required `typeMetadata`. cooperative and
// buyer both map to CORPORATE — that metadata (CAC number, tax ID, turnover,
// decision maker) is what an incorporated entity has.
//
// `contactName` only has a home on CORPORATE, as decisionMaker.name. The base
// payload has no contact field and typeMetadata is validated strict, so for
// merchant and agrodealer leads it is folded into the source string rather than
// silently dropped.

export function toCreateLeadRequest(values: CreateLeadSchema): CreateLeadRequest {
  const base = {
    name: values.businessName.trim(),
    email: values.email.trim() || undefined,
    phone: values.phone.trim() || undefined,
    source: values.source,
  };

  if (values.intendedType === "merchant") {
    return {
      ...base,
      type: "MERCHANT",
      typeMetadata: {
        storeName: values.storeName.trim(),
        outletGps: { lat: values.outletLat, lng: values.outletLng },
        posCount: values.posCount,
        monthlyVolume: values.monthlyVolume,
      },
    };
  }

  if (values.intendedType === "agrodealer") {
    return {
      ...base,
      type: "AGRO_DEALER",
      typeMetadata: {
        licenseNo: values.licenseNo.trim(),
        storageMt: values.storageMt,
        inputSpecialties: values.inputSpecialties,
        lgaCoverage: values.lgaCoverage,
      },
    };
  }

  // cooperative | buyer
  return {
    ...base,
    type: "CORPORATE",
    typeMetadata: {
      cacNumber: values.cacNumber.trim(),
      taxId: values.taxId.trim(),
      annualTurnover: values.annualTurnover,
      decisionMaker: {
        name: values.contactName.trim(),
        ...(values.decisionMakerTitle?.trim() ? { title: values.decisionMakerTitle.trim() } : {}),
        ...(values.phone.trim() ? { phone: values.phone.trim() } : {}),
        ...(values.email.trim() ? { email: values.email.trim() } : {}),
      },
    },
  };
}
