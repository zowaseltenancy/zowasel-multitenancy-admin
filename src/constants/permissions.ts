import { Permission, PermissionCategory, PermissionCategoryGroup } from "@/types/permissions";

export const PERMISSION_CATEGORIES: Record<PermissionCategory, { label: string; description: string }> = {
  organizations: {
    label: "Organization Management",
    description: "Manage tenant business accounts, details, and team members",
  },
  kyb: {
    label: "KYB Verification",
    description: "Review, approve, or reject business verification documents",
  },
  modules: {
    label: "Modules & Pricing",
    description: "Configure CropPilot sub-modules, pricing tiers, and tenant activations",
  },
  billing: {
    label: "Billing & Payments",
    description: "Manage payment providers, subscriptions, currencies, and settlements",
  },
  users: {
    label: "Platform User Management",
    description: "Manage platform admins, buyers, farmers, and merchants",
  },
  roles: {
    label: "Roles & Security",
    description: "Configure system roles, permission scopes, and admin access",
  },
  system: {
    label: "System Settings",
    description: "Access platform-wide configuration, audit logs, and webhooks",
  },
};

export const ALL_PERMISSIONS: Permission[] = [
  // Organizations
  { id: "p1", code: "organizations:read", name: "View Organizations", description: "View tenant business profiles & list views", category: "organizations", action: "read" },
  { id: "p2", code: "organizations:create", name: "Create Organization", description: "Manually provision new business tenants", category: "organizations", action: "create" },
  { id: "p3", code: "organizations:update", name: "Edit Organization", description: "Update tenant business details & metadata", category: "organizations", action: "update" },
  { id: "p4", code: "organizations:delete", name: "Delete Organization", description: "Archive or remove business tenant records", category: "organizations", action: "delete", isSensitive: true },
  { id: "p5", code: "organizations:export", name: "Export Tenant Data", description: "Export organization reports to CSV/Excel", category: "organizations", action: "export" },

  // KYB
  { id: "p6", code: "kyb:read", name: "View KYB Submissions", description: "Inspect submitted business verification documents", category: "kyb", action: "read" },
  { id: "p7", code: "kyb:approve", name: "Approve / Reject KYB", description: "Approve business applications or issue rejection notices", category: "kyb", action: "approve", isSensitive: true },
  { id: "p8", code: "kyb:export", name: "Export KYB Audit Logs", description: "Download KYB review history and audit trails", category: "kyb", action: "export" },

  // Modules
  { id: "p9", code: "modules:read", name: "View Module Catalog", description: "View sub-modules, adoption stats & default tiers", category: "modules", action: "read" },
  { id: "p10", code: "modules:update", name: "Configure Module Pricing", description: "Override module pricing & free/paid toggles", category: "modules", action: "update" },
  { id: "p11", code: "modules:approve", name: "Toggle Tenant Activation", description: "Enable or suspend sub-modules for specific tenants", category: "modules", action: "approve", isSensitive: true },

  // Billing
  { id: "p12", code: "billing:read", name: "View Transactions & Invoices", description: "View payment transactions, subscriptions & payouts", category: "billing", action: "read" },
  { id: "p13", code: "billing:update", name: "Configure Payment Providers", description: "Add or edit gateway credentials (Paystack, Stripe, etc.)", category: "billing", action: "update", isSensitive: true },
  { id: "p14", code: "billing:approve", name: "Manage Disputes & Refunds", description: "Approve transaction disputes or issue manual refunds", category: "billing", action: "approve", isSensitive: true },
  { id: "p15", code: "billing:export", name: "Export Financial Reports", description: "Download revenue, tax & settlement data", category: "billing", action: "export" },

  // Users
  { id: "p16", code: "users:read", name: "View User Profiles", description: "View internal admins, buyers, farmers & merchants", category: "users", action: "read" },
  { id: "p17", code: "users:create", name: "Invite Admin Users", description: "Invite new internal team members to admin panel", category: "users", action: "create" },
  { id: "p18", code: "users:update", name: "Update User Access", description: "Change user statuses, emails & account attributes", category: "users", action: "update" },
  { id: "p19", code: "users:delete", name: "Revoke User Access", description: "Deactivate or delete user accounts", category: "users", action: "delete", isSensitive: true },

  // Roles & Security
  { id: "p20", code: "roles:read", name: "View Roles & Scopes", description: "Inspect defined system roles and assigned scopes", category: "roles", action: "read" },
  { id: "p21", code: "roles:create", name: "Create Custom Roles", description: "Build new role templates with specific permission sets", category: "roles", action: "create" },
  { id: "p22", code: "roles:update", name: "Edit Role Permissions", description: "Modify assigned permission scopes for existing roles", category: "roles", action: "update", isSensitive: true },
  { id: "p23", code: "roles:delete", name: "Delete Custom Roles", description: "Remove custom role configurations", category: "roles", action: "delete", isSensitive: true },

  // System
  { id: "p24", code: "system:read", name: "View System Logs", description: "Inspect platform audit logs & webhook deliveries", category: "system", action: "read" },
  { id: "p25", code: "system:update", name: "Configure Platform Settings", description: "Update global environment variables & feature flags", category: "system", action: "update", isSensitive: true },
];

export const PERMISSION_GROUPS: PermissionCategoryGroup[] = (
  Object.keys(PERMISSION_CATEGORIES) as PermissionCategory[]
).map((category) => ({
  category,
  label: PERMISSION_CATEGORIES[category].label,
  description: PERMISSION_CATEGORIES[category].description,
  permissions: ALL_PERMISSIONS.filter((p) => p.category === category),
}));
