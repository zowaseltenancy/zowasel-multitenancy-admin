import { BuyerTier, PlatformUserCategory, PlatformUserRole, StaffDepartment } from "@/types/user";
import { StatusTone } from "@/lib/statusTone";

export const USER_CATEGORY_LABELS: Record<PlatformUserCategory, string> = {
  agent: "Field Agent",
  merchant: "Merchant",
  agrodealer: "Agrodealer",
  cooperative: "Cooperative",
  buyer: "Buyer",
  staff: "Zowasel Staff",
};

// Fixed categorical color per user category — agent matches Field Agent's
// existing role-badge color, the other four match ORGANIZATION_TYPE_COLORS
// so the same entity type reads the same hue whether it's an org or a user.
export const USER_CATEGORY_COLORS: Record<Exclude<PlatformUserCategory, "staff">, string> = {
  agent: "bg-emerald-500",
  merchant: "bg-blue-500",
  agrodealer: "bg-lime-500",
  cooperative: "bg-teal-500",
  buyer: "bg-orange-500",
};

// Matches the icon colors already assigned to each department on the
// Zowasel Staff overview page (src/app/(dashboard)/admin/staff/page.tsx).
export const STAFF_DEPARTMENT_COLORS: Record<StaffDepartment, string> = {
  Executive: "bg-cyan-500",
  Technology: "bg-indigo-500",
  Programs: "bg-emerald-500",
  Fintech: "bg-amber-500",
  Sales: "bg-rose-500",
  Finance: "bg-purple-500",
  Administration: "bg-slate-500",
  Compliance: "bg-red-500",
  "Regional Operations": "bg-teal-500",
};

// Which roles are selectable once a category (the "overarching" entity type)
// has been chosen when creating a new user.
export const CATEGORY_ROLE_OPTIONS: Record<PlatformUserCategory, PlatformUserRole[]> = {
  agent: ["Field Agent", "Field Supervisor", "Programme Manager"],
  merchant: ["Input Merchant", "Tenant Admin"],
  agrodealer: ["Agrodealer", "Tenant Admin"],
  cooperative: ["Cooperative Leader", "Tenant Admin"],
  buyer: ["Buyer", "Tenant Admin"],
  staff: ["Zowasel Staff Admin", "Compliance Officer", "Data Analyst"],
};

export const BUYER_TIER_LABELS: Record<BuyerTier, string> = {
  red_hot: "Red Hot",
  brown_chip: "Brown Chip",
  blue_chip: "Blue Chip",
};

export const BUYER_TIER_DESCRIPTIONS: Record<BuyerTier, string> = {
  red_hot: "Pays in full immediately",
  brown_chip: "Pays in part, balance follows",
  blue_chip: "Profiled, high-value — reconciles after transaction",
};

export const BUYER_TIER_TONE: Record<BuyerTier, StatusTone> = {
  red_hot: "danger",
  brown_chip: "warning",
  blue_chip: "info",
};
