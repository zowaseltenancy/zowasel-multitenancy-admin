import React from "react";
import { cn } from "@/lib/utils";

export interface DetailFieldProps {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  value?: string | number | null;
  iconClassName?: string;
  className?: string;
}

export default function DetailField({
  icon: Icon,
  label,
  value,
  iconClassName = "bg-muted/80 text-muted-foreground border-border/40",
  className,
}: DetailFieldProps) {
  const displayValue =
    value !== undefined && value !== null && String(value).trim() !== ""
      ? String(value)
      : "—";

  return (
    <div className={cn("flex items-start gap-3", className)}>
      <div
        className={cn(
          "flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border",
          iconClassName
        )}
      >
        <Icon className="h-4 w-4" />
      </div>
      <div className="min-w-0 flex-1">
        <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
          {label}
        </p>
        <p className="mt-0.5 font-medium text-foreground break-words">
          {displayValue}
        </p>
      </div>
    </div>
  );
}
