import { Provider } from "@/types/provider";

export const mockProviders: Provider[] = [
  {
    id: "paystack",

    name: "Paystack",

    slug: "paystack",

    description: "Online payment processing.",

    category: "payment",

    environment: "live",

    health: "healthy",

    isActive: true,

    credentials: {
      publicKey: "pk_live_xxxxxxxxx",

      secretKey: "sk_live_xxxxxxxxx",

      webhookSecret: "whsec_xxxxxxxxx",
    },

    supportedCurrencies: ["NGN"],

    lastHealthCheck: "2 minutes ago",

    responseTime: 94,

    createdAt: "2026-07-20",

    updatedAt: "2026-07-22",
  },

  {
    id: "flutterwave",

    name: "Flutterwave",

    slug: "flutterwave",

    description: "Payments across Africa.",

    category: "payment",

    environment: "test",

    health: "healthy",

    isActive: false,

    credentials: {
      publicKey: "pk_test_xxxxxxxxx",

      secretKey: "sk_test_xxxxxxxxx",

      webhookSecret: "whsec_xxxxxxxxx",
    },

    supportedCurrencies: [
      "NGN",
      "USD",
      "EUR",
      "KES",
      "GHS",
    ],

    lastHealthCheck: "2 minutes ago",

    responseTime: 118,

    createdAt: "2026-07-20",

    updatedAt: "2026-07-22",
  },

  {
    id: "monnify",

    name: "Monnify",

    slug: "monnify",

    description: "Bank transfer infrastructure.",

    category: "payment",

    environment: "live",

    health: "degraded",

    isActive: false,

    credentials: {},

    supportedCurrencies: ["NGN"],

    lastHealthCheck: "6 minutes ago",

    responseTime: 487,

    createdAt: "2026-07-20",

    updatedAt: "2026-07-22",
  },

  {
    id: "exchange-rate-host",

    name: "ExchangeRate.host",

    slug: "exchange-rate-host",

    description: "Free exchange rate API.",

    category: "currency",

    environment: "live",

    health: "healthy",

    isActive: true,

    credentials: {
      apiKey: "",
    },

    supportedCurrencies: [
      "USD",
      "EUR",
      "GBP",
      "NGN",
    ],

    lastHealthCheck: "1 minute ago",

    responseTime: 52,

    createdAt: "2026-07-20",

    updatedAt: "2026-07-22",
  },

  {
    id: "currency-freaks",

    name: "CurrencyFreaks",

    slug: "currency-freaks",

    description: "Currency conversion service.",

    category: "currency",

    environment: "test",

    health: "offline",

    isActive: false,

    credentials: {
      apiKey: "xxxxxxxx",
    },

    supportedCurrencies: ["ALL"],

    lastHealthCheck: "15 minutes ago",

    responseTime: 0,

    createdAt: "2026-07-20",

    updatedAt: "2026-07-22",
  },
];