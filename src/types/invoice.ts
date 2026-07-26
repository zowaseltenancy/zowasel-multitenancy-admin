import { OrganizationType } from "@/types/organization";

export type InvoiceStatus =
  | "Paid"
  | "Pending"
  | "Overdue"
  | "Void";

export interface InvoiceLineItem {
  name: string;

  quantity: number;

  unitPrice: number;
}

export interface Invoice {
  id: string;

  invoiceNumber: string;

  organization: string;

  entityType: OrganizationType;

  product: string;

  amount: number;

  currency: string;

  status: InvoiceStatus;

  issuedAt: string;

  dueDate: string;

  paidAt?: string | null;

  items: InvoiceLineItem[];
}
