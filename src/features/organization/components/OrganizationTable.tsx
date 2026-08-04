import Link from "next/link";
import { ArrowRight, AlertCircle } from "lucide-react";

import { Card } from "@/components/ui/card";
import KybStatusBadge from "@/components/shared/KybStatusBadge";
import OnboardedByCell from "@/components/shared/OnboardedByCell";
import { Organization } from "@/types/organization";

interface Props {
  organizations: Organization[];
}

function getModuleCount(organization: Organization) {
  return organization.subscriptions.reduce(
    (total, subscription) => total + subscription.activeModules.length,
    0
  );
}

function getPrimaryPlan(organization: Organization) {
  return organization.subscriptions[0]?.plan ?? "—";
}

export default function OrganizationTable({ organizations }: Props) {
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
              <th className="px-6 py-4 font-medium">Business / Organization</th>
              <th className="px-6 py-4 font-medium">Onboarded By</th>
              <th className="px-6 py-4 font-medium">Owner / Contact</th>
              <th className="px-6 py-4 font-medium">KYB Status & Remarks</th>
              <th className="px-6 py-4 font-medium">Modules</th>
              <th className="px-6 py-4 font-medium">Plan</th>
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
                  <p className="font-semibold text-foreground">
                    {organization.name}
                  </p>
                  <p className="text-xs text-muted-foreground capitalize">
                    {organization.type} · {organization.businessId}
                  </p>
                </td>

                <td className="px-6 py-4">
                  <OnboardedByCell
                    onboardedByAgent={organization.onboardedByAgent}
                    fallback="Direct Signup"
                  />
                </td>

                <td className="px-6 py-4">
                  <p className="font-medium">{organization.owner.name}</p>
                  <p className="text-xs text-muted-foreground">
                    {organization.owner.email}
                  </p>
                </td>

                <td className="px-6 py-4">
                  <div className="space-y-1">
                    <KybStatusBadge status={organization.kybStatus} />
                    {organization.kybStatus === "pending" && (organization.pendingReason || organization.kybRejectionReason) && (
                      <div className="flex items-start gap-1 text-[11px] text-amber-700 dark:text-amber-300 bg-amber-500/10 p-1.5 rounded border border-amber-500/20 max-w-xs">
                        <AlertCircle className="h-3.5 w-3.5 shrink-0 mt-0.5" />
                        <span>{organization.pendingReason || organization.kybRejectionReason}</span>
                      </div>
                    )}
                  </div>
                </td>

                <td className="px-6 py-4 font-medium">
                  {getModuleCount(organization)}
                </td>

                <td className="px-6 py-4 font-medium">
                  {getPrimaryPlan(organization)}
                </td>

                <td className="px-6 py-4 text-right">
                  <Link
                    href={`/admin/organizations/${organization.id}`}
                    className="inline-flex items-center gap-1 text-sm font-medium text-primary hover:underline"
                  >
                    View
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
