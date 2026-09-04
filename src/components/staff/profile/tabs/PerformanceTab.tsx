'use client';

import { StaffMember } from '@/types/staff';
import { defaultPerformance } from './performance/performanceConstants';
import { PerformanceScoreBanner } from './performance/PerformanceScoreBanner';
import { PerformanceGoalsSection } from './performance/PerformanceGoalsSection';
import { PerformanceKpiSection } from './performance/PerformanceKpiSection';
import { PerformanceReviewsSection } from './performance/PerformanceReviewsSection';

interface PerformanceTabProps {
  staff: StaffMember;
}

export function PerformanceTab({ staff }: PerformanceTabProps) {
  const perf = staff.performance || defaultPerformance;

  return (
    <div className="space-y-5">
      <PerformanceScoreBanner perf={perf} />
      <PerformanceGoalsSection goals={perf.goals} />
      <PerformanceKpiSection kpis={perf.kpis} />
      <PerformanceReviewsSection reviews={perf.reviews} />
    </div>
  );
}
