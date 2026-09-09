'use client';

import { Card, CardContent } from '@/components/ui/card';
import { Shield, ShieldCheck, UserCog, KeyRound } from 'lucide-react';

interface RolesStatsCardsProps {
  stats: {
    total: number;
    system: number;
    custom: number;
    totalScopes: number;
  };
}

export function RolesStatsCards({ stats }: RolesStatsCardsProps) {
  const items = [
    {
      label: 'Total Roles',
      value: stats.total,
      icon: Shield,
      subtext: 'Configured role profiles',
      bgClass: 'bg-emerald-50 dark:bg-emerald-950/40',
      borderClass: 'border-emerald-200 dark:border-emerald-800/50',
      iconBgClass: 'bg-[#44883C]/15 text-[#44883C] dark:text-[#5cb850] border border-[#44883C]/25',
      labelClass: 'text-emerald-900 dark:text-emerald-300',
    },
    {
      label: 'System Roles',
      value: stats.system,
      icon: ShieldCheck,
      subtext: 'Default built-in templates',
      bgClass: 'bg-blue-50 dark:bg-blue-950/40',
      borderClass: 'border-blue-200 dark:border-blue-800/50',
      iconBgClass: 'bg-blue-500/15 text-blue-600 dark:text-blue-400 border border-blue-500/25',
      labelClass: 'text-blue-900 dark:text-blue-300',
    },
    {
      label: 'Custom Roles',
      value: stats.custom,
      icon: UserCog,
      subtext: 'Tenant-tailored roles',
      bgClass: 'bg-purple-50 dark:bg-purple-950/40',
      borderClass: 'border-purple-200 dark:border-purple-800/50',
      iconBgClass: 'bg-purple-500/15 text-purple-600 dark:text-purple-400 border border-purple-500/25',
      labelClass: 'text-purple-900 dark:text-purple-300',
    },
    {
      label: 'Total Scopes',
      value: stats.totalScopes,
      icon: KeyRound,
      subtext: 'Granular permissions',
      bgClass: 'bg-amber-50 dark:bg-amber-950/40',
      borderClass: 'border-amber-200 dark:border-amber-800/50',
      iconBgClass: 'bg-amber-500/15 text-amber-600 dark:text-amber-400 border border-amber-500/25',
      labelClass: 'text-amber-900 dark:text-amber-300',
    },
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-3.5 sm:gap-4">
      {items.map((it, idx) => {
        const Icon = it.icon;
        return (
          <Card
            key={idx}
            className={`border ${it.borderClass} ${it.bgClass} rounded-2xl shadow-2xs transition-all hover:shadow-xs`}
          >
            <CardContent className="p-4 sm:p-4.5 flex items-center justify-between">
              <div className="space-y-0.5">
                <p className={`text-xs font-bold uppercase tracking-wider ${it.labelClass}`}>
                  {it.label}
                </p>
                <p className="text-2xl sm:text-3xl font-extrabold text-foreground font-mono tracking-tight">
                  {it.value}
                </p>
                <span className="text-[10.5px] text-muted-foreground block">
                  {it.subtext}
                </span>
              </div>
              <div className={`h-10 w-10 sm:h-11 sm:w-11 rounded-xl flex items-center justify-center shrink-0 ${it.iconBgClass} shadow-2xs`}>
                <Icon className="h-5 w-5" />
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
