'use client';

import { useState } from 'react';
import { Mail, Phone, Copy, Check } from 'lucide-react';
import { StaffMember } from '@/types/staff';
import { toast } from 'sonner';

interface StaffQuickContactMetaProps {
  staff: StaffMember;
}

export function StaffQuickContactMeta({ staff }: StaffQuickContactMetaProps) {
  const [copiedField, setCopiedField] = useState<string | null>(null);

  const handleCopy = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    setCopiedField(label);
    toast.success(`Copied ${label} to clipboard`);
    setTimeout(() => setCopiedField(null), 2000);
  };

  return (
    <div className="flex flex-wrap items-center gap-3 sm:gap-4 text-xs text-muted-foreground pt-0.5">
      <button
        type="button"
        onClick={() => handleCopy(staff.id, 'Staff ID')}
        className="inline-flex items-center gap-1 font-mono text-[11px] hover:text-foreground transition-colors cursor-pointer"
      >
        <span className="text-[10px] text-muted-foreground/80 font-sans">ID:</span>
        <span className="font-semibold text-slate-800 dark:text-slate-200">{staff.id}</span>
        {copiedField === 'Staff ID' ? (
          <Check className="h-3 w-3 text-[#00A651]" />
        ) : (
          <Copy className="h-3 w-3 opacity-50" />
        )}
      </button>

      <button
        type="button"
        onClick={() => handleCopy(staff.email, 'Email')}
        className="inline-flex items-center gap-1 hover:text-foreground transition-colors cursor-pointer"
      >
        <Mail className="h-3.5 w-3.5 text-muted-foreground" />
        <span>{staff.email}</span>
        {copiedField === 'Email' && <Check className="h-3 w-3 text-[#00A651]" />}
      </button>

      {(staff.mobilenumber || staff.phone) && (
        <a
          href={`tel:${staff.mobilenumber || staff.phone}`}
          className="inline-flex items-center gap-1 hover:text-foreground transition-colors"
        >
          <Phone className="h-3.5 w-3.5 text-muted-foreground" />
          <span>{staff.mobilenumber || staff.phone}</span>
        </a>
      )}
    </div>
  );
}