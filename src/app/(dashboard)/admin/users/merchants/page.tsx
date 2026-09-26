"use client";

import UsersListView from "@/features/users/components/UsersListView";

export default function MerchantsUserPage() {
  return (
    <UsersListView
      title="Merchants Directory"
      description="View individual and organization commodity merchants trading grains, cash crops, and produce."
      dataSource="platform"
    />
  );
}
