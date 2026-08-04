import { cn } from "@/lib/utils";

export interface CategoryChip {
  label: string;
  count: number;
  colorClass: string;
}

interface Props {
  items: CategoryChip[];
  className?: string;
}

// A fixed-order categorical breakdown (entity type, department, channel) —
// small chips rather than a chart, since these run 4-9 categories at a size
// where a legend-less chart would be harder to read than direct labels.
export default function CategoryChipRow({ items, className }: Props) {
  return (
    <div className={cn("flex flex-wrap gap-2", className)}>
      {items.map((item) => (
        <span
          key={item.label}
          className="inline-flex items-center gap-1.5 rounded-full border border-border bg-card px-2.5 py-1 text-xs font-medium text-muted-foreground"
        >
          <span className={cn("h-2 w-2 shrink-0 rounded-full", item.colorClass)} />
          {item.label}
          <span className="font-semibold text-foreground">{item.count}</span>
        </span>
      ))}
    </div>
  );
}
