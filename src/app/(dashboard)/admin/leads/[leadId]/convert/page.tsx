import ConvertLeadPageView from "@/features/leads/components/ConvertLeadPageView";

interface Props {
  params: Promise<{
    leadId: string;
  }>;
}

export default async function ConvertLeadPage({ params }: Props) {
  const { leadId: rawLeadId } = await params;
  const leadId = decodeURIComponent(rawLeadId || "").trim();

  return <ConvertLeadPageView leadId={leadId} />;
}
