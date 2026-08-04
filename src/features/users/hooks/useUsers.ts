"use client";

import { useState } from "react";
import { mockUsers } from "../data/mockUsers";
import { PlatformUser, PlatformUserRole, UserAccountStatus } from "@/types/user";

export function useUsers(initialOrgId?: string) {
  const [users, setUsers] = useState<PlatformUser[]>(() => {
    if (initialOrgId) {
      return mockUsers.filter((u) => u.organizationId === initialOrgId);
    }
    return mockUsers;
  });

  const getUserById = (id: string) => {
    return users.find((user) => user.id === id) || mockUsers.find((user) => user.id === id);
  };

  const toggleUserStatus = (id: string, newStatus: UserAccountStatus) => {
    setUsers((current) =>
      current.map((user) =>
        user.id === id ? { ...user, status: newStatus } : user
      )
    );
  };

  const addUser = (user: PlatformUser) => {
    setUsers((current) => [user, ...current]);
  };

  return {
    users,
    getUserById,
    toggleUserStatus,
    addUser,
  };
}
