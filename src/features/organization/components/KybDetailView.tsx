"use client";

import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { notFound } from "next/navigation";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { usePageHeader } from "@/components/layout/PageHeaderContext";
import { getApiErrorMessage } from "@/lib/axios";
import { useOrganization, useOrganizations } from "../hooks/useOrganizations";

import OrganizationKybTab from "./OrganizationKybTab";

interface Props {
  organizationId: string;
}

export default function KybDetailView({
  organizationId,
}: Props) {
  const {
    approveKyb,
    rejectKyb,
    markKybPending,
  } = useOrganizations();

  // GET /admin/businesses/{id} — the KYB screen needs the detail projection
  // (documents, rejection reason, submitted/approved timestamps), none of which
  // are on the list row this used to search.
  const detailQuery = useOrganization(organizationId);
  const organization = detailQuery.data;

  usePageHeader(
    organization?.name ?? "KYB Review",
    organization
      ? `${organization.businessId} · KYB Review`
      : undefined
  );

  if (detailQuery.isLoading) {
    return (
      <Card className="flex min-h-[240px] items-center justify-center p-6 text-sm text-muted-foreground">
        Loading KYB record…
      </Card>
    );
  }

  if (!organization) {
    const status = (detailQuery.error as { response?: { status?: number } } | null)?.response?.status;
    if (detailQuery.isError && status !== 404) {
      return (
        <Card className="flex min-h-[240px] flex-col items-center justify-center gap-2 p-6 text-center">
          <p className="text-sm font-medium text-foreground">Unable to load this KYB record</p>
          <p className="max-w-md text-xs text-muted-foreground">
            {getApiErrorMessage(detailQuery.error, "Please try again.")}
          </p>
        </Card>
      );
    }
    notFound();
  }

  return (
    <div className="space-y-6">
      <div>
        <Link
          href="/admin/kyb"
          className="mb-3 inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to KYB Review
        </Link>

        <h1 className="text-3xl font-bold">
          {organization.name}
        </h1>

        <p className="mt-2 text-muted-foreground">
          {organization.businessId} ·{" "}
          <Link
            href={`/admin/organizations/${organization.id}`}
            className="text-primary hover:underline"
          >
            View full business profile
          </Link>
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>
            Business Owner
          </CardTitle>
        </CardHeader>

        <CardContent className="grid gap-6 md:grid-cols-3">
          <div>
            <p className="text-sm text-muted-foreground">
              Name
            </p>

            <p className="mt-2 font-medium">
              {organization.owner.name}
            </p>
          </div>

          <div>
            <p className="text-sm text-muted-foreground">
              Email
            </p>

            <p className="mt-2 font-medium">
              {organization.owner.email}
            </p>
          </div>

          <div>
            <p className="text-sm text-muted-foreground">
              Phone
            </p>

            <p className="mt-2 font-medium">
              {organization.owner.phone}
            </p>
          </div>
        </CardContent>
      </Card>

      <OrganizationKybTab
        organization={organization}
        onApprove={approveKyb}
        onReject={rejectKyb}
        onMarkPending={markKybPending}
      />
    </div>
  );
}
