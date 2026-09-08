'use client';

import React from 'react';
import { MapPin, HeartHandshake, Pencil } from 'lucide-react';
import { StaffFormValues } from '@/lib/validations/staff';

interface ReviewAddressKinSectionProps {
  address?: StaffFormValues['address'];
  nextOfKin?: StaffFormValues['nextOfKin'];
  kinPhoneCode: string;
  onEdit: () => void;
}

export function ReviewAddressKinSection({
  address,
  nextOfKin,
  kinPhoneCode,
  onEdit,
}: ReviewAddressKinSectionProps) {
  const formattedKinPhone = nextOfKin?.phone
    ? nextOfKin.phone.startsWith('+')
      ? nextOfKin.phone
      : `${kinPhoneCode} ${nextOfKin.phone}`
    : '—';

  const hasKinData = Boolean(
    nextOfKin?.fullName || nextOfKin?.phone || nextOfKin?.email || nextOfKin?.relationship || nextOfKin?.address
  );

  return (
    <>
      {/* 2A. Permanent Residential Address */}
      <div id="rev-section-address" className="p-5 sm:p-6 space-y-3.5 scroll-mt-6">
        <div className="flex items-center justify-between pb-2 border-b border-border/50">
          <div className="flex items-center gap-2">
            <MapPin className="h-4 w-4 text-purple-600 dark:text-purple-400" />
            <span className="text-xs font-bold uppercase tracking-wider text-foreground">
              2A. Permanent Residential Address
            </span>
          </div>
          <button
            type="button"
            onClick={onEdit}
            className="flex items-center gap-1 text-xs font-semibold text-purple-600 dark:text-purple-400 hover:underline cursor-pointer"
          >
            <Pencil className="h-3 w-3" /> Edit
          </button>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 sm:gap-5 text-xs">
          <div className="sm:col-span-2">
            <span className="text-[11px] text-muted-foreground block">Location / Street</span>
            <p className="font-semibold text-foreground text-[13px] mt-0.5">{address?.line1 || '—'}</p>
          </div>
          <div>
            <span className="text-[11px] text-muted-foreground block">City</span>
            <p className="font-semibold text-foreground text-[13px] mt-0.5">{address?.city || '—'}</p>
          </div>
          <div>
            <span className="text-[11px] text-muted-foreground block">State / Region</span>
            <p className="font-semibold text-foreground text-[13px] mt-0.5">{address?.state || '—'}</p>
          </div>
          <div>
            <span className="text-[11px] text-muted-foreground block">Country</span>
            <p className="font-semibold text-foreground text-[13px] mt-0.5">{address?.country || '—'}</p>
          </div>
        </div>
      </div>

      {/* 2B. Next of Kin & Emergency Contact */}
      <div id="rev-section-kin" className="p-5 sm:p-6 space-y-3.5 scroll-mt-6 border-t border-border/60">
        <div className="flex items-center justify-between pb-2 border-b border-border/50">
          <div className="flex items-center gap-2">
            <HeartHandshake className="h-4 w-4 text-purple-600 dark:text-purple-400" />
            <span className="text-xs font-bold uppercase tracking-wider text-foreground">
              2B. Next of Kin & Emergency Contact
            </span>
          </div>
          <button
            type="button"
            onClick={onEdit}
            className="flex items-center gap-1 text-xs font-semibold text-purple-600 dark:text-purple-400 hover:underline cursor-pointer"
          >
            <Pencil className="h-3 w-3" /> Edit
          </button>
        </div>

        {hasKinData ? (
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 sm:gap-5 text-xs">
            <div>
              <span className="text-[11px] text-muted-foreground block">Full Name</span>
              <p className="font-semibold text-foreground text-[13px] mt-0.5">{nextOfKin?.fullName || '—'}</p>
            </div>
            <div>
              <span className="text-[11px] text-muted-foreground block">Relationship</span>
              <p className="font-semibold text-foreground text-[13px] mt-0.5">{nextOfKin?.relationship || '—'}</p>
            </div>
            <div>
              <span className="text-[11px] text-muted-foreground block">Emergency Phone</span>
              <p className="font-semibold text-foreground font-mono text-[12.5px] mt-0.5">{formattedKinPhone}</p>
            </div>
            <div>
              <span className="text-[11px] text-muted-foreground block">Emergency Email</span>
              <p className="font-semibold text-foreground text-[13px] mt-0.5">{nextOfKin?.email || '—'}</p>
            </div>
            {nextOfKin?.address && (
              <div className="col-span-2 sm:col-span-4">
                <span className="text-[11px] text-muted-foreground block">Residential Address</span>
                <p className="font-semibold text-foreground text-[13px] mt-0.5">{nextOfKin.address}</p>
              </div>
            )}
          </div>
        ) : (
          <p className="text-xs text-muted-foreground italic">
            Not provided (Optional emergency contact details were skipped)
          </p>
        )}
      </div>
    </>
  );
}
