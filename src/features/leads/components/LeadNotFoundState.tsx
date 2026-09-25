"use client";

import React from "react";
import Link from "next/link";
import { ArrowRight, Building2 } from "lucide-react";

import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { getApiErrorMessage } from "@/lib/axios";

interface Props {
  leadId: string;
  error: unknown;
}

export default function LeadNotFoundState({ leadId, error }: Props) {
  const status = (error as { response?: { status?: number } } | null)?.response?.status;

  if (error && status !== 404) {
    return (
      <Card className="flex min-h-[260px] flex-col items-center justify-center gap-3 p-6 text-center">
        <p className="text-base font-semibold text-foreground">Unable to load this lead</p>
        <p className="max-w-md text-xs text-muted-foreground">
          {getApiErrorMessage(error, "Please check your network connection and try again.")}
        </p>
        <Link href="/admin/leads/pipeline">
          <Button variant="outline" size="sm" className="mt-2 gap-1.5">
            <ArrowRight className="h-3.5 w-3.5 rotate-180" />
            Return to Leads Pipeline
          </Button>
        </Link>
      </Card>
    );
  }

  return (
    <Card className="flex min-h-[280px] flex-col items-center justify-center gap-4 p-8 text-center border-dashed">
      <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-muted text-muted-foreground">
        <Building2 className="h-6 w-6" />
      </div>
      <div className="space-y-1">
        <h2 className="text-lg font-semibold text-foreground">Lead Profile Not Found</h2>
        <p className="max-w-md text-xs text-muted-foreground">
          The lead profile <span className="font-mono font-semibold text-foreground">{leadId}</span> could not be located in the pipeline.
        </p>
      </div>
      <Link href="/admin/leads/pipeline">
        <Button variant="outline" size="sm" className="gap-1.5">
          <ArrowRight className="h-3.5 w-3.5 rotate-180" />
          Back to Leads Pipeline
        </Button>
      </Link>
    </Card>
  );
}
