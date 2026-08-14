"use client";

import { useState, useMemo, useEffect } from "react";
import { UserCheck, ChevronLeft, ChevronRight, ShieldCheck } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { cn, formatCompactMetric } from "@/lib/utils";
import { PlatformUser } from "@/types/user";
import GenderIcon from "@/components/shared/GenderIcon";

interface Props {
  users: PlatformUser[];
  isExpanded?: boolean;
}

export default function StaffCarouselCard({ users, isExpanded = false }: Props) {
  const [currentIndex, setCurrentIndex] = useState(0);

  const staffUsers = useMemo(() => users.filter((u) => u.userCategory === "staff"), [users]);

  const departments = useMemo(() => {
    const list = Array.from(new Set(staffUsers.map((s) => s.department).filter(Boolean))) as string[];
    return list.length > 0 ? list : ["Executive", "Engineering", "Operations", "Compliance"];
  }, [staffUsers]);

  useEffect(() => {
    if (!isExpanded) return;
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % departments.length);
    }, 10000);

    return () => clearInterval(timer);
  }, [departments.length, isExpanded]);

  const activeDepartment = departments[currentIndex] || "Executive";

  const departmentUsers = useMemo(
    () => staffUsers.filter((s) => s.department === activeDepartment),
    [staffUsers, activeDepartment]
  );

  const maleCount = departmentUsers.filter((u) => u.gender === "male").length;
  const femaleCount = departmentUsers.filter((u) => u.gender === "female").length;

  const nextSlide = (e: React.MouseEvent) => {
    e.stopPropagation();
    setCurrentIndex((prev) => (prev + 1) % departments.length);
  };
  const prevSlide = (e: React.MouseEvent) => {
    e.stopPropagation();
    setCurrentIndex((prev) => (prev - 1 + departments.length) % departments.length);
  };

  // SUMMARY VIEW (Landing 8-Card Grid)
  if (!isExpanded) {
    return (
      <Card className="h-full min-h-[210px] flex flex-col justify-between border shadow-2xs bg-card overflow-hidden">
        <CardContent className="p-3.5 sm:p-4 flex flex-col justify-between h-full space-y-2.5">
          <div className="flex items-center justify-between gap-1.5 min-w-0">
            <div className="flex items-center gap-2 min-w-0">
              <div className="flex h-7 w-7 sm:h-8 sm:w-8 items-center justify-center rounded-xl bg-slate-500/15 text-slate-700 dark:text-slate-300 shrink-0">
                <UserCheck className="h-4 w-4" />
              </div>
              <p className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground leading-none truncate">
                Zowasel Staff
              </p>
            </div>
            <span className="inline-flex items-center gap-1 rounded-full bg-slate-500/10 px-2 py-0.5 text-[10px] font-bold text-slate-600 border border-slate-500/20 shrink-0 whitespace-nowrap">
              <ShieldCheck className="h-3 w-3" /> 100% Assigned
            </span>
          </div>

          <div className="grid grid-cols-2 gap-2 min-w-0">
            <div className="p-2.5 rounded-lg border bg-slate-500/5 border-slate-500/20 min-w-0 overflow-hidden" title={`${staffUsers.length.toLocaleString()}`}>
              <p className="text-[10px] font-bold uppercase text-muted-foreground truncate">Total Staff</p>
              <p className="text-xl sm:text-2xl font-extrabold text-foreground mt-0.5 truncate tracking-tight tabular-nums">{formatCompactMetric(staffUsers.length)}</p>
            </div>
            <div className="p-2.5 rounded-lg border bg-muted/30 min-w-0 overflow-hidden" title={`${departments.length.toLocaleString()}`}>
              <p className="text-[10px] font-bold uppercase text-muted-foreground truncate">Departments</p>
              <p className="text-xl sm:text-2xl font-extrabold text-indigo-600 mt-0.5 truncate tracking-tight tabular-nums">{formatCompactMetric(departments.length)}</p>
            </div>
          </div>

          <div className="flex items-center justify-between text-[10px] font-semibold text-muted-foreground pt-1.5 border-t border-border/60 min-w-0 overflow-hidden">
            <span className="truncate" title="Regional Operations">Regional Ops ({formatCompactMetric(staffUsers.filter(s => s.department === 'Regional Operations').length)})</span>
            <span className="shrink-0 mx-1">&bull;</span>
            <span className="truncate" title="Technology">Tech ({formatCompactMetric(staffUsers.filter(s => s.department === 'Technology').length)})</span>
            <span className="shrink-0 mx-1">&bull;</span>
            <span className="truncate" title="Executive">Exec ({formatCompactMetric(staffUsers.filter(s => s.department === 'Executive').length)})</span>
          </div>
        </CardContent>
      </Card>
    );
  }

  // EXPANDED VIEW
  return (
    <Card className="min-h-[360px] flex flex-col justify-between border shadow-md bg-card overflow-hidden">
      <CardContent className="p-4 sm:p-6 flex flex-col justify-between h-full space-y-4 sm:space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-3 min-w-0">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-500/15 text-slate-700 dark:text-slate-300 shrink-0">
              <UserCheck className="h-5 w-5" />
            </div>
            <div className="min-w-0">
              <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground truncate">
                Zowasel Internal Staff Directory & Department Roles
              </p>
              <h3 className="text-xl sm:text-2xl font-extrabold text-foreground truncate">{staffUsers.length.toLocaleString()} Internal Team Members</h3>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <Button variant="outline" size="sm" className="h-8 text-xs font-bold cursor-pointer" onClick={prevSlide}>
              <ChevronLeft className="h-4 w-4 mr-1" /> Previous Dept
            </Button>
            <span className="text-xs font-mono font-bold text-muted-foreground px-2">
              {currentIndex + 1} / {departments.length}
            </span>
            <Button variant="outline" size="sm" className="h-8 text-xs font-bold cursor-pointer" onClick={nextSlide}>
              Next Dept <ChevronRight className="h-4 w-4 ml-1" />
            </Button>
          </div>
        </div>

        <div className="w-full flex flex-wrap sm:flex-nowrap items-center gap-1.5 sm:gap-2 p-1.5 bg-muted/60 rounded-xl overflow-x-auto">
          {departments.map((dept, idx) => (
            <button
              key={dept}
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                setCurrentIndex(idx);
              }}
              className={cn(
                "flex-1 min-w-[90px] py-2 px-3 text-xs font-bold rounded-lg transition-all cursor-pointer text-center whitespace-nowrap",
                currentIndex === idx
                  ? "bg-primary text-primary-foreground shadow-xs"
                  : "text-foreground hover:bg-card"
              )}
            >
              {dept}
            </button>
          ))}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4 p-4 border rounded-xl bg-muted/20">
          <div className="flex flex-col justify-center items-center text-center p-3 rounded-lg border bg-card min-w-0 overflow-hidden">
            <p className="text-2xl sm:text-3xl font-black text-foreground truncate">{departmentUsers.length.toLocaleString()}</p>
            <p className="text-xs font-bold text-muted-foreground mt-1 truncate">Total {activeDepartment} Staff</p>
          </div>

          <div className="flex flex-col justify-center items-center text-center p-3 rounded-lg border border-sky-500/30 bg-sky-500/10 min-w-0 overflow-hidden">
            <div className="flex items-center gap-1.5">
              <GenderIcon gender="male" className="h-5 w-5 shrink-0" />
              <span className="text-2xl sm:text-3xl font-black text-sky-700 dark:text-sky-300 truncate">{maleCount.toLocaleString()}</span>
            </div>
            <p className="text-xs font-bold text-sky-800 dark:text-sky-200 mt-1 truncate">Male Staff</p>
          </div>

          <div className="flex flex-col justify-center items-center text-center p-3 rounded-lg border border-pink-500/30 bg-pink-500/10 min-w-0 overflow-hidden">
            <div className="flex items-center gap-1.5">
              <GenderIcon gender="female" className="h-5 w-5 shrink-0" />
              <span className="text-2xl sm:text-3xl font-black text-pink-700 dark:text-pink-300 truncate">{femaleCount.toLocaleString()}</span>
            </div>
            <p className="text-xs font-bold text-pink-800 dark:text-pink-200 mt-1 truncate">Female Staff</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
