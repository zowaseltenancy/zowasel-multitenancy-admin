import Link from "next/link";
import {
  ArrowRight,
  ShieldCheck,
  Sprout,
  Store,
  Users as UsersIcon,
} from "lucide-react";

import { Card, CardContent } from "@/components/ui/card";

const quickLinks = [
  {
    title: "Admins",
    description: "Internal platform admin accounts.",
    href: "/admin/users/admins",
    icon: ShieldCheck,
  },
  {
    title: "Farmers",
    description: "Farmer accounts across CropPilot tenants.",
    href: "/admin/users/farmers",
    icon: Sprout,
  },
  {
    title: "Buyers",
    description: "Marketplace buyer accounts.",
    href: "/admin/users/buyers",
    icon: UsersIcon,
  },
  {
    title: "Merchants",
    description: "Marketplace merchant accounts.",
    href: "/admin/users/merchants",
    icon: Store,
  },
];

export default function UsersOverviewPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">
          Users
        </h1>

        <p className="mt-2 max-w-2xl text-muted-foreground">
          Platform-wide user accounts across every role.
        </p>
      </div>

      <section className="space-y-3">
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          {quickLinks.map((link) => {
            const Icon = link.icon;

            return (
              <Link
                key={link.href}
                href={link.href}
              >
                <Card className="group h-full transition-all duration-200 hover:-translate-y-1 hover:border-primary hover:shadow-lg">
                  <CardContent className="flex h-full flex-col justify-between gap-5 p-5">
                    <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary/10 text-primary transition-colors group-hover:bg-primary group-hover:text-white">
                      <Icon className="h-5 w-5" />
                    </div>

                    <div>
                      <h3 className="font-semibold">
                        {link.title}
                      </h3>

                      <p className="mt-1 text-sm text-muted-foreground">
                        {link.description}
                      </p>
                    </div>

                    <div className="flex justify-end">
                      <ArrowRight className="h-5 w-5 text-muted-foreground transition-transform group-hover:translate-x-1" />
                    </div>
                  </CardContent>
                </Card>
              </Link>
            );
          })}
        </div>
      </section>
    </div>
  );
}
