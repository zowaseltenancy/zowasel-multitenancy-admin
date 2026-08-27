import { ListLeadsQuery } from "./leads.types";

export const leadsKeys = {
  all: ["leads"] as const,
  lists: () => [...leadsKeys.all, "list"] as const,
  list: (params: ListLeadsQuery) => [...leadsKeys.lists(), params] as const,
  detail: (id: string) => [...leadsKeys.all, "detail", id] as const,
};

