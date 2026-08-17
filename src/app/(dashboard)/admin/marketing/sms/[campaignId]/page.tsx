import { use } from "react";
import CampaignDetailView from "@/features/marketing/components/CampaignDetailView";

interface Props {
  params: Promise<{
    campaignId: string;
  }>;
}

export default function SmsCampaignPage({ params }: Props) {
  const { campaignId } = use(params);
  return <CampaignDetailView campaignId={campaignId} channel="sms" />;
}
