'use client';

import React from 'react';
import { User, MapPin } from 'lucide-react';
import { StaffMember } from '@/types/staff';

interface PersonalDemographicsSectionProps {
  staff: StaffMember;
  formatDate: (dateStr?: string) => string;
}

export function PersonalDemographicsSection({
  staff,
  formatDate,
}: PersonalDemographicsSectionProps) {
  return (
    <>
      {/* 1. Personal Identity & Demographics */}
      <div className="p-5 sm:p-6 space-y-4">
        <div className="flex items-center gap-2 pb-1 border-b border-border/40">
          <User className="h-4 w-4 text-[#44883C]" />
          <h3 className="text-sm font-bold uppercase tracking-wider text-foreground">
            Personal Identity & Demographics
          </h3>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs">
          <div>
            <span className="text-[11px] text-muted-foreground block">First Name</span>
            <p className="font-semibold text-foreground mt-0.5">
              {staff.firstName || '—'}
            </p>
          </div>
          <div>
            <span className="text-[11px] text-muted-foreground block">Last Name</span>
            <p className="font-semibold text-foreground mt-0.5">
              {staff.lastName || '—'}
            </p>
          </div>
          <div>
            <span className="text-[11px] text-muted-foreground block">Date of Birth</span>
            <p className="font-semibold text-foreground mt-0.5">
              {formatDate(staff.dateOfBirth)}
            </p>
          </div>
          <div>
            <span className="text-[11px] text-muted-foreground block">Gender</span>
            <p className="font-semibold text-foreground capitalize mt-0.5">
              {staff.gender || '—'}
            </p>
          </div>
          <div>
            <span className="text-[11px] text-muted-foreground block">Marital Status</span>
            <p className="font-semibold text-foreground capitalize mt-0.5">
              {staff.maritalStatus || '—'}
            </p>
          </div>
          <div>
            <span className="text-[11px] text-muted-foreground block">Nationality</span>
            <p className="font-semibold text-foreground mt-0.5">
              {staff.nationality || '—'}
            </p>
          </div>
          <div>
            <span className="text-[11px] text-muted-foreground block">Personal Phone</span>
            <p className="font-semibold text-foreground mt-0.5 font-mono">
              {staff.phone || staff.mobilenumber || '—'}
            </p>
          </div>
          <div>
            <span className="text-[11px] text-muted-foreground block">Official Email</span>
            <p className="font-semibold text-foreground mt-0.5 font-mono truncate">
              {staff.email || '—'}
            </p>
          </div>
        </div>
      </div>

      {/* 2. Permanent Residential Address */}
      <div className="p-5 sm:p-6 space-y-4">
        <div className="flex items-center gap-2 pb-1 border-b border-border/40">
          <MapPin className="h-4 w-4 text-[#44883C]" />
          <h3 className="text-sm font-bold uppercase tracking-wider text-foreground">
            Permanent Residential Address
          </h3>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs">
          <div className="sm:col-span-2">
            <span className="text-[11px] text-muted-foreground block">Street Address</span>
            <p className="font-semibold text-foreground mt-0.5">
              {staff.address?.line1 ? (
                <>
                  {staff.address.line1}
                  {staff.address.line2 ? `, ${staff.address.line2}` : ''}
                </>
              ) : (
                '—'
              )}
            </p>
          </div>
          <div>
            <span className="text-[11px] text-muted-foreground block">City</span>
            <p className="font-semibold text-foreground mt-0.5">
              {staff.address?.city || '—'}
            </p>
          </div>
          <div>
            <span className="text-[11px] text-muted-foreground block">State & Country</span>
            <p className="font-semibold text-foreground mt-0.5">
              {staff.address?.state ? (
                `${staff.address.state}${staff.address.country ? `, ${staff.address.country}` : ''}`
              ) : (
                staff.address?.country || '—'
              )}
            </p>
          </div>
          {staff.address?.postalCode && (
            <div>
              <span className="text-[11px] text-muted-foreground block">Postal / Zip Code</span>
              <p className="font-semibold text-foreground mt-0.5 font-mono">
                {staff.address.postalCode}
              </p>
            </div>
          )}
        </div>
      </div>
    </>
  );
}