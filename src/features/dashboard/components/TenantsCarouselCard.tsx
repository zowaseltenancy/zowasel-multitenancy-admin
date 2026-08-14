"use client";

import { useState, useEffect } from "react";
import { Users, ChevronLeft, ChevronRight, UserCheck } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { cn, formatCompactMetric } from "@/lib/utils";
import { PlatformUser, PlatformUserCategory } from "@/types/user";
import { USER_CATEGORY_LABELS } from "@/constants/user";
import GenderIcon from "@/components/shared/GenderIcon";

interface Props {
  users: PlatformUser[];
  isExpanded?: boolean;
}

const TENANT_CATEGORIES: Exclude<PlatformUserCategory, "staff">[] = [
  "agent",
  "merchant",
  "agrodealer",
  "cooperative",
  "buyer",
];

export default function TenantsCarouselCard({ users, isExpanded = false }: Props) {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    if (!isExpanded) return;
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % TENANT_CATEGORIES.length);
    }, 10000);

    return () => clearInterval(timer);
  }, [isExpanded]);

  const tenantUsers = users.filter((u) => u.userCategory !== "staff");
  const activeCategory = TENANT_CATEGORIES[currentIndex];

  const categoryUsers = tenantUsers.filter((u) => u.userCategory === activeCategory);
  const maleCount = categoryUsers.filter((u) => u.gender === "male").length;
  const femaleCount = categoryUsers.filter((u) => u.gender === "female").length;

  const nextSlide = (e: React.MouseEvent) => {
    e.stopPropagation();
    setCurrentIndex((prev) => (prev + 1) % TENANT_CATEGORIES.length);
  };
  const prevSlide = (e: React.MouseEvent) => {
    e.stopPropagation();
    setCurrentIndex((prev) => (prev - 1 + TENANT_CATEGORIES.length) % TENANT_CATEGORIES.length);
  };

  // SUMMARY VIEW (Landing 8-Card Grid)
  if (!isExpanded) {
    return (
      <Card className="h-full min-h-[210px] flex flex-col justify-between border shadow-2xs bg-card overflow-hidden">
        <CardContent className="p-3.5 sm:p-4 flex flex-col justify-between h-full space-y-2.5">
          <div className="flex items-center justify-between gap-1.5 min-w-0">
            <div className="flex items-center gap-2 min-w-0">
              <div className="flex h-7 w-7 sm:h-8 sm:w-8 items-center justify-center rounded-xl bg-purple-500/15 text-purple-700 dark:text-purple-300 shrink-0">
                <Users className="h-4 w-4" />
              </div>
              <p className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground leading-none truncate">
                Platform Tenants
              </p>
            </div>
            <span className="inline-flex items-center gap-1 rounded-full bg-purple-500/10 px-2 py-0.5 text-[10px] font-bold text-purple-600 border border-purple-500/20 shrink-0 whitespace-nowrap">
              <UserCheck className="h-3 w-3" /> 92.8% Active
            </span>
          </div>

          <div className="grid grid-cols-2 gap-2 min-w-0">
            <div className="p-2.5 rounded-lg border bg-purple-500/5 border-purple-500/20 min-w-0 overflow-hidden" title={`${tenantUsers.length.toLocaleString()}`}>
              <p className="text-[10px] font-bold uppercase text-muted-foreground truncate">Total Tenants</p>
              <p className="text-xl sm:text-2xl font-extrabold text-purple-600 mt-0.5 truncate tracking-tight tabular-nums">{formatCompactMetric(tenantUsers.length)}</p>
            </div>
            <div className="p-2.5 rounded-lg border bg-muted/30 min-w-0 overflow-hidden" title={`${(tenantUsers.length > 0 ? tenantUsers.length - 2 : 0).toLocaleString()}`}>
              <p className="text-[10px] font-bold uppercase text-muted-foreground truncate">Active Monthly</p>
              <p className="text-xl sm:text-2xl font-extrabold text-foreground mt-0.5 truncate tracking-tight tabular-nums">{formatCompactMetric(tenantUsers.length > 0 ? tenantUsers.length - 2 : 0)}</p>
            </div>
          </div>

          <div className="flex items-center justify-between text-[10px] font-semibold text-muted-foreground pt-1.5 border-t border-border/60 min-w-0 overflow-hidden">
            <span className="truncate">Agents: {formatCompactMetric(tenantUsers.filter(u => u.userCategory === 'agent').length)}</span>
            <span className="shrink-0 mx-1">&bull;</span>
            <span className="truncate">Merchants: {formatCompactMetric(tenantUsers.filter(u => u.userCategory === 'merchant').length)}</span>
            <span className="shrink-0 mx-1">&bull;</span>
            <span className="truncate">Buyers: {formatCompactMetric(tenantUsers.filter(u => u.userCategory === 'buyer').length)}</span>
          </div>
        </CardContent>
      </Card>
    );
  }

  // EXPANDED VIEW
  return (
    <Card className="min-h-[360px] flex flex-col justify-between border shadow-md bg-card overflow-hidden">
      <CardContent className="p-4 sm:p-6 flex flex-col justify-between h-full space-y-4 sm:space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-3 min-w-0">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-purple-500/15 text-purple-700 dark:text-purple-300 shrink-0">
              <Users className="h-5 w-5" />
            </div>
            <div className="min-w-0">
              <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground truncate">
                Tenants & User Category Breakdown
              </p>
              <h3 className="text-xl sm:text-2xl font-extrabold text-foreground truncate">{tenantUsers.length.toLocaleString()} Platform Tenant Accounts</h3>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <Button variant="outline" size="sm" className="h-8 text-xs font-bold cursor-pointer" onClick={prevSlide}>
              <ChevronLeft className="h-4 w-4 mr-1" /> Previous Category
            </Button>
            <span className="text-xs font-mono font-bold text-muted-foreground px-2">
              {currentIndex + 1} / {TENANT_CATEGORIES.length}
            </span>
            <Button variant="outline" size="sm" className="h-8 text-xs font-bold cursor-pointer" onClick={nextSlide}>
              Next Category <ChevronRight className="h-4 w-4 ml-1" />
            </Button>
          </div>
        </div>

        <div className="w-full flex flex-wrap sm:flex-nowrap items-center gap-1.5 sm:gap-2 p-1.5 bg-muted/60 rounded-xl overflow-x-auto">
          {TENANT_CATEGORIES.map((cat, idx) => (
            <button
              key={cat}
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                setCurrentIndex(idx);
              }}
              className={cn(
                "flex-1 min-w-[90px] py-2 px-3 text-xs font-bold rounded-lg transition-all cursor-pointer text-center whitespace-nowrap",
                currentIndex === idx
                  ? "bg-primary text-primary-foreground shadow-xs"
                  : "text-foreground hover:bg-card"
              )}
            >
              {USER_CATEGORY_LABELS[cat]}
            </button>
          ))}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4 p-4 border rounded-xl bg-muted/20">
          <div className="flex flex-col justify-center items-center text-center p-3 rounded-lg border bg-card min-w-0 overflow-hidden">
            <p className="text-2xl sm:text-3xl font-black text-foreground truncate">{categoryUsers.length.toLocaleString()}</p>
            <p className="text-xs font-bold text-muted-foreground mt-1 truncate">Total {USER_CATEGORY_LABELS[activeCategory]}</p>
          </div>

          <div className="flex flex-col justify-center items-center text-center p-3 rounded-lg border border-sky-500/30 bg-sky-500/10 min-w-0 overflow-hidden">
            <div className="flex items-center gap-1.5">
              <GenderIcon gender="male" className="h-5 w-5 shrink-0" />
              <span className="text-2xl sm:text-3xl font-black text-sky-700 dark:text-sky-300 truncate">{maleCount.toLocaleString()}</span>
            </div>
            <p className="text-xs font-bold text-sky-800 dark:text-sky-200 mt-1 truncate">Male Members</p>
          </div>

          <div className="flex flex-col justify-center items-center text-center p-3 rounded-lg border border-pink-500/30 bg-pink-500/10 min-w-0 overflow-hidden">
            <div className="flex items-center gap-1.5">
              <GenderIcon gender="female" className="h-5 w-5 shrink-0" />
              <span className="text-2xl sm:text-3xl font-black text-pink-700 dark:text-pink-300 truncate">{femaleCount.toLocaleString()}</span>
            </div>
            <p className="text-xs font-bold text-pink-800 dark:text-pink-200 mt-1 truncate">Female Members</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
