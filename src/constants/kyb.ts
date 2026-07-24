import { KybDocumentType, KybStatus } from "@/types/kyb";

export const KYB_DOCUMENT_LABELS: Record<KybDocumentType, string> = {
  business_registration: "Business Registration",
  tax_clearance: "Tax Clearance Certificate",
  directors_id: "Director's ID",
  utility_bill: "Utility Bill",
  memorandum: "Memorandum of Association",
  shareholder_mapping: "Shareholder Mapping",
  bvn: "BVN Verification",
};

export const KYB_STATUS_FILTERS: {
  label: string;

  value: KybStatus | "all";
}[] = [
  { label: "All", value: "all" },
  { label: "Approved", value: "approved" },
  { label: "Pending", value: "pending" },
  { label: "Rejected", value: "rejected" },
  { label: "Not Submitted", value: "not_submitted" },
];
