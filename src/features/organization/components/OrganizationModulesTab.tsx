import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Organization } from "@/types/organization";

interface Props {
  organization: Organization;
}

const billingStateStyles: Record<string, string> = {
  free: "bg-slate-100 text-slate-700 border-slate-200",
  paid: "bg-green-100 text-green-700 border-green-200",
  expired: "bg-red-100 text-red-700 border-red-200",
};

export default function OrganizationModulesTab({
  organization,
}: Props) {
  if (organization.subscriptions.length === 0) {
    return (
      <Card className="flex min-h-[160px] items-center justify-center p-6 text-sm text-muted-foreground">
        No app subscriptions yet.
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {organization.subscriptions.map(
        (subscription) => (
          <Card key={subscription.app}>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="capitalize">
                {subscription.app}
              </CardTitle>

              <span
                className={`inline-flex rounded-full border px-3 py-1 text-xs font-medium capitalize ${billingStateStyles[subscription.billingState]}`}
              >
                {subscription.billingState}
              </span>
            </CardHeader>

            <CardContent className="space-y-4">
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">
                  Plan
                </span>

                <span className="font-medium">
                  {subscription.plan}
                </span>
              </div>

              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">
                  Renews
                </span>

                <span>
                  {subscription.renewsAt
                    ? new Date(
                        subscription.renewsAt
                      ).toLocaleDateString()
                    : "—"}
                </span>
              </div>

              <div>
                <p className="mb-2 text-sm text-muted-foreground">
                  Active Modules
                </p>

                {subscription.activeModules.length === 0 ? (
                  <p className="text-sm text-muted-foreground">
                    No modules active.
                  </p>
                ) : (
                  <div className="flex flex-wrap gap-2">
                    {subscription.activeModules.map(
                      (moduleId) => (
                        <span
                          key={moduleId}
                          className="rounded-full border border-border bg-muted px-3 py-1 text-xs font-medium"
                        >
                          {moduleId
                            .split("_")
                            .join(" ")}
                        </span>
                      )
                    )}
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        )
      )}
    </div>
  );
}
