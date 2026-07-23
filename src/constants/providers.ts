import { Provider } from "@/types/provider";

export const PAYMENT_PROVIDERS: Pick<
  Provider,
  "name" | "slug" | "description"
>[] = [
  {
    name: "Flutterwave",
    slug: "flutterwave",
    description:
      "Payments across Africa.",
  },

  {
    name: "Paystack",
    slug: "paystack",
    description:
      "Online payment processing.",
  },

  {
    name: "Monnify",
    slug: "monnify",
    description:
      "Bank transfer infrastructure.",
  },
];

export const CURRENCY_PROVIDERS: Pick<
  Provider,
  "name" | "slug" | "description"
>[] = [
  {
    name: "ExchangeRate.host",
    slug: "exchange-rate-host",
    description:
      "Free exchange rate API.",
  },

  {
    name: "Frankfurter",
    slug: "frankfurter",
    description:
      "European Central Bank rates.",
  },

  {
    name: "CurrencyFreaks",
    slug: "currency-freaks",
    description:
      "Currency conversion service.",
  },
];