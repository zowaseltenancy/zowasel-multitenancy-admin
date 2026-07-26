import Link from "next/link";
import { ArrowRight, ShieldCheck } from "lucide-react";

import { Card, CardContent } from "@/components/ui/card";

export default function RolesOverviewPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">
          Roles
        </h1>

        <p className="mt-2 max-w-2xl text-muted-foreground">
          Permission scopes for internal admin staff.
        </p>
      </div>

      <section className="space-y-3">
        <div className="grid gap-4 md:grid-cols-3">
          <Link href="/admin/roles/permissions">
            <Card className="group h-full transition-all duration-200 hover:-translate-y-1 hover:border-primary hover:shadow-lg">
              <CardContent className="flex h-full flex-col justify-between gap-5 p-5">
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary/10 text-primary transition-colors group-hover:bg-primary group-hover:text-white">
                  <ShieldCheck className="h-5 w-5" />
                </div>

                <div>
                  <h3 className="font-semibold">
                    Permissions
                  </h3>

                  <p className="mt-1 text-sm text-muted-foreground">
                    Define what each role can see and do.
                  </p>
                </div>

                <div className="flex justify-end">
                  <ArrowRight className="h-5 w-5 text-muted-foreground transition-transform group-hover:translate-x-1" />
                </div>
              </CardContent>
            </Card>
          </Link>
        </div>
      </section>
    </div>
  );
}
