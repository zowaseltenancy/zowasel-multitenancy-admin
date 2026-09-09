'use client';

import { Mail, Phone, MapPin, Copy, Check } from 'lucide-react';
import { StaffMember } from '@/types/staff';
import { useState } from 'react';
import { toast } from 'sonner';

interface ContactCardProps {
  staff: StaffMember;
}

export function ContactCard({ staff }: ContactCardProps) {
  const [copied, setCopied] = useState<string | null>(null);

  // Hoisted so the truthiness guard below narrows inside the onClick closure —
  // narrowing on `staff.phone` does not reach into a callback, because the
  // property could in principle change between render and click.
  const phone = staff.phone;

  const handleCopy = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    setCopied(label);
    toast.success(`Copied ${label} to clipboard`);
    setTimeout(() => setCopied(null), 2000);
  };

  return (
    <div className="border border-border/60 rounded-2xl bg-card p-5 shadow-2xs space-y-4">
      <div className="flex items-center gap-2 pb-1 border-b border-border/40">
        <Mail className="h-4 w-4 text-[#00A651]" />
        <h3 className="text-sm font-bold tracking-tight text-slate-900 dark:text-white">
          Contact Information
        </h3>
      </div>

      <div className="space-y-3 text-xs">
        {/* Work Email */}
        <div className="space-y-0.5">
          <span className="text-[11px] text-muted-foreground block">Work Email</span>
          <div className="flex items-center justify-between gap-2">
            <span className="font-semibold text-slate-900 dark:text-slate-100 truncate font-mono text-[11.5px]">
              {staff.email}
            </span>
            <button
              type="button"
              onClick={() => handleCopy(staff.email, 'Work Email')}
              className="text-muted-foreground hover:text-foreground cursor-pointer p-1"
              title="Copy email"
            >
              {copied === 'Work Email' ? (
                <Check className="h-3.5 w-3.5 text-[#00A651]" />
              ) : (
                <Copy className="h-3.5 w-3.5 opacity-60" />
              )}
            </button>
          </div>
        </div>

        {/* Work Phone */}
        <div className="space-y-0.5">
          <span className="text-[11px] text-muted-foreground block">Work Phone</span>
          <div className="flex items-center justify-between gap-2">
            <a
              href={phone ? `tel:${phone}` : '#'}
              className="font-semibold text-slate-900 dark:text-slate-100 hover:text-[#00A651] transition-colors font-mono text-[11.5px]"
            >
              {phone || '—'}
            </a>
            {phone && (
              <button
                type="button"
                onClick={() => handleCopy(phone, 'Phone Number')}
                className="text-muted-foreground hover:text-foreground cursor-pointer p-1"
                title="Copy phone"
              >
                {copied === 'Phone Number' ? (
                  <Check className="h-3.5 w-3.5 text-[#00A651]" />
                ) : (
                  <Copy className="h-3.5 w-3.5 opacity-60" />
                )}
              </button>
            )}
          </div>
        </div>

        {/* Work Location */}
        <div className="space-y-0.5">
          <span className="text-[11px] text-muted-foreground block">Work Location</span>
          <p className="font-semibold text-slate-900 dark:text-slate-100 flex items-center gap-1.5 mt-0.5">
            <MapPin className="h-3.5 w-3.5 text-muted-foreground shrink-0" />
            <span>{staff.workLocation || 'HQ - Victoria Island, Lagos'}</span>
          </p>
        </div>
      </div>
    </div>
  );
}
