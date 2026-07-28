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
import OrganizationUsersTab from "./OrganizationUsersTab";
import OrganizationAgentsTab from "./OrganizationAgentsTab";
import OrganizationProjectsTab from "./OrganizationProjectsTab";

interface Props {
  organizationId: string;
}

const TABS = [
  { key: "profile", label: "Profile" },
  { key: "kyb", label: "KYB Verification" },
  { key: "modules", label: "Active Modules" },
  { key: "team", label: "Team Members" },
  { key: "users", label: "Farmers & Users" },
  { key: "agents", label: "Field Agents" },
  { key: "projects", label: "Agro Projects" },
] as const;

type TabKey = (typeof TABS)[number]["key"];

export default function OrganizationDetailView({
  organizationId,
}: Props) {
  const {
    organizations,
    approveKyb,
    rejectKyb,
    markKybPending,
    updateTeamMember,
  } = useOrganizations();

  const [activeTab, setActiveTab] =
    useState<TabKey>("profile");

  const organization = organizations.find(
    (item) => item.id === organizationId
  );

  if (!organization) {
    notFound();
  }

  usePageHeader(
    organization.name,
    organization.businessId
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <span className="text-sm font-semibold text-muted-foreground">{organization.businessId}</span>
          <span>•</span>
          <span className="text-sm text-muted-foreground">{organization.owner.email}</span>
        </div>
        <KybStatusBadge status={organization.kybStatus} />
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
          onMarkPending={markKybPending}
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
        />
      )}

      {activeTab === "users" && (
        <OrganizationUsersTab
          organization={organization}
        />
      )}

      {activeTab === "agents" && (
        <OrganizationAgentsTab
          organization={organization}
        />
      )}

      {activeTab === "projects" && (
        <OrganizationProjectsTab
          organization={organization}
        />
      )}
    </div>
  );
}
