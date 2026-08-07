import { ModulePlan } from "@/types/module";

// Seeded from the real plan names already in use across the app — Billing's
// mockSubscriptions.ts (Starter/Growth/Carbon/Enterprise/Government) and
// Organizations' own subscriptions (Free) — none of these are invented.
// Enterprise and Government are "platform" scope: both real subscriptions
// describe full/cross-product access ("Full Access + API", "National
// Database Integration"), not a single-product bundle.
export const mockModulePlans: ModulePlan[] = [
  {
    id: "plan_croppilot_free",
    product: "croppilot",
    name: "Free",
    description: "Baseline farmer registry access — no cost, no KYB required.",
    pricePerMonth: 0,
    includedModuleIds: ["module_farmer_database"],
    isActive: true,
    createdBy: "system",
    updatedAt: "2026-06-11T08:30:00Z",
  },
  {
    id: "plan_croppilot_starter",
    product: "croppilot",
    name: "Starter",
    description: "Registry, Mapping & Advisory — full Farmer Database core module and sub-modules.",
    // $19, not $0 — real Billing subscriptions (sub_005, sub_006) already
    // show tenants genuinely paying for this tier, contradicting a $0
    // catalog price. Individual modules stay free-tagged; the bundle itself
    // is the paid, supported package.
    pricePerMonth: 19,
    includedModuleIds: [
      "module_farmer_database",
      "sub_extended_profile",
      "sub_family_data",
      "sub_location_mapping",
      "sub_plot_registry",
    ],
    isActive: true,
    createdBy: "system",
    updatedAt: "2026-06-11T08:30:00Z",
  },
  {
    id: "plan_croppilot_growth",
    product: "croppilot",
    name: "Growth",
    description: "D-MRV, Inputs & Harvest — Starter plus full Carbon & Sustainability (D-MRV) access.",
    pricePerMonth: 79,
    includedModuleIds: [
      "module_farmer_database",
      "sub_extended_profile",
      "sub_family_data",
      "sub_location_mapping",
      "sub_plot_registry",
      "module_carbon_sustainability",
      "sub_soil_carbon",
      "sub_agroforestry",
    ],
    isActive: true,
    createdBy: "system",
    updatedAt: "2026-06-14T14:20:00Z",
  },
  {
    id: "plan_croppilot_carbon",
    product: "croppilot",
    name: "Carbon",
    description: "Carbon & Agroforestry Traceability Suite — D-MRV plus export traceability, for carbon-credit and export-focused tenants.",
    pricePerMonth: 129,
    includedModuleIds: [
      "module_carbon_sustainability",
      "sub_soil_carbon",
      "sub_agroforestry",
      "module_export_traceability",
    ],
    isActive: true,
    createdBy: "system",
    updatedAt: "2026-06-18T09:40:00Z",
  },
  {
    id: "plan_marketplace_free",
    product: "marketplace",
    name: "Free",
    description: "Browse listings and market pricing — no paid modules active.",
    pricePerMonth: 0,
    includedModuleIds: [],
    isActive: true,
    createdBy: "system",
    updatedAt: "2026-06-10T11:00:00Z",
  },
  {
    id: "plan_marketplace_growth",
    product: "marketplace",
    name: "Growth",
    description: "Full commodity trading, wallet payouts, and market analytics & price feeds.",
    pricePerMonth: 49,
    includedModuleIds: ["module_marketplace_listings", "module_market_analytics"],
    isActive: true,
    createdBy: "system",
    updatedAt: "2026-06-20T16:00:00Z",
  },
  {
    id: "plan_platform_enterprise",
    product: "platform",
    name: "Enterprise",
    description: "Zowasel Enterprise Platform — full access across every product plus API access.",
    pricePerMonth: 299,
    includedModuleIds: [
      "module_farmer_database",
      "sub_extended_profile",
      "sub_family_data",
      "sub_location_mapping",
      "sub_plot_registry",
      "module_compliance_monitoring",
      "sub_clmrs",
      "sub_worker_welfare",
      "sub_pesticide_tracking",
      "module_carbon_sustainability",
      "sub_soil_carbon",
      "sub_agroforestry",
      "module_export_traceability",
      "module_marketplace_listings",
      "module_market_analytics",
    ],
    isActive: true,
    createdBy: "system",
    updatedAt: "2026-02-01T09:00:00Z",
  },
  {
    id: "plan_platform_government",
    product: "platform",
    name: "Government",
    description: "Zowasel Government Platform — national database integration across farmer registry, compliance, and carbon reporting.",
    pricePerMonth: 349,
    includedModuleIds: [
      "module_farmer_database",
      "sub_extended_profile",
      "sub_family_data",
      "sub_location_mapping",
      "sub_plot_registry",
      "module_compliance_monitoring",
      "sub_clmrs",
      "sub_worker_welfare",
      "sub_pesticide_tracking",
      "module_carbon_sustainability",
      "sub_soil_carbon",
      "sub_agroforestry",
      "module_export_traceability",
    ],
    isActive: true,
    createdBy: "system",
    updatedAt: "2026-02-01T09:00:00Z",
  },

  // Empty shells — every product shows the same set of named tiers, even
  // where nothing's configured yet. Inactive by construction: a real
  // placeholder to build into later, not a hidden/omitted plan. Per
  // Busayo, Aug 7: "even if a plan has no module in it, include it there."
  ...(["Free", "Starter", "Growth", "Carbon", "Enterprise", "Government"] as const).flatMap(
    (tier) => {
      const shellsNeeded: { id: string; product: "croppilot" | "marketplace" | "acess" }[] = [];
      if (tier === "Enterprise" || tier === "Government") {
        shellsNeeded.push({ id: `plan_croppilot_${tier.toLowerCase()}_shell`, product: "croppilot" });
        shellsNeeded.push({ id: `plan_marketplace_${tier.toLowerCase()}_shell`, product: "marketplace" });
      }
      if (tier === "Starter" || tier === "Carbon") {
        shellsNeeded.push({ id: `plan_marketplace_${tier.toLowerCase()}_shell`, product: "marketplace" });
      }
      // ACESS has no real plans yet — every tier gets a shell there.
      shellsNeeded.push({ id: `plan_acess_${tier.toLowerCase()}_shell`, product: "acess" });

      return shellsNeeded.map(
        (shell): ModulePlan => ({
          id: shell.id,
          product: shell.product,
          name: tier,
          description: "Not configured yet for this product — empty shell, ready to build into.",
          pricePerMonth: 0,
          includedModuleIds: [],
          isActive: false,
          createdBy: "system",
          updatedAt: "2026-08-07T11:00:00Z",
        })
      );
    }
  ),
];
