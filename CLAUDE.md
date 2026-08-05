# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

Package manager is **pnpm** (pnpm-lock.yaml, pnpm-workspace.yaml present — do not use npm/yarn).

```
pnpm dev      # start dev server (next dev)
pnpm build    # production build
pnpm start    # run production build
pnpm lint     # eslint
```

There is no static test suite framework pre-configured, but **Playwright (`^1.62.0`) is installed in `devDependencies`**. 

### 🧪 Playwright Runtime & E2E Verification Rule
* **TypeScript compilation alone is NOT sufficient** to confirm feature correctness or performance.
* Always test live runtime UI flows using Playwright.
* If port 3000 is not serving, launch `pnpm dev` in the background and verify HTTP readiness before running tests.
* Walk through pages to observe speed, responsiveness, hydration warnings, console errors, and re-render bottlenecks (e.g. Framer Motion layout shift calculations blocking main thread during sidebar toggles).

Adding shadcn components: this project uses the `shadcn` CLI (`^4.13.0`) with style `base-nova`, base color `neutral`, RSC enabled, icon library `lucide-react`. Aliases (see `components.json`): `@/components`, `@/components/ui`, `@/lib`, `@/hooks`.

## Architecture

**Stack:** Next.js 16 (App Router), React 19, TypeScript (strict), Tailwind CSS v4, shadcn/ui on `@base-ui/react` primitives, `react-hook-form` + `@hookform/resolvers` + `zod` for forms, `sonner` for toasts. `mongoose`, `next-auth` (v4), and `bcrypt` are installed as dependencies but **not yet wired up** — there is no `src/app/api/`, no auth config, no middleware, and no mongoose models/db connection anywhere in the repo yet. Treat auth/DB as not-yet-implemented, not broken.

**Product:** Zowasel is a multitenancy admin platform. Everything currently under `src/app` is the *admin* side (managing organizations, users, roles, modules, KYB, billing providers) — there is no tenant-facing app yet.

### Where this repo fits in the wider Zowasel system
This admin panel is one piece of a larger SSO'd product suite: `auth.zowasel.com` (login, issues a shared session cookie on `.zowasel.com`), `account.zowasel.com` (end-user account center), `croppilot.zowasel.com` (farm management), `marketplace.zowasel.com` (commodities trading), and this admin panel. **No app maintains its own user table** — every app, including this one, is meant to consume a central `GET /api/user/profile` endpoint (owned by the auth/backend service) as the single source of truth for user identity, KYB status, organizations, and subscriptions, rather than modeling that data locally.

A "tenant" here is a business/organization identified by `business_id`; a business has one account owner plus optional internal team members who manage the account on the owner's behalf (distinct from CropPilot's own farmer/agent/agronomist sub-users). This admin panel's job is org-facing platform administration: business overview/detail, account owner & team member management, module pricing/free-paid toggles + adoption stats, and KYB review (approve/reject with reason). When implementing these, match the central API's field shapes (e.g. `kyb_status`: `not_submitted`/`pending`/`approved`/`rejected`, `business_id`) rather than inventing new ones — those contracts are owned elsewhere in the system.

### CropPilot module system (drives the `module` domain / T4 & T5 admin screens)
Modules are CropPilot's unit of both feature access and billing — activating one unlocks its feature area + stats; deactivating hides the UI/stats but keeps history for reactivation. Catalog: 6 categories, ~30 sub-modules, per-tenant pricing that admin can override — **Farmer Management** and **Marketplace & Billing** are always free/no-KYB-required; **Compliance & Monitoring** ($49/mo), **Carbon & Sustainability** ($79/mo), and **Field & Operations** ($39/mo) are paid; **Agent/Agronomist Management** is threshold-priced (free for 5 agents, $19/agent/month above). A module record looks like:

```ts
{
  id, name, category, description, featureKey,
  requiresKyb: boolean,        // per-module flag, not a blanket rule
  isPaid: boolean, pricePerMonth: number,
  billingState: "free" | "paid" | "expired",
  enabledByTenant: boolean, statsEnabled: boolean, defaultFreeDays: number,
  createdBy, updatedBy, updatedAt,
}
```

The catalog itself is defined by product/backend; this admin panel edits **tenant module assignments, free/paid status, and per-tenant activation** (`billingState`/`requiresKyb` must stay in sync with the backend's contract, not be modeled independently). KYB approval gates a tenant's ability to drill into module *content* in CropPilot, even though the catalog itself stays browsable.

### Route structure
- `src/app/(auth)/` — login, forgot-password, verify-otp, reset-password, activate-account. These pages are markup-only right now: no `onSubmit` handlers, no server actions, no `next-auth` calls wired in yet.
- `src/app/(dashboard)/admin/` — the authenticated admin shell (dashboard, billing sub-routes for providers/subscriptions/transactions/currency/settings). `src/app/(dashboard)/layout.tsx` wraps children in `DashboardLayout`.

### Layout composition
`RootLayout` (fonts, html/body shell) → route group layout → `DashboardLayout` (client component in `src/components/layout/`, holds sidebar-collapsed state in `localStorage`) → `Sidebar` / `Header` / `PageContainer`.

### Domain-per-folder convention
Each domain gets a parallel slice across three top-level folders:
- `src/types/<domain>.ts` — plain TS interfaces/types
- `src/schemas/<domain>.schema.ts` — zod schema + inferred type (`z.infer`)
- `src/constants/<domain>.ts` — static data/enums for that domain

Domains present so far: `organization`, `user`, `module`, `permissions`/`roles`, `billing`, `provider`, `currency`, `kyb`, `login`. Many of these files exist but are **currently empty** — they're placeholders marking where that domain's types/schema/constants belong, not dead code. Check file contents before assuming a domain is implemented.

### Feature modules
`src/features/<feature>/` holds the fuller implementation for a domain once it's built out: `components/`, `hooks/`, `services/`, `utils/`, `data/`. `billing` is the only feature implemented so far and is the reference pattern for how a new feature should be structured — but note it currently runs on **mock data + local React state** (`features/billing/data/mockProviders.ts`, `useProviders` hook using `useState`), not real API calls. `features/billing/services/provider.service.ts` exists as an empty stub for where the real API/service layer will go.

### Styling/theming
Design tokens are CSS custom properties in `src/app/globals.css`, consumed via Tailwind v4's `@theme inline`. Light theme uses a custom brand palette (primary green `#05b050`, dark navy sidebar `#262c3f`). The `.dark` theme block is still shadcn's default neutral oklch palette — it has not been customized to match the brand yet.

### Path alias
`@/*` → `./src/*` (see `tsconfig.json`).