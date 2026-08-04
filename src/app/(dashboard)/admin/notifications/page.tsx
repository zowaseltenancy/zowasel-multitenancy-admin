"use client";

import Link from "next/link";
import { ArrowRight, Bell, FileCheck, LayoutGrid, Lock, CreditCard } from "lucide-react";

import { Card, CardContent } from "@/components/ui/card";
import { useNotifications } from "@/features/notifications/hooks/useNotifications";
import { NotificationCategory } from "@/types/notification";
import { NOTIFICATION_CATEGORY_LABELS } from "@/constants/notification";

const CATEGORY_META: Record<
  NotificationCategory,
  { icon: typeof Bell; href: string; cardBg: string; iconClassName: string }
> = {
  kyb: {
    icon: FileCheck,
    href: "/admin/notifications/kyb",
    cardBg: "bg-emerald-500/5 dark:bg-emerald-500/10 border-emerald-500/20",
    iconClassName: "bg-emerald-500/15 text-emerald-600 border-emerald-500/30 dark:text-emerald-400",
  },
  module: {
    icon: LayoutGrid,
    href: "/admin/notifications/modules",
    cardBg: "bg-indigo-500/5 dark:bg-indigo-500/10 border-indigo-500/20",
    iconClassName: "bg-indigo-500/15 text-indigo-600 border-indigo-500/30 dark:text-indigo-400",
  },
  security: {
    icon: Lock,
    href: "/admin/notifications/security",
    cardBg: "bg-red-500/5 dark:bg-red-500/10 border-red-500/30",
    iconClassName: "bg-red-500/15 text-red-600 border-red-500/30 dark:text-red-400",
  },
  billing: {
    icon: CreditCard,
    href: "/admin/notifications/billing",
    cardBg: "bg-amber-500/5 dark:bg-amber-500/10 border-amber-500/20",
    iconClassName: "bg-amber-500/15 text-amber-600 border-amber-500/30 dark:text-amber-400",
  },
};

const CATEGORIES = Object.keys(CATEGORY_META) as NotificationCategory[];

export default function NotificationsOverviewPage() {
  const { notifications } = useNotifications();

  const totalUnread = notifications.filter((n) => !n.isRead).length;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Notification Center</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Platform-wide activity across KYB, modules, security, and billing — {totalUnread} unread.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {CATEGORIES.map((category) => {
          const meta = CATEGORY_META[category];
          const Icon = meta.icon;
          const categoryNotifications = notifications.filter((n) => n.category === category);
          const unread = categoryNotifications.filter((n) => !n.isRead).length;

          return (
            <Link key={category} href={meta.href} className="group block">
              <Card className={`border shadow-2xs transition-all hover:scale-[1.02] ${meta.cardBg}`}>
                <CardContent className="flex flex-col justify-between p-4 min-h-[110px]">
                  <div className="flex items-center justify-between">
                    <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                      {NOTIFICATION_CATEGORY_LABELS[category]}
                    </p>
                    <div className={`flex h-8 w-8 items-center justify-center rounded-lg border ${meta.iconClassName}`}>
                      <Icon className="h-4 w-4" />
                    </div>
                  </div>
                  <div className="mt-2 flex items-baseline justify-between">
                    <div>
                      <p className="text-2xl font-bold">{categoryNotifications.length}</p>
                      {unread > 0 && (
                        <p className="text-[11px] font-semibold text-primary">{unread} unread</p>
                      )}
                    </div>
                    <ArrowRight className="h-3.5 w-3.5 opacity-0 group-hover:opacity-100 transition-opacity text-primary" />
                  </div>
                </CardContent>
              </Card>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
