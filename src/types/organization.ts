import { KybDocument, KybStatus } from "@/types/kyb";

export type OrganizationType = "business" | "cooperative";

export type TeamMemberRole = "admin" | "member" | "viewer";

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

  kybDocuments: KybDocument[];

  subscriptions: OrganizationSubscription[];

  createdAt: string;
}
