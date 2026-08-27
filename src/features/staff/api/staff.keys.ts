import { StaffListQuery } from "./staff.types";

export const staffKeys = {
  all: ["staff"] as const,
  lists: () => [...staffKeys.all, "list"] as const,
  list: (query: StaffListQuery) => [...staffKeys.lists(), query] as const,
  detail: (id: string) => [...staffKeys.all, "detail", id] as const,
  departments: () => ["departments"] as const,
};
