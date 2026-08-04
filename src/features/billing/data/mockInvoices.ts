import type { Invoice } from "@/types/invoice";

function daysAgo(days: number) {
  const date = new Date();
  date.setDate(date.getDate() - days);
  return date.toISOString();
}

function daysFromNow(days: number) {
  const date = new Date();
  date.setDate(date.getDate() + days);
  return date.toISOString();
}

export const mockInvoices: Invoice[] = [
  {
    id: "inv_001",
    invoiceNumber: "INV-0001",
    organization: "FarmFresh Cooperative",
    entityType: "cooperative",
    product: "Zowasel Enterprise Platform (Full Access + API)",
    amount: 250000,
    currency: "NGN",
    status: "Paid",
    issuedAt: daysAgo(20),
    dueDate: daysAgo(6),
    paidAt: daysAgo(8),
    items: [
      { name: "Zowasel Enterprise Platform — Monthly Plan", quantity: 1, unitPrice: 250000 },
    ],
  },
  {
    id: "inv_002",
    invoiceNumber: "INV-0002",
    organization: "AgroHub Ghana",
    entityType: "agrodealer",
    product: "CropPilot Growth (D-MRV, Inputs & Harvest)",
    amount: 1200,
    currency: "GHS",
    status: "Pending",
    issuedAt: daysAgo(10),
    dueDate: daysFromNow(5),
    paidAt: null,
    items: [
      { name: "CropPilot Growth — Quarterly Plan", quantity: 1, unitPrice: 1200 },
    ],
  },
  {
    id: "inv_003",
    invoiceNumber: "INV-0003",
    organization: "Green Harvest Ltd",
    entityType: "merchant",
    product: "Carbon & Agroforestry Traceability Suite",
    amount: 1800,
    currency: "USD",
    status: "Overdue",
    issuedAt: daysAgo(35),
    dueDate: daysAgo(14),
    paidAt: null,
    items: [
      { name: "Carbon & Agroforestry Traceability — Annual Plan", quantity: 1, unitPrice: 1800 },
    ],
  },
  {
    id: "inv_004",
    invoiceNumber: "INV-0004",
    organization: "Harvest Link Africa",
    entityType: "buyer",
    product: "CropPilot Growth (D-MRV, Inputs & Harvest)",
    amount: 320000,
    currency: "NGN",
    status: "Overdue",
    issuedAt: daysAgo(40),
    dueDate: daysAgo(19),
    paidAt: null,
    items: [
      { name: "CropPilot Growth — Monthly Plan", quantity: 1, unitPrice: 320000 },
    ],
  },
  {
    id: "inv_005",
    invoiceNumber: "INV-0005",
    organization: "EcoFarm Nigeria",
    entityType: "merchant",
    product: "CropPilot Starter (Registry, Mapping & Advisory)",
    amount: 450000,
    currency: "NGN",
    status: "Paid",
    issuedAt: daysAgo(60),
    dueDate: daysAgo(46),
    paidAt: daysAgo(48),
    items: [
      { name: "CropPilot Starter — Yearly Plan", quantity: 1, unitPrice: 450000 },
    ],
  },
  {
    id: "inv_006",
    invoiceNumber: "INV-0006",
    organization: "Sahel Grains Offtakers Ltd",
    entityType: "buyer",
    product: "Marketplace",
    amount: 45000,
    currency: "GHS",
    status: "Void",
    issuedAt: daysAgo(15),
    dueDate: daysAgo(1),
    paidAt: null,
    items: [
      { name: "Marketplace — Featured Listing", quantity: 3, unitPrice: 15000 },
    ],
  },
];
