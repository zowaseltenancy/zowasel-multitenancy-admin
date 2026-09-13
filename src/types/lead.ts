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
