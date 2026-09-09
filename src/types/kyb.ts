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
  | "bvn"
  // Written by the business-registration form as a flat URL on the tenant
  // record, so it arrives from the API alongside the reviewed document rows.
  | "proof_of_address"
  // Anything the country requirements add that this union does not name yet.
  // Without it an unknown type was displayed under the wrong label rather
  // than under its own.
  | "other";

export type KybDocumentStatus =
  | "pending"
  | "verified"
  | "rejected";

export interface KybDocument {
  /**
   * Row id from the kybDocuments table. Null for the two flat URL columns on
   * the tenant record, which are not rows — so this cannot be a React key on
   * its own, but `type` alone collides when a business has two documents the
   * type union does not name.
   */
  id?: string | null;

  type: KybDocumentType;

  url: string;

  filename?: string | null;

  status: KybDocumentStatus;

  /**
   * Null for the flat tenant URLs, which carry no upload time. Was typed as a
   * required string, which meant callers passed "" and the UI rendered
   * "Invalid Date".
   */
  uploadedAt: string | null;

  reviewedAt?: string | null;

  rejectionReason?: string;
}
