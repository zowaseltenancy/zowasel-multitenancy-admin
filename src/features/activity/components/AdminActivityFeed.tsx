"use client";

import {
  AlertCircle,
  Building2,
  CalendarClock,
  KeyRound,
  LogIn,
  ShieldAlert,
  UserCog,
  Users,
} from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";
import { useAdminActivity } from "../hooks/useAdminActivity";
import { AdminActivityType } from "../api/activity.types";

// Recent activity on the ADMIN CONSOLE — staff sign-ins, moderation, staff and
// leave changes. Replaces the previous feed, which synthesised entries client-
// side from organization/user/lead lists: that showed tenant lifecycle events
// (an org onboarding, a user joining) rather than anything a staff member did,
// and it could only ever describe records that happened to be on the current
// page.

const TYPE_ICONS: Record<AdminActivityType, typeof Building2> = {
  session:  LogIn,
  security: ShieldAlert,
  staff:    UserCog,
  business: Building2,
  users:    Users,
  leave:    CalendarClock,
  other:    KeyRound,
};

const TYPE_STYLES: Record<AdminActivityType, string> = {
  session:  "bg-sky-500/15 text-sky-600 dark:text-sky-400",
  security: "bg-amber-500/15 text-amber-600 dark:text-amber-400",
  staff:    "bg-purple-500/15 text-purple-600 dark:text-purple-400",
  business: "bg-cyan-500/15 text-cyan-600 dark:text-cyan-400",
  users:    "bg-emerald-500/15 text-emerald-600 dark:text-emerald-400",
  leave:    "bg-indigo-500/15 text-indigo-600 dark:text-indigo-400",
  other:    "bg-muted text-muted-foreground",
};

function relativeTime(iso: string): string {
  const seconds = Math.round((Date.now() - new Date(iso).getTime()) / 1000);
  if (seconds < 60) return "just now";
  const minutes = Math.round(seconds / 60);
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.round(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.round(hours / 24);
  if (days < 7) return `${days}d ago`;
  return new Date(iso).toLocaleDateString();
}

interface Props {
  limit?: number;
  /** Narrow to one staff member — used by a staff member's own detail screen. */
  adminId?: string;
}

export default function AdminActivityFeed({ limit = 8, adminId }: Props) {
  const { activity, isLoading, isFetching, error } = useAdminActivity({
    page: 1,
    limit,
    adminId,
  });

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">Recent Activity</CardTitle>
      </CardHeader>

      <CardContent>
        {isLoading ? (
          <ul className="space-y-4" aria-busy="true">
            {Array.from({ length: 5 }).map((_, index) => (
              <li key={index} className="flex items-start gap-3">
                <Skeleton className="h-8 w-8 shrink-0 rounded-lg" />
                <div className="flex-1 space-y-2">
                  <Skeleton className="h-3.5 w-3/4" />
                  <Skeleton className="h-3 w-20" />
                </div>
              </li>
            ))}
          </ul>
        ) : error ? (
          <div className="flex flex-col items-center gap-2 py-6 text-center">
            <AlertCircle className="h-5 w-5 text-destructive" />
            <p className="text-sm font-medium text-foreground">Unable to load activity</p>
            <p className="max-w-sm text-xs text-muted-foreground">{error}</p>
          </div>
        ) : activity.length === 0 ? (
          <p className="py-6 text-center text-sm text-muted-foreground">
            No admin activity recorded yet.
          </p>
        ) : (
          <ul className={cn("space-y-4", isFetching && "opacity-60 transition-opacity")}>
            {activity.map((entry) => {
              const Icon = TYPE_ICONS[entry.type];

              return (
                <li key={entry.id} className="flex items-start gap-3">
                  <div
                    className={cn(
                      "flex h-8 w-8 shrink-0 items-center justify-center rounded-lg",
                      TYPE_STYLES[entry.type],
                    )}
                  >
                    <Icon className="h-4 w-4" />
                  </div>

                  <div className="min-w-0 flex-1">
                    <p className="text-sm">
                      <span className="font-medium">{entry.actor?.name ?? "Unknown account"}</span>{" "}
                      <span className="text-muted-foreground">{entry.event.toLowerCase()}</span>
                    </p>
                    <p className="flex items-center gap-2 text-xs text-muted-foreground">
                      <span>{relativeTime(entry.createdAt)}</span>
                      {entry.status === "failure" ? (
                        <span className="font-semibold text-destructive">failed</span>
                      ) : null}
                      {entry.city || entry.country ? (
                        <span>· {[entry.city, entry.country].filter(Boolean).join(", ")}</span>
                      ) : null}
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
