"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import {
  Users,
  UserCheck,
  Store,
  Sprout,
  Building2,
  ShoppingBag,
  ArrowRight,
} from "lucide-react";

import { Card, CardContent } from "@/components/ui/card";
import UsersListView from "@/features/users/components/UsersListView";
import { useUsers } from "@/features/users/hooks/useUsers";

export default function PlatformUsersOverviewPage() {
  const { users } = useUsers();

  // Zowasel Staff are a separate domain from platform/tenant users.
  const tenantUsers = users.filter((u) => u.userCategory !== "staff");

  const totalUsers = tenantUsers.length;
  const agentsCount = users.filter((u) => u.userCategory === "agent" || u.role === "Field Agent").length;
  const merchantsCount = users.filter((u) => u.userCategory === "merchant" || u.role === "Input Merchant").length;
  const agrodealersCount = users.filter((u) => u.userCategory === "agrodealer" || u.role === "Agrodealer").length;
  const cooperativesCount = users.filter((u) => u.userCategory === "cooperative" || u.role === "Cooperative Leader").length;
  const buyersCount = users.filter((u) => u.userCategory === "buyer" || u.role === "Buyer").length;

  const stats = [
    {
      title: "Total Platform Users",
      value: totalUsers,
      href: "/admin/users",
      icon: Users,
      cardBg: "bg-cyan-500/5 dark:bg-cyan-500/10 border-cyan-500/20",
      iconClassName: "bg-cyan-500/15 text-cyan-600 border-cyan-500/30 dark:text-cyan-400",
    },
    {
      title: "Field Agents",
      value: agentsCount,
      href: "/admin/users/agents",
      icon: UserCheck,
      cardBg: "bg-emerald-500/5 dark:bg-emerald-500/10 border-emerald-500/20",
      iconClassName: "bg-emerald-500/15 text-emerald-600 border-emerald-500/30 dark:text-emerald-400",
    },
    {
      title: "Commodity Merchants",
      value: merchantsCount,
      href: "/admin/users/merchants",
      icon: Store,
      cardBg: "bg-blue-500/5 dark:bg-blue-500/10 border-blue-500/20",
      iconClassName: "bg-blue-500/15 text-blue-600 border-blue-500/30 dark:text-blue-400",
    },
    {
      title: "Input Agrodealers",
      value: agrodealersCount,
      href: "/admin/users/agrodealers",
      icon: Sprout,
      cardBg: "bg-amber-500/5 dark:bg-amber-500/10 border-amber-500/20",
      iconClassName: "bg-amber-500/15 text-amber-600 border-amber-500/30 dark:text-amber-400",
    },
    {
      title: "Farmer Cooperatives",
      value: cooperativesCount,
      href: "/admin/users/cooperatives",
      icon: Building2,
      cardBg: "bg-purple-500/5 dark:bg-purple-500/10 border-purple-500/20",
      iconClassName: "bg-purple-500/15 text-purple-600 border-purple-500/30 dark:text-purple-400",
    },
    {
      title: "Commodity Buyers",
      value: buyersCount,
      href: "/admin/users/buyers",
      icon: ShoppingBag,
      cardBg: "bg-indigo-500/5 dark:bg-indigo-500/10 border-indigo-500/20",
      iconClassName: "bg-indigo-500/15 text-indigo-600 border-indigo-500/30 dark:text-indigo-400",
    },
  ];

  return (
    <div className="space-y-6">
      {/* Metric Cards Banner */}
      <section className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <Link key={stat.title} href={stat.href} className="group block">
              <Card className={`border shadow-2xs transition-all hover:scale-[1.02] ${stat.cardBg}`}>
                <CardContent className="flex flex-col justify-between p-4 min-h-[110px]">
                  <div className="flex items-center justify-between">
                    <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                      {stat.title}
                    </p>
                    <div className={`flex h-8 w-8 items-center justify-center rounded-lg border ${stat.iconClassName}`}>
                      <Icon className="h-4 w-4" />
                    </div>
                  </div>
                  <div className="mt-2 flex items-baseline justify-between">
                    <p className="text-2xl font-bold">{stat.value}</p>
                    <ArrowRight className="h-3.5 w-3.5 opacity-0 group-hover:opacity-100 transition-opacity text-primary" />
                  </div>
                </CardContent>
              </Card>
            </Link>
          );
        })}
      </section>

      {/* Main Users List */}
      <UsersListView showStatsCards={false} />
    </div>
  );
}
