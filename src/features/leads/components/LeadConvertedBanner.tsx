"use client";

import React from "react";
import Link from "next/link";
import { ArrowRight, CheckCircle2 } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

interface Props {
  convertedOrganizationId?: string | null;
}

export default function LeadConvertedBanner({ convertedOrganizationId }: Props) {
  if (!convertedOrganizationId) return null;

  return (
    <Card className="border-emerald-500/20 bg-emerald-500/5">
      <CardContent className="flex items-center justify-between p-4">
        <div className="flex items-center gap-2.5">
          <div className="flex h-7 w-7 items-center justify-center rounded-md bg-emerald-500/15 text-emerald-600 dark:text-emerald-400">
            <CheckCircle2 className="h-4 w-4" />
          </div>
          <p className="text-sm font-medium text-emerald-700 dark:text-emerald-400">
            This lead has been converted to a full organization.
          </p>
        </div>
        <Link
          href={`/admin/organizations/${convertedOrganizationId}`}
          className="inline-flex items-center gap-1.5 text-sm font-semibold text-primary hover:underline"
        >
          View Organization <ArrowRight className="h-3.5 w-3.5" />
        </Link>
      </CardContent>
    </Card>
  );
}
