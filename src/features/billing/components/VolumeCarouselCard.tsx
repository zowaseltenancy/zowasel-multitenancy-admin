"use client";

import { useState, useEffect } from "react";
import { ChevronLeft, ChevronRight, TrendingUp, TrendingDown, Clock, Calendar } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { PeriodComparison } from "../utils/transaction";

interface Props {
  dayComparison: PeriodComparison;
  weekComparison: PeriodComparison;
  monthComparison: PeriodComparison;
  yearComparison: PeriodComparison;
}

export default function VolumeCarouselCard({
  dayComparison,
  weekComparison,
  monthComparison,
  yearComparison,
}: Props) {
  const slides = [
    { label: "Today", comparisonLabel: "yesterday", comparison: dayComparison },
    { label: "This Week", comparisonLabel: "last week", comparison: weekComparison },
    { label: "This Month", comparisonLabel: "last month", comparison: monthComparison },
    { label: "This Year", comparisonLabel: "last year", comparison: yearComparison },
  ];

  const [currentIndex, setCurrentIndex] = useState(0);

  // Auto-rotate slide every 10 seconds
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % slides.length);
    }, 10000);

    return () => clearInterval(timer);
  }, [slides.length]);

  const nextSlide = () => setCurrentIndex((prev) => (prev + 1) % slides.length);
  const prevSlide = () => setCurrentIndex((prev) => (prev - 1 + slides.length) % slides.length);

  const activeSlide = slides[currentIndex];
  const isPositive = activeSlide.comparison.absoluteChange >= 0;

  return (
    <Card className="h-full flex flex-col justify-between border border-border bg-card shadow-xs overflow-hidden">
      <CardContent className="p-6 flex flex-col justify-between h-full space-y-6">
        {/* Header Controls */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Calendar className="h-4 w-4 text-primary" />
            <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Volume Overview</span>
          </div>

          <div className="flex items-center gap-1">
            <Button variant="ghost" size="icon" className="h-7 w-7 cursor-pointer" onClick={prevSlide}>
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <span className="text-xs font-mono font-medium text-muted-foreground">{currentIndex + 1}/4</span>
            <Button variant="ghost" size="icon" className="h-7 w-7 cursor-pointer" onClick={nextSlide}>
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Slide Selector Tabs */}
        <div className="grid grid-cols-4 gap-1 p-1 bg-muted/40 rounded-xl">
          {slides.map((s, idx) => (
            <button
              key={s.label}
              type="button"
              onClick={() => setCurrentIndex(idx)}
              className={cn(
                "py-1.5 text-xs font-semibold rounded-lg transition-all cursor-pointer text-center truncate",
                currentIndex === idx
                  ? "bg-card text-foreground shadow-2xs"
                  : "text-muted-foreground hover:text-foreground"
              )}
            >
              {s.label}
            </button>
          ))}
        </div>

        {/* Main Content Display */}
        <div className="space-y-3 py-2">
          <div className="flex items-baseline justify-between">
            <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">{activeSlide.label} Volume</p>
            <span className="text-xs text-muted-foreground font-mono flex items-center gap-1">
              <Clock className="h-3 w-3 text-amber-500" /> Auto-rotates 10s
            </span>
          </div>

          <h3 className="text-4xl font-extrabold font-mono tracking-tight text-foreground">
            {activeSlide.comparison.currentVolume.toLocaleString()} <span className="text-sm font-sans text-muted-foreground font-normal">txns</span>
          </h3>

          {activeSlide.comparison.percentChange === null ? (
            <p className="text-xs text-muted-foreground">No {activeSlide.comparisonLabel} data to compare against.</p>
          ) : (
            <div
              className={cn(
                "flex items-center gap-1.5 text-sm font-semibold p-2.5 rounded-xl border",
                isPositive
                  ? "bg-emerald-500/10 text-emerald-600 border-emerald-500/20"
                  : "bg-red-500/10 text-destructive border-red-500/20"
              )}
            >
              {isPositive ? <TrendingUp className="h-4 w-4 shrink-0" /> : <TrendingDown className="h-4 w-4 shrink-0" />}
              <span>
                {isPositive ? "+" : ""}
                {activeSlide.comparison.percentChange.toFixed(1)}%
              </span>
              <span className="text-muted-foreground font-normal">
                ({isPositive ? "+" : ""}
                {activeSlide.comparison.absoluteChange.toLocaleString()} vs {activeSlide.comparisonLabel})
              </span>
            </div>
          )}
        </div>

        {/* Carousel Indicator Dots */}
        <div className="flex items-center justify-center gap-1.5 pt-2">
          {slides.map((_, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => setCurrentIndex(idx)}
              className={cn(
                "h-1.5 rounded-full transition-all cursor-pointer",
                currentIndex === idx ? "w-6 bg-primary" : "w-1.5 bg-muted-foreground/30 hover:bg-muted-foreground/50"
              )}
            />
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
