import { Provider } from "@/types/provider";

export const mockProviders: Provider[] = [
  {
    id: "paystack",

    name: "Paystack",

    slug: "paystack",

    description: "Collects card, bank and USSD payments from customers.",

    category: "pay_in",

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

    description: "Collects payments across Africa via card, transfer and mobile money.",

    category: "pay_in",

    environment: "test",

    health: "healthy",

    isActive: true,

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
    id: "papss",

    name: "PAPSS",

    slug: "papss",

    description: "Afreximbank's Pan-African Payment and Settlement System — instant cross-border collections settled in local currency via participating central banks.",

    category: "pay_in",

    environment: "live",

    health: "healthy",

    isActive: false,

    credentials: {
      apiKey: "papss_live_xxxxxxxxx",
    },

    supportedCurrencies: [
      "NGN",
      "GHS",
      "KES",
      "ZAR",
      "XOF",
    ],

    lastHealthCheck: "3 minutes ago",

    responseTime: 210,

    createdAt: "2026-07-20",

    updatedAt: "2026-07-22",
  },

  {
    id: "fincra",

    name: "Fincra",

    slug: "fincra",

    description: "CBN-licensed collections across 50+ currencies and 40+ countries, built for cross-border African trade.",

    category: "pay_in",

    environment: "test",

    health: "healthy",

    isActive: false,

    credentials: {
      publicKey: "pk_test_xxxxxxxxx",
      secretKey: "sk_test_xxxxxxxxx",
    },

    supportedCurrencies: [
      "NGN",
      "USD",
      "GBP",
      "EUR",
    ],

    lastHealthCheck: "5 minutes ago",

    responseTime: 143,

    createdAt: "2026-07-20",

    updatedAt: "2026-07-22",
  },

  {
    id: "monnify",

    name: "Monnify",

    slug: "monnify",

    description: "Disburses payouts and settlements to bank accounts.",

    category: "pay_out",

    environment: "live",

    health: "degraded",

    isActive: true,

    credentials: {},

    supportedCurrencies: ["NGN"],

    lastHealthCheck: "6 minutes ago",

    responseTime: 487,

    createdAt: "2026-07-20",

    updatedAt: "2026-07-22",
  },

  {
    id: "paystack-transfers",

    name: "Paystack Transfers",

    slug: "paystack-transfers",

    description: "Sends payouts and refunds directly to bank accounts.",

    category: "pay_out",

    environment: "test",

    health: "healthy",

    isActive: false,

    credentials: {
      publicKey: "pk_test_xxxxxxxxx",

      secretKey: "sk_test_xxxxxxxxx",

      webhookSecret: "whsec_xxxxxxxxx",
    },

    supportedCurrencies: ["NGN"],

    lastHealthCheck: "4 minutes ago",

    responseTime: 132,

    createdAt: "2026-07-20",

    updatedAt: "2026-07-22",
  },

  {
    id: "onafriq",

    name: "Onafriq",

    slug: "onafriq",

    description: "Bulk payouts and remittances to bank accounts, mobile wallets and cash pickup across 1B+ connected mobile money users in Africa.",

    category: "pay_out",

    environment: "live",

    health: "healthy",

    isActive: false,

    credentials: {
      apiKey: "onafriq_live_xxxxxxxxx",
    },

    supportedCurrencies: [
      "NGN",
      "GHS",
      "KES",
      "UGX",
      "TZS",
    ],

    lastHealthCheck: "2 minutes ago",

    responseTime: 176,

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

    supportedCurrencies: ["NGN", "GHS", "KES", "ZAR", "XOF", "UGX", "TZS", "USD", "EUR", "GBP", "CNY"],

    lastHealthCheck: "15 minutes ago",

    responseTime: 0,

    createdAt: "2026-07-20",

    updatedAt: "2026-07-22",
  },
];
