"use client";

import { toast } from "sonner";
import { Trash2 } from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
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

  onRemoveMember: (
    organizationId: string,
    memberId: string
  ) => void;
}

export default function OrganizationTeamTab({
  organization,
  onUpdateMember,
  onRemoveMember,
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
                      <select
                        value={member.role}
                        onChange={(event) => {
                          onUpdateMember(
                            organization.id,
                            member.id,
                            {
                              role: event.target
                                .value as TeamMemberRole,
                            }
                          );

                          toast.success(
                            `${member.name}'s role updated.`
                          );
                        }}
                        className="h-9 rounded-lg border border-input bg-card px-3 text-sm outline-none focus-visible:border-primary"
                      >
                        <option value="admin">
                          Admin
                        </option>
                        <option value="member">
                          Member
                        </option>
                        <option value="viewer">
                          Viewer
                        </option>
                      </select>

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

                      <Button
                        variant="ghost"
                        size="icon-sm"
                        onClick={() => {
                          onRemoveMember(
                            organization.id,
                            member.id
                          );

                          toast.success(
                            `${member.name} was removed from the team.`
                          );
                        }}
                      >
                        <Trash2 className="h-4 w-4 text-destructive" />
                      </Button>
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
