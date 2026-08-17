import { LedgerTransaction, LedgerTransactionStatus } from "@/types/finance";

// Finance-Hub-only entries — Zowasel's own vendor outflows and settlements
// that customer-facing Billing never tracks. Billing's real transactions
// (subscriptions/platform fees tenants pay Zowasel) are merged on top of
// this in useLedgerTransactions, not duplicated here.
const handAuthoredEntries: LedgerTransaction[] = [
  {
    id: "EXP-44091",
    date: "2026-08-03T11:05:00Z",
    accountName: "Termii Technologies",
    countryCode: "NG",
    category: "Operational Outflow",
    channel: "Online",
    amount: 450000,
    currencyCode: "NGN",
    type: "debit",
    method: "Bank Transfer",
    status: "Completed",
    reference: "TRM-SMS-202608",
  },
  {
    id: "EXP-44092",
    date: "2026-08-02T10:15:00Z",
    accountName: "Meta WhatsApp Business API",
    countryCode: "NG",
    category: "Operational Outflow",
    channel: "Online",
    amount: 820000,
    currencyCode: "NGN",
    type: "debit",
    method: "Flutterwave",
    status: "Completed",
    reference: "FLW-META-3391",
  },
  {
    id: "EXP-44093",
    date: "2026-07-30T08:40:00Z",
    accountName: "Paystack Gateway Fees",
    countryCode: "NG",
    category: "Operational Outflow",
    channel: "Online",
    amount: 310000,
    currencyCode: "NGN",
    type: "debit",
    method: "Paystack",
    status: "Completed",
    reference: "PSTK-FEE-BATCH-44",
  },
  {
    id: "SET-33012",
    date: "2026-08-01T16:40:00Z",
    accountName: "Riverbend Farmers Cooperative Union",
    organizationId: "biz_1006",
    // biz_1006 is Ivory Coast (mockOrganizations.ts) — this used to be
    // mismatched to NG/NGN despite the org FK pointing at a CI entity.
    countryCode: "CI",
    category: "Escrow Settlement",
    channel: "Online",
    amount: 3470000,
    currencyCode: "XOF",
    type: "debit",
    method: "Bank Transfer",
    status: "Completed",
    reference: "SET-RIVERBEND-04",
  },
  {
    id: "OFF-90001",
    date: "2026-08-02T16:45:00Z",
    accountName: "Northline Farmers Cooperative Union",
    organizationId: "biz_1004",
    // biz_1004 is Tanzania (mockOrganizations.ts) — same NG/NGN mismatch bug.
    countryCode: "TZ",
    category: "Subscription",
    channel: "Offline / Manual",
    amount: 2600000,
    currencyCode: "TZS",
    type: "credit",
    method: "Cheque",
    status: "Pending Approval",
    reference: "CHQ-STANCHART-TZ-2231",
    recordedBy: "Ops Team",
  },
  {
    id: "EXP-55010",
    date: "2026-08-04T09:20:00Z",
    accountName: "Safaricom SMS Gateway",
    countryCode: "KE",
    category: "Operational Outflow",
    channel: "Online",
    amount: 65000,
    currencyCode: "KES",
    type: "debit",
    method: "Bank Transfer",
    status: "Completed",
    reference: "SAF-SMS-0819",
  },
];

// --- 18-month expansion --------------------------------------------------
// The 6 hand-authored entries above span 4 days and 2 categories — nowhere
// near enough for Analytics' revenue trend, category breakdown, Budget vs
// Actual, or WHT vendor charts to render anything but a flat or single-slice
// result (confirmed by direct audit: 3 of 6 categories sat at literal $0
// "Actual" every month, the category pie was a single 100% slice, and there
// was no Tanzania row in the WHT table). This generator adds real, granular
// volume across all 6 LedgerCategory values and Zowasel's 3 country-officer
// markets (NG/KE/TZ), plus lighter West Africa volume (CI) — seeded so the
// numbers are stable across reloads instead of reshuffling on every visit.
function mulberry32(seed: number) {
  return function random() {
    seed |= 0;
    seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

const rand = mulberry32(90210);
function pick<T>(arr: T[]): T {
  return arr[Math.floor(rand() * arr.length)];
}
function range(min: number, max: number): number {
  return min + rand() * (max - min);
}

// Anchored to the current date (not a static past date) so this data keeps
// looking like a live 18-month trailing window no matter when the demo runs.
function monthDate(monthsBack: number, dayOfMonth: number, hour: number, minute: number): string {
  const d = new Date();
  d.setDate(1);
  d.setMonth(d.getMonth() - monthsBack);
  d.setDate(Math.min(dayOfMonth, 28));
  d.setHours(hour, minute, 0, 0);
  return d.toISOString();
}

const FX: Record<string, number> = { NGN: 1540, KES: 129.5, TZS: 2680, XOF: 605 };

const NG_VENDORS = ["Termii Technologies", "Meta WhatsApp Business API", "AWS Africa Hosting", "Google Workspace Enterprise", "MTN Business Data Bundles"];
const KE_VENDORS = ["Safaricom SMS Gateway", "AWS East Africa Region", "Twilio Africa Messaging"];
const TZ_VENDORS = ["Vodacom Tanzania SMS Gateway", "CRDB Merchant Service Fees", "Airtel Business Data TZ"];

const NG_ORGS = [
  { id: "biz_1001", name: "Greenfields Agro & Commodity Merchants" },
  { id: "biz_agro_01", name: "Gwarzo Farm Inputs & Seeds Hub" },
  { id: "biz_1007", name: "FarmFresh Cooperative" },
  { id: "biz_1009", name: "Green Harvest Ltd" },
  { id: "biz_1011", name: "Harvest Link Africa" },
  { id: "biz_1013", name: "EcoFarm Nigeria" },
];
const KE_ORGS = [
  { id: "biz_1010", name: "Savannah Growers" },
  { id: "biz_1003", name: "Delta Basin Farms" },
];
const TZ_ORGS = [
  { id: "biz_1004", name: "Northline Farmers Cooperative Union" },
  { id: "biz_1014", name: "Kilimanjaro Produce" },
];
const CI_ORGS = [{ id: "biz_1006", name: "Riverbend Farmers Cooperative Union" }];

// Weighted toward Completed so the "Actual" side of Budget vs Actual and the
// revenue trend both get real completed volume, while still exercising the
// Pending / Pending Approval / Failed / Refunded states elsewhere in the Hub.
const STATUS_POOL: LedgerTransactionStatus[] = [
  "Completed", "Completed", "Completed", "Completed", "Completed", "Completed",
  "Pending", "Pending Approval", "Failed", "Refunded",
];

let seq = 1;
function nextRef(prefix: string): string {
  return `${prefix}-${(seq++).toString().padStart(5, "0")}`;
}

const generated: LedgerTransaction[] = [];

for (let m = 17; m >= 1; m--) {
  // --- Escrow Settlement: cooperative/buyer payouts, the largest category ---
  const settlementRounds: Array<{ orgs: { id: string; name: string }[]; currency: string; country: string }> = [
    { orgs: NG_ORGS, currency: "NGN", country: "NG" },
    { orgs: KE_ORGS, currency: "KES", country: "KE" },
    { orgs: TZ_ORGS, currency: "TZS", country: "TZ" },
  ];
  settlementRounds.forEach(({ orgs, currency, country }) => {
    const count = 1 + Math.floor(rand() * 2); // 1-2 per country per month
    for (let i = 0; i < count; i++) {
      const org = pick(orgs);
      generated.push({
        id: `SET-${m}-${i}-${org.id}`,
        date: monthDate(m, 3 + i * 9, 10 + i, 15),
        accountName: org.name,
        organizationId: org.id,
        countryCode: country,
        category: "Escrow Settlement",
        channel: "Online",
        amount: Math.round(range(1200, 3200) * FX[currency]),
        currencyCode: currency,
        type: "debit",
        method: "Bank Transfer",
        status: pick(STATUS_POOL),
        reference: nextRef("SET"),
      });
    }
  });

  // Lighter West Africa (CI) settlement volume, every other month.
  if (m % 2 === 0) {
    const org = pick(CI_ORGS);
    generated.push({
      id: `SET-CI-${m}`,
      date: monthDate(m, 20, 14, 0),
      accountName: org.name,
      organizationId: org.id,
      countryCode: "CI",
      category: "Escrow Settlement",
      channel: "Online",
      amount: Math.round(range(1500, 3000) * FX.XOF),
      currencyCode: "XOF",
      type: "debit",
      method: "Bank Transfer",
      status: pick(STATUS_POOL),
      reference: nextRef("SET"),
    });
  }

  // --- Operational Outflow: Zowasel's own vendor spend, one per market ---
  const outflowRounds: Array<{ vendors: string[]; currency: string; country: string }> = [
    { vendors: NG_VENDORS, currency: "NGN", country: "NG" },
    { vendors: KE_VENDORS, currency: "KES", country: "KE" },
    { vendors: TZ_VENDORS, currency: "TZS", country: "TZ" },
  ];
  outflowRounds.forEach(({ vendors, currency, country }) => {
    const vendor = pick(vendors);
    generated.push({
      id: `EXP-${m}-${country}`,
      date: monthDate(m, 5, 9, 30),
      accountName: vendor,
      countryCode: country,
      category: "Operational Outflow",
      channel: "Online",
      amount: Math.round(range(250, 700) * FX[currency]),
      currencyCode: currency,
      type: "debit",
      method: pick(["Bank Transfer", "Paystack", "Flutterwave"]),
      status: "Completed",
      reference: nextRef("EXP"),
    });
  });

  // --- Subscription: recurring tenant subscription fees paid offline ---
  // Two per month (day 1 and day 16) rather than one — real subscription
  // billing isn't perfectly monthly-on-the-1st, and a single fixed day per
  // month left this category showing a hollow $0 in any 30-day trailing
  // window that happened to fall between two once-a-month data points.
  const subsOrgs = [...NG_ORGS, ...KE_ORGS, ...TZ_ORGS];
  [1, 16].forEach((dayOfMonth) => {
    const subOrg = pick(subsOrgs);
    const subCountry = NG_ORGS.includes(subOrg) ? "NG" : KE_ORGS.includes(subOrg) ? "KE" : "TZ";
    const subCurrency = subCountry === "NG" ? "NGN" : subCountry === "KE" ? "KES" : "TZS";
    generated.push({
      id: `SUB-${m}-${dayOfMonth}`,
      date: monthDate(m, dayOfMonth, 8, 0),
      accountName: subOrg.name,
      organizationId: subOrg.id,
      countryCode: subCountry,
      category: "Subscription",
      channel: "Offline / Manual",
      amount: Math.round(range(150, 400) * FX[subCurrency]),
      currencyCode: subCurrency,
      type: "credit",
      method: "Cheque",
      status: pick(["Completed", "Completed", "Pending Approval"]),
      reference: nextRef("SUB"),
      recordedBy: "Ops Team",
    });
  });

  // --- Dispute Fee: not every month ---
  if (m % 3 !== 0) {
    const country = pick(["NG", "KE"]);
    const currency = country === "NG" ? "NGN" : "KES";
    generated.push({
      id: `DSP-${m}`,
      date: monthDate(m, 22, 13, 45),
      accountName: country === "NG" ? "Paystack Dispute Fees" : "Flutterwave Dispute Fees",
      countryCode: country,
      category: "Dispute Fee",
      channel: "Online",
      amount: Math.round(range(30, 90) * FX[currency]),
      currencyCode: currency,
      type: "debit",
      method: country === "NG" ? "Paystack" : "Flutterwave",
      status: "Completed",
      reference: nextRef("DSP"),
    });
  }

  // --- Internal Transfer: treasury consolidation, every month ---
  // Was every-other-month, which left ~60-day gaps a 30-day trailing window
  // could easily fall entirely inside, showing a hollow $0.
  generated.push({
    id: `TRF-${m}`,
    date: monthDate(m, 15, 16, 0),
    accountName: "Zowasel Treasury Consolidation",
    countryCode: "NG",
    category: "Internal Transfer",
    channel: "Offline / Manual",
    amount: Math.round(range(200, 700) * FX.NGN),
    currencyCode: "NGN",
    type: "debit",
    method: "Internal Sweep",
    status: "Completed",
    reference: nextRef("TRF"),
    recordedBy: "Treasury Ops",
    approvedBy: "Folasade Bankole",
  });
}

// A few guaranteed-recent entries (days-ago, not months-ago) for the lower-
// cadence categories — Subscription/Internal Transfer/Dispute Fee only land
// once or twice a month in the generator above, so calendar-boundary luck
// could leave a real trailing-30-day window (e.g. the Budget vs Actual card)
// showing a hollow $0 for one of them depending on what day "today" is.
function daysAgo(days: number, hour: number, minute: number): string {
  const d = new Date();
  d.setDate(d.getDate() - days);
  d.setHours(hour, minute, 0, 0);
  return d.toISOString();
}

const recentTopUps: LedgerTransaction[] = [
  {
    id: "SUB-RECENT-01",
    date: daysAgo(6, 8, 30),
    accountName: "Green Harvest Ltd",
    organizationId: "biz_1009",
    countryCode: "NG",
    category: "Subscription",
    channel: "Offline / Manual",
    amount: 385000,
    currencyCode: "NGN",
    type: "credit",
    method: "Cheque",
    status: "Completed",
    reference: nextRef("SUB"),
    recordedBy: "Ops Team",
  },
  {
    id: "TRF-RECENT-01",
    date: daysAgo(9, 16, 0),
    accountName: "Zowasel Treasury Consolidation",
    countryCode: "NG",
    category: "Internal Transfer",
    channel: "Offline / Manual",
    amount: 620000,
    currencyCode: "NGN",
    type: "debit",
    method: "Internal Sweep",
    status: "Completed",
    reference: nextRef("TRF"),
    recordedBy: "Treasury Ops",
    approvedBy: "Folasade Bankole",
  },
  {
    id: "DSP-RECENT-01",
    date: daysAgo(11, 13, 45),
    accountName: "Paystack Dispute Fees",
    countryCode: "NG",
    category: "Dispute Fee",
    channel: "Online",
    amount: 78000,
    currencyCode: "NGN",
    type: "debit",
    method: "Paystack",
    status: "Completed",
    reference: nextRef("DSP"),
  },
];

export const mockLedgerTransactions: LedgerTransaction[] = [...handAuthoredEntries, ...generated, ...recentTopUps];
