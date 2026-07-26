export type ProviderCategory =
  | "pay_in"
  | "pay_out"
  | "currency";

export type ProviderEnvironment = "test" | "live";

export type ProviderHealth =
  | "healthy"
  | "degraded"
  | "offline";

export interface ProviderCredentials {
  publicKey?: string;
  secretKey?: string;
  webhookSecret?: string;
  apiKey?: string;
}

export interface Provider {
  id: string;

  name: string;

  slug: string;

  category: ProviderCategory;

  description: string;

  environment: ProviderEnvironment;

  health: ProviderHealth;

  isActive: boolean;

  credentials: ProviderCredentials;

  supportedCurrencies: string[];

  lastHealthCheck: string;

  responseTime: number;

  createdAt: string;

  updatedAt: string;
}