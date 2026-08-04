import type { Settlement } from "@/types/settlement";

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

export const mockSettlements: Settlement[] = [
  {
    id: "stl_001",
    settlementNumber: "STL-0001",
    organization: "Highveld AgroTraders Ltd",
    entityType: "merchant",
    amount: 1250000,
    currency: "ZAR",
    status: "Completed",
    payoutMethod: "Bank Transfer",
    provider: "Monnify",
    scheduledAt: daysAgo(5),
    completedAt: daysAgo(4),
  },
  {
    id: "stl_002",
    settlementNumber: "STL-0002",
    organization: "Sahel Grains Offtakers Ltd",
    entityType: "buyer",
    amount: 620000,
    currency: "GHS",
    status: "Processing",
    payoutMethod: "Bank Transfer",
    provider: "Paystack Transfers",
    scheduledAt: daysAgo(1),
    completedAt: null,
  },
  {
    id: "stl_003",
    settlementNumber: "STL-0003",
    organization: "Delta Basin Farms",
    entityType: "buyer",
    amount: 275000,
    currency: "KES",
    status: "Scheduled",
    payoutMethod: "Bank Transfer",
    provider: "Monnify",
    scheduledAt: daysFromNow(3),
    completedAt: null,
  },
  {
    id: "stl_004",
    settlementNumber: "STL-0004",
    organization: "AgriConnect Zambia",
    entityType: "agrodealer",
    amount: 4200,
    currency: "USD",
    status: "Failed",
    payoutMethod: "Bank Transfer",
    provider: "Paystack Transfers",
    scheduledAt: daysAgo(10),
    completedAt: null,
  },
  {
    id: "stl_005",
    settlementNumber: "STL-0005",
    organization: "Riverbend Farmers Cooperative Union",
    entityType: "cooperative",
    amount: 140000,
    currency: "XOF",
    status: "Completed",
    payoutMethod: "Mobile Money",
    provider: "Monnify",
    scheduledAt: daysAgo(20),
    completedAt: daysAgo(19),
  },
];
