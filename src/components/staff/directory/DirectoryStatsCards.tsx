'use client';

import React from 'react';
import { Users, UserCheck, Building2, Clock } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { cn } from '@/lib/utils';

interface DirectoryStatsCardsProps {
  stats: {
    total: number;
    active: number;
    inactive: number;
    totalDepts: number;
    activePercent: number;
  };
  filteredCount: number;
}

export function DirectoryStatsCards({ stats, filteredCount }: DirectoryStatsCardsProps) {
  const cards = [
    {
      label: 'Total Personnel',
      value: stats.total,
      subtitle: `${filteredCount} showing on grid`,
      subColor: 'text-cyan-600 dark:text-cyan-400',
      icon: Users,
      cardBg: 'bg-cyan-500/5 dark:bg-cyan-500/10 border-cyan-500/20',
      iconClassName: 'bg-cyan-500/15 text-cyan-600 border-cyan-500/30 dark:text-cyan-400',
    },
    {
      label: 'Active Personnel',
      value: stats.active,
      subtitle: `${stats.activePercent}% Operational`,
      subColor: 'text-emerald-600 dark:text-emerald-400',
      icon: UserCheck,
      cardBg: 'bg-emerald-500/5 dark:bg-emerald-500/10 border-emerald-500/20',
      iconClassName: 'bg-emerald-500/15 text-emerald-600 border-emerald-500/30 dark:text-emerald-400',
      showDot: true,
    },
    {
      label: 'Departments',
      value: stats.totalDepts,
      subtitle: 'Functional business units',
      subColor: 'text-purple-600 dark:text-purple-400',
      icon: Building2,
      cardBg: 'bg-purple-500/5 dark:bg-purple-500/10 border-purple-500/20',
      iconClassName: 'bg-purple-500/15 text-purple-600 border-purple-500/30 dark:text-purple-400',
    },
    {
      label: 'On Leave / Inactive',
      value: stats.inactive,
      subtitle: stats.inactive > 0 ? 'Requires attention / on leave' : 'All staff active',
      subColor: 'text-amber-600 dark:text-amber-400',
      icon: Clock,
      cardBg: 'bg-amber-500/5 dark:bg-amber-500/10 border-amber-500/20',
      iconClassName: 'bg-amber-500/15 text-amber-600 border-amber-500/30 dark:text-amber-400',
    },
  ];

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
      {cards.map((c) => {
        const Icon = c.icon;

        return (
          <Card
            key={c.label}
            className={cn(
              'w-full min-w-0 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-xs border shadow-2xs rounded-xl overflow-hidden',
              c.cardBg
            )}
          >
            <CardContent className="p-3.5 sm:p-4 flex items-center justify-between gap-2">
              <div className="min-w-0 flex-1">
                <p className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider truncate">
                  {c.label}
                </p>
                <h3 className="text-xl sm:text-2xl font-bold tracking-tight text-foreground truncate tabular-nums mt-1 leading-tight">
                  {c.value.toLocaleString()}
                </h3>
                <p className={cn('text-[11px] font-medium mt-1 truncate flex items-center gap-1.5', c.subColor)}>
                  {c.showDot && <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 shrink-0" />}
                  {c.subtitle}
                </p>
              </div>

              <div
                className={cn(
                  'flex h-10 w-10 sm:h-11 sm:w-11 shrink-0 aspect-square items-center justify-center rounded-xl border transition-transform duration-200',
                  c.iconClassName
                )}
              >
                <Icon className="h-5 w-5 shrink-0" />
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
