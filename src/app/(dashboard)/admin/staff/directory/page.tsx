"use client";

import { useState } from "react";
import { AlertCircle, Mail, Search } from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import UserAvatar from "@/components/shared/UserAvatar";
import Pagination from "@/components/shared/Pagination";
import { statusBadgeClass } from "@/lib/statusTone";
import { StaffStatus } from "@/features/staff/api/staff.types";
import { staffDisplayName, useDepartments, useStaff } from "@/features/staff/hooks/useStaff";

// Backed by GET /admin/staff and GET /admin/departments.
//
// Previously this read the mock user list, filtered to userCategory === "staff"
// and grouped by a hardcoded department name union ("Executive", "Technology",
// …). Real departments are records with ids — the seeded set is Sales,
// Operations, Compliance, Finance, People & Culture — so the filter now sends
// departmentId and the options come from the API.
//
// Three columns from the mock are gone because the API has no source for them:
// phone and position aren't on the admin record at all, and the geographic
// "jurisdiction" scope isn't modelled server-side.

const PAGE_SIZE = 20;

const STATUS_TONE: Record<StaffStatus, "success" | "warning" | "danger" | "neutral"> = {
  ACTIVE: "success",
  INACTIVE: "neutral",
  SUSPENDED: "danger",
};

export default function StaffDirectoryPage() {
  const [search, setSearch] = useState("");
  const [departmentId, setDepartmentId] = useState<string>("all");
  const [page, setPage] = useState(1);

  const { departments } = useDepartments();
  const { staff, meta, isLoading, isFetching, error } = useStaff({
    page,
    limit: PAGE_SIZE,
    // Filtered server-side rather than in the browser, so the result is the
    // whole directory and not just whatever landed on the current page.
    ...(search.trim() ? { search: search.trim() } : {}),
    ...(departmentId !== "all" ? { departmentId } : {}),
  });

  const resetTo = (fn: () => void) => {
    fn();
    setPage(1);
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Staff Directory</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Internal Zowasel staff, organized by department.
        </p>
      </div>

      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div className="relative max-w-md flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search staff by name or email..."
            value={search}
            onChange={(event) => resetTo(() => setSearch(event.target.value))}
            className="pl-9"
          />
        </div>

        <select
          value={departmentId}
          onChange={(event) => resetTo(() => setDepartmentId(event.target.value))}
          className="h-9 rounded-md border border-border bg-background px-3 text-sm"
        >
          <option value="all">All departments</option>
          {departments.map((department) => (
            <option key={department.id} value={department.id}>
              {department.name}
            </option>
          ))}
        </select>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">
            Staff {isLoading ? "" : `(${meta?.total ?? staff.length})`}
          </CardTitle>
        </CardHeader>

        <CardContent>
          {isLoading ? (
            <div className="space-y-3">
              {Array.from({ length: 6 }).map((_, index) => (
                <Skeleton key={index} className="h-12 w-full" />
              ))}
            </div>
          ) : error ? (
            <div className="flex flex-col items-center gap-2 py-10 text-center">
              <AlertCircle className="h-5 w-5 text-destructive" />
              <p className="text-sm font-medium text-foreground">Unable to load staff</p>
              <p className="max-w-md text-xs text-muted-foreground">{error}</p>
            </div>
          ) : staff.length === 0 ? (
            <p className="py-10 text-center text-sm text-muted-foreground">
              No staff match the current filters.
            </p>
          ) : (
            <div className={`space-y-4 ${isFetching ? "opacity-60 transition-opacity" : ""}`}>
              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm">
                  <thead className="border-b bg-muted/40 text-xs uppercase text-muted-foreground">
                    <tr>
                      <th className="p-3 font-medium">Name</th>
                      <th className="p-3 font-medium">Department</th>
                      <th className="p-3 font-medium">System Role</th>
                      <th className="p-3 font-medium">Manager</th>
                      <th className="p-3 font-medium">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border">
                    {staff.map((member) => (
                      <tr key={member.id} className="hover:bg-muted/30">
                        <td className="p-3">
                          <div className="flex items-center gap-3">
                            <UserAvatar
                              firstName={member.firstName ?? member.email}
                              lastName={member.lastName ?? ""}
                            />
                            <div className="min-w-0">
                              <p className="font-medium text-foreground">{staffDisplayName(member)}</p>
                              <p className="flex items-center gap-1 text-xs text-muted-foreground">
                                <Mail className="h-3 w-3" />
                                {member.email}
                              </p>
                            </div>
                          </div>
                        </td>
                        <td className="p-3 text-muted-foreground">
                          {member.department?.name ?? "Unassigned"}
                        </td>
                        <td className="p-3">
                          <span className="inline-flex items-center rounded border border-border bg-muted/50 px-2 py-0.5 text-xs font-semibold">
                            {member.role.replace("_", " ").toLowerCase()}
                          </span>
                        </td>
                        <td className="p-3 text-muted-foreground">
                          {member.manager
                            ? [member.manager.firstName, member.manager.lastName].filter(Boolean).join(" ") || "—"
                            : "—"}
                        </td>
                        <td className="p-3">
                          <span
                            className={`inline-flex items-center rounded border px-2 py-0.5 text-xs font-semibold ${statusBadgeClass(
                              STATUS_TONE[member.status],
                            )}`}
                          >
                            {member.status.toLowerCase()}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <Pagination
                page={page}
                pageCount={meta?.totalPages ?? 1}
                onPageChange={setPage}
                pageSize={PAGE_SIZE}
                totalItems={meta?.total ?? staff.length}
              />
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
