import { BusinessListQuery } from "./organization.types";

export const organizationKeys = {
  all: ["organizations"] as const,
  lists: () => [...organizationKeys.all, "list"] as const,
  list: (params: BusinessListQuery) => [...organizationKeys.lists(), params] as const,
  detail: (id: string) => [...organizationKeys.all, "detail", id] as const,
  stats: () => [...organizationKeys.all, "stats"] as const,
};

