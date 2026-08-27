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

function toOrganizationType(value: string | null): OrganizationType {
  const normalized = value?.toLowerCase().replace(/[_\s-]/g, "") ?? "";
  if (normalized === "agrodealer" || normalized === "merchant" || normalized === "buyer" || normalized === "cooperative") {
    return normalized;
  }
  if (normalized === "agrodealer") return "agrodealer";
  return "merchant";
}

function toDocumentType(value: string): KybDocumentType {
  const normalized = value as KybDocumentType;
  const known: KybDocumentType[] = [
    "business_registration",
    "tax_clearance",
    "directors_id",
    "utility_bill",
    "memorandum",
    "shareholder_mapping",
    "bvn",
  ];
  return known.includes(normalized) ? normalized : "business_registration";
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
      type: toDocumentType(document.type),
      url: document.url,
      status: document.status.toLowerCase() === "verified" ? "verified" : document.status.toLowerCase() === "rejected" ? "rejected" : "pending",
      // Required string on new-ui's KybDocument; the API returns null for the
      // two flat tenant URLs, which carry no upload timestamp.
      uploadedAt: document.uploadedAt ?? "",
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
