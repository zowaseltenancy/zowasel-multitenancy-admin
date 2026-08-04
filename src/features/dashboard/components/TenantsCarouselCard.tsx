"use client";

import { useState, useEffect } from "react";
import { Users, ChevronLeft, ChevronRight, UserCheck } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
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
      <Card className="h-[210px] flex flex-col justify-between border shadow-2xs bg-card overflow-hidden transition-all duration-200">
        <CardContent className="p-4 flex flex-col justify-between h-full space-y-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-purple-500/15 text-purple-700 dark:text-purple-300">
                <Users className="h-4 w-4" />
              </div>
              <div>
                <p className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground leading-none">
                  Platform Tenants
                </p>
              </div>
            </div>
            <span className="inline-flex items-center gap-1 rounded-full bg-purple-500/10 px-2 py-0.5 text-[10px] font-bold text-purple-600 border border-purple-500/20">
              <UserCheck className="h-3 w-3" /> 92.8% Active
            </span>
          </div>

          <div className="grid grid-cols-2 gap-2 pt-1">
            <div className="p-2.5 rounded-lg border bg-purple-500/5 border-purple-500/20">
              <p className="text-[10px] font-bold uppercase text-muted-foreground">Total Tenants</p>
              <p className="text-2xl font-extrabold text-purple-600 mt-0.5">{tenantUsers.length}</p>
            </div>
            <div className="p-2.5 rounded-lg border bg-muted/30">
              <p className="text-[10px] font-bold uppercase text-muted-foreground">Active Monthly</p>
              <p className="text-2xl font-extrabold text-foreground mt-0.5">{tenantUsers.length > 0 ? tenantUsers.length - 2 : 0}</p>
            </div>
          </div>

          <div className="flex items-center justify-between text-[10px] font-semibold text-muted-foreground pt-1 border-t">
            <span>Agents: {tenantUsers.filter(u => u.userCategory === 'agent').length}</span>
            <span>&bull;</span>
            <span>Merchants: {tenantUsers.filter(u => u.userCategory === 'merchant').length}</span>
            <span>&bull;</span>
            <span>Buyers: {tenantUsers.filter(u => u.userCategory === 'buyer').length}</span>
          </div>
        </CardContent>
      </Card>
    );
  }

  // EXPANDED VIEW
  return (
    <Card className="min-h-[360px] flex flex-col justify-between border shadow-md bg-card overflow-hidden">
      <CardContent className="p-6 flex flex-col justify-between h-full space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-purple-500/15 text-purple-700 dark:text-purple-300">
              <Users className="h-5 w-5" />
            </div>
            <div>
              <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                Tenants & User Category Breakdown
              </p>
              <h3 className="text-2xl font-extrabold text-foreground">{tenantUsers.length} Platform Tenant Accounts</h3>
            </div>
          </div>

          <div className="flex items-center gap-2">
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

        <div className="w-full flex items-center gap-2 p-1.5 bg-muted/60 rounded-xl">
          {TENANT_CATEGORIES.map((cat, idx) => (
            <button
              key={cat}
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                setCurrentIndex(idx);
              }}
              className={cn(
                "flex-1 py-2 px-3 text-xs font-bold rounded-lg transition-all cursor-pointer text-center",
                currentIndex === idx
                  ? "bg-primary text-primary-foreground shadow-xs"
                  : "text-foreground hover:bg-card"
              )}
            >
              {USER_CATEGORY_LABELS[cat]}
            </button>
          ))}
        </div>

        <div className="grid grid-cols-3 gap-4 p-4 border rounded-xl bg-muted/20">
          <div className="flex flex-col justify-center items-center text-center p-3 rounded-lg border bg-card">
            <p className="text-3xl font-black text-foreground">{categoryUsers.length}</p>
            <p className="text-xs font-bold text-muted-foreground mt-1">Total {USER_CATEGORY_LABELS[activeCategory]}</p>
          </div>

          <div className="flex flex-col justify-center items-center text-center p-3 rounded-lg border border-sky-500/30 bg-sky-500/10">
            <div className="flex items-center gap-1.5">
              <GenderIcon gender="male" className="h-5 w-5" />
              <span className="text-3xl font-black text-sky-700 dark:text-sky-300">{maleCount}</span>
            </div>
            <p className="text-xs font-bold text-sky-800 dark:text-sky-200 mt-1">Male Members</p>
          </div>

          <div className="flex flex-col justify-center items-center text-center p-3 rounded-lg border border-pink-500/30 bg-pink-500/10">
            <div className="flex items-center gap-1.5">
              <GenderIcon gender="female" className="h-5 w-5" />
              <span className="text-3xl font-black text-pink-700 dark:text-pink-300">{femaleCount}</span>
            </div>
            <p className="text-xs font-bold text-pink-800 dark:text-pink-200 mt-1">Female Members</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
