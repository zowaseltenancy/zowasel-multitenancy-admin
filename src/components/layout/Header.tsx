"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Bell,
  Menu,
  CheckCheck,
  Check,
  RotateCcw,
  ExternalLink,
  ShieldAlert,
  AlertTriangle,
  Info,
  X,
  ArrowRight,
} from "lucide-react";

import ThemeToggle from "@/components/shared/ThemeToggle";
import Breadcrumbs from "./Breadcrumbs";
import UserMenu from "./UserMenu";
import { useNotifications } from "@/features/notifications/hooks/useNotifications";
import { Button } from "@/components/ui/button";

export default function Header({ onToggle }: { onToggle: () => void }) {
  const router = useRouter();
  const { notifications, toggleReadStatus, markAllAsRead } = useNotifications();
  const [isOpen, setIsOpen] = useState(false);
  const popoverRef = useRef<HTMLDivElement>(null);

  const unreadCount = notifications.filter((n) => !n.isRead).length;

  // Close popover when clicking outside or pressing Escape
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (popoverRef.current && !popoverRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setIsOpen(false);
      }
    }

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
      document.addEventListener("keydown", handleKeyDown);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen]);

  const handleGoToCategory = (category: string) => {
    setIsOpen(false);
    router.push(`/admin/notifications/${category}`);
  };

  return (
    <header className="sticky top-0 z-20 flex h-16 shrink-0 items-center justify-between border-b border-border bg-card px-6">
      <div className="flex items-center gap-4">
        <button
          type="button"
          onClick={onToggle}
          className="rounded-lg border border-border p-2 transition hover:bg-muted cursor-pointer"
        >
          <Menu className="h-5 w-5" />
        </button>

        <Breadcrumbs />
      </div>

      <div className="flex items-center gap-3">
        {/* Single Bell Icon Container with Interactive Popover */}
        <div className="relative" ref={popoverRef}>
          <button
            type="button"
            onClick={() => setIsOpen((prev) => !prev)}
            aria-label="Notifications"
            className="relative rounded-lg border border-border p-2 transition hover:bg-muted cursor-pointer focus:outline-none"
          >
            <Bell className="h-5 w-5 text-muted-foreground" />
            {unreadCount > 0 && (
              <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-rose-500 text-[10px] font-bold text-white shadow-xs">
                {unreadCount}
              </span>
            )}
          </button>

          {/* Interactive Notifications Pop-over Dialog */}
          {isOpen && (
            <div className="absolute right-0 mt-2 w-80 sm:w-96 rounded-xl border bg-card text-card-foreground shadow-2xl z-50 animate-in fade-in zoom-in-95 duration-150 overflow-hidden">
              {/* Popover Header */}
              <div className="flex items-center justify-between p-3.5 border-b bg-muted/40">
                <div className="flex items-center gap-2">
                  <Bell className="h-4 w-4 text-primary" />
                  <h3 className="font-bold text-sm text-foreground">Missed Platform Notifications</h3>
                  {unreadCount > 0 && (
                    <span className="rounded-full bg-rose-500/10 px-2 py-0.5 text-[10px] font-bold text-rose-600 border border-rose-500/20">
                      {unreadCount} Unread
                    </span>
                  )}
                </div>

                <div className="flex items-center gap-1">
                  {unreadCount > 0 && (
                    <button
                      onClick={markAllAsRead}
                      title="Bulk Mark All as Read"
                      className="flex items-center gap-1 text-[11px] font-bold text-primary hover:underline px-2 py-1 rounded-md hover:bg-primary/10 transition-colors"
                    >
                      <CheckCheck className="h-3.5 w-3.5" />
                      <span>Mark All Read</span>
                    </button>
                  )}
                  <button
                    onClick={() => setIsOpen(false)}
                    className="text-muted-foreground hover:text-foreground p-1 rounded-md"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
              </div>

              {/* Scrollable Notification Items List */}
              <div className="max-h-80 overflow-y-auto divide-y text-xs">
                {notifications.length > 0 ? (
                  notifications.map((notif) => (
                    <div
                      key={notif.id}
                      className={`p-3.5 transition-colors hover:bg-muted/40 ${
                        !notif.isRead ? "bg-primary/5 dark:bg-primary/10" : ""
                      }`}
                    >
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex items-start gap-2">
                          {/* Severity Icon Indicator */}
                          {notif.severity === "critical" && (
                            <span className="mt-0.5 rounded-full bg-rose-500/10 p-1 text-rose-600">
                              <ShieldAlert className="h-3.5 w-3.5" />
                            </span>
                          )}
                          {notif.severity === "warning" && (
                            <span className="mt-0.5 rounded-full bg-amber-500/10 p-1 text-amber-600">
                              <AlertTriangle className="h-3.5 w-3.5" />
                            </span>
                          )}
                          {notif.severity === "info" && (
                            <span className="mt-0.5 rounded-full bg-sky-500/10 p-1 text-sky-600">
                              <Info className="h-3.5 w-3.5" />
                            </span>
                          )}

                          <div className="space-y-0.5">
                            <p className="font-bold text-foreground leading-tight">{notif.title}</p>
                            <p className="text-muted-foreground text-[11px] line-clamp-2 leading-relaxed">
                              {notif.message}
                            </p>
                            <div className="flex items-center gap-2 pt-1 text-[10px] text-muted-foreground font-semibold">
                              <span>{new Date(notif.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                              {notif.organizationName && <span>&bull; {notif.organizationName}</span>}
                            </div>
                          </div>
                        </div>

                        {/* Unread dot indicator */}
                        {!notif.isRead && (
                          <span className="h-2 w-2 rounded-full bg-rose-500 shrink-0 mt-1" title="Unread"></span>
                        )}
                      </div>

                      {/* Item Controls Row */}
                      <div className="mt-2.5 flex items-center justify-between pt-2 border-t border-border/40 text-[11px]">
                        <button
                          onClick={() => toggleReadStatus(notif.id)}
                          className="flex items-center gap-1 font-semibold text-muted-foreground hover:text-foreground transition-colors"
                        >
                          {notif.isRead ? (
                            <>
                              <RotateCcw className="h-3 w-3" /> Mark Unread
                            </>
                          ) : (
                            <>
                              <Check className="h-3 w-3 text-emerald-600" /> Mark Read
                            </>
                          )}
                        </button>

                        <button
                          onClick={() => handleGoToCategory(notif.category)}
                          className="flex items-center gap-1 font-bold text-primary hover:underline transition-colors"
                        >
                          <span>More Details</span>
                          <ExternalLink className="h-3 w-3" />
                        </button>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="p-8 text-center text-muted-foreground font-medium">
                    No notifications available.
                  </div>
                )}
              </div>

              {/* Popover Footer */}
              <div className="p-2.5 border-t bg-muted/30 text-center">
                <Link
                  href="/admin/notifications"
                  onClick={() => setIsOpen(false)}
                  className="inline-flex items-center justify-center gap-1.5 text-xs font-bold text-primary hover:underline py-1"
                >
                  <span>View All in Notification Center</span>
                  <ArrowRight className="h-3.5 w-3.5" />
                </Link>
              </div>
            </div>
          )}
        </div>

        <ThemeToggle />
        <UserMenu />
      </div>
    </header>
  );
}