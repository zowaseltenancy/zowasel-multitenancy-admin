import { cn } from "@/lib/utils";
import GenderIcon from "./GenderIcon";

interface Props {
  gender?: "male" | "female" | "other";
  className?: string;
}

const GENDER_LABELS: Record<"male" | "female" | "other", string> = {
  male: "Male",
  female: "Female",
  other: "Other",
};

// Blue for male, pink for female — a deliberate, consistent convention across
// every table/card that surfaces gender, so it's spottable at a glance.
const GENDER_BADGE_CLASS: Record<"male" | "female" | "other", string> = {
  male: "bg-blue-500/10 text-blue-600 border-blue-500/20 dark:text-blue-400",
  female: "bg-pink-500/10 text-pink-600 border-pink-500/20 dark:text-pink-400",
  other: "bg-muted text-muted-foreground border-border",
};

export default function GenderBadge({ gender, className }: Props) {
  if (!gender) return null;

  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide",
        GENDER_BADGE_CLASS[gender],
        className
      )}
    >
      <GenderIcon gender={gender} className="h-3 w-3" />
      {GENDER_LABELS[gender]}
    </span>
  );
}
