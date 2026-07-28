export type ModuleCategory =
  | "croppilot"
  | "marketplace"
  | "analytics"
  | "export_management"
  | "supply_chain"
  | "carbon_sustainability";

export interface Module {
  id: string;
  name: string;
  description: string;
  category: ModuleCategory;
  featureKey: string;
  parentId: string | null; // null => Core Module, string => Sub-module under Core Module
  enabled: boolean;        // Global toggle flag across all tenant businesses
  isPaid: boolean;         // Paid vs Free indicator (Core modules only)
  pricePerMonth: number;   // Price in USD per month
  requiresKyb: boolean;    // KYB verification gating rule
  billingState?: "free" | "paid" | "expired";
  enabledByTenant?: boolean;
  statsEnabled?: boolean;
  defaultFreeDays?: number;
  submodule_count?: number;
  tenant_count?: number;
  createdBy?: string;
  updatedBy?: string;
  updatedAt?: string;
}

export interface TenantModuleUsage {
  org_id: string;
  org_name: string;
  owner_name?: string;
  owner_email: string;
  kyb_status: "not_submitted" | "pending" | "approved" | "rejected";
  subscribed_at: string;
  expires_at: string | null;
  active_submodules_count?: number;
}

export interface ModuleDetailData {
  module: Module;
  parentModule: { id: string; name: string } | null;
  subModules: Module[];
  tenants: TenantModuleUsage[];
}
