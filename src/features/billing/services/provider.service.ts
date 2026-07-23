import { mockProviders } from "../data/mockProviders";
import { Provider } from "@/types/provider";

export const providerService = {
  getProviders(): Provider[] {
    return mockProviders;
  },

  getProviderBySlug(slug: string): Provider | undefined {
    return mockProviders.find((provider) => provider.slug === slug);
  },
};