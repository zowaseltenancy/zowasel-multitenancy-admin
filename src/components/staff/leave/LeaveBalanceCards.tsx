'use client';

import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { LEAVE_BALANCES } from './leaveUtils';

export function LeaveBalanceCards() {
  return (
    <div className="grid gap-3 sm:gap-4 grid-cols-2 lg:grid-cols-4">
      {Object.entries(LEAVE_BALANCES).map(([type, { total, taken }]) => {
        const available = type === 'Unpaid' ? '∞' : total - taken;
        return (
          <Card key={type} className="border border-border/60 rounded-2xl bg-card shadow-2xs">
            <CardContent className="p-3.5 sm:p-4 space-y-1.5">
              <div className="flex items-center justify-between">
                <span className="font-bold text-xs text-foreground uppercase tracking-wider">{type}</span>
                {type === 'Unpaid' ? (
                  <Badge variant="outline" className="text-[10px]">Uncapped</Badge>
                ) : (
                  <Badge variant="secondary" className="text-[10px] font-bold text-[#008C44]">
                    {available} left
                  </Badge>
                )}
              </div>
              <div className="flex items-baseline justify-between pt-0.5">
                <span className="text-xl sm:text-2xl font-extrabold text-foreground">{available}</span>
                <span className="text-[10.5px] text-muted-foreground">
                  {taken} used / {total} total
                </span>
              </div>
              <div className="h-1.5 w-full rounded-full bg-muted overflow-hidden">
                <div
                  className="h-full bg-[#00A651] rounded-full"
                  style={{ width: type === 'Unpaid' ? '0%' : `${Math.min((taken / total) * 100, 100)}%` }}
                />
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
