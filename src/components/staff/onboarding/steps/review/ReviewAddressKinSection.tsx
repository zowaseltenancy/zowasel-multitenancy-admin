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

  return (
    <>
      {/* 3. Permanent Residential Address */}
      <div id="rev-section-address" className="p-3.5 space-y-2 scroll-mt-6">
        <div className="flex items-center justify-between pb-1 border-b border-border/40">
          <div className="flex items-center gap-2">
            <MapPin className="h-3.5 w-3.5 text-[#44883C]" />
            <span className="text-xs font-bold uppercase tracking-wider text-slate-800 dark:text-slate-200">
              2A. Permanent Residential Address
            </span>
          </div>
          <button
            type="button"
            onClick={onEdit}
            className="flex items-center gap-1 text-[11px] font-semibold text-[#008C44] dark:text-[#00C862] hover:underline cursor-pointer"
          >
            <Pencil className="h-3 w-3" /> Edit
          </button>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 text-xs">
          <div className="sm:col-span-2">
            <span className="text-[10px] text-muted-foreground block">Street / Location</span>
            <p className="font-semibold text-slate-900 dark:text-slate-100">{address?.line1 || '—'}</p>
          </div>
          <div>
            <span className="text-[10px] text-muted-foreground block">City</span>
            <p className="font-semibold text-slate-900 dark:text-slate-100">{address?.city || '—'}</p>
          </div>
          <div>
            <span className="text-[10px] text-muted-foreground block">State / Region</span>
            <p className="font-semibold text-slate-900 dark:text-slate-100">{address?.state || '—'}</p>
          </div>
          <div>
            <span className="text-[10px] text-muted-foreground block">Country</span>
            <p className="font-semibold text-slate-900 dark:text-slate-100">{address?.country || 'Nigeria'}</p>
          </div>
        </div>
      </div>

      {/* 4. Next of Kin & Emergency Contact */}
      <div id="rev-section-kin" className="p-3.5 space-y-2 scroll-mt-6">
        <div className="flex items-center justify-between pb-1 border-b border-border/40">
          <div className="flex items-center gap-2">
            <HeartHandshake className="h-3.5 w-3.5 text-[#00A651]" />
            <span className="text-xs font-bold uppercase tracking-wider text-slate-800 dark:text-slate-200">
              2B. Emergency Contact & Next of Kin (Optional)
            </span>
          </div>
          <button
            type="button"
            onClick={onEdit}
            className="flex items-center gap-1 text-[11px] font-semibold text-[#008C44] dark:text-[#00C862] hover:underline cursor-pointer"
          >
            <Pencil className="h-3 w-3" /> Edit
          </button>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 text-xs">
          <div>
            <span className="text-[10px] text-muted-foreground block">Full Name</span>
            <p className="font-semibold text-slate-900 dark:text-slate-100">{nextOfKin?.fullName || '—'}</p>
          </div>
          <div>
            <span className="text-[10px] text-muted-foreground block">Relationship</span>
            <p className="font-semibold text-slate-900 dark:text-slate-100">{nextOfKin?.relationship || '—'}</p>
          </div>
          <div>
            <span className="text-[10px] text-muted-foreground block">Emergency Phone</span>
            <p className="font-semibold text-slate-900 dark:text-slate-100 font-mono">{formattedKinPhone}</p>
          </div>
          <div>
            <span className="text-[10px] text-muted-foreground block">Emergency Email</span>
            <p className="font-semibold text-slate-900 dark:text-slate-100">{nextOfKin?.email || '—'}</p>
          </div>
          <div className="col-span-2 sm:col-span-4">
            <span className="text-[10px] text-muted-foreground block">Emergency Contact Address</span>
            <p className="font-semibold text-slate-900 dark:text-slate-100">{nextOfKin?.address || '—'}</p>
          </div>
        </div>
      </div>
    </>
  );
}
