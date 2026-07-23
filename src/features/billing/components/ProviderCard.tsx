import {
  Activity,
  Clock3,
  Globe,
} from "lucide-react";

import Link from "next/link";

import { Button, buttonVariants } from "@/components/ui/button";
import { Provider } from "@/types/provider";

import ProviderEnvironmentBadge from "./ProviderEnvironmentBadge";
import ProviderStatusBadge from "./ProviderStatusBadge";

interface ProviderCardProps {
  provider: Provider;

  onActivate: (
    provider: Provider
  ) => void;
}

export default function ProviderCard({
  provider,
  onActivate,
}: ProviderCardProps) {
  return (
    <div className="rounded-3xl border border-border bg-card p-6 shadow-sm transition-all hover:shadow-lg">
      <div className="flex items-start justify-between">
        <div>
          <h3 className="text-lg font-semibold">
            {provider.name}
          </h3>

          <p className="mt-1 text-sm text-muted-foreground">
            {provider.description}
          </p>
        </div>

        <ProviderEnvironmentBadge
          environment={provider.environment}
        />
      </div>

      <div className="mt-6">
        <ProviderStatusBadge
          status={provider.health}
        />
      </div>

      <div className="mt-6 space-y-4 text-sm">
        <div className="flex items-center justify-between">
          <span className="flex items-center gap-2 text-muted-foreground">
            <Activity className="h-4 w-4" />
            Response
          </span>

          <span className="font-medium">
            {provider.responseTime} ms
          </span>
        </div>

        <div className="flex items-center justify-between">
          <span className="flex items-center gap-2 text-muted-foreground">
            <Clock3 className="h-4 w-4" />
            Last Check
          </span>

          <span>{provider.lastHealthCheck}</span>
        </div>

        <div className="flex items-start justify-between">
          <span className="flex items-center gap-2 text-muted-foreground">
            <Globe className="mt-0.5 h-4 w-4" />
            Currencies
          </span>

          <span className="max-w-[180px] text-right text-xs">
            {provider.supportedCurrencies.join(", ")}
          </span>
        </div>
      </div>

      <div className="mt-8 border-t border-border pt-5">
        {provider.isActive ? (
          <div className="rounded-xl border border-primary/20 bg-primary/10 px-4 py-3 text-center text-sm font-semibold text-primary">
            ✓ Currently Serving Platform
          </div>
        ) : (
          <div className="flex items-center gap-2">
  {!provider.isActive && (
    <Button
      className="flex-1"
      onClick={() => onActivate(provider)}
    >
      Activate
    </Button>
  )}

  <Link
    href={`/admin/billing/providers/${provider.slug}`}
    className={buttonVariants({
      variant: "outline",
      className: provider.isActive ? "w-full" : "flex-1",
    })}
  >
    Manage
  </Link>
</div>
        )}
      </div>
    </div>
  );
}