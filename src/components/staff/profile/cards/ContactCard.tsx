'use client';

import { Mail, Phone, MapPin, Send, Copy, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { StaffMember } from '@/types/staff';
import { useState } from 'react';
import { toast } from 'sonner';

interface ContactCardProps {
  staff: StaffMember;
  onSendMessage: () => void;
}

export function ContactCard({ staff, onSendMessage }: ContactCardProps) {
  const [copied, setCopied] = useState<string | null>(null);

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
              href={staff.phone ? `tel:${staff.phone}` : '#'}
              className="font-semibold text-slate-900 dark:text-slate-100 hover:text-[#00A651] transition-colors font-mono text-[11.5px]"
            >
              {staff.phone || '—'}
            </a>
            {staff.phone && (
              <button
                type="button"
                onClick={() => handleCopy(staff.phone, 'Phone Number')}
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

      {/* Action Button: Send Message */}
      <Button
        type="button"
        size="sm"
        onClick={onSendMessage}
        className="w-full h-8.5 bg-[#00A651] hover:bg-[#008C44] text-white font-semibold text-xs gap-1.5 shadow-xs cursor-pointer"
      >
        <Send className="h-3.5 w-3.5" /> Send Message
      </Button>
    </div>
  );
}
