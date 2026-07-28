"use client";

import { useMemo, useState } from "react";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import UserTable from "./UserTable";
import { useUsers } from "../hooks/useUsers";
import { PlatformUserRole, UserAccountStatus } from "@/types/user";

export default function UsersListView() {
  const { users } = useUsers();
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState<PlatformUserRole | "all">("all");
  const [statusFilter, setStatusFilter] = useState<UserAccountStatus | "all">("all");

  const filteredUsers = useMemo(() => {
    return users.filter((user) => {
      const query = search.toLowerCase().trim();
      const matchesSearch =
        query === "" ||
        user.firstName.toLowerCase().includes(query) ||
        user.lastName.toLowerCase().includes(query) ||
        user.email.toLowerCase().includes(query) ||
        user.organizationName.toLowerCase().includes(query);

      const matchesRole = roleFilter === "all" || user.role === roleFilter;
      const matchesStatus = statusFilter === "all" || user.status === statusFilter;

      return matchesSearch && matchesRole && matchesStatus;
    });
  }, [users, search, roleFilter, statusFilter]);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Platform Users & Team Members</h1>
        <p className="mt-2 text-muted-foreground">
          Manage system-wide tenant administrators, field agents, agronomists, and internal staff.
        </p>
      </div>

      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search users by name, email, or organization..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9"
          />
        </div>

        <div className="flex items-center gap-3">
          <select
            value={roleFilter}
            onChange={(e) => setRoleFilter(e.target.value as PlatformUserRole | "all")}
            className="h-10 rounded-xl border border-input bg-card px-3 text-sm outline-none focus-visible:border-primary"
          >
            <option value="all">All Roles</option>
            <option value="Tenant Admin">Tenant Admin</option>
            <option value="Programme Manager">Programme Manager</option>
            <option value="Field Supervisor">Field Supervisor</option>
            <option value="Field Agent">Field Agent</option>
            <option value="Agronomist">Agronomist</option>
            <option value="Data Analyst">Data Analyst</option>
          </select>

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value as UserAccountStatus | "all")}
            className="h-10 rounded-xl border border-input bg-card px-3 text-sm outline-none focus-visible:border-primary"
          >
            <option value="all">All Statuses</option>
            <option value="active">Active</option>
            <option value="pending">Pending</option>
            <option value="suspended">Suspended</option>
          </select>
        </div>
      </div>

      <UserTable users={filteredUsers} />
    </div>
  );
}
