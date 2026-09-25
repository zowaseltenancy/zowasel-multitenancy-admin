export type LeadSource =
  | "referral"
  | "marketing_campaign"
  | "field_agent"
  | "inbound_website"
  | "partner_organization";

export type LeadStatus = "incomplete" | "ready_to_convert" | "converted" | "lost";

// What the lead would become once converted into a real Organization.
export type LeadIntendedType = "merchant" | "agrodealer" | "cooperative" | "buyer";

export interface Lead {
  id: string;
  businessName: string;
  contactName: string;
  email: string;
  phone: string;
  intendedType: LeadIntendedType;
  source: LeadSource;
  status: LeadStatus;
  missingFields: string[];
  notes?: string;
  countryCode?: string;
  countryName?: string;
  subRegion?: string;
  continent?: string;
  createdAt: string;
  convertedOrganizationId?: string;
  /**
   * The pipeline stage, exactly as the API reports it.
   *
   * `status` above is a four-way summary for badges and cannot stand in for
   * it: it reads "ready_to_convert" for QUALIFIED, PROPOSAL and NEGOTIATION
   * too, while POST /admin/leads/{id}/convert accepts CLOSED_WON alone. The
   * screens offered Convert on all four and the server refused three of them.
   */
  stage?: string;

  // Merchant details
  storeName?: string;
  outletLat?: number;
  outletLng?: number;
  posCount?: number;
  monthlyVolume?: number;

  // Agrodealer details
  licenseNo?: string;
  storageMt?: number;
  inputSpecialties?: string[];
  lgaCoverage?: string[];

  // Corporate details
  cacNumber?: string;
  taxId?: string;
  annualTurnover?: number;
  decisionMakerTitle?: string;
}
