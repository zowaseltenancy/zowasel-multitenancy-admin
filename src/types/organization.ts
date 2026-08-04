import { KybDocument, KybStatus } from "@/types/kyb";
import { KeyOfficer } from "@/types/user";

export type OrganizationType =
  | "merchant"
  | "agrodealer"
  | "buyer"
  | "cooperative";

export type TeamMemberRole = "admin" | "member" | "viewer";

// CRM-style staff coverage for an organization: a primary and secondary
// Zowasel staff member responsible for the account, so nothing goes
// unassigned. Assigned from Sales/Regional Operations staff, not tenant users.
export interface AssignedStaffMember {
  id: string;
  name: string;
}

export interface OrganizationStaffAssignment {
  primary?: AssignedStaffMember;
  secondary?: AssignedStaffMember;
}

export interface TeamMember {
  id: string;
  name: string;
  email: string;
  role: TeamMemberRole;
  isActive: boolean;
  joinedAt: string;
}

export interface OrganizationOwner {
  name: string;
  email: string;
  phone: string;
}

export type OrganizationBillingState = "free" | "paid" | "expired";

export interface OrganizationSubscription {
  app: string;
  plan: string;
  activeModules: string[];
  billingState: OrganizationBillingState;
  renewsAt: string | null;
}

export interface OrganizationGovernance {
  type: "cooperative" | "corporate" | "individual";
  chairman?: string;
  secretary?: string;
  boardOfTrustees?: string[];
  directors?: string[];
  shareholders?: string[];
}

export interface Organization {
  id: string;
  businessId: string;
  name: string;
  type: OrganizationType;
  owner: OrganizationOwner;
  teamMembers: TeamMember[];
  kybStatus: KybStatus;
  kybSubmittedAt: string | null;
  kybApprovedAt: string | null;
  kybRejectionReason: string | null;
  pendingReason?: string;
  kybDocuments: KybDocument[];
  subscriptions: OrganizationSubscription[];
  onboardedByAgent?: {
    id: string;
    name: string;
  };
  governanceStructure?: OrganizationGovernance;
  keyOfficers?: KeyOfficer[];
  assignedStaff?: OrganizationStaffAssignment;
  inputFocus?: string[];
  commodityFocus?: string[];
  countryCode?: string;
  countryName?: string;
  subRegion?: string;
  continent?: string;
  createdAt: string;
}
