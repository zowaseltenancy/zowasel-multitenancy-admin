"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { Users, Mail, Phone, ArrowRight } from "lucide-react";
import { Organization } from "@/types/organization";
import { Card, CardContent } from "@/components/ui/card";
import UserRoleBadge from "@/features/users/components/UserRoleBadge";
import UserStatusBadge from "@/features/users/components/UserStatusBadge";
import { useUsers } from "@/features/users/hooks/useUsers";
import Pagination from "@/components/shared/Pagination";

const PAGE_SIZE = 5;

interface Props {
  organization: Organization;
}

export default function OrganizationUsersTab({ organization }: Props) {
  const { users } = useUsers(organization.id);
  const [page, setPage] = useState(1);

  const pageCount = Math.ceil(users.length / PAGE_SIZE);

  const paginatedUsers = useMemo(() => {
    const startIndex = (page - 1) * PAGE_SIZE;
    return users.slice(startIndex, startIndex + PAGE_SIZE);
  }, [users, page]);

  return (
    <Card className="bg-card">
      <CardContent className="p-5 space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Users className="h-4 w-4 text-primary" />
            <h3 className="font-semibold text-sm">
              Team Members & Users ({users.length})
            </h3>
          </div>
          <p className="text-xs text-muted-foreground">
            Registered team members under {organization.name}
          </p>
        </div>

        {users.length === 0 ? (
          <div className="p-8 text-center text-xs text-muted-foreground border rounded-xl">
            No registered users found for this organization.
          </div>
        ) : (
          <div className="space-y-4">
            <div className="overflow-x-auto border rounded-xl">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="border-b bg-muted/50">
                    <th className="p-3 font-semibold text-muted-foreground uppercase">S/N</th>
                    <th className="p-3 font-semibold text-muted-foreground uppercase">User Name</th>
                    <th className="p-3 font-semibold text-muted-foreground uppercase">Contact Info</th>
                    <th className="p-3 font-semibold text-muted-foreground uppercase">Role</th>
                    <th className="p-3 font-semibold text-muted-foreground uppercase">Status</th>
                    <th className="p-3 font-semibold text-muted-foreground uppercase">Date Joined</th>
                    <th className="p-3 font-semibold text-muted-foreground uppercase text-right">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {paginatedUsers.map((user, idx) => (
                    <tr key={user.id} className="border-b last:border-0 hover:bg-muted/30 transition-colors">
                      <td className="p-3 text-muted-foreground">{(page - 1) * PAGE_SIZE + idx + 1}</td>
                      <td className="p-3 font-semibold text-foreground">
                        {user.firstName} {user.lastName}
                      </td>
                      <td className="p-3 text-muted-foreground">
                        <div>{user.email}</div>
                        <div className="text-[11px] opacity-80">{user.phone}</div>
                      </td>
                      <td className="p-3">
                        <UserRoleBadge role={user.role} />
                      </td>
                      <td className="p-3">
                        <UserStatusBadge status={user.status} />
                      </td>
                      <td className="p-3 text-muted-foreground">{user.dateJoined}</td>
                      <td className="p-3 text-right">
                        <Link
                          href={`/admin/users/${user.id}`}
                          className="inline-flex items-center gap-1 text-[11px] font-medium text-primary hover:underline"
                        >
                          View Profile <ArrowRight className="h-3 w-3" />
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <Pagination
              page={page}
              pageCount={pageCount}
              onPageChange={setPage}
            />
          </div>
        )}
      </CardContent>
    </Card>
  );
}
