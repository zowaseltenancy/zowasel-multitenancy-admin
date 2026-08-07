"use client";

import { useState } from "react";
import { LayoutGrid, ShieldCheck, MapPin, User, Users } from "lucide-react";
import EntityOverviewTab from "./EntityOverviewTab";
import PersonalDetailsTab from "./PersonalDetailsTab";
import NextOfKinTab from "./NextOfKinTab";
import UserPermissionsTab from "./UserPermissionsTab";
import UserAssignedFarmersTab from "./UserAssignedFarmersTab";
import { usePageHeader } from "@/components/layout/PageHeaderContext";
import { PlatformUser } from "@/types/user";

interface Props {
  user: PlatformUser;
}

type TabKey = "overview" | "personal" | "next_of_kin" | "permissions" | "agent_meta";

export default function UserDetailView({ user }: Props) {
  const [activeTab, setActiveTab] = useState<TabKey>("overview");

  usePageHeader(
    `${user.firstName} ${user.lastName}`,
    `${user.role} · ${user.organizationName}`
  );

  const tabs: { key: TabKey; label: string; icon: typeof LayoutGrid }[] = [
    { key: "overview", label: "Entity Overview", icon: LayoutGrid },
    { key: "personal", label: "Personal Details", icon: User },
    { key: "next_of_kin", label: "Next of Kin", icon: Users },
    { key: "permissions", label: "Module Permissions", icon: ShieldCheck },
    ...(user.agentMeta
      ? [{ key: "agent_meta" as const, label: "Field Agent / Agronomist Stats", icon: MapPin }]
      : []),
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center gap-2 border-b pb-2">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`flex items-center gap-2 border-b-2 px-4 py-2 text-sm font-semibold transition-colors ${
                activeTab === tab.key
                  ? "border-primary text-primary"
                  : "border-transparent text-muted-foreground hover:text-foreground"
              }`}
            >
              <Icon className="h-4 w-4" />
              {tab.label}
            </button>
          );
        })}
      </div>

      {activeTab === "overview" && <EntityOverviewTab user={user} />}
      {activeTab === "personal" && <PersonalDetailsTab personalDetails={user.personalDetails} />}
      {activeTab === "next_of_kin" && <NextOfKinTab nextOfKin={user.nextOfKin} />}
      {activeTab === "permissions" && <UserPermissionsTab permissions={user.permissions} />}
      {activeTab === "agent_meta" && <UserAssignedFarmersTab agentMeta={user.agentMeta} />}
    </div>
  );
}
