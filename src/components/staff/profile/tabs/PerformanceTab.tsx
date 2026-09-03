'use client';

import {
  TrendingUp,
  Target,
  Award,
  CheckCircle2,
  Clock,
  Star,
  MessageSquare,
  Calendar,
} from 'lucide-react';
import { StaffMember, StaffPerformance } from '@/types/staff';
import { Badge } from '@/components/ui/badge';

interface PerformanceTabProps {
  staff: StaffMember;
}

export function PerformanceTab({ staff }: PerformanceTabProps) {
  const defaultPerformance: StaffPerformance = {
    overallScore: 4.8,
    status: 'Exceeds Expectations',
    goals: [
      {
        id: 'g1',
        title: 'Cluster Farmer Biometric Onboarding (Q3)',
        target: '500 Verified Farmers in Ogun & Oyo State',
        progress: 88,
        status: 'in-progress',
      },
      {
        id: 'g2',
        title: 'CropPilot Data Integrity & Yield Audit',
        target: '100% ground check compliance on 45 grain warehouses',
        progress: 100,
        status: 'achieved',
      },
      {
        id: 'g3',
        title: 'Digital Agronomy Workshop Facilitation',
        target: 'Train 10 Lead Farmers on Weather-Indexed Farming',
        progress: 60,
        status: 'in-progress',
      },
    ],
    kpis: [
      {
        id: 'k1',
        name: 'Farmer Onboarding Accuracy',
        target: '95%',
        current: '98.4%',
        achievementRate: 103,
      },
      {
        id: 'k2',
        name: 'Field Audit Turnaround Time',
        target: '< 48 Hours',
        current: '26 Hours',
        achievementRate: 115,
      },
      {
        id: 'k3',
        name: 'Stakeholder Satisfaction Score',
        target: '4.5 / 5.0',
        current: '4.9 / 5.0',
        achievementRate: 108,
      },
    ],
    reviews: [
      {
        id: 'r1',
        period: 'Q2 2024 Performance Evaluation',
        reviewer: 'Dr. Chuka Eze (VP of Agronomy & Field Operations)',
        date: 'Jun 28, 2024',
        rating: 4.9,
        feedback:
          'John has shown exceptional leadership across the South-West grain corridor. His proactive engagement with cooperative leaders significantly accelerated CropPilot farmer verification while maintaining pristine data accuracy.',
      },
      {
        id: 'r2',
        period: 'Q1 2024 Quarterly Appraisal',
        reviewer: 'Amina Bello (Operations Director)',
        date: 'Mar 30, 2024',
        rating: 4.7,
        feedback:
          'Consistently meets and exceeds field operations benchmarks. Commendable adherence to safety protocols and outstanding reporting quality.',
      },
    ],
  };

  const perf = staff.performance || defaultPerformance;

  return (
    <div className="space-y-5">
      {/* 1. Overall Performance Score Header Banner */}
      <div className="border border-border/60 rounded-2xl bg-card p-5 sm:p-6 shadow-2xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="h-14 w-14 rounded-2xl bg-gradient-to-br from-emerald-500/20 to-teal-500/20 border border-emerald-500/30 flex items-center justify-center text-[#00A651] shrink-0 shadow-xs">
              <Award className="h-7 w-7" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-2xl font-extrabold text-slate-900 dark:text-white font-mono">
                  {perf.overallScore}
                </span>
                <span className="text-xs text-muted-foreground font-semibold">/ 5.0 Rating</span>
                <Badge
                  variant="outline"
                  className="ml-2 text-xs font-bold text-[#008C44] dark:text-[#00C862] border-[#00A651]/30 bg-[#00A651]/10"
                >
                  {perf.status}
                </Badge>
              </div>
              <p className="text-xs text-muted-foreground mt-0.5">
                Calculated across quarterly reviews, KPI achievement rates, and field supervisor ratings.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-1 text-amber-500">
            {[1, 2, 3, 4, 5].map((s) => (
              <Star
                key={s}
                className={`h-4 w-4 ${
                  s <= Math.floor(perf.overallScore) ? 'fill-amber-400 text-amber-400' : 'text-slate-300 dark:text-slate-700'
                }`}
              />
            ))}
          </div>
        </div>
      </div>

      {/* 2. Current Goals & Objectives */}
      <div className="border border-border/60 rounded-2xl bg-card p-5 sm:p-6 shadow-2xs space-y-4">
        <div className="flex items-center gap-2 pb-1 border-b border-border/40">
          <Target className="h-4 w-4 text-[#00A651]" />
          <h3 className="text-sm font-bold uppercase tracking-wider text-slate-900 dark:text-white">
            Current Goals & Strategic Objectives
          </h3>
        </div>

        <div className="space-y-3">
          {perf.goals.map((goal) => (
            <div
              key={goal.id}
              className="p-3.5 rounded-xl bg-muted/20 border border-border/60 space-y-2"
            >
              <div className="flex items-center justify-between gap-2">
                <span className="font-bold text-xs sm:text-sm text-slate-900 dark:text-slate-100">
                  {goal.title}
                </span>
                <Badge
                  variant="outline"
                  className={`text-[10px] capitalize font-semibold ${
                    goal.status === 'achieved'
                      ? 'text-[#008C44] dark:text-[#00C862] border-[#00A651]/30 bg-[#00A651]/10'
                      : 'text-blue-600 dark:text-blue-400 border-blue-500/30 bg-blue-500/10'
                  }`}
                >
                  {goal.status}
                </Badge>
              </div>

              <p className="text-xs text-muted-foreground">{goal.target}</p>

              {/* Progress Bar */}
              <div className="space-y-1 pt-1">
                <div className="flex items-center justify-between text-[11px] font-mono text-muted-foreground">
                  <span>Progress</span>
                  <span className="font-bold text-slate-800 dark:text-slate-200">{goal.progress}%</span>
                </div>
                <div className="w-full bg-muted rounded-full h-1.5 overflow-hidden">
                  <div
                    className="bg-[#00A651] h-full rounded-full transition-all duration-300"
                    style={{ width: `${goal.progress}%` }}
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 3. Core Key Performance Indicators (KPIs) */}
      <div className="border border-border/60 rounded-2xl bg-card p-5 sm:p-6 shadow-2xs space-y-4">
        <div className="flex items-center gap-2 pb-1 border-b border-border/40">
          <TrendingUp className="h-4 w-4 text-[#00A651]" />
          <h3 className="text-sm font-bold uppercase tracking-wider text-slate-900 dark:text-white">
            Core Key Performance Indicators (KPIs)
          </h3>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
          {perf.kpis.map((kpi) => (
            <div
              key={kpi.id}
              className="p-4 rounded-xl bg-muted/20 border border-border/60 space-y-2 text-xs"
            >
              <span className="font-semibold text-slate-900 dark:text-slate-100 block truncate">
                {kpi.name}
              </span>
              <div className="flex items-baseline justify-between pt-1">
                <div>
                  <span className="text-[10px] text-muted-foreground block">Actual / Current</span>
                  <p className="text-base font-extrabold text-slate-900 dark:text-white font-mono">
                    {kpi.current}
                  </p>
                </div>
                <div className="text-right">
                  <span className="text-[10px] text-muted-foreground block">Target</span>
                  <p className="text-xs font-semibold text-slate-600 dark:text-slate-300 font-mono">
                    {kpi.target}
                  </p>
                </div>
              </div>

              <div className="pt-2 border-t border-border/40 flex items-center justify-between text-[10.5px]">
                <span className="text-muted-foreground">Achievement Rate:</span>
                <span className="font-bold text-[#008C44] dark:text-[#00C862] font-mono">
                  {kpi.achievementRate}%
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 4. Manager Appraisals & Feedback History */}
      <div className="border border-border/60 rounded-2xl bg-card p-5 sm:p-6 shadow-2xs space-y-4">
        <div className="flex items-center gap-2 pb-1 border-b border-border/40">
          <MessageSquare className="h-4 w-4 text-[#00A651]" />
          <h3 className="text-sm font-bold uppercase tracking-wider text-slate-900 dark:text-white">
            Supervisor Appraisals & Feedback History
          </h3>
        </div>

        <div className="space-y-3.5">
          {perf.reviews.map((rev) => (
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
    </div>
  );
}
