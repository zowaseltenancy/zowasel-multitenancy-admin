'use client';

import React from 'react';
import { Palmtree, Stethoscope, Coffee, CalendarOff, CalendarCheck } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { LEAVE_BALANCES } from './leaveUtils';

interface LeaveTheme {
  icon: React.ElementType;
  bgClass: string;
  borderClass: string;
  iconBgClass: string;
  titleClass: string;
  badgeClass: string;
  barColor: string;
  subtext: string;
}

const LEAVE_CARD_THEMES: Record<string, LeaveTheme> = {
  Annual: {
    icon: Palmtree,
    bgClass: 'bg-emerald-50 dark:bg-emerald-950/40',
    borderClass: 'border-emerald-200 dark:border-emerald-800/50',
    iconBgClass: 'bg-[#44883C]/15 text-[#44883C] dark:text-[#5cb850] border border-[#44883C]/30',
    titleClass: 'text-emerald-900 dark:text-emerald-200',
    badgeClass: 'bg-emerald-100 text-emerald-800 border-emerald-300 dark:bg-emerald-900/50 dark:text-emerald-300 dark:border-emerald-700',
    barColor: '#44883C',
    subtext: 'Paid annual vacation allowance',
  },
  Sick: {
    icon: Stethoscope,
    bgClass: 'bg-rose-50 dark:bg-rose-950/40',
    borderClass: 'border-rose-200 dark:border-rose-800/50',
    iconBgClass: 'bg-rose-500/15 text-rose-600 dark:text-rose-400 border border-rose-500/30',
    titleClass: 'text-rose-900 dark:text-rose-200',
    badgeClass: 'bg-rose-100 text-rose-800 border-rose-300 dark:bg-rose-900/50 dark:text-rose-300 dark:border-rose-700',
    barColor: '#f43f5e',
    subtext: 'Medical & health recovery days',
  },
  Casual: {
    icon: Coffee,
    bgClass: 'bg-blue-50 dark:bg-blue-950/40',
    borderClass: 'border-blue-200 dark:border-blue-800/50',
    iconBgClass: 'bg-blue-500/15 text-blue-600 dark:text-blue-400 border border-blue-500/30',
    titleClass: 'text-blue-900 dark:text-blue-200',
    badgeClass: 'bg-blue-100 text-blue-800 border-blue-300 dark:bg-blue-900/50 dark:text-blue-300 dark:border-blue-700',
    barColor: '#3b82f6',
    subtext: 'Short-term personal affairs',
  },
  Unpaid: {
    icon: CalendarOff,
    bgClass: 'bg-amber-50 dark:bg-amber-950/40',
    borderClass: 'border-amber-200 dark:border-amber-800/50',
    iconBgClass: 'bg-amber-500/15 text-amber-600 dark:text-amber-400 border border-amber-500/30',
    titleClass: 'text-amber-900 dark:text-amber-200',
    badgeClass: 'bg-amber-100 text-amber-800 border-amber-300 dark:bg-amber-900/50 dark:text-amber-300 dark:border-amber-700',
    barColor: '#f59e0b',
    subtext: 'Discretionary unpaid absence',
  },
};

export function LeaveBalanceCards() {
  return (
    <div className="grid gap-3 sm:gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
      {Object.entries(LEAVE_BALANCES).map(([type, { total, taken }]) => {
        const available = type === 'Unpaid' ? '∞' : total - taken;
        const theme = LEAVE_CARD_THEMES[type] || {
          icon: CalendarCheck,
          bgClass: 'bg-muted/30',
          borderClass: 'border-border/60',
          iconBgClass: 'bg-muted text-foreground',
          titleClass: 'text-foreground',
          badgeClass: 'bg-muted text-muted-foreground border-border',
          barColor: '#44883C',
          subtext: 'Standard leave entitlement',
        };
        const IconComponent = theme.icon;

        return (
          <Card
            key={type}
            className={`border ${theme.borderClass} ${theme.bgClass} rounded-2xl shadow-2xs transition-all hover:shadow-xs`}
          >
            <CardContent className="p-4 sm:p-4.5 space-y-2.5">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className={`h-8 w-8 rounded-xl flex items-center justify-center shrink-0 ${theme.iconBgClass}`}>
                    <IconComponent className="h-4 w-4" />
                  </div>
                  <div>
                    <span className={`font-bold text-xs uppercase tracking-wider block ${theme.titleClass}`}>
                      {type}
                    </span>
                    <span className="text-[10px] text-muted-foreground hidden sm:block">
                      {theme.subtext}
                    </span>
                  </div>
                </div>

                {type === 'Unpaid' ? (
                  <Badge variant="outline" className={`text-[10px] font-bold ${theme.badgeClass}`}>
                    Uncapped
                  </Badge>
                ) : (
                  <Badge variant="outline" className={`text-[10px] font-bold ${theme.badgeClass}`}>
                    {available} left
                  </Badge>
                )}
              </div>

              <div className="flex items-baseline justify-between pt-1">
                <div>
                  <span className="text-2xl sm:text-3xl font-black text-foreground tracking-tight">
                    {available}
                  </span>
                  <span className="text-xs text-muted-foreground font-medium ml-1">
                    {type === 'Unpaid' ? 'days taken' : 'days available'}
                  </span>
                </div>
                <span className="text-[11px] font-mono font-medium text-muted-foreground">
                  {taken}/{total || '∞'} used
                </span>
              </div>

              <div className="h-2 w-full rounded-full bg-muted/60 overflow-hidden">
                <div
                  className="h-full rounded-full transition-all duration-300"
                  style={{
                    backgroundColor: theme.barColor,
                    width: type === 'Unpaid' ? '0%' : `${Math.min((taken / Math.max(total, 1)) * 100, 100)}%`,
                  }}
                />
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}

