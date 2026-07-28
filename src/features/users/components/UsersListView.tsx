"use client";

import { useMemo, useState } from "react";
import { Search, Users, UserCheck, Clock, UserX } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import UserTable from "./UserTable";
import Pagination from "@/components/shared/Pagination";
import { useUsers } from "../hooks/useUsers";
import { PlatformUserRole, UserAccountStatus } from "@/types/user";

export default function UsersListView() {
  const { users } = useUsers();
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState<PlatformUserRole | "all">("all");
  const [statusFilter, setStatusFilter] = useState<UserAccountStatus | "all">("all");
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  const activeCount = users.filter((u) => u.status === "active").length;
  const pendingCount = users.filter((u) => u.status === "pending").length;
  const suspendedCount = users.filter((u) => u.status === "suspended").length;

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

  const totalItems = filteredUsers.length;
  const pageCount = Math.max(1, Math.ceil(totalItems / pageSize));
  const paginatedUsers = filteredUsers.slice((page - 1) * pageSize, page * pageSize);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Platform Users & Team Members</h1>
        <p className="mt-2 text-muted-foreground">
          Manage system-wide tenant administrators, field agents, agronomists, and internal staff.
        </p>
      </div>

      {/* Snapshot Cards with Status Color Background Tints */}
      <div className="grid gap-4 md:grid-cols-4">
        {/* Total Users - Cyan Tint */}
        <Card className="bg-cyan-500/5 dark:bg-cyan-500/10 border-cyan-500/20 shadow-2xs">
          <CardContent className="p-5 flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                Total Users
              </p>
              <h3 className="text-2xl font-bold mt-1">{users.length}</h3>
            </div>
            <div className="p-2.5 rounded-xl bg-cyan-500/15 text-cyan-600 border border-cyan-500/30 dark:text-cyan-400">
              <Users className="h-5 w-5" />
            </div>
          </CardContent>
        </Card>

        {/* Active - Emerald Tint */}
        <Card className="bg-emerald-500/5 dark:bg-emerald-500/10 border-emerald-500/20 shadow-2xs">
          <CardContent className="p-5 flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                Active Users
              </p>
              <h3 className="text-2xl font-bold mt-1">{activeCount}</h3>
            </div>
            <div className="p-2.5 rounded-xl bg-emerald-500/15 text-emerald-600 border border-emerald-500/30 dark:text-emerald-400">
              <UserCheck className="h-5 w-5" />
            </div>
          </CardContent>
        </Card>

        {/* Pending - Amber Tint */}
        <Card className="bg-amber-500/5 dark:bg-amber-500/10 border-amber-500/20 shadow-2xs">
          <CardContent className="p-5 flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                Pending Approval
              </p>
              <h3 className="text-2xl font-bold mt-1">{pendingCount}</h3>
            </div>
            <div className="p-2.5 rounded-xl bg-amber-500/15 text-amber-600 border border-amber-500/30 dark:text-amber-400">
              <Clock className="h-5 w-5" />
            </div>
          </CardContent>
        </Card>

        {/* Suspended - Red Tint */}
        <Card className="bg-red-500/5 dark:bg-red-500/10 border-red-500/30 shadow-2xs">
          <CardContent className="p-5 flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                Suspended Accounts
              </p>
              <h3 className="text-2xl font-bold mt-1">{suspendedCount}</h3>
            </div>
            <div className="p-2.5 rounded-xl bg-red-500/15 text-red-600 border border-red-500/30 dark:text-red-400">
              <UserX className="h-5 w-5" />
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search users by name, email, or organization..."
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(1);
            }}
            className="pl-9"
          />
        </div>

        <div className="flex items-center gap-3">
          <select
            value={roleFilter}
            onChange={(e) => {
              setRoleFilter(e.target.value as PlatformUserRole | "all");
              setPage(1);
            }}
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
            onChange={(e) => {
              setStatusFilter(e.target.value as UserAccountStatus | "all");
              setPage(1);
            }}
            className="h-10 rounded-xl border border-input bg-card px-3 text-sm outline-none focus-visible:border-primary"
          >
            <option value="all">All Statuses</option>
            <option value="active">Active</option>
            <option value="pending">Pending</option>
            <option value="suspended">Suspended</option>
          </select>
        </div>
      </div>

      <UserTable users={paginatedUsers} />

      <Pagination
        page={page}
        pageCount={pageCount}
        onPageChange={setPage}
        pageSize={pageSize}
        onPageSizeChange={setPageSize}
        totalItems={totalItems}
        pageSizeOptions={[5, 10, 15, 20]}
      />
    </div>
  );
}
