import { OrganizationType } from "@/types/organization";

export type SettlementStatus =
  | "Completed"
  | "Processing"
  | "Scheduled"
  | "Failed";

export interface Settlement {
  id: string;

  settlementNumber: string;

  organization: string;

  entityType: OrganizationType;

  amount: number;

  currency: string;

  status: SettlementStatus;

  payoutMethod: string;

  provider: string;

  scheduledAt: string;

  completedAt?: string | null;
}
