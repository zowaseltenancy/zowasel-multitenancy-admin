"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { FileCheck, LayoutGrid, Lock, CreditCard, Check, CheckCheck } from "lucide-react";

import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useNotifications } from "../hooks/useNotifications";
import { NotificationCategory } from "@/types/notification";
import { statusBadgeClass, statusDotClass } from "@/lib/statusTone";
import { NOTIFICATION_SEVERITY_TONE } from "@/constants/notification";

const CATEGORY_ICON: Record<NotificationCategory, typeof FileCheck> = {
  kyb: FileCheck,
  module: LayoutGrid,
  security: Lock,
  billing: CreditCard,
};

interface Props {
  title: string;
  description: string;
  categoryFilter?: NotificationCategory | "all";
}

export default function NotificationsListView({
  title,
  description,
  categoryFilter = "all",
}: Props) {
  const { notifications, markAsRead, markAllAsRead } = useNotifications();
  const [showUnreadOnly, setShowUnreadOnly] = useState(false);

  const filtered = useMemo(() => {
    return notifications
      .filter((n) => categoryFilter === "all" || n.category === categoryFilter)
      .filter((n) => !showUnreadOnly || !n.isRead)
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }, [notifications, categoryFilter, showUnreadOnly]);

  const unreadCount = filtered.filter((n) => !n.isRead).length;

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">{title}</h1>
          <p className="mt-1 text-sm text-muted-foreground">{description}</p>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant={showUnreadOnly ? "default" : "outline"}
            size="sm"
            onClick={() => setShowUnreadOnly((v) => !v)}
          >
            {showUnreadOnly ? "Showing Unread" : "Show Unread Only"}
          </Button>
          <Button variant="outline" size="sm" className="gap-1.5" onClick={markAllAsRead}>
            <CheckCheck className="h-3.5 w-3.5" />
            Mark All Read
          </Button>
        </div>
      </div>

      {filtered.length === 0 ? (
        <Card className="border shadow-2xs">
          <CardContent className="p-12 text-center text-sm text-muted-foreground">
            No notifications to show.
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-2">
          {filtered.map((notification) => {
            const Icon = CATEGORY_ICON[notification.category];
            const tone = NOTIFICATION_SEVERITY_TONE[notification.severity];

            return (
              <Card
                key={notification.id}
                className={`border shadow-2xs transition-colors ${!notification.isRead ? "bg-primary/[0.03] border-primary/20" : ""}`}
              >
                <CardContent className="flex items-start gap-3 p-4">
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-muted text-muted-foreground">
                    <Icon className="h-4 w-4" />
                  </div>

                  <div className="min-w-0 flex-1 space-y-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <p className="font-semibold text-sm text-foreground">{notification.title}</p>
                      <span className={statusBadgeClass(tone)}>
                        <span className={statusDotClass(tone)} />
                        {notification.severity}
                      </span>
                      {!notification.isRead && (
                        <span className="h-1.5 w-1.5 rounded-full bg-primary" />
                      )}
                    </div>

                    <p className="text-xs text-muted-foreground">{notification.message}</p>

                    <div className="flex flex-wrap items-center gap-3 pt-1 text-[11px] text-muted-foreground">
                      {notification.organizationId && notification.organizationName && (
                        <Link
                          href={`/admin/organizations/${notification.organizationId}`}
                          className="text-primary hover:underline font-medium"
                        >
                          {notification.organizationName}
                        </Link>
                      )}
                      <span>{new Date(notification.createdAt).toLocaleString()}</span>
                    </div>
                  </div>

                  {!notification.isRead && (
                    <Button
                      variant="ghost"
                      size="sm"
                      className="shrink-0 gap-1.5 text-xs"
                      onClick={() => markAsRead(notification.id)}
                    >
                      <Check className="h-3.5 w-3.5" />
                      Mark Read
                    </Button>
                  )}
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}
