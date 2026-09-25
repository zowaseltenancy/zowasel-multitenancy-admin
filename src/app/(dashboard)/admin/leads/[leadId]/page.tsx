import { redirect } from "next/navigation";
import LeadDetailView from "@/features/leads/components/LeadDetailView";

interface Props {
  params: Promise<{
    leadId: string;
  }>;
}

// Same reasoning as the organization detail route: this checked the id against
// mockLeads and 404'd every real UUID. Existence is the client view's call now,
// since it is the thing that talks to the API.
export default async function LeadDetailPage({ params }: Props) {
  const { leadId: rawLeadId } = await params;
  const leadId = decodeURIComponent(rawLeadId || "").trim();

  if (leadId === "pipeline" || leadId === "pipline") {
    redirect("/admin/leads/pipeline");
  }

  return <LeadDetailView leadId={leadId} />;
}
