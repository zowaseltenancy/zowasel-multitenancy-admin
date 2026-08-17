import { use } from "react";
import CampaignDetailView from "@/features/marketing/components/CampaignDetailView";

interface Props {
  params: Promise<{
    campaignId: string;
  }>;
}

export default function NewsletterCampaignPage({ params }: Props) {
  const { campaignId } = use(params);
  return <CampaignDetailView campaignId={campaignId} channel="newsletter" />;
}
