"use client";

import { useState } from "react";
import { MarketingCampaign } from "@/types/marketing";
import { mockCampaigns } from "../data/mockCampaigns";

export function useCampaigns() {
  const [campaigns, setCampaigns] = useState<MarketingCampaign[]>(mockCampaigns);

  const addCampaign = (campaign: MarketingCampaign) => {
    setCampaigns((current) => [campaign, ...current]);
  };

  return { campaigns, addCampaign };
}
