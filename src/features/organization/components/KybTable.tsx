import Link from "next/link";
import { ArrowRight } from "lucide-react";

import { Card } from "@/components/ui/card";
import KybStatusBadge from "@/components/shared/KybStatusBadge";
import { Organization } from "@/types/organization";

interface Props {
  organizations: Organization[];
}

function verifiedCount(organization: Organization) {
  return organization.kybDocuments.filter(
    (document) => document.status === "verified"
  ).length;
}

export default function KybTable({
  organizations,
}: Props) {
  if (organizations.length === 0) {
    return (
      <Card className="flex min-h-[160px] items-center justify-center p-6 text-sm text-muted-foreground">
        No organizations match this filter.
      </Card>
    );
  }

  return (
    <Card className="overflow-hidden p-0">
      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm">
          <thead className="border-b border-border bg-muted/40 text-xs uppercase text-muted-foreground">
            <tr>
              <th className="px-6 py-4 font-medium">
                Business
              </th>

              <th className="px-6 py-4 font-medium">
                Owner
              </th>

              <th className="px-6 py-4 font-medium">
                Status
              </th>

              <th className="px-6 py-4 font-medium">
                Submitted
              </th>

              <th className="px-6 py-4 font-medium">
                Documents
              </th>

              <th className="px-6 py-4" />
            </tr>
          </thead>

          <tbody className="divide-y divide-border">
            {organizations.map((organization) => (
              <tr
                key={organization.id}
                className="transition-colors hover:bg-muted/30"
              >
                <td className="px-6 py-4">
                  <p className="font-medium">
                    {organization.name}
                  </p>

                  <p className="text-xs text-muted-foreground">
                    {organization.businessId}
                  </p>
                </td>

                <td className="px-6 py-4">
                  <p>{organization.owner.name}</p>

                  <p className="text-xs text-muted-foreground">
                    {organization.owner.email}
                  </p>
                </td>

                <td className="px-6 py-4">
                  <KybStatusBadge
                    status={organization.kybStatus}
                  />
                </td>

                <td className="px-6 py-4">
                  {organization.kybSubmittedAt
                    ? new Date(
                        organization.kybSubmittedAt
                      ).toLocaleDateString()
                    : "—"}
                </td>

                <td className="px-6 py-4">
                  {verifiedCount(organization)} /{" "}
                  {organization.kybDocuments.length}{" "}
                  verified
                </td>

                <td className="px-6 py-4 text-right">
                  <Link
                    href={`/admin/kyb/${organization.id}`}
                    className="inline-flex items-center gap-1 text-sm font-medium text-primary hover:underline"
                  >
                    Review
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Card>
  );
}
