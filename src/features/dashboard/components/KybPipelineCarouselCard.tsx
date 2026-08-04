"use client";

import { useState, useEffect } from "react";
import { FileCheck, ChevronLeft, ChevronRight, Clock } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Organization } from "@/types/organization";
import { KybStatus } from "@/types/kyb";

interface Props {
  organizations: Organization[];
  isExpanded?: boolean;
}

const STATUSES: { key: KybStatus; label: string; tone: "neutral" | "warning" | "success" | "danger" }[] = [
  { key: "not_submitted", label: "Not Submitted", tone: "neutral" },
  { key: "pending", label: "Pending Review", tone: "warning" },
  { key: "approved", label: "Approved", tone: "success" },
  { key: "rejected", label: "Rejected", tone: "danger" },
];

const TONE_CLASSES = {
  neutral: "bg-muted text-muted-foreground border-border",
  warning: "bg-amber-500/10 text-amber-600 border-amber-500/20 dark:text-amber-400",
  success: "bg-emerald-500/10 text-emerald-600 border-emerald-500/20 dark:text-emerald-400",
  danger: "bg-rose-500/10 text-rose-600 border-rose-500/20 dark:text-rose-400",
};

export default function KybPipelineCarouselCard({ organizations, isExpanded = false }: Props) {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    if (!isExpanded) return;
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % STATUSES.length);
    }, 10000);

    return () => clearInterval(timer);
  }, [isExpanded]);

  const active = STATUSES[currentIndex];
  const activeCount = organizations.filter((o) => o.kybStatus === active.key).length;
  const totalCount = organizations.length;
  const percentage = totalCount > 0 ? Math.round((activeCount / totalCount) * 100) : 0;
  const pendingCount = organizations.filter((o) => o.kybStatus === "pending").length;

  const nextSlide = (e: React.MouseEvent) => {
    e.stopPropagation();
    setCurrentIndex((prev) => (prev + 1) % STATUSES.length);
  };
  const prevSlide = (e: React.MouseEvent) => {
    e.stopPropagation();
    setCurrentIndex((prev) => (prev - 1 + STATUSES.length) % STATUSES.length);
  };

  // SUMMARY VIEW (Landing 8-Card Grid)
  if (!isExpanded) {
    return (
      <Card className="h-[210px] flex flex-col justify-between border shadow-2xs bg-card overflow-hidden transition-all duration-200">
        <CardContent className="p-4 flex flex-col justify-between h-full space-y-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-amber-500/10 text-amber-600 dark:text-amber-400">
                <FileCheck className="h-4 w-4" />
              </div>
              <div>
                <p className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground leading-none">
                  KYB Pipeline
                </p>
              </div>
            </div>
            <span className="inline-flex items-center gap-1 rounded-full bg-amber-500/10 px-2 py-0.5 text-[10px] font-bold text-amber-600 border border-amber-500/20">
              <Clock className="h-3 w-3" /> 3.2d SLA
            </span>
          </div>

          <div className="grid grid-cols-2 gap-2 pt-1">
            <div className="p-2.5 rounded-lg border bg-amber-500/5 border-amber-500/20">
              <p className="text-[10px] font-bold uppercase text-muted-foreground">Pending Review</p>
              <p className="text-2xl font-extrabold text-amber-600 mt-0.5">{pendingCount}</p>
            </div>
            <div className="p-2.5 rounded-lg border bg-muted/30">
              <p className="text-[10px] font-bold uppercase text-muted-foreground">Total Ingested</p>
              <p className="text-2xl font-extrabold text-foreground mt-0.5">{totalCount}</p>
            </div>
          </div>

          <div className="flex items-center justify-between text-[10px] font-semibold text-muted-foreground pt-1 border-t">
            <span>Approved: {organizations.filter(o => o.kybStatus === 'approved').length}</span>
            <span>&bull;</span>
            <span>Pending: {pendingCount}</span>
            <span>&bull;</span>
            <span>Rejected: {organizations.filter(o => o.kybStatus === 'rejected').length}</span>
          </div>
        </CardContent>
      </Card>
    );
  }

  // EXPANDED VIEW
  return (
    <Card className="min-h-[360px] flex flex-col justify-between border shadow-md bg-card overflow-hidden">
      <CardContent className="p-6 flex flex-col justify-between h-full space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-500/10 text-amber-600 dark:text-amber-400">
              <FileCheck className="h-5 w-5" />
            </div>
            <div>
              <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                KYB Verification Pipeline & Approval SLA
              </p>
              <h3 className="text-2xl font-extrabold text-foreground">{totalCount} Applications Processed</h3>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" className="h-8 text-xs font-bold cursor-pointer" onClick={prevSlide}>
              <ChevronLeft className="h-4 w-4 mr-1" /> Previous Status
            </Button>
            <span className="text-xs font-mono font-bold text-muted-foreground px-2">
              {currentIndex + 1} / {STATUSES.length}
            </span>
            <Button variant="outline" size="sm" className="h-8 text-xs font-bold cursor-pointer" onClick={nextSlide}>
              Next Status <ChevronRight className="h-4 w-4 ml-1" />
            </Button>
          </div>
        </div>

        <div className="w-full flex items-center gap-2 p-1.5 bg-muted/60 rounded-xl">
          {STATUSES.map((s, idx) => (
            <button
              key={s.key}
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                setCurrentIndex(idx);
              }}
              className={cn(
                "flex-1 py-2 px-3 text-xs font-bold rounded-lg transition-all cursor-pointer text-center",
                currentIndex === idx
                  ? "bg-primary text-primary-foreground shadow-xs"
                  : "text-foreground hover:bg-card"
              )}
            >
              {s.label}
            </button>
          ))}
        </div>

        <div className="grid grid-cols-3 gap-4 p-4 border rounded-xl bg-muted/20">
          <div>
            <span className={cn("inline-flex items-center rounded-md px-2 py-0.5 text-xs font-extrabold border mb-1", TONE_CLASSES[active.tone])}>
              {active.label}
            </span>
            <p className="text-3xl font-black text-foreground mt-1">{activeCount}</p>
            <p className="text-xs font-bold text-muted-foreground">Applications</p>
          </div>

          <div>
            <p className="text-xs font-bold uppercase text-muted-foreground">Ratio of Total</p>
            <p className="text-3xl font-black text-amber-600 mt-1">{percentage}%</p>
            <p className="text-xs font-bold text-muted-foreground">Of Total Submissions</p>
          </div>

          <div>
            <p className="text-xs font-bold uppercase text-muted-foreground">Turnaround Speed</p>
            <p className="text-3xl font-black text-emerald-600 mt-1">3.2 Days</p>
            <p className="text-xs font-bold text-muted-foreground">Average SLA</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
