import { Provider } from "@/types/provider";

import ProviderCard from "./ProviderCard";

interface ProviderGridProps {
  title: string;

  description: string;

  providers: Provider[];

  onToggle: (provider: Provider) => void;
}

export default function ProviderGrid({
  title,
  description,
  providers,
  onToggle,
}: ProviderGridProps) {
  return (
    <section className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold">
          {title}
        </h2>

        <p className="mt-2 text-muted-foreground">
          {description}
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-2 xl:grid-cols-3">
        {providers.map((provider) => (
          <ProviderCard
            key={provider.id}
            provider={provider}
            onToggle={onToggle}
          />
        ))}
      </div>
    </section>
  );
}
