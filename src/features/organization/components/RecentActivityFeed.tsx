import { Building2, CheckCircle2, Megaphone, Target, UserPlus } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { Organization } from "@/types/organization";
import { PlatformUser } from "@/types/user";
import { Lead } from "@/types/lead";
import { MarketingCampaign } from "@/types/marketing";
import { MARKETING_CHANNEL_LABELS } from "@/constants/marketing";
import { LEAD_STATUS_LABELS } from "@/constants/lead";

interface Props {
  organizations: Organization[];
  users: PlatformUser[];
  leads: Lead[];
  campaigns: MarketingCampaign[];
}

interface ActivityItem {
  id: string;
  icon: typeof Building2;
  iconClass: string;
  title: string;
  timestamp: string;
}

// Merges timestamped events across every domain the Dashboard oversees into
// one feed — the "command center" view a single row of stat cards can't give.
export default function RecentActivityFeed({ organizations, users, leads, campaigns }: Props) {
  const items: ActivityItem[] = [];

  organizations.forEach((org) => {
    items.push({
      id: `org-${org.id}`,
      icon: Building2,
      iconClass: "bg-cyan-500/15 text-cyan-600 dark:text-cyan-400",
      title: `${org.name} onboarded as a new ${org.type} organization`,
      timestamp: org.createdAt,
    });

    if (org.kybApprovedAt) {
      items.push({
        id: `kyb-${org.id}`,
        icon: CheckCircle2,
        iconClass: "bg-emerald-500/15 text-emerald-600 dark:text-emerald-400",
        title: `${org.name}'s KYB was approved`,
        timestamp: org.kybApprovedAt,
      });
    }
  });

  users.forEach((user) => {
    items.push({
      id: `user-${user.id}`,
      icon: UserPlus,
      iconClass: "bg-purple-500/15 text-purple-600 dark:text-purple-400",
      title: `${user.firstName} ${user.lastName} joined ${user.organizationName} as a ${user.role}`,
      timestamp: user.dateJoined,
    });
  });

  leads.forEach((lead) => {
    items.push({
      id: `lead-${lead.id}`,
      icon: Target,
      iconClass: "bg-sky-500/15 text-sky-600 dark:text-sky-400",
      title: `New lead: ${lead.businessName} (${LEAD_STATUS_LABELS[lead.status]})`,
      timestamp: lead.createdAt,
    });
  });

  campaigns.forEach((campaign) => {
    if (campaign.sentAt) {
      items.push({
        id: `campaign-${campaign.id}`,
        icon: Megaphone,
        iconClass: "bg-rose-500/15 text-rose-600 dark:text-rose-400",
        title: `${MARKETING_CHANNEL_LABELS[campaign.channel]} campaign "${campaign.title}" sent`,
        timestamp: campaign.sentAt,
      });
    }
  });

  const recent = items
    .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
    .slice(0, 8);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">Recent Activity</CardTitle>
      </CardHeader>

      <CardContent>
        {recent.length === 0 ? (
          <p className="py-6 text-center text-sm text-muted-foreground">
            No recent activity in this scope.
          </p>
        ) : (
          <ul className="space-y-4">
            {recent.map((item) => {
              const Icon = item.icon;

              return (
                <li key={item.id} className="flex items-start gap-3">
                  <div
                    className={cn(
                      "flex h-8 w-8 shrink-0 items-center justify-center rounded-lg",
                      item.iconClass
                    )}
                  >
                    <Icon className="h-4 w-4" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm">{item.title}</p>
                    <p className="text-xs text-muted-foreground">
                      {new Date(item.timestamp).toLocaleString()}
                    </p>
                  </div>
                </li>
              );
            })}
          </ul>
        )}
      </CardContent>
    </Card>
  );
}
