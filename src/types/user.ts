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
  | "Country Director";

export type PlatformUserCategory =
  | "agent"
  | "merchant"
  | "agrodealer"
  | "cooperative"
  | "buyer"
  | "staff";

// Internal Zowasel staff are organized by department — a separate axis from
// PlatformUserCategory, since staff are not tenant/platform users at all.
export type StaffDepartment =
  | "Executive"
  | "Technology"
  | "Programs"
  | "Fintech"
  | "Sales"
  | "Finance"
  | "Administration"
  | "Compliance"
  | "Regional Operations";

// Geographic oversight scope for Regional Operations staff — the level at
// which they operate (a Continental Director oversees an entire continent,
// a Regional Manager one sub-region, a Country Director one country). The
// actual continent/subRegion/countryCode fields on PlatformUser carry the
// specific jurisdiction; this just says which of those fields is authoritative.
export type GeographicScopeLevel = "continent" | "sub_region" | "country";

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
}
