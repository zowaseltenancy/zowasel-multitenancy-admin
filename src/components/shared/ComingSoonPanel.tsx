import { LucideIcon } from "lucide-react";

import { Card, CardContent } from "@/components/ui/card";

interface Props {
  icon: LucideIcon;

  title: string;

  description: string;
}

export default function ComingSoonPanel({
  icon: Icon,
  title,
  description,
}: Props) {
  return (
    <Card>
      <CardContent className="flex flex-col items-center justify-center gap-4 p-16 text-center">
        <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/10 text-primary">
          <Icon className="h-6 w-6" />
        </div>

        <div>
          <h3 className="text-lg font-semibold">
            {title}
          </h3>

          <p className="mt-2 max-w-md text-sm text-muted-foreground">
            {description}
          </p>
        </div>

        <span className="rounded-full border border-border bg-muted px-3 py-1 text-xs font-medium text-muted-foreground">
          Coming soon
        </span>
      </CardContent>
    </Card>
  );
}
