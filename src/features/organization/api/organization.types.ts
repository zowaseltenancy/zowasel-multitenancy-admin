import { ApiMeta } from "@/lib/api-response";

export interface BusinessListQuery {
  page?: number;
  limit?: number;
  sortBy?: "createdAt" | "updatedAt" | "name" | "kybSubmittedAt" | "kybApprovedAt";
  sortOrder?: "asc" | "desc";
  search?: string;
  kybStatus?: string;
  country?: string;
  continent?: string;
  subRegion?: string;
  countryName?: string;
  type?: string;
  onboardingSource?: "DIRECT_SIGNUP" | "AGENT";
  plan?: string;
  // ── "More Filters" panel ───────────────────────────────────────────────────
  // These three used to be applied in the browser over whatever page had been
  // fetched, which is why the panel looked like it did nothing. They are now
  // server-side filters.
  /** One member of staff: assigned account staff, or the agent on the converted lead. */
  onboardedById?: string;
  /** Module ids. Sent comma-separated; matches a business holding ANY of them. */
  modules?: string[];
  /** Bucketed count of live module subscriptions. */
  moduleCount?: "0" | "1-2" | "3+";
}

export interface BusinessListItemDto {
  id: string;
  businessId: string;
  name: string;
  type: string | null;
  ownerId: string | null;
  email: string | null;
  phone: string | null;
  kybStatus: string;
  kybSubmittedAt: string | null;
  kybApprovedAt: string | null;
  kybRejectionReason?: string | null;
  countryCode: string | null;
  countryName: string | null;
  subRegion: string | null;
  continent: string | null;
  onboardedByAgent: { id: string; name: string } | null;
  assignedStaff: {
    primary: { id: string; name: string } | null;
    secondary: { id: string; name: string } | null;
  };
  commodityFocus: string[];
  subscriptions: Array<{
    app: string;
    plan: string;
    planId: string | null;
    activeModules: string[];
    billingState: "free" | "paid" | "expired";
    renewsAt: string | null;
  }>;
  memberCount: number;
  createdAt: string;
  deletedAt: string | null;
}

export interface BusinessDetailDto extends BusinessListItemDto {
  owner: {
    id: string;
    name: string;
    email: string;
    phone: string | null;
    firstName: string;
    lastName: string;
    isActive: boolean;
    isVerified: boolean;
  } | null;
  teamMembers: Array<{
    id: string;
    name: string;
    email: string;
    role: string;
    isActive: boolean;
    joinedAt: string;
  }>;
  kybDocuments: Array<{
    /** Null for the two flat URL columns on the tenant record. */
    id: string | null;
    type: string;
    url: string;
    filename: string | null;
    status: string;
    uploadedAt: string | null;
    reviewedAt: string | null;
  }>;
  governanceStructure: {
    type: string | null;
    directors: string[];
    shareholders: string[];
  };
  keyOfficers: Array<{
    id: string;
    name: string;
    position: string;
    gender: string | null;
    phone: string | null;
    email: string | null;
  }>;
}

export interface BusinessStatsDto {
  total: number;
  active: number;
  inactive: number;
  verified: number;
  unverified: number;
  deleted: number;
  kyb: {
    NOT_SUBMITTED: number;
    PENDING: number;
    APPROVED: number;
    REJECTED: number;
  };
}

export interface BusinessListResult {
  items: BusinessListItemDto[];
  meta: ApiMeta;
}

// ── Team members ─────────────────────────────────────────────────────────────
// GET /admin/businesses/{id}/members. The detail response also carries an
// inline `teamMembers` array; this endpoint is the paginated, filterable view —
// which is what the agents tab needs, since a field agent is a member with a
// particular role.

export interface BusinessMemberDto {
  id: string;
  role: string;
  jobTitle: string | null;
  isActive: boolean;
  joinedAt: string;
  user: {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    isActive: boolean;
    isVerified: boolean;
    lastLoginAt: string | null;
  };
}

export interface BusinessMembersQuery {
  page?: number;
  limit?: number;
  search?: string;
  /** Tenant-scoped role, e.g. "FIELD_AGENT". Matched case-insensitively. */
  role?: string;
  isActive?: boolean;
}

export interface BusinessMembersResult {
  items: BusinessMemberDto[];
  meta: ApiMeta;
}

// ── Tenant users ─────────────────────────────────────────────────────────────
// GET /admin/users?tenantId=… — the end users (farmers, merchants, buyers)
// attached to one business. Distinct from members, which is the membership
// record; this is the user account behind it.

export interface TenantUserDto {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  isActive: boolean;
  isVerified: boolean;
  isSuspended: boolean;
  isLocked: boolean;
  lastLoginAt: string | null;
  roles: string[];
  tenantCount: number;
  createdAt: string;
}

export interface TenantUsersResult {
  items: TenantUserDto[];
  meta: ApiMeta;
}
