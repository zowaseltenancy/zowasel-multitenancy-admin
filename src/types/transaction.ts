import { OrganizationType } from "@/types/organization";

export type TransactionStatus =
  | "Completed"
  | "Pending"
  | "Failed"
  | "Refunded";

export interface Transaction {
  id: string;

  reference: string;

  organization: string;

  entityType: OrganizationType;

  amount: number;

  currency: string;

  provider: string;

  status: TransactionStatus;

  paymentMethod: string;

  createdAt: string;

  disputed: boolean;

  disputeReason?: string;

  disputeNotifyTarget?: DisputeNotifyTarget;
}

export type DisputeNotifyTarget =
  | "operations_team"
  | "finance_team"
  | "provider_support";
