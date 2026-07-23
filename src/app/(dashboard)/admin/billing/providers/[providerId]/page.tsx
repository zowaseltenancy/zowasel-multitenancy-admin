import Link from "next/link";
import { notFound } from "next/navigation";

import { Button } from "@/components/ui/button";
import { providerService } from "@/features/billing/services/provider.service";
import ProviderEnvironmentBadge from "@/features/billing/components/ProviderEnvironmentBadge";
import { ProviderForm } from "@/features/billing/components/ProviderForm";
import { ProviderHealthBadge } from "@/features/billing/components/ProviderHealthBadge";
import ProviderStatusBadge from "@/features/billing/components/ProviderStatusBadge";

interface Props {
  params: Promise<{
    providerId: string;
  }>;
}

export default async function ProviderDetailsPage({
  params,
}: Props) {
  const { providerId } = await params;

  const provider =
    providerService.getProviderBySlug(providerId);

  if (!provider) {
    notFound();
  }

  return (
    <div className="space-y-6">
      <div className="rounded-xl border bg-card p-6">
        <div className="mb-6">
          <Link
            href="/admin/billing/providers"
            className="text-sm text-muted-foreground hover:text-foreground"
          >
            ← Back to Providers
          </Link>
        </div>

        <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
          <div>
            <h1 className="text-3xl font-semibold">
              {provider.name}
            </h1>

            <p className="mt-2 max-w-2xl text-muted-foreground">
              {provider.description}
            </p>

            <div className="mt-4 flex flex-wrap gap-2">
              <ProviderStatusBadge
                status={provider.health}
              />

              <ProviderEnvironmentBadge
                environment={provider.environment}
              />
            </div>
          </div>

          <div>
            {provider.isActive ? (
              <Button disabled>
                Currently Active
              </Button>
            ) : (
              <Button>
                Activate Provider
              </Button>
            )}
          </div>
        </div>
      </div>

      <ProviderForm provider={provider} />

      <ProviderHealthBadge provider={provider} />
    </div>
  );
}