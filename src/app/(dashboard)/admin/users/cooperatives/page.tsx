"use client";

import UsersListView from "@/features/users/components/UsersListView";

export default function CooperativesUserPage() {
  return (
    <UsersListView
      title="Farmer Cooperatives Directory"
      description="View farmer cooperative leaders, general secretaries, credit officers, and governance structures."
      dataSource="platform"
    />
  );
}
