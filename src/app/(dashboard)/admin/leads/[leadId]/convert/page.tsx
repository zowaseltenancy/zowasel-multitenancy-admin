import ConvertLeadPageView from "@/features/leads/components/ConvertLeadPageView";

interface Props {
  params: Promise<{
    leadId: string;
  }>;
}

export default async function ConvertLeadPage({ params }: Props) {
  const { leadId } = await params;

  return <ConvertLeadPageView leadId={leadId} />;
}
