import Link from "next/link";
import { Eye } from "lucide-react";
import UserRoleBadge from "./UserRoleBadge";
import UserStatusBadge from "./UserStatusBadge";
import { PlatformUser } from "@/types/user";

interface Props {
  users: PlatformUser[];
}

export default function UserTable({ users }: Props) {
  return (
    <div className="rounded-xl border bg-card shadow-sm overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm">
          <thead className="border-b bg-muted/50 text-xs font-semibold uppercase text-muted-foreground">
            <tr>
              <th className="p-4">User</th>
              <th className="p-4">Role</th>
              <th className="p-4">Organization</th>
              <th className="p-4">Status</th>
              <th className="p-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {users.map((user) => (
              <tr key={user.id} className="hover:bg-muted/30 transition-colors">
                <td className="p-4 font-medium">
                  <div className="flex items-center gap-3">
                    <div className="flex h-9 w-9 items-center justify-center rounded-full bg-primary/10 font-bold text-primary">
                      {user.firstName[0]}
                      {user.lastName[0]}
                    </div>
                    <div>
                      <div className="font-semibold text-foreground">
                        {user.firstName} {user.lastName}
                      </div>
                      <div className="text-xs text-muted-foreground">{user.email}</div>
                    </div>
                  </div>
                </td>
                <td className="p-4">
                  <UserRoleBadge role={user.role} />
                </td>
                <td className="p-4">
                  <Link
                    href={`/admin/organizations/${user.organizationId}`}
                    className="text-primary hover:underline font-medium"
                  >
                    {user.organizationName}
                  </Link>
                </td>
                <td className="p-4">
                  <UserStatusBadge status={user.status} />
                </td>
                <td className="p-4 text-right">
                  <Link
                    href={`/admin/users/${user.id}`}
                    className="inline-flex items-center gap-1.5 rounded-lg border px-3 py-1.5 text-xs font-medium transition-colors hover:bg-accent"
                  >
                    <Eye className="h-3.5 w-3.5" />
                    View Profile
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
