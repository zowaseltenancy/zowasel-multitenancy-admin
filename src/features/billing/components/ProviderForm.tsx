import { Provider } from "@/types/provider";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

interface ProviderFormProps {
  provider: Provider;
}

export function ProviderForm({
  provider,
}: ProviderFormProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Provider Information</CardTitle>
      </CardHeader>

      <CardContent className="grid gap-6 md:grid-cols-2">
        <div>
          <p className="text-sm text-muted-foreground">
            Provider Name
          </p>
          <p className="mt-1 font-medium">
            {provider.name}
          </p>
        </div>

        <div>
          <p className="text-sm text-muted-foreground">
            Category
          </p>
          <p className="mt-1 font-medium capitalize">
            {provider.category}
          </p>
        </div>

        <div>
          <p className="text-sm text-muted-foreground">
            Slug
          </p>
          <p className="mt-1 font-medium">
            {provider.slug}
          </p>
        </div>

        <div>
          <p className="text-sm text-muted-foreground">
            Environment
          </p>
          <p className="mt-1 font-medium uppercase">
            {provider.environment}
          </p>
        </div>
      </CardContent>
    </Card>
  );
}