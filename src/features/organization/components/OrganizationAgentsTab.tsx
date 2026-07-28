"use client";

import Link from "next/link";
import { UserCog, ArrowRight, MapPin } from "lucide-react";
import { Organization } from "@/types/organization";
import { Card, CardContent } from "@/components/ui/card";
import UserStatusBadge from "@/features/users/components/UserStatusBadge";
import UserRoleBadge from "@/features/users/components/UserRoleBadge";
import { useUsers } from "@/features/users/hooks/useUsers";

interface Props {
  organization: Organization;
}

export default function OrganizationAgentsTab({ organization }: Props) {
  const { users } = useUsers(organization.id);
  const agents = users.filter((u) => u.role === "Field Agent" || u.role === "Field Supervisor");

  return (
    <Card className="bg-card">
      <CardContent className="p-5 space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <UserCog className="h-4 w-4 text-primary" />
            <h3 className="font-semibold text-sm">
              Field Agents & Agronomists ({agents.length})
            </h3>
          </div>
          <p className="text-xs text-muted-foreground">
            Field agents managing farm visits & advisory for {organization.name}
          </p>
        </div>

        {agents.length === 0 ? (
          <div className="p-8 text-center text-xs text-muted-foreground border rounded-xl">
            No field agents or agronomists assigned to this organization.
          </div>
        ) : (
          <div className="overflow-x-auto border rounded-xl">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b bg-muted/50">
                  <th className="p-3 font-semibold text-muted-foreground uppercase">S/N</th>
                  <th className="p-3 font-semibold text-muted-foreground uppercase">Agent Name</th>
                  <th className="p-3 font-semibold text-muted-foreground uppercase">Role</th>
                  <th className="p-3 font-semibold text-muted-foreground uppercase">Coverage Area</th>
                  <th className="p-3 font-semibold text-muted-foreground uppercase">Assigned Farmers</th>
                  <th className="p-3 font-semibold text-muted-foreground uppercase">Status</th>
                  <th className="p-3 font-semibold text-muted-foreground uppercase text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {agents.map((agent, idx) => (
                  <tr key={agent.id} className="border-b last:border-0 hover:bg-muted/30 transition-colors">
                    <td className="p-3 text-muted-foreground">{idx + 1}</td>
                    <td className="p-3 font-semibold text-foreground">
                      {agent.firstName} {agent.lastName}
                    </td>
                    <td className="p-3">
                      <UserRoleBadge role={agent.role} />
                    </td>
                    <td className="p-3 text-muted-foreground flex items-center gap-1">
                      <MapPin className="h-3 w-3 text-primary" />
                      {agent.agentMeta?.coverageArea || "N/A"}
                    </td>
                    <td className="p-3 font-bold text-foreground">
                      {agent.agentMeta?.assignedFarmersCount || 0} farmers
                    </td>
                    <td className="p-3">
                      <UserStatusBadge status={agent.status} />
                    </td>
                    <td className="p-3 text-right">
                      <Link
                        href={`/admin/users/${agent.id}`}
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
        )}
      </CardContent>
    </Card>
  );
}
