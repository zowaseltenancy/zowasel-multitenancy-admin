export type TransactionStatus =
  | "Completed"
  | "Pending"
  | "Failed"
  | "Refunded";

export interface Transaction {
  id: string;

  reference: string;

  organization: string;

  amount: number;

  currency: string;

  provider: string;

  status: TransactionStatus;

  paymentMethod: string;

  createdAt: string;
}