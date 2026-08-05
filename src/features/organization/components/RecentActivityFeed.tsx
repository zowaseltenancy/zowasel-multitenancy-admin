"use client";

import { useState, useMemo } from "react";
import {
  Building2,
  CheckCircle2,
  Megaphone,
  Target,
  UserPlus,
  CreditCard,
  Search,
  ChevronLeft,
  ChevronRight,
  Activity,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { Organization } from "@/types/organization";
import { PlatformUser } from "@/types/user";
import { Lead } from "@/types/lead";
import { MarketingCampaign } from "@/types/marketing";
import { Transaction } from "@/types/transaction";

interface Props {
  organizations: Organization[];
  users: PlatformUser[];
  leads: Lead[];
  campaigns: MarketingCampaign[];
  transactions?: Transaction[];
  compact?: boolean;
  className?: string;
}

export type ActivityCategory =
  | "all"
  | "organizations"
  | "compliance"
  | "users"
  | "leads"
  | "marketing"
  | "finance";

export interface ActivityItem {
  id: string;
  category: ActivityCategory;
  categoryLabel: string;
  categoryBadgeClass: string;
  icon: typeof Building2;
  iconClass: string;
  actorOrEntity: string;
  actionText: string;
  details?: string;
  timestamp: string;
  formattedTime: string;
}

function formatRelativeTime(dateString?: string): string {
  if (!dateString) return "Recently";
  try {
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return dateString;
    const now = new Date();
    const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

    if (diffInSeconds < 0 || diffInSeconds < 60) return "Just now";
    const diffInMinutes = Math.floor(diffInSeconds / 60);
    if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
    const diffInHours = Math.floor(diffInMinutes / 60);
    if (diffInHours < 24) return `${diffInHours}h ago`;
    const diffInDays = Math.floor(diffInHours / 24);
    if (diffInDays < 7) return `${diffInDays}d ago`;

    return date.toLocaleDateString("en-US", { month: "short", day: "numeric" });
  } catch {
    return dateString;
  }
}

export default function RecentActivityFeed({
  organizations,
  users,
  leads,
  campaigns,
  transactions = [],
  compact = false,
  className = "",
}: Props) {
  const [selectedCategory, setSelectedCategory] = useState<ActivityCategory>("all");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [pageSize, setPageSize] = useState<number>(5);
  const [currentPage, setCurrentPage] = useState<number>(1);

  // Compile real activity items
  const items: ActivityItem[] = useMemo(() => {
    const list: ActivityItem[] = [];

    organizations.forEach((org) => {
      list.push({
        id: `org-${org.id}`,
        category: "organizations",
        categoryLabel: "Organization",
        categoryBadgeClass: "bg-cyan-500/10 text-cyan-700 dark:text-cyan-400 border-cyan-500/20",
        icon: Building2,
        iconClass: "bg-cyan-500/15 text-cyan-600 dark:text-cyan-400",
        actorOrEntity: org.name,
        actionText: `onboarded as a ${org.type} organization`,
        timestamp: org.createdAt,
        formattedTime: formatRelativeTime(org.createdAt),
      });

      if (org.kybApprovedAt || org.kybStatus === "approved") {
        list.push({
          id: `kyb-${org.id}`,
          category: "compliance",
          categoryLabel: "KYB Verification",
          categoryBadgeClass: "bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border-emerald-500/20",
          icon: CheckCircle2,
          iconClass: "bg-emerald-500/15 text-emerald-600 dark:text-emerald-400",
          actorOrEntity: org.name,
          actionText: "completed KYB compliance verification",
          timestamp: org.kybApprovedAt || org.createdAt,
          formattedTime: formatRelativeTime(org.kybApprovedAt || org.createdAt),
        });
      }
    });

    users.forEach((user) => {
      list.push({
        id: `user-${user.id}`,
        category: "users",
        categoryLabel: "User Access",
        categoryBadgeClass: "bg-indigo-500/10 text-indigo-700 dark:text-indigo-400 border-indigo-500/20",
        icon: UserPlus,
        iconClass: "bg-indigo-500/15 text-indigo-600 dark:text-indigo-400",
        actorOrEntity: `${user.firstName} ${user.lastName}`,
        actionText: `joined ${user.organizationName || "Zowasel Platform"}`,
        timestamp: user.dateJoined,
        formattedTime: formatRelativeTime(user.dateJoined),
      });
    });

    leads.forEach((lead) => {
      list.push({
        id: `lead-${lead.id}`,
        category: "leads",
        categoryLabel: "CRM Lead",
        categoryBadgeClass: "bg-sky-500/10 text-sky-700 dark:text-sky-400 border-sky-500/20",
        icon: Target,
        iconClass: "bg-sky-500/15 text-sky-600 dark:text-sky-400",
        actorOrEntity: lead.businessName,
        actionText: "registered as a new platform lead",
        timestamp: lead.createdAt,
        formattedTime: formatRelativeTime(lead.createdAt),
      });
    });

    campaigns.forEach((campaign) => {
      if (campaign.sentAt || campaign.createdAt) {
        list.push({
          id: `campaign-${campaign.id}`,
          category: "marketing",
          categoryLabel: "Marketing",
          categoryBadgeClass: "bg-rose-500/10 text-rose-700 dark:text-rose-400 border-rose-500/20",
          icon: Megaphone,
          iconClass: "bg-rose-500/15 text-rose-600 dark:text-rose-400",
          actorOrEntity: campaign.title,
          actionText: "campaign dispatched",
          timestamp: campaign.sentAt || campaign.createdAt,
          formattedTime: formatRelativeTime(campaign.sentAt || campaign.createdAt),
        });
      }
    });

    transactions.forEach((tx) => {
      list.push({
        id: `tx-${tx.id}`,
        category: "finance",
        categoryLabel: "Billing",
        categoryBadgeClass: "bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border-emerald-500/20",
        icon: CreditCard,
        iconClass: "bg-emerald-500/15 text-emerald-600 dark:text-emerald-400",
        actorOrEntity: `${tx.currency} ${tx.amount?.toLocaleString() || "0.00"}`,
        actionText: `payment ${tx.status}`,
        timestamp: tx.createdAt,
        formattedTime: formatRelativeTime(tx.createdAt),
      });
    });

    return list.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
  }, [organizations, users, leads, campaigns, transactions]);

  // Compact Header Live Activity Ticker Render (Matches Map Card Height 1:1)
  if (compact) {
    const compactItems = items.slice(0, 3);
    return (
      <Card className={cn("border shadow-xs flex flex-col justify-between overflow-hidden bg-card h-full min-h-[160px]", className)}>
        <CardHeader className="py-2.5 px-3.5 border-b bg-muted/20 shrink-0">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Activity className="h-3.5 w-3.5 text-primary" />
              <CardTitle className="text-xs font-bold uppercase tracking-wider text-foreground">
                Live Activity Ticker
              </CardTitle>
            </div>
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
              Real-time
            </span>
          </div>
        </CardHeader>

        <CardContent className="p-2.5 flex-1 flex flex-col justify-around gap-1">
          {compactItems.map((item) => {
            const Icon = item.icon;
            return (
              <div
                key={item.id}
                className="flex items-center justify-between gap-2.5 p-2 rounded-lg hover:bg-muted/40 transition-colors text-xs border border-transparent hover:border-border/40"
              >
                <div className="flex items-center gap-2.5 min-w-0 flex-1 truncate">
                  <div className={cn("flex h-7 w-7 shrink-0 items-center justify-center rounded-lg text-xs", item.iconClass)}>
                    <Icon className="h-3.5 w-3.5" />
                  </div>
                  <div className="truncate text-left leading-tight">
                    <span className="font-bold text-foreground text-[11px] truncate block">{item.actorOrEntity}</span>
                    <span className="text-[10px] text-muted-foreground truncate block">{item.actionText}</span>
                  </div>
                </div>
                <span className="text-[10px] font-mono text-muted-foreground shrink-0">{item.formattedTime}</span>
              </div>
            );
          })}
        </CardContent>
      </Card>
    );
  }

  // Full Feed Mode (Standard View)
  const totalItems = items.length;
  const totalPages = Math.ceil(totalItems / pageSize) || 1;
  const safeCurrentPage = Math.min(currentPage, totalPages);
  const startIndex = (safeCurrentPage - 1) * pageSize;
  const endIndex = Math.min(startIndex + pageSize, totalItems);
  const paginatedItems = items.slice(startIndex, endIndex);

  return (
    <Card className={cn("border shadow-xs", className)}>
      <CardHeader className="pb-3 border-b">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <CardTitle className="text-base font-semibold">Recent Activity Feed</CardTitle>
            <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[11px] font-medium bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
              Live Audit Log
            </span>
          </div>
        </div>
      </CardHeader>

      <CardContent className="pt-4">
        <ul className="divide-y divide-border/40">
          {paginatedItems.map((item) => {
            const Icon = item.icon;
            return (
              <li key={item.id} className="flex items-center justify-between gap-3 py-2.5 px-3 rounded-lg hover:bg-muted/50 transition-all text-sm">
                <div className="flex items-center gap-3 min-w-0 flex-1">
                  <div className={cn("flex h-8 w-8 shrink-0 items-center justify-center rounded-lg", item.iconClass)}>
                    <Icon className="h-4 w-4" />
                  </div>
                  <div className="flex items-center gap-2 min-w-0 flex-1 truncate">
                    <span className="font-semibold text-foreground truncate">{item.actorOrEntity}</span>
                    <span className="text-muted-foreground truncate">{item.actionText}</span>
                  </div>
                </div>
                <span className="text-xs text-muted-foreground font-mono">{item.formattedTime}</span>
              </li>
            );
          })}
        </ul>
      </CardContent>
    </Card>
  );
}
