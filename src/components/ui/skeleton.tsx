import { cn } from "@/lib/utils";

/** Neutral shimmer block. Size it with className at the call site. */
export function Skeleton({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      // aria-hidden: the loading state is announced by the region's own
      // aria-busy, so screen readers should not walk the placeholder bars.
      aria-hidden
      className={cn("animate-pulse rounded-md bg-muted", className)}
      {...props}
    />
  );
}

export default Skeleton;
