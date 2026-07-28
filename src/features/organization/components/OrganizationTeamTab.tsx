"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Organization,
  TeamMemberRole,
} from "@/types/organization";

interface Props {
  organization: Organization;

  onUpdateMember: (
    organizationId: string,
    memberId: string,
    updates: { role?: TeamMemberRole; isActive?: boolean }
  ) => void;
}

export default function OrganizationTeamTab({
  organization,
  onUpdateMember,
}: Props) {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>
            Account Owner
          </CardTitle>
        </CardHeader>

        <CardContent className="flex items-center justify-between">
          <div>
            <p className="font-medium">
              {organization.owner.name}
            </p>

            <p className="text-sm text-muted-foreground">
              {organization.owner.email}
            </p>
          </div>

          <span className="rounded-full border border-primary/20 bg-primary/10 px-3 py-1 text-xs font-medium text-primary">
            Owner
          </span>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>
            Team Members
          </CardTitle>
        </CardHeader>

        <CardContent>
          <p className="mb-4 text-sm text-muted-foreground">
            Internal account managers who help the owner run this business — not CropPilot end-users like farmers or agents.
          </p>

          {organization.teamMembers.length === 0 ? (
            <p className="text-sm text-muted-foreground">
              No team members added yet.
            </p>
          ) : (
            <div className="divide-y divide-border">
              {organization.teamMembers.map(
                (member) => (
                  <div
                    key={member.id}
                    className="flex flex-wrap items-center justify-between gap-4 py-4"
                  >
                    <div>
                      <p className="font-medium">
                        {member.name}
                      </p>

                      <p className="text-sm text-muted-foreground">
                        {member.email}
                      </p>
                    </div>

                    <div className="flex items-center gap-3">
                      <span className="text-sm font-medium text-muted-foreground">
                        {member.role === "admin"
                          ? "Admin"
                          : member.role === "member"
                          ? "Member"
                          : "Viewer"}
                      </span>

                      <button
                        type="button"
                        onClick={() =>
                          onUpdateMember(
                            organization.id,
                            member.id,
                            {
                              isActive:
                                !member.isActive,
                            }
                          )
                        }
                        className={`rounded-full border px-3 py-1 text-xs font-medium transition-colors ${
                          member.isActive
                            ? "border-green-200 bg-green-100 text-green-700"
                            : "border-slate-200 bg-slate-100 text-slate-700"
                        }`}
                      >
                        {member.isActive
                          ? "Active"
                          : "Inactive"}
                      </button>

                      <Link
                        href={`/admin/organizations/${organization.id}/team/${member.id}`}
                        className="inline-flex items-center gap-1 text-sm font-medium text-primary hover:underline"
                      >
                        View
                        <ArrowRight className="h-4 w-4" />
                      </Link>
                    </div>
                  </div>
                )
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
