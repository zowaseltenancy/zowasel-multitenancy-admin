'use client';

import { StaffMember } from '@/types/staff';
import { PersonalDemographicsSection } from './personal/PersonalDemographicsSection';
import { EducationPayrollSection } from './personal/EducationPayrollSection';

interface PersonalTabProps {
  staff: StaffMember;
}

export function PersonalTab({ staff }: PersonalTabProps) {
  const formatDate = (dateStr?: string) => {
    if (!dateStr) return '—';
    try {
      return new Date(dateStr).toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
      });
    } catch {
      return dateStr;
    }
  };

  return (
    <div className="border border-border/60 rounded-2xl bg-card overflow-hidden shadow-2xs divide-y divide-border/60">
      <PersonalDemographicsSection staff={staff} formatDate={formatDate} />
      <EducationPayrollSection staff={staff} />
    </div>
  );
}
