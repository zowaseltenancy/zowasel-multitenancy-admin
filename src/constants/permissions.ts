import { Permission, PermissionCategory, PermissionCategoryGroup } from "@/types/permissions";

export const PERMISSION_CATEGORIES: Record<PermissionCategory, { label: string; description: string }> = {
  staff: {
    label: "Staff Directory & Team",
    description: "Manage staff directory, onboarding, profiles, and team assignments",
  },
  departments: {
    label: "Departments & Hierarchy",
    description: "Manage department structure, hierarchy, and department head assignments",
  },
  leave: {
    label: "Leave & Absence Management",
    description: "Review leave requests, approval queues, and department leave calendars",
  },
  leads: {
    label: "Leads & CRM Pipeline",
    description: "Access and manage sales leads across company, department, or assigned scopes",
  },
  businesses: {
    label: "Business Accounts & Tenants",
    description: "Manage business accounts, verification, suspensions, and unlocking",
  },
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
  permissions: {
    label: "Permission Catalog",
    description: "View master catalogue of platform capabilities and granular scopes",
  },
  system: {
    label: "System Settings",
    description: "Access platform-wide configuration, audit logs, and webhooks",
  },
};

export const ALL_PERMISSIONS: Permission[] = [
  // Staff (SSO Backend Track 4.2)
  { id: "p-staff-read", code: "staff:read", name: "View Staff Directory", description: "View staff list, profiles, identity, and assigned roles", category: "staff", action: "read" },
  { id: "p-staff-write", code: "staff:write", name: "Manage Staff Accounts", description: "Onboard, edit profile, and manage staff members", category: "staff", action: "update" },

  // Departments (SSO Backend Track 4.1 & 4.2)
  { id: "p-dept-read", code: "departments:read", name: "View Departments", description: "View departments, hierarchy, and department heads", category: "departments", action: "read" },

  // Leave & Absence (SSO Backend Track 4.3)
  { id: "p-leave-cal", code: "leave:read_calendar", name: "View Leave Calendar", description: "See team and department-wide leave schedule calendar", category: "leave", action: "read" },
  { id: "p-leave-rev", code: "leave:review", name: "Review & Authorize Leave", description: "Approve or reject leave requests in approval inbox", category: "leave", action: "approve", isSensitive: true },

  // Leads CRM (SSO Backend Track 4.2)
  { id: "p-leads-all", code: "leads:read_all", name: "View All Company Leads", description: "Full organization-wide visibility of the lead pipeline", category: "leads", action: "read" },
  { id: "p-leads-dept", code: "leads:read_department", name: "View Department Leads", description: "View and work lead pipeline for own department", category: "leads", action: "read" },
  { id: "p-leads-assigned", code: "leads:read_assigned", name: "View Assigned Leads", description: "View and work only leads assigned directly to user", category: "leads", action: "read" },
  { id: "p-leads-write", code: "leads:write", name: "Manage & Update Leads", description: "Create, update, and advance lead stage in CRM pipeline", category: "leads", action: "update" },

  // Businesses & Organizations (SSO Backend Track 4.2)
  { id: "p-biz-write", code: "businesses:write", name: "Manage Business Accounts", description: "Manage business accounts — suspension, verification, unlocking", category: "businesses", action: "update", isSensitive: true },
  { id: "p-org-read-sso", code: "organisations:read", name: "View Registered Organisations", description: "Read-only access to tenant business organizations", category: "businesses", action: "read" },

  // Roles & Security (SSO Backend Track 4.2)
  { id: "p-roles-read", code: "roles:read", name: "View Roles & Scopes", description: "Read-only access to defined roles and attached permissions", category: "roles", action: "read" },
  { id: "p-roles-create", code: "roles:create", name: "Create Custom Roles", description: "Define new custom department roles and templates", category: "roles", action: "create" },
  { id: "p-roles-update", code: "roles:update", name: "Edit Role Permissions", description: "Attach or overwrite permission key arrays on roles", category: "roles", action: "update", isSensitive: true },
  { id: "p-roles-delete", code: "roles:delete", name: "Delete Custom Roles", description: "Retire or remove custom roles", category: "roles", action: "delete", isSensitive: true },

  // Permissions Catalog (SSO Backend Track 4.2)
  { id: "p-perms-read", code: "permissions:read", name: "View Permission Catalog", description: "Inspect master catalogue of system permission keys", category: "permissions", action: "read" },

  // Users (SSO Backend Track 4.2)
  { id: "p-users-write", code: "users:write", name: "Manage User Accounts", description: "Update user accounts, status, password resets, and locks", category: "users", action: "update", isSensitive: true },
  { id: "p16", code: "users:read", name: "View User Profiles", description: "View internal admins, buyers, farmers & merchants", category: "users", action: "read" },
  { id: "p17", code: "users:create", name: "Invite Admin Users", description: "Invite new internal team members to admin panel", category: "users", action: "create" },
  { id: "p19", code: "users:delete", name: "Revoke User Access", description: "Deactivate or delete user accounts", category: "users", action: "delete", isSensitive: true },

  // Organizations Platform
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
