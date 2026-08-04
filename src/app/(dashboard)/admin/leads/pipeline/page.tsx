"use client";

import { Suspense } from "react";
import { useSearchParams } from "next/navigation";

import LeadsListView from "@/features/leads/components/LeadsListView";
import { LeadStatus } from "@/types/lead";

const VALID_STATUSES: (LeadStatus | "all")[] = [
  "all",
  "incomplete",
  "ready_to_convert",
  "converted",
  "lost",
];

function LeadPipelineContent() {
  const searchParams = useSearchParams();
  const statusParam = searchParams.get("status");
  const initialStatus = VALID_STATUSES.includes(statusParam as LeadStatus)
    ? (statusParam as LeadStatus)
    : "all";

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Lead Pipeline</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Track prospective customers from first contact through to conversion.
        </p>
      </div>

      <LeadsListView initialStatus={initialStatus} />
    </div>
  );
}

export default function LeadPipelinePage() {
  return (
    <Suspense fallback={null}>
      <LeadPipelineContent />
    </Suspense>
  );
}
