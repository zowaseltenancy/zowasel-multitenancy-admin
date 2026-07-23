import { cn } from "@/lib/utils";
import { ProviderEnvironment } from "@/types/provider";

interface Props {
  environment: ProviderEnvironment;
}

const styles = {
  live:
    "bg-primary/10 text-primary",

  test:
    "bg-blue-100 text-blue-700",
};

export default function ProviderEnvironmentBadge({
  environment,
}: Props) {
  return (
    <span
      className={cn(
        "inline-flex rounded-full px-3 py-1 text-xs font-semibold uppercase",
        styles[environment]
      )}
    >
      {environment}
    </span>
  );
}