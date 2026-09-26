"use client";

import UsersListView from "@/features/users/components/UsersListView";

export default function AgentsUserPage() {
  return (
    <UsersListView
      title="Field Agents Directory"
      description="View all field agents, their coverage areas, and the merchants, agrodealers, and cooperatives onboarded under them."
      dataSource="platform"
    />
  );
}
