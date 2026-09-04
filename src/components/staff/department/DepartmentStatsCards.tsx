'use client';

import { Card, CardContent } from '@/components/ui/card';
import { Building2, UserCheck, UserX, Users } from 'lucide-react';

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
    { label: 'Total Units', value: totalUnits, icon: Building2 },
    { label: 'Appointed Leads', value: assignedHeadsCount, icon: UserCheck },
    { label: 'Unassigned Units', value: unassignedCount, icon: UserX },
    { label: 'Total Staff', value: totalDepartmentStaff, icon: Users },
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      {stats.map((s, idx) => {
        const Icon = s.icon;
        return (
          <Card key={idx} className="bg-card border rounded-xl shadow-2xs">
            <CardContent className="p-4 flex items-center justify-between">
              <div>
                <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                  {s.label}
                </p>
                <p className="text-2xl font-bold text-foreground mt-1">{s.value}</p>
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
