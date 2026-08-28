"use client";

import Link from "next/link";
import { AlertCircle, ArrowRight, UserCog } from "lucide-react";

import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { statusBadgeClass } from "@/lib/statusTone";
import { Organization } from "@/types/organization";
import { useOrganizationFieldAgents } from "../hooks/useOrganizations";

interface Props {
  organization: Organization;
}

// GET /admin/businesses/{id}/members?role=FIELD_AGENT. A field agent is a
// TenantMember holding that role, not a separate table.
//
// The previous version filtered a fabricated user list by organizationId, which
// never matches a real tenant, so this tab was always empty. Two columns went
// with it: coverage area and assigned-farmer count came from an `agentMeta`
// object with no backend source — agent-to-farmer assignment lives in
// billing-service's projectFarmers, not on the membership record.
export default function OrganizationAgentsTab({ organization }: Props) {
  const { agents, isLoading, error } = useOrganizationFieldAgents(organization.id);

  return (
    <Card className="bg-card">
      <CardContent className="space-y-4 p-5">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <UserCog className="h-4 w-4 text-primary" />
            <h3 className="text-sm font-semibold">
              Field Agents &amp; Agronomists {isLoading ? "" : `(${agents.length})`}
            </h3>
          </div>
          <p className="text-xs text-muted-foreground">
            Field agents managing farm visits &amp; advisory for {organization.name}
          </p>
        </div>

        {isLoading ? (
          <div className="space-y-2">
            {Array.from({ length: 3 }).map((_, index) => (
              <Skeleton key={index} className="h-10 w-full" />
            ))}
          </div>
        ) : error ? (
          <div className="flex flex-col items-center gap-2 py-8 text-center">
            <AlertCircle className="h-5 w-5 text-destructive" />
            <p className="text-sm font-medium text-foreground">Unable to load field agents</p>
            <p className="max-w-md text-xs text-muted-foreground">{error}</p>
          </div>
        ) : agents.length === 0 ? (
          <p className="py-8 text-center text-sm text-muted-foreground">
            No field agents or agronomists assigned to this organization.
          </p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="border-b bg-muted/40 text-xs uppercase text-muted-foreground">
                <tr>
                  <th className="p-3 font-medium">#</th>
                  <th className="p-3 font-medium">Name</th>
                  <th className="p-3 font-medium">Job Title</th>
                  <th className="p-3 font-medium">Joined</th>
                  <th className="p-3 font-medium">Last Active</th>
                  <th className="p-3 font-medium">Status</th>
                  <th className="p-3 text-right font-medium">Actions</th>
                </tr>
              </thead>
              <tbody>
                {agents.map((agent, index) => (
                  <tr key={agent.id} className="border-b transition-colors last:border-0 hover:bg-muted/30">
                    <td className="p-3 text-muted-foreground">{index + 1}</td>
                    <td className="p-3 font-semibold text-foreground">
                      {agent.user.firstName} {agent.user.lastName}
                      <span className="block text-xs font-normal text-muted-foreground">
                        {agent.user.email}
                      </span>
                    </td>
                    <td className="p-3 text-muted-foreground">{agent.jobTitle ?? "—"}</td>
                    <td className="p-3 text-muted-foreground">
                      {new Date(agent.joinedAt).toLocaleDateString()}
                    </td>
                    <td className="p-3 text-muted-foreground">
                      {agent.user.lastLoginAt
                        ? new Date(agent.user.lastLoginAt).toLocaleDateString()
                        : "Never"}
                    </td>
                    <td className="p-3">
                      <span
                        className={`inline-flex items-center rounded border px-2 py-0.5 text-xs font-semibold ${statusBadgeClass(
                          agent.isActive ? "success" : "neutral",
                        )}`}
                      >
                        {agent.isActive ? "Active" : "Inactive"}
                      </span>
                    </td>
                    <td className="p-3 text-right">
                      <Link
                        href={`/admin/users/${agent.user.id}`}
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
