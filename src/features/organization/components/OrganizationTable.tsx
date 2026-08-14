import Link from "next/link";
import { ArrowRight, AlertCircle, Building2, RotateCcw } from "lucide-react";

import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import KybStatusBadge from "@/components/shared/KybStatusBadge";
import OnboardedByCell from "@/components/shared/OnboardedByCell";
import { Organization } from "@/types/organization";

interface Props {
  organizations: Organization[];
  onClearFilters?: () => void;
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

export default function OrganizationTable({ organizations, onClearFilters }: Props) {
  if (organizations.length === 0) {
    return (
      <Card className="flex flex-col items-center justify-center p-12 text-center border-dashed border-2">
        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#438B3E]/10 text-[#438B3E] dark:bg-[#438B3E]/20 dark:text-[#B8E5B8] mb-3.5">
          <Building2 className="h-6 w-6" />
        </div>
        <h3 className="text-base font-semibold text-foreground">No organizations found</h3>
        <p className="mt-1 text-xs text-muted-foreground max-w-sm">
          No organizations match your current search and filter criteria.
        </p>
        {onClearFilters && (
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={onClearFilters}
            className="mt-4 gap-1.5 rounded-xl border-[#438B3E]/30 text-[#438B3E] hover:bg-[#438B3E]/10 text-xs font-semibold cursor-pointer"
          >
            <RotateCcw className="h-3.5 w-3.5" />
            <span>Clear filters</span>
          </Button>
        )}
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
