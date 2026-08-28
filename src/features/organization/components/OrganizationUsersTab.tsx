"use client";

import { useState } from "react";
import Link from "next/link";
import { AlertCircle, ArrowRight, Users } from "lucide-react";

import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import Pagination from "@/components/shared/Pagination";
import { statusBadgeClass } from "@/lib/statusTone";
import { Organization } from "@/types/organization";
import { useOrganizationUsers } from "../hooks/useOrganizations";

const PAGE_SIZE = 10;

interface Props {
  organization: Organization;
}

// GET /admin/users?tenantId={id} — the end-user accounts attached to this
// business. Previously read a fabricated user list filtered by organizationId,
// which matched nothing for a real tenant.
//
// Paged server-side. `phone` is not on the platform-user list projection (it
// lives on the user profile), so the contact column shows email only.
export default function OrganizationUsersTab({ organization }: Props) {
  const [page, setPage] = useState(1);
  const { users, meta, isLoading, isFetching, error } = useOrganizationUsers(organization.id, {
    page,
    limit: PAGE_SIZE,
  });

  const total = meta?.total ?? users.length;

  return (
    <Card className="bg-card">
      <CardContent className="space-y-4 p-5">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Users className="h-4 w-4 text-primary" />
            <h3 className="text-sm font-semibold">Users {isLoading ? "" : `(${total})`}</h3>
          </div>
          <p className="text-xs text-muted-foreground">
            Registered user accounts under {organization.name}
          </p>
        </div>

        {isLoading ? (
          <div className="space-y-2">
            {Array.from({ length: 5 }).map((_, index) => (
              <Skeleton key={index} className="h-10 w-full" />
            ))}
          </div>
        ) : error ? (
          <div className="flex flex-col items-center gap-2 rounded-xl border p-8 text-center">
            <AlertCircle className="h-5 w-5 text-destructive" />
            <p className="text-sm font-medium text-foreground">Unable to load users</p>
            <p className="max-w-md text-xs text-muted-foreground">{error}</p>
          </div>
        ) : users.length === 0 ? (
          <div className="rounded-xl border p-8 text-center text-xs text-muted-foreground">
            No registered users found for this organization.
          </div>
        ) : (
          <div className={`space-y-4 ${isFetching ? "opacity-60 transition-opacity" : ""}`}>
            <div className="overflow-x-auto rounded-xl border">
              <table className="w-full border-collapse text-left text-xs">
                <thead>
                  <tr className="border-b bg-muted/50">
                    <th className="p-3 font-semibold uppercase text-muted-foreground">S/N</th>
                    <th className="p-3 font-semibold uppercase text-muted-foreground">User Name</th>
                    <th className="p-3 font-semibold uppercase text-muted-foreground">Email</th>
                    <th className="p-3 font-semibold uppercase text-muted-foreground">Roles</th>
                    <th className="p-3 font-semibold uppercase text-muted-foreground">Status</th>
                    <th className="p-3 font-semibold uppercase text-muted-foreground">Date Joined</th>
                    <th className="p-3 text-right font-semibold uppercase text-muted-foreground">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {users.map((user, index) => {
                    // Suspension and lockout are flags separate from isActive,
                    // and the more severe one should win the badge.
                    const label = user.isSuspended
                      ? "Suspended"
                      : user.isLocked
                        ? "Locked"
                        : user.isActive
                          ? "Active"
                          : "Inactive";
                    const tone =
                      user.isSuspended || user.isLocked
                        ? "danger"
                        : user.isActive
                          ? "success"
                          : "neutral";

                    return (
                      <tr key={user.id} className="border-b transition-colors last:border-0 hover:bg-muted/30">
                        <td className="p-3 text-muted-foreground">
                          {(page - 1) * PAGE_SIZE + index + 1}
                        </td>
                        <td className="p-3 font-semibold text-foreground">
                          {user.firstName} {user.lastName}
                        </td>
                        <td className="p-3 text-muted-foreground">{user.email}</td>
                        <td className="p-3 text-muted-foreground">
                          {user.roles.length > 0 ? user.roles.join(", ") : "—"}
                        </td>
                        <td className="p-3">
                          <span
                            className={`inline-flex items-center rounded border px-2 py-0.5 text-[11px] font-semibold ${statusBadgeClass(
                              tone,
                            )}`}
                          >
                            {label}
                          </span>
                        </td>
                        <td className="p-3 text-muted-foreground">
                          {new Date(user.createdAt).toLocaleDateString()}
                        </td>
                        <td className="p-3 text-right">
                          <Link
                            href={`/admin/users/${user.id}`}
                            className="inline-flex items-center gap-1 text-[11px] font-medium text-primary hover:underline"
                          >
                            View <ArrowRight className="h-3 w-3" />
                          </Link>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            <Pagination
              page={page}
              pageCount={meta?.totalPages ?? 1}
              onPageChange={setPage}
              pageSize={PAGE_SIZE}
              totalItems={total}
            />
          </div>
        )}
      </CardContent>
    </Card>
  );
}
