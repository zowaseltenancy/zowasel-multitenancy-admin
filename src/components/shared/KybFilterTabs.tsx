import { cn } from "@/lib/utils";
import { KybStatus } from "@/types/kyb";
import { KYB_STATUS_FILTERS } from "@/constants/kyb";

interface Props {
  value: KybStatus | "all";

  onChange: (value: KybStatus | "all") => void;

  counts?: Partial<
    Record<KybStatus | "all", number>
  >;
}

export default function KybFilterTabs({
  value,
  onChange,
  counts,
}: Props) {
  return (
    <div className="flex flex-wrap gap-2 border-b border-border pb-3">
      {KYB_STATUS_FILTERS.map((filter) => {
        const isActive = filter.value === value;

        return (
          <button
            key={filter.value}
            type="button"
            onClick={() => onChange(filter.value)}
            className={cn(
              "rounded-full px-4 py-2 text-sm font-medium transition-colors",
              isActive
                ? "bg-primary text-primary-foreground"
                : "bg-muted text-muted-foreground hover:bg-muted/70"
            )}
          >
            {filter.label}

            {counts?.[filter.value] !== undefined && (
              <span
                className={cn(
                  "ml-2 text-xs",
                  isActive
                    ? "text-primary-foreground/80"
                    : "text-muted-foreground/70"
                )}
              >
                {counts[filter.value]}
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
}
