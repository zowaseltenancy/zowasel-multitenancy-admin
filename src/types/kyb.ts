export type KybStatus =
  | "not_submitted"
  | "pending"
  | "approved"
  | "rejected";

export type KybDocumentType =
  | "business_registration"
  | "tax_clearance"
  | "directors_id"
  | "utility_bill"
  | "memorandum"
  | "shareholder_mapping"
  | "bvn";

export type KybDocumentStatus =
  | "pending"
  | "verified"
  | "rejected";

export interface KybDocument {
  type: KybDocumentType;

  url: string;

  status: KybDocumentStatus;

  uploadedAt: string;

  rejectionReason?: string;
}
