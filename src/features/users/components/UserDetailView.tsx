"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowLeft, ShieldCheck, MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";
import UserProfileHero from "./UserProfileHero";
import UserPermissionsTab from "./UserPermissionsTab";
import UserAssignedFarmersTab from "./UserAssignedFarmersTab";
import { usePageHeader } from "@/components/layout/PageHeaderContext";
import { PlatformUser } from "@/types/user";

interface Props {
  user: PlatformUser;
}

export default function UserDetailView({ user }: Props) {
  const [activeTab, setActiveTab] = useState<"permissions" | "agent_meta">("permissions");

  usePageHeader(
    `${user.firstName} ${user.lastName}`,
    `${user.role} · ${user.organizationName}`
  );

  return (
    <div className="space-y-6">


      <UserProfileHero user={user} />

      <div className="flex items-center gap-2 border-b pb-2">
        <button
          onClick={() => setActiveTab("permissions")}
          className={`flex items-center gap-2 border-b-2 px-4 py-2 text-sm font-semibold transition-colors ${
            activeTab === "permissions"
              ? "border-primary text-primary"
              : "border-transparent text-muted-foreground hover:text-foreground"
          }`}
        >
          <ShieldCheck className="h-4 w-4" />
          Module Permissions
        </button>

        {user.agentMeta && (
          <button
            onClick={() => setActiveTab("agent_meta")}
            className={`flex items-center gap-2 border-b-2 px-4 py-2 text-sm font-semibold transition-colors ${
              activeTab === "agent_meta"
                ? "border-primary text-primary"
                : "border-transparent text-muted-foreground hover:text-foreground"
            }`}
          >
            <MapPin className="h-4 w-4" />
            Field Agent / Agronomist Stats
          </button>
        )}
      </div>

      {activeTab === "permissions" && (
        <UserPermissionsTab permissions={user.permissions} />
      )}

      {activeTab === "agent_meta" && (
        <UserAssignedFarmersTab agentMeta={user.agentMeta} />
      )}
    </div>
  );
}
