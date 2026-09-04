'use client';

import { Card, CardContent } from '@/components/ui/card';
import { Shield, ShieldCheck, UserCog, Lock } from 'lucide-react';

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
    { label: 'Total Roles', value: stats.total, icon: Shield },
    { label: 'System Roles', value: stats.system, icon: ShieldCheck },
    { label: 'Custom Roles', value: stats.custom, icon: UserCog },
    { label: 'Total Scopes', value: stats.totalScopes, icon: Lock },
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      {items.map((it, idx) => {
        const Icon = it.icon;
        return (
          <Card key={idx} className="bg-card border rounded-xl shadow-2xs">
            <CardContent className="p-4 flex items-center justify-between">
              <div>
                <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">{it.label}</p>
                <p className="text-2xl font-bold mt-1">{it.value}</p>
              </div>
              <div className="h-9 w-9 rounded-lg bg-muted flex items-center justify-center text-muted-foreground">
                <Icon className="h-4 w-4" />
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
