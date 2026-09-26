"use client";

import { useEffect, useMemo, useState } from "react";
import { Search, Users, UserCheck, Clock, UserX, UserPlus, Loader2, AlertCircle } from "lucide-react";
import { toast } from "sonner";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import UserTable from "./UserTable";
import CreateUserDialog from "./CreateUserDialog";
import Pagination from "@/components/shared/Pagination";
import CompactRegionScopeSelector from "@/components/shared/CompactRegionScopeSelector";
import { useUsers } from "../hooks/useUsers";
import { usePlatformUsers, usePlatformUserStats } from "../hooks/usePlatformUsers";
import { toApiRoleSlug } from "../api/platform-users.mappers";
import { useOrganizations } from "@/features/organization/hooks/useOrganizations";
import { BuyerTier, PlatformUserCategory, PlatformUserRole, UserAccountStatus } from "@/types/user";
import { GeographicFilterState } from "@/types/geo";
import { CreateUserSchema } from "@/schemas/user.schema";
import { BUYER_TIER_LABELS } from "@/constants/user";

interface Props {
  title?: string;
  description?: string;
  categoryFilter?: PlatformUserCategory | "all";
  showStatsCards?: boolean;
  /**
   * Where the rows come from. 'platform' is the API; 'sample' is the fixture,
   * for the category screens whose filters have no server-side source yet.
   */
  dataSource?: "platform" | "sample";
}

const CATEGORY_LABELS: Record<PlatformUserCategory | "all", string> = {
  all: "Users",
  agent: "Agents",
  merchant: "Merchants",
  agrodealer: "Agrodealers",
  cooperative: "Cooperatives",
  buyer: "Buyers",
  staff: "Staff",
};

// Zowasel Staff Admin / Compliance Officer are excluded — staff are a
// separate domain from platform/tenant users, not selectable here.
const ROLE_OPTIONS: PlatformUserRole[] = [
  "Tenant Admin",
  "Programme Manager",
  "Field Supervisor",
  "Field Agent",
  "Data Analyst",
  "Farmer (self-service)",
  "Input Merchant",
  "Agrodealer",
  "Cooperative Leader",
  "Buyer",
];

export default function UsersListView({
  title = "Platform Users Directory",
  description = "Manage and audit all platform users across agents, merchants, agrodealers, cooperatives, and buyers.",
  categoryFilter = "all",
  showStatsCards = true,
  dataSource = "platform",
}: Props) {
  // Two sources, chosen by the caller, because they are not interchangeable.
  //
  // `platform` is GET /admin/users — the real accounts. It returns identity,
  // the account flags, roles and a tenant count, and nothing else: there is no
  // gender, buyer tier, user category, agent metadata or geography on a user
  // server-side (see platform-users.mappers).
  //
  // `sample` is the fixture, and the category screens still use it because
  // those screens exist to slice by exactly the fields the API does not have.
  // Pointing them at the API would render five empty tables and look like a
  // fault rather than a gap.
  const { organizations } = useOrganizations();
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState<PlatformUserRole | "all">("all");
  const [statusFilter, setStatusFilter] = useState<UserAccountStatus | "all">("all");
  const [genderFilter, setGenderFilter] = useState<"all" | "male" | "female">("all");
  const [tierFilter, setTierFilter] = useState<BuyerTier | "all">("all");
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [createOpen, setCreateOpen] = useState(false);

  // Typing should not fire a request per keystroke, and out-of-order responses
  // would make the table flicker between result sets.
  const [debouncedSearch, setDebouncedSearch] = useState("");
  useEffect(() => {
    const timer = setTimeout(() => setDebouncedSearch(search), 300);
    return () => clearTimeout(timer);
  }, [search]);

  // Search, status and paging narrow server-side, so the table is a page of
  // the whole user base rather than a slice of the first hundred rows. The
  // four-way status maps onto two independent server flags — see toUiStatus;
  // 'pending' means unverified, which the endpoint does not filter on, so it
  // stays a client-side narrowing of the page.
  const platform = usePlatformUsers({
    page,
    limit: pageSize,
    ...(debouncedSearch.trim() ? { search: debouncedSearch.trim() } : {}),
    ...(statusFilter === "suspended" ? { isSuspended: true } : {}),
    ...(statusFilter === "inactive" ? { isActive: false } : {}),
    ...(statusFilter === "active" ? { isActive: true, isSuspended: false } : {}),
    // Only when the chosen title has a slug behind it. The console offers
    // titles the roles table has no row for (Programme Manager, Data Analyst
    // and the rest); sending one would filter on a role that cannot match, so
    // those stay a client-side narrowing instead.
    ...(toApiRoleSlug(roleFilter === "all" ? undefined : roleFilter)
      ? { role: toApiRoleSlug(roleFilter as PlatformUserRole) }
      : {}),
  });
  const sample = useUsers();
  // Platform-wide counts for the snapshot cards.
  const { stats } = usePlatformUserStats();

  const users = dataSource === "platform" ? platform.mapped : sample.users;
  const addUser = sample.addUser;

  // POST /admin/users, which provisions the account and emails an invitation
  // to set a password. This used to push an object into a fixture array and
  // toast success — nothing left the browser, and the "user" was gone on
  // refresh.
  //
  // Two fields the form collects have no home server-side: `gender` and
  // `userCategory` are not columns on a user, so they are not sent. They still
  // drive the form's own role options, which is why they are still asked for.
  const handleCreateUser = (values: CreateUserSchema) => {
    if (dataSource !== "platform") {
      // The category screens run on the fixture; creating there would write to
      // the API and then not appear in the list the operator is looking at.
      addUser({
        id: `usr_${Date.now()}`,
        firstName: values.firstName,
        lastName: values.lastName,
        email: values.email,
        phone: values.phone,
        gender: values.gender,
        role: values.role,
        userCategory: values.userCategory,
        status: "pending",
        organizationId: values.organizationId,
        organizationName:
          organizations.find((org) => org.id === values.organizationId)?.name ?? "Unassigned",
        dateJoined: new Date().toISOString().slice(0, 10),
        lastActive: new Date().toISOString(),
        permissions: [],
      });
      toast.success(`${values.firstName} ${values.lastName} added to the sample directory.`);
      setCreateOpen(false);
      return;
    }

    platform.create(
      {
        email: values.email,
        firstName: values.firstName,
        lastName: values.lastName,
        ...(values.phone ? { phone: values.phone } : {}),
        ...(toApiRoleSlug(values.role) ? { role: toApiRoleSlug(values.role) } : {}),
        ...(values.organizationId ? { tenantId: values.organizationId } : {}),
      },
      { onSuccess: () => setCreateOpen(false) },
    );
  };
  const [geoFilter, setGeoFilter] = useState<GeographicFilterState>({
    scope: "global",
    continent: "all",
    subRegion: "all",
    countryCode: "all",
  });

  const filteredUsers = useMemo(() => {
    return users.filter((user) => {
      // Zowasel Staff are a separate domain — never shown among Platform Users.
      if (user.userCategory === "staff") return false;

      const query = search.toLowerCase().trim();
      const matchesSearch =
        query === "" ||
        user.firstName.toLowerCase().includes(query) ||
        user.lastName.toLowerCase().includes(query) ||
        user.email.toLowerCase().includes(query) ||
        user.organizationName.toLowerCase().includes(query);

      const matchesRole = roleFilter === "all" || user.role === roleFilter;
      const matchesStatus = statusFilter === "all" || user.status === statusFilter;
      const matchesGender = genderFilter === "all" || user.gender === genderFilter;
      const matchesTier = tierFilter === "all" || user.buyerTier === tierFilter;

      // Category matching
      const matchesCategory =
        categoryFilter === "all" ||
        user.userCategory === categoryFilter ||
        (categoryFilter === "agent" && user.role === "Field Agent") ||
        (categoryFilter === "merchant" && user.role === "Input Merchant") ||
        (categoryFilter === "agrodealer" && user.role === "Agrodealer") ||
        (categoryFilter === "cooperative" && user.role === "Cooperative Leader") ||
        (categoryFilter === "buyer" && user.role === "Buyer");

      // Regional geographic filtering
      const matchesContinent =
        geoFilter.continent === "all" || user.continent === geoFilter.continent;
      const matchesSubRegion =
        geoFilter.subRegion === "all" || user.subRegion === geoFilter.subRegion;
      const matchesCountry =
        geoFilter.countryCode === "all" || user.countryCode === geoFilter.countryCode;

      return matchesSearch && matchesRole && matchesStatus && matchesGender && matchesTier && matchesCategory && matchesContinent && matchesSubRegion && matchesCountry;
    });
  }, [users, search, roleFilter, statusFilter, genderFilter, tierFilter, categoryFilter, geoFilter]);

  const isApi = dataSource === "platform";

  // Counted platform-wide by GET /admin/users/stats, not tallied from the rows
  // on screen. Tallying a page would make every figure mean "users currently
  // visible" and move as you filter or page — the totals would disagree with
  // themselves between page 1 and page 2.
  const totalItems = isApi ? (platform.meta?.total ?? filteredUsers.length) : filteredUsers.length;
  const activeCount = isApi ? (stats?.active ?? 0) : filteredUsers.filter((u) => u.status === "active").length;
  const pendingCount = isApi
    ? (stats?.unverified ?? 0)
    : filteredUsers.filter((u) => u.status === "pending").length;
  const suspendedCount = isApi
    ? (stats?.suspended ?? 0)
    : filteredUsers.filter((u) => u.status === "suspended").length;

  // The server already returned one page, so slicing again would page a page.
  const pageCount = isApi
    ? Math.max(1, platform.meta?.totalPages ?? 1)
    : Math.max(1, Math.ceil(filteredUsers.length / pageSize));
  const paginatedUsers = isApi
    ? filteredUsers
    : filteredUsers.slice((page - 1) * pageSize, page * pageSize);

  if (isApi && platform.isLoading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (isApi && platform.error) {
    return (
      <Card className="border-destructive/30 bg-destructive/5">
        <CardContent className="flex items-start gap-3 p-6">
          <AlertCircle className="mt-0.5 h-5 w-5 shrink-0 text-destructive" />
          <div className="space-y-1">
            <p className="text-sm font-semibold text-foreground">Users could not be loaded</p>
            <p className="text-sm text-muted-foreground">{platform.error}</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Top Section Grid: Left side has Title/Add User + Stat Cards; Right side has Map Selector at top right */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
        <div className="lg:col-span-6 xl:col-span-7 flex flex-col justify-between h-full space-y-4">
          <div className="flex items-start justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold tracking-tight">{title}</h1>
              <p className="mt-1.5 text-sm text-muted-foreground">{description}</p>
            </div>

            <Button onClick={() => setCreateOpen(true)} className="gap-2 shrink-0 cursor-pointer">
              <UserPlus className="h-4 w-4" />
              Add User
            </Button>
          </div>

          {/* Snapshot Cards with Status Color Background Tints */}
          {showStatsCards && (
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
              {/* Total (category-scoped) - Cyan Tint */}
              <Card className="bg-cyan-500/5 dark:bg-cyan-500/10 border-cyan-500/20 shadow-2xs">
                <CardContent className="p-4 flex items-center justify-between">
                  <div>
                    <p className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider">
                      Total {CATEGORY_LABELS[categoryFilter]}
                    </p>
                    <h3 className="text-xl font-bold mt-0.5">{totalItems}</h3>
                  </div>
                  <div className="p-2 rounded-xl bg-cyan-500/15 text-cyan-600 border border-cyan-500/30 dark:text-cyan-400">
                    <Users className="h-4 w-4" />
                  </div>
                </CardContent>
              </Card>

              {/* Active - Emerald Tint */}
              <Card className="bg-emerald-500/5 dark:bg-emerald-500/10 border-emerald-500/20 shadow-2xs">
                <CardContent className="p-4 flex items-center justify-between">
                  <div>
                    <p className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider">
                      Active
                    </p>
                    <h3 className="text-xl font-bold mt-0.5">{activeCount}</h3>
                  </div>
                  <div className="p-2 rounded-xl bg-emerald-500/15 text-emerald-600 border border-emerald-500/30 dark:text-emerald-400">
                    <UserCheck className="h-4 w-4" />
                  </div>
                </CardContent>
              </Card>

              {/* Pending - Amber Tint */}
              <Card className="bg-amber-500/5 dark:bg-amber-500/10 border-amber-500/20 shadow-2xs">
                <CardContent className="p-4 flex items-center justify-between">
                  <div>
                    <p className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider">
                      Pending
                    </p>
                    <h3 className="text-xl font-bold mt-0.5">{pendingCount}</h3>
                  </div>
                  <div className="p-2 rounded-xl bg-amber-500/15 text-amber-600 border border-amber-500/30 dark:text-amber-400">
                    <Clock className="h-4 w-4" />
                  </div>
                </CardContent>
              </Card>

              {/* Suspended - Red Tint */}
              <Card className="bg-red-500/5 dark:bg-red-500/10 border-red-500/30 shadow-2xs">
                <CardContent className="p-4 flex items-center justify-between">
                  <div>
                    <p className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider">
                      Suspended
                    </p>
                    <h3 className="text-xl font-bold mt-0.5">{suspendedCount}</h3>
                  </div>
                  <div className="p-2 rounded-xl bg-red-500/15 text-red-600 border border-red-500/30 dark:text-red-400">
                    <UserX className="h-4 w-4" />
                  </div>
                </CardContent>
              </Card>
            </div>
          )}
        </div>

        <div className="lg:col-span-6 xl:col-span-5 flex justify-end w-full h-full">
          <CompactRegionScopeSelector
            value={geoFilter}
            onChange={(newFilter) => {
              setGeoFilter(newFilter);
              setPage(1);
            }}
          />
        </div>
      </div>

      <CreateUserDialog
        open={createOpen}
        onOpenChange={setCreateOpen}
        organizations={organizations}
        onCreate={handleCreateUser}
        isCreating={platform.isCreating}
      />

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

        <div className="flex items-center gap-3 flex-wrap">
          <select
            value={roleFilter}
            onChange={(e) => {
              setRoleFilter(e.target.value as PlatformUserRole | "all");
              setPage(1);
            }}
            className="h-9 rounded-xl border border-input bg-card px-3 text-xs font-semibold outline-none focus-visible:border-primary cursor-pointer"
          >
            <option value="all">All Roles</option>
            {ROLE_OPTIONS.map((role) => (
              <option key={role} value={role}>
                {role}
              </option>
            ))}
          </select>

          <select
            value={statusFilter}
            onChange={(e) => {
              setStatusFilter(e.target.value as UserAccountStatus | "all");
              setPage(1);
            }}
            className="h-9 rounded-xl border border-input bg-card px-3 text-xs font-semibold outline-none focus-visible:border-primary cursor-pointer"
          >
            <option value="all">All Statuses</option>
            <option value="active">Active</option>
            <option value="pending">Pending</option>
            <option value="suspended">Suspended</option>
          </select>

          <select
            value={genderFilter}
            onChange={(e) => {
              setGenderFilter(e.target.value as "all" | "male" | "female");
              setPage(1);
            }}
            className="h-9 rounded-xl border border-input bg-card px-3 text-xs font-semibold outline-none focus-visible:border-primary cursor-pointer"
          >
            <option value="all">All Genders</option>
            <option value="male">Male</option>
            <option value="female">Female</option>
          </select>

          {categoryFilter === "buyer" && (
            <select
              value={tierFilter}
              onChange={(e) => {
                setTierFilter(e.target.value as BuyerTier | "all");
                setPage(1);
              }}
              className="h-9 rounded-xl border border-input bg-card px-3 text-xs font-semibold outline-none focus-visible:border-primary cursor-pointer"
            >
              <option value="all">All Tiers</option>
              {(Object.keys(BUYER_TIER_LABELS) as BuyerTier[]).map((tier) => (
                <option key={tier} value={tier}>
                  {BUYER_TIER_LABELS[tier]}
                </option>
              ))}
            </select>
          )}
        </div>
      </div>

      <UserTable users={paginatedUsers}
        // Only for API-sourced rows: these call PATCH /admin/users/{id}/…, so
        // offering them on fixture rows would be a button that can only 404.
        actions={
          isApi
            ? {
                onSetActive: (user, isActive) => platform.setActive(user.id, isActive),
                onSetSuspended: (user, isSuspended) => platform.setSuspended(user.id, isSuspended),
                onUnlock: (user) => platform.unlock(user.id),
                isMutating: platform.isMutating,
              }
            : undefined
        }
      />

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
