import { KybDocumentType, KybStatus } from "@/types/kyb";
import { Organization, OrganizationType, TeamMemberRole } from "@/types/organization";
import { KeyOfficer } from "@/types/user";
import { BusinessDetailDto, BusinessListItemDto } from "./organization.types";

function toKybStatus(value: string): KybStatus {
  const normalized = value.toLowerCase();
  if (normalized === "not_submitted" || normalized === "pending" || normalized === "approved" || normalized === "rejected") {
    return normalized;
  }
  return "not_submitted";
}

// Tenant.type is free-form server-side — it holds whatever the registration
// form or a lead conversion wrote ("corporate", "limited_liability", null) —
// while the admin console types it as a closed union of four. Anything outside
// the union falls back to "merchant" only so the badge renders; it is NOT the
// basis for filtering. The type filter is sent to the API and matched against
// the real column, because collapsing unknown values here made "filter by
// buyer" match nothing and "filter by merchant" match everything.
function toOrganizationType(value: string | null): OrganizationType {
  const normalized = value?.toLowerCase().replace(/[_\s-]/g, "") ?? "";
  if (
    normalized === "agrodealer" ||
    normalized === "merchant" ||
    normalized === "buyer" ||
    normalized === "cooperative"
  ) {
    return normalized;
  }
  return "merchant";
}

// An unrecognised type maps to "other", not to business_registration. The old
// fallback silently relabelled every unknown document as a registration
// certificate — including proof_of_address, which the API does return.
function toDocumentType(value: string): KybDocumentType {
  const normalized = value.toLowerCase() as KybDocumentType;
  const known: KybDocumentType[] = [
    "business_registration",
    "tax_clearance",
    "directors_id",
    "utility_bill",
    "memorandum",
    "shareholder_mapping",
    "bvn",
    "proof_of_address",
  ];
  return known.includes(normalized) ? normalized : "other";
}

function toTeamMemberRole(value: string): TeamMemberRole {
  const normalized = value.toLowerCase();
  if (normalized === "admin" || normalized === "viewer") return normalized;
  return "member";
}

function baseOrganization(dto: BusinessListItemDto): Organization {
  return {
    id: dto.id,
    businessId: dto.businessId,
    name: dto.name,
    type: toOrganizationType(dto.type),
    owner: {
      name: dto.email ?? "Unassigned owner",
      email: dto.email ?? "",
      phone: dto.phone ?? "",
    },
    teamMembers: [],
    kybStatus: toKybStatus(dto.kybStatus),
    kybSubmittedAt: dto.kybSubmittedAt,
    kybApprovedAt: dto.kybApprovedAt,
    kybRejectionReason: dto.kybRejectionReason ?? null,
    kybDocuments: [],
    subscriptions: dto.subscriptions.map((subscription) => ({
      app: subscription.app,
      plan: subscription.plan,
      activeModules: subscription.activeModules,
      billingState: subscription.billingState,
      renewsAt: subscription.renewsAt,
    })),
    onboardedByAgent: dto.onboardedByAgent ?? undefined,
    assignedStaff: {
      primary: dto.assignedStaff.primary ?? undefined,
      secondary: dto.assignedStaff.secondary ?? undefined,
    },
    commodityFocus: dto.commodityFocus,
    countryCode: dto.countryCode ?? undefined,
    countryName: dto.countryName ?? undefined,
    subRegion: dto.subRegion ?? undefined,
    continent: dto.continent ?? undefined,
    createdAt: dto.createdAt,
  };
}

export function mapBusinessListItem(dto: BusinessListItemDto): Organization {
  return baseOrganization(dto);
}

export function mapBusinessDetail(dto: BusinessDetailDto): Organization {
  const organization = baseOrganization(dto);

  return {
    ...organization,
    owner: {
      name: dto.owner?.name ?? organization.owner.name,
      email: dto.owner?.email ?? organization.owner.email,
      phone: dto.owner?.phone ?? organization.owner.phone,
    },
    teamMembers: dto.teamMembers.map((member) => ({
      ...member,
      role: toTeamMemberRole(member.role),
    })),
    kybDocuments: dto.kybDocuments.map((document) => ({
      id: document.id,
      type: toDocumentType(document.type),
      url: document.url,
      filename: document.filename,
      status:
        document.status.toLowerCase() === "verified"
          ? "verified"
          : document.status.toLowerCase() === "rejected"
            ? "rejected"
            : "pending",
      // Passed through as null rather than "" — the flat tenant URLs genuinely
      // have no upload time, and "" rendered as "Invalid Date".
      uploadedAt: document.uploadedAt,
      reviewedAt: document.reviewedAt,
    })),
    governanceStructure: {
      // new-ui types this as a required union, but the column is nullable and
      // free-form server-side. Anything unrecognised falls back to "corporate",
      // the default the admin UI renders, rather than widening their type.
      type:
        dto.governanceStructure.type === "cooperative" ||
        dto.governanceStructure.type === "corporate" ||
        dto.governanceStructure.type === "individual"
          ? dto.governanceStructure.type
          : "corporate",
      directors: dto.governanceStructure.directors,
      shareholders: dto.governanceStructure.shareholders,
    },
    keyOfficers: dto.keyOfficers.map((officer): KeyOfficer => ({
      id: officer.id,
      name: officer.name,
      position: officer.position,
      gender: officer.gender === "male" || officer.gender === "female" || officer.gender === "other" ? officer.gender : "other",
      phone: officer.phone ?? "",
      email: officer.email ?? "",
      isActive: true,
    })),
  };
}
