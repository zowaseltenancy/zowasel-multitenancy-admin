import type { NextConfig } from "next";

// ── Local microservice ports (used only in development) ───────────────────────
// These are server-side env vars — NOT NEXT_PUBLIC_ — so they are never
// baked into the browser bundle. Override them in .env.local if your services
// run on different ports.
const DEV_SERVICES = {
  auth:         process.env.BACKEND_AUTH_URL         ?? "http://localhost:4000",
  user:         process.env.BACKEND_USER_URL         ?? "http://localhost:4001",
  notification: process.env.BACKEND_NOTIFICATION_URL ?? "http://localhost:4002",
  wallet:       process.env.BACKEND_WALLET_URL       ?? "http://localhost:4003",
  billing:      process.env.BACKEND_BILLING_URL      ?? "http://localhost:4004",
  payment:      process.env.BACKEND_PAYMENT_URL      ?? "http://localhost:4005",
};

const nextConfig: NextConfig = {
  poweredByHeader: false,
  reactStrictMode: true,

  /**
   * Proxy /api/<service>/* → the matching microservice.
   *
   * Development : routes to localhost:<port> directly (no Nginx needed).
   * Production  : the same paths hit your real API gateway (Nginx/cloud LB)
   *               which handles routing — these rewrites are a passthrough.
   *
   * The destination keeps the /api/v1 prefix because that is where every
   * service mounts its router (see each service's app.ts) and what the gateway
   * matches on. Dropping it here routes to a path nothing serves.
   */
  async rewrites() {
    const isProd = process.env.NODE_ENV === "production";

    if (isProd) {
      // In production the gateway / reverse-proxy handles routing,
      // so we don't need Next.js rewrites. Return empty array.
      return [];
    }

    // Development: proxy each prefix to its local service port.
    return [
      // Auth service → :4000
      {
        source: "/api/auth/:path*",
        destination: `${DEV_SERVICES.auth}/api/v1/:path*`,
      },
      // User service → :4001
      {
        source: "/api/user/:path*",
        destination: `${DEV_SERVICES.user}/api/v1/:path*`,
      },
      // Notification service → :4002
      {
        source: "/api/notification/:path*",
        destination: `${DEV_SERVICES.notification}/api/v1/:path*`,
      },
      // Wallet service → :4003
      {
        source: "/api/wallet/:path*",
        destination: `${DEV_SERVICES.wallet}/api/v1/:path*`,
      },
      // Billing service → :4004
      {
        source: "/api/billing/:path*",
        destination: `${DEV_SERVICES.billing}/api/v1/:path*`,
      },
      // Payment service → :4005
      {
        source: "/api/payment/:path*",
        destination: `${DEV_SERVICES.payment}/api/v1/:path*`,
      },
    ];
  },
};

export default nextConfig;
