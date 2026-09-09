'use client';

import React from 'react';
import { HeartHandshake } from 'lucide-react';
import { StaffMember } from '@/types/staff';

interface NextOfKinSectionProps {
  nextOfKin?: StaffMember['nextOfKin'];
}

export function NextOfKinSection({ nextOfKin }: NextOfKinSectionProps) {
  const hasData = nextOfKin && (nextOfKin.fullName || nextOfKin.phone || nextOfKin.relationship || nextOfKin.email);

  return (
    <div className="p-5 sm:p-6 space-y-4">
      <div className="flex items-center gap-2 pb-1 border-b border-border/40">
        <HeartHandshake className="h-4 w-4 text-[#44883C]" />
        <h3 className="text-sm font-bold uppercase tracking-wider text-foreground">
          Emergency Contact & Next of Kin
        </h3>
      </div>

      {hasData ? (
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs">
          <div>
            <span className="text-[11px] text-muted-foreground block">Full Name</span>
            <p className="font-semibold text-foreground mt-0.5">
              {nextOfKin?.fullName || '—'}
            </p>
          </div>
          <div>
            <span className="text-[11px] text-muted-foreground block">Relationship</span>
            <p className="font-semibold text-foreground mt-0.5">
              {nextOfKin?.relationship || '—'}
            </p>
          </div>
          <div>
            <span className="text-[11px] text-muted-foreground block">Emergency Phone</span>
            <p className="font-semibold text-foreground mt-0.5 font-mono">
              {nextOfKin?.phone || '—'}
            </p>
          </div>
          <div>
            <span className="text-[11px] text-muted-foreground block">Emergency Email</span>
            <p className="font-semibold text-foreground mt-0.5 truncate">
              {nextOfKin?.email || '—'}
            </p>
          </div>
          {nextOfKin?.address && (
            <div className="sm:col-span-4">
              <span className="text-[11px] text-muted-foreground block">Residential Address</span>
              <p className="font-semibold text-foreground mt-0.5">
                {nextOfKin.address}
              </p>
            </div>
          )}
        </div>
      ) : (
        <p className="text-xs text-muted-foreground italic py-1">
          No next of kin details recorded during onboarding.
        </p>
      )}
    </div>
  );
}