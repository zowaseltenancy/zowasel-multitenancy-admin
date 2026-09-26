"use client";

import UsersListView from "@/features/users/components/UsersListView";

export default function BuyersUserPage() {
  return (
    <UsersListView
      title="Commodity Buyers Directory"
      description="View institutional offtakers, grain buyers, and commodity procurement leads."
      dataSource="platform"
    />
  );
}
