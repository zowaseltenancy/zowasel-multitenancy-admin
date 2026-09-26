import { PlatformUser, PlatformUserRole, UserAccountStatus } from "@/types/user";
import { PlatformUserDetailDto, PlatformUserDto } from "./platform-users.api";

// PlatformUserDto → the PlatformUser the user screens are written against.
//
// The two shapes are not the same size, and this file is deliberate about the
// difference rather than papering over it. The endpoint returns identity, the
// account flags, roles and tenant membership. It has no source at all for:
//
//   buyerTier, userCategory, agentMeta, geographicScopeLevel, department,
//   position, keyOfficers, permissions, onboardedByAgent, bvn, nationalId
//
// Those are left undefined, not invented. A screen that filters on them shows
// nothing for API-sourced users — which is the truth about the data, and is
// why the category screens (agents, buyers, cooperatives…) are still on the
// fixture: they exist to slice by exactly those fields.

/**
 * The API reports role slugs from the `roles` table — admin, merchant, farmer,
 * support — while the console's union is a set of display titles. Anything
 * unrecognised keeps the API's own wording rather than being forced into a
 * title that would misdescribe the account.
 */
const ROLE_BY_SLUG: Record<string, PlatformUserRole> = {
  farmer: "Farmer (self-service)",
  merchant: "Input Merchant",
  buyer: "Buyer",
  agrodealer: "Agrodealer",
  admin: "Zowasel Staff Admin",
  support: "Compliance Officer",
};

export function toUiRole(roles: string[] | undefined): PlatformUserRole {
  const first = (roles ?? [])[0];
  if (!first) return "Farmer (self-service)";
  return ROLE_BY_SLUG[first.toLowerCase()] ?? (first as PlatformUserRole);
}

/**
 * One status from four independent booleans, in order of severity.
 *
 * Suspension outranks everything: a suspended account is suspended whether or
 * not it is also inactive, and showing it as merely "inactive" would hide an
 * enforcement action. A lock is a failed-sign-in lockout rather than an
 * account state, so it reads as suspended to the screens, which have no
 * separate word for it.
 */
export function toUiStatus(dto: {
  isSuspended: boolean;
  isActive: boolean;
  isVerified: boolean;
  isLocked: boolean;
}): UserAccountStatus {
  if (dto.isSuspended || dto.isLocked) return "suspended";
  if (!dto.isActive) return "inactive";
  if (!dto.isVerified) return "pending";
  return "active";
}

function fullNameOf(dto: PlatformUserDto): { firstName: string; lastName: string } {
  return { firstName: dto.firstName ?? "", lastName: dto.lastName ?? "" };
}

export function mapPlatformUser(dto: PlatformUserDto): PlatformUser {
  return {
    id: dto.id,
    ...fullNameOf(dto),
    email: dto.email,
    // The list projection carries no profile, so no phone. '' rather than a
    // placeholder: the field is required by the type and the screens render it
    // behind a truthiness check.
    phone: "",
    role: toUiRole(dto.roles),
    status: toUiStatus(dto),
    // The list gives a membership *count*, not the businesses themselves —
    // only the detail endpoint returns those. Left blank rather than guessed.
    organizationId: "",
    organizationName: dto.tenantCount > 0 ? `${dto.tenantCount} business${dto.tenantCount === 1 ? "" : "es"}` : "",
    dateJoined: dto.createdAt,
    lastActive: dto.lastLoginAt ?? dto.updatedAt,
    permissions: [],
  };
}

/**
 * The detail endpoint adds the profile and the businesses, so the fields the
 * list has to leave empty can be filled honestly here.
 */
export function mapPlatformUserDetail(dto: PlatformUserDetailDto): PlatformUser {
  const base = mapPlatformUser(dto);

  // The business they own if there is one, otherwise the first they belong to:
  // the screens show a single organisation, and ownership is the relationship
  // that matters when an account holds several.
  const primaryTenant = dto.tenants?.find((t) => t.isOwner) ?? dto.tenants?.[0];

  return {
    ...base,
    phone: dto.profile?.phone ?? "",
    organizationId: primaryTenant?.id ?? "",
    organizationName: primaryTenant?.name ?? "",
    ...(dto.profile?.country ? { countryName: dto.profile.country } : {}),
    ...(dto.profile?.region ? { subRegion: dto.profile.region } : {}),
    ...(dto.profile
      ? {
          personalDetails: {
            ...(dto.profile.dateOfBirth ? { dateOfBirth: dto.profile.dateOfBirth } : {}),
            ...(dto.profile.address ? { residentialAddress: dto.profile.address } : {}),
            ...(dto.profile.city ? { city: dto.profile.city } : {}),
            ...(dto.profile.state ? { state: dto.profile.state } : {}),
          },
        }
      : {}),
  };
}

/**
 * The reverse of toUiRole, for the Add User form.
 *
 * The form offers display titles; the endpoint takes slugs from the `roles`
 * table, and rejects anything it does not know. Titles with no slug behind
 * them — Programme Manager, Field Supervisor, Data Analyst and the rest — map
 * to nothing rather than being invented, so the account is created without a
 * platform role instead of the request failing on a role that does not exist.
 */
const SLUG_BY_ROLE: Partial<Record<PlatformUserRole, string>> = {
  "Farmer (self-service)": "farmer",
  "Input Merchant": "merchant",
  Buyer: "buyer",
  Agrodealer: "agrodealer",
  "Zowasel Staff Admin": "admin",
  "Compliance Officer": "support",
};

export function toApiRoleSlug(role: PlatformUserRole | undefined): string | undefined {
  if (!role) return undefined;
  return SLUG_BY_ROLE[role];
}
