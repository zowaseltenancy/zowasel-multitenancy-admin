"use client";

import { Info } from "lucide-react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";

interface PageHeaderInfoProps {
  description: React.ReactNode;
  title?: string;
  className?: string;
}

export default function PageHeaderInfo({ description, title = "Overview & Scope", className = "" }: PageHeaderInfoProps) {
  return (
    <Popover>
      <PopoverTrigger
        aria-label="View page information"
        className={`inline-flex items-center justify-center rounded-full p-1 text-muted-foreground hover:text-primary hover:bg-primary/10 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-primary ${className}`}
      >
        <Info className="h-4 w-4" />
      </PopoverTrigger>
      <PopoverContent align="start" className="w-80 sm:w-96 p-4 shadow-xl border border-border bg-card">
        <div className="space-y-2">
          <div className="flex items-center gap-1.5 border-b pb-2">
            <Info className="h-4 w-4 text-primary shrink-0" />
            <h4 className="text-xs font-bold uppercase tracking-wider text-foreground">{title}</h4>
          </div>
          <div className="text-xs leading-relaxed text-muted-foreground font-medium">
            {description}
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
}
