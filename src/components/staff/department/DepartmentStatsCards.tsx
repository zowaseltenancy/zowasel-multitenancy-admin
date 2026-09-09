'use client';

import { Card, CardContent } from '@/components/ui/card';
import { Building2, UserCheck, UserX, Users } from 'lucide-react';
import { cn } from '@/lib/utils';

interface DepartmentStatsCardsProps {
  totalUnits: number;
  assignedHeadsCount: number;
  unassignedCount: number;
  totalDepartmentStaff: number;
}

export function DepartmentStatsCards({
  totalUnits,
  assignedHeadsCount,
  unassignedCount,
  totalDepartmentStaff,
}: DepartmentStatsCardsProps) {
  const stats = [
    {
      label: 'Total Units',
      value: totalUnits,
      icon: Building2,
      subtitle: 'Configured business units',
      cardBg: 'bg-blue-500/5 dark:bg-blue-500/10 border-blue-500/20',
      iconBg: 'bg-blue-500/15 text-blue-600 dark:text-blue-400 border-blue-500/30',
      labelColor: 'text-blue-700 dark:text-blue-300',
      subColor: 'text-blue-600/80 dark:text-blue-400/80',
    },
    {
      label: 'Appointed Leads',
      value: assignedHeadsCount,
      icon: UserCheck,
      subtitle: `${assignedHeadsCount} units with leadership`,
      cardBg: 'bg-emerald-500/5 dark:bg-emerald-500/10 border-emerald-500/20',
      iconBg: 'bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border-emerald-500/30',
      labelColor: 'text-emerald-700 dark:text-emerald-300',
      subColor: 'text-emerald-600/80 dark:text-emerald-400/80',
    },
    {
      label: 'Unassigned Units',
      value: unassignedCount,
      icon: UserX,
      subtitle: unassignedCount > 0 ? 'Requires head assignment' : 'All units assigned',
      cardBg: 'bg-amber-500/5 dark:bg-amber-500/10 border-amber-500/20',
      iconBg: 'bg-amber-500/15 text-amber-600 dark:text-amber-400 border-amber-500/30',
      labelColor: 'text-amber-700 dark:text-amber-300',
      subColor: 'text-amber-600/80 dark:text-amber-400/80',
    },
    {
      label: 'Total Staff',
      value: totalDepartmentStaff,
      icon: Users,
      subtitle: 'Active members assigned',
      cardBg: 'bg-purple-500/5 dark:bg-purple-500/10 border-purple-500/20',
      iconBg: 'bg-purple-500/15 text-purple-600 dark:text-purple-400 border-purple-500/30',
      labelColor: 'text-purple-700 dark:text-purple-300',
      subColor: 'text-purple-600/80 dark:text-purple-400/80',
    },
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      {stats.map((s, idx) => {
        const Icon = s.icon;
        return (
          <Card
            key={idx}
            className={cn(
              'border rounded-xl shadow-2xs transition-all duration-200 hover:-translate-y-0.5 hover:shadow-xs',
              s.cardBg
            )}
          >
            <CardContent className="p-4 flex items-center justify-between">
              <div className="min-w-0 flex-1 space-y-1">
                <p className={cn('text-xs font-semibold uppercase tracking-wider', s.labelColor)}>
                  {s.label}
                </p>
                <p className="text-2xl font-bold text-foreground font-mono tracking-tight">
                  {s.value}
                </p>
                <p className={cn('text-[11px] font-medium truncate', s.subColor)}>
                  {s.subtitle}
                </p>
              </div>
              <div
                className={cn(
                  'h-10 w-10 rounded-xl flex items-center justify-center shrink-0 border shadow-2xs',
                  s.iconBg
                )}
              >
                <Icon className="h-5 w-5" />
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
