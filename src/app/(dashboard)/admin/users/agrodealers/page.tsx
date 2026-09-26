"use client";

import UsersListView from "@/features/users/components/UsersListView";

export default function AgrodealersUserPage() {
  return (
    <UsersListView
      title="Agrodealers Directory"
      description="View agrodealers supplying farm inputs (agrochemicals, fertilizers, certified seeds) and storage facilities."
      dataSource="platform"
    />
  );
}
