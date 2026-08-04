import { OrganizationType } from "@/types/organization";

export const ORGANIZATION_TYPE_LABELS: Record<
  OrganizationType,
  string
> = {
  merchant: "Merchant",
  agrodealer: "Agrodealer",
  buyer: "Buyer",
  cooperative: "Cooperative",
};

// Fixed categorical order/hue per entity type — matches the colors
// UserRoleBadge already uses for the equivalent roles (Input Merchant,
// Agrodealer, Cooperative Leader, Buyer), so a type reads the same color
// everywhere it appears, not just within one screen.
export const ORGANIZATION_TYPE_COLORS: Record<OrganizationType, string> = {
  merchant: "bg-blue-500",
  agrodealer: "bg-lime-500",
  cooperative: "bg-teal-500",
  buyer: "bg-orange-500",
};

export const ORGANIZATION_TYPE_FILTERS: {
  label: string;

  value: OrganizationType | "all";
}[] = [
  { label: "All Entities", value: "all" },
  { label: "Merchants", value: "merchant" },
  { label: "Agrodealers", value: "agrodealer" },
  { label: "Buyers", value: "buyer" },
  { label: "Cooperatives", value: "cooperative" },
];
