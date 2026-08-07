import { notFound } from "next/navigation";
import LeadDetailView from "@/features/leads/components/LeadDetailView";
import { mockLeads } from "@/features/leads/data/mockLeads";

interface Props {
  params: Promise<{
    leadId: string;
  }>;
}

export default async function LeadDetailPage({ params }: Props) {
  const { leadId } = await params;
  const lead = mockLeads.find((l) => l.id === leadId);

  if (!lead) {
    notFound();
  }

  return <LeadDetailView leadId={leadId} />;
}
