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
