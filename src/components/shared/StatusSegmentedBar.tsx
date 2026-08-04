import { cn } from "@/lib/utils";
import { statusDotClass, statusFillClass, StatusTone } from "@/lib/statusTone";

export interface StatusSegment {
  label: string;
  count: number;
  tone: StatusTone;
}

interface Props {
  segments: StatusSegment[];
  className?: string;
}

// A single stacked bar across fixed states (KYB pipeline, lead pipeline,
// campaign status) using the app-wide status tones — never a bespoke
// categorical palette for what is fundamentally a status distribution.
// Counts + labels always ship alongside the color (never color-alone).
export default function StatusSegmentedBar({ segments, className }: Props) {
  const total = segments.reduce((sum, segment) => sum + segment.count, 0);

  return (
    <div className={cn("space-y-3", className)}>
      <div className="flex h-3 w-full gap-0.5 overflow-hidden rounded-full bg-muted">
        {total === 0 ? (
          <div className="h-full w-full" />
        ) : (
          segments
            .filter((segment) => segment.count > 0)
            .map((segment) => (
              <div
                key={segment.label}
                className={cn("h-full", statusFillClass(segment.tone))}
                style={{ width: `${(segment.count / total) * 100}%` }}
                title={`${segment.label}: ${segment.count}`}
              />
            ))
        )}
      </div>

      <div className="flex flex-wrap gap-x-4 gap-y-1.5">
        {segments.map((segment) => (
          <div key={segment.label} className="flex items-center gap-1.5 text-xs">
            <span className={statusDotClass(segment.tone)} />
            <span className="text-muted-foreground">{segment.label}</span>
            <span className="font-semibold text-foreground">{segment.count}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
