"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { notFound } from "next/navigation";

import { cn } from "@/lib/utils";
import KybStatusBadge from "@/components/shared/KybStatusBadge";
import { usePageHeader } from "@/components/layout/PageHeaderContext";
import { useOrganizations } from "../hooks/useOrganizations";

import OrganizationProfileTab from "./OrganizationProfileTab";
import OrganizationKybTab from "./OrganizationKybTab";
import OrganizationModulesTab from "./OrganizationModulesTab";
import OrganizationTeamTab from "./OrganizationTeamTab";

interface Props {
  organizationId: string;
}

const TABS = [
  { key: "profile", label: "Profile" },
  { key: "kyb", label: "KYB" },
  { key: "modules", label: "Modules" },
  { key: "team", label: "Team" },
] as const;

type TabKey = (typeof TABS)[number]["key"];

export default function OrganizationDetailView({
  organizationId,
}: Props) {
  const {
    organizations,
    approveKyb,
    rejectKyb,
    updateTeamMember,
    removeTeamMember,
  } = useOrganizations();

  const [activeTab, setActiveTab] =
    useState<TabKey>("profile");

  const organization = organizations.find(
    (item) => item.id === organizationId
  );

  usePageHeader(
    organization?.name ?? "Organization",
    organization?.businessId
  );

  if (!organization) {
    notFound();
  }

  return (
    <div className="space-y-6">
      <div>
        <Link
          href="/admin/organizations"
          className="mb-3 inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Organizations
        </Link>

        <div className="flex flex-wrap items-center gap-3">
          <h1 className="text-3xl font-bold">
            {organization.name}
          </h1>

          <KybStatusBadge
            status={organization.kybStatus}
          />
        </div>

        <p className="mt-2 text-muted-foreground">
          {organization.businessId} ·{" "}
          {organization.owner.email}
        </p>
      </div>

      <div className="flex flex-wrap gap-2 border-b border-border pb-3">
        {TABS.map((tab) => (
          <button
            key={tab.key}
            type="button"
            onClick={() => setActiveTab(tab.key)}
            className={cn(
              "rounded-full px-4 py-2 text-sm font-medium transition-colors",
              activeTab === tab.key
                ? "bg-primary text-primary-foreground"
                : "bg-muted text-muted-foreground hover:bg-muted/70"
            )}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {activeTab === "profile" && (
        <OrganizationProfileTab
          organization={organization}
        />
      )}

      {activeTab === "kyb" && (
        <OrganizationKybTab
          organization={organization}
          onApprove={approveKyb}
          onReject={rejectKyb}
        />
      )}

      {activeTab === "modules" && (
        <OrganizationModulesTab
          organization={organization}
        />
      )}

      {activeTab === "team" && (
        <OrganizationTeamTab
          organization={organization}
          onUpdateMember={updateTeamMember}
          onRemoveMember={removeTeamMember}
        />
      )}
    </div>
  );
}
