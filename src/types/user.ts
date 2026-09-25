export type PlatformUserRole =
  | "Tenant Admin"
  | "Programme Manager"
  | "Field Supervisor"
  | "Field Agent"
  | "Data Analyst"
  | "Farmer (self-service)"
  | "Zowasel Staff Admin"
  | "Compliance Officer"
  | "Cooperative Leader"
  | "Input Merchant"
  | "Agrodealer"
  | "Buyer"
  | "Continental Director"
  | "Regional Manager"
  | "Country Director"
  | "Chief Financial Officer"
  | "Continental Finance Director"
  | "Regional Finance Manager"
  | "Country Finance Officer"
  | "Chief Executive Officer";

export type PlatformUserCategory =
  | "agent"
  | "merchant"
  | "agrodealer"
  | "cooperative"
  | "buyer"
  | "staff";

// Internal Zowasel staff are organized by department — a separate axis from
// PlatformUserCategory, since staff are not tenant/platform users at all.
/**
 * A department name.
 *
 * Was a closed union of nine names. Departments are database rows that admins
 * create, rename and delete through /admin/departments, so a closed union was
 * wrong in both directions: it rejected real departments (Operations, People &
 * Culture) and asserted ones that do not exist (Fintech, Programs).
 *
 * Kept as a named alias rather than replaced with `string` everywhere so the
 * intent still reads at each use site — and so the compiler flags anything
 * that starts treating a department name as an identifier. The id is what
 * addresses a department; this is only ever for display and matching.
 */
export type StaffDepartment = string;

// Geographic oversight scope for Regional Operations and Finance staff — the
// level at which they operate (a Continental Director oversees an entire
// continent, a Regional Manager one sub-region, a Country Director one
// country; "global" sits above continent for roles like the CFO). The actual
// continent/subRegion/countryCode fields on PlatformUser carry the specific
// jurisdiction; this just says which of those fields is authoritative.
export type GeographicScopeLevel = "global" | "continent" | "sub_region" | "country";

export type UserAccountStatus = "active" | "inactive" | "pending" | "suspended";

// Buyer payment-risk tiering (Jul 31 2026 meeting spec): Red Hot buyers pay
// immediately, Brown Chip buyers may pay in part, Blue Chip buyers are
// profiled/high-value and reconcile payment after the transaction.
export type BuyerTier = "red_hot" | "brown_chip" | "blue_chip";

export interface UserModulePermission {
  moduleKey: string;
  moduleName: string;
  read: boolean;
  write: boolean;
  approve: boolean;
  delete: boolean;
}

export interface AgentMetaData {
  coverageArea?: string;
  assignedFarmersCount?: number;
  totalSurveysSubmitted?: number;
  assignedProjectsCount?: number;
  specialization?: string;
  onboardedEntitiesCount?: number;
}

export interface KeyOfficer {
  id: string;
  name: string;
  position: string;
  gender: "male" | "female" | "other";
  phone: string;
  email: string;
  isActive?: boolean;
}

export type MaritalStatus = "single" | "married" | "divorced" | "widowed";

// Personal Details tab on the Entity Overview redesign — separate from the
// core identity fields (name/email/phone/country) shown on the overview card
// itself.
export interface PersonalDetails {
  dateOfBirth?: string;
  maritalStatus?: MaritalStatus;
  stateOfOrigin?: string;
  nationality?: string;
  residentialAddress?: string;
}

// Next of Kin tab on the Entity Overview redesign.
export interface NextOfKin {
  name: string;
  relationship: string;
  phone: string;
  email?: string;
  address?: string;
}

export interface PlatformUser {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  role: PlatformUserRole;
  userCategory?: PlatformUserCategory;
  gender?: "male" | "female" | "other";
  position?: string;
  department?: StaffDepartment;
  geographicScopeLevel?: GeographicScopeLevel;
  buyerTier?: BuyerTier;
  status: UserAccountStatus;
  organizationId: string;
  organizationName: string;
  onboardedByAgent?: {
    id: string;
    name: string;
  };
  keyOfficers?: KeyOfficer[];
  avatarUrl?: string;
  dateJoined: string;
  lastActive: string;
  permissions: UserModulePermission[];
  agentMeta?: AgentMetaData;
  countryCode?: string;
  countryName?: string;
  subRegion?: string;
  continent?: string;
  bvn?: string;
  nationalId?: string;
  personalDetails?: PersonalDetails;
  nextOfKin?: NextOfKin;
}
