import { UserCheck } from "lucide-react";

interface Props {
  onboardedByAgent?: { id: string; name: string };
  fallback?: string;
}

export default function OnboardedByCell({ onboardedByAgent, fallback = "—" }: Props) {
  if (!onboardedByAgent) {
    return <span className="text-xs text-muted-foreground">{fallback}</span>;
  }

  return (
    <div className="flex items-center gap-1.5 text-xs text-emerald-600 dark:text-emerald-400 font-medium">
      <UserCheck className="h-3.5 w-3.5" />
      <span>{onboardedByAgent.name}</span>
    </div>
  );
}
