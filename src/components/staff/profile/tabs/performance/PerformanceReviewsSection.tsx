'use client';

import { MessageSquare, Calendar } from 'lucide-react';
import { StaffPerformance } from '@/types/staff';

interface PerformanceReviewsSectionProps {
  reviews: StaffPerformance['reviews'];
}

export function PerformanceReviewsSection({ reviews }: PerformanceReviewsSectionProps) {
  return (
    <div className="border border-border/60 rounded-2xl bg-card p-5 sm:p-6 shadow-2xs space-y-4">
      <div className="flex items-center gap-2 pb-1 border-b border-border/40">
        <MessageSquare className="h-4 w-4 text-[#00A651]" />
        <h3 className="text-sm font-bold uppercase tracking-wider text-slate-900 dark:text-white">
          Supervisor Appraisals & Feedback History
        </h3>
      </div>

      <div className="space-y-3.5">
        {reviews.map((rev) => (
          <div
            key={rev.id}
            className="p-4 rounded-xl bg-muted/20 border border-border/60 space-y-2.5 text-xs"
          >
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1.5">
              <div>
                <span className="font-bold text-slate-900 dark:text-slate-100 text-sm">
                  {rev.period}
                </span>
                <p className="text-[11px] text-muted-foreground mt-0.5">Reviewed by {rev.reviewer}</p>
              </div>
              <div className="flex items-center gap-2">
                <span className="font-mono font-bold text-slate-800 dark:text-slate-200">
                  ★ {rev.rating} / 5.0
                </span>
                <span className="text-[11px] text-muted-foreground flex items-center gap-1">
                  <Calendar className="h-3 w-3" /> {rev.date}
                </span>
              </div>
            </div>

            <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed italic bg-card/60 p-3 rounded-lg border border-border/40">
              "{rev.feedback}"
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}