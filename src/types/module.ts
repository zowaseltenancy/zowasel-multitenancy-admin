// Legacy filter tags — kept on existing records for now (not deleted), but
// no longer the primary grouping. "if there's need for categorization under
// each product, that would be done in due time" — Busayo, Aug 7. `product`
// below is the real grouping going forward.
export type ModuleCategory =
  | "croppilot"
  | "marketplace"
  | "analytics"
  | "export_management"
  | "supply_chain"
  | "carbon_sustainability";

// The 3 real Zowasel platforms modules get consolidated under, per the
// RVE-064 restructure (Aug 7). ACESS has zero modules today — its card
// exists as a real nav destination, not a fabricated catalog.
export type ModuleProduct = "croppilot" | "marketplace" | "acess";

export interface Module {
  id: string;
  name: string;
  description: string;
  category: ModuleCategory;
  product: ModuleProduct;
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

// A named bundle of core/sub-modules at a fixed monthly price — the catalog
// that "Growth"/"Enterprise"/etc. tier labels always should have pointed to.
// "platform" scope exists for the two real bundles (Enterprise, Government)
// that genuinely span every product rather than sitting under just one —
// found by cross-checking real Billing subscription data, not invented.
export interface ModulePlan {
  id: string;
  product: ModuleProduct | "platform";
  name: string;
  description: string;
  pricePerMonth: number;
  includedModuleIds: string[];
  isActive: boolean;
  createdBy?: string;
  updatedAt: string;
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
