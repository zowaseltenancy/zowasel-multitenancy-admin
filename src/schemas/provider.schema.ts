import { z } from "zod";

export const providerSchema = z.object({
  id: z.string(),

  name: z.string().min(2),

  slug: z.string(),

  description: z.string(),

  category: z.enum([
    "pay_in",
    "pay_out",
    "currency",
  ]),

  environment: z.enum([
    "test",
    "live",
  ]),

  health: z.enum([
    "healthy",
    "degraded",
    "offline",
  ]),

  isActive: z.boolean(),

  credentials: z.object({
    publicKey: z.string().optional(),

    secretKey: z.string().optional(),

    webhookSecret: z.string().optional(),

    apiKey: z.string().optional(),
  }),

  supportedCurrencies: z.array(z.string()),

  lastHealthCheck: z.string(),

  responseTime: z.number(),

  createdAt: z.string(),

  updatedAt: z.string(),
});

export type ProviderSchema = z.infer<
  typeof providerSchema
>;

export const createProviderSchema = z.object({
  name: z.string().min(2, "Name is required."),

  description: z
    .string()
    .min(5, "Give a short description of this provider."),

  category: z.enum([
    "pay_in",
    "pay_out",
    "currency",
  ]),

  environment: z.enum(["test", "live"]),

  supportedCurrencies: z
    .string()
    .min(1, "List at least one currency code."),

  publicKey: z.string().optional(),

  secretKey: z.string().optional(),

  webhookSecret: z.string().optional(),

  apiKey: z.string().optional(),
});

export type CreateProviderSchema = z.infer<
  typeof createProviderSchema
>;
