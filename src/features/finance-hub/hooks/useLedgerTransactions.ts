"use client";

import { useState } from "react";
import { useTransactions } from "@/features/billing/hooks/useTransactions";
import { useActingFinanceOfficer } from "../context/FinanceOfficerContext";
import { mockLedgerTransactions } from "../data/mockLedgerTransactions";
import { countryForCurrency } from "../utils/currency";
import { LedgerTransaction } from "@/types/finance";

interface OfflineTransactionInput {
  accountName: string;
  category: LedgerTransaction["category"];
  amount: number;
  currencyCode: string;
  countryCode: string;
  type: "credit" | "debit";
  method: string;
  reference: string;
  receiptFileName?: string;
  recordedBy: string;
}

// The single shared ledger feed for the whole Finance Hub. Billing's real
// tenant-payment transactions are mapped in as "Platform Fee" / Online —
// that's the actual link Ezuka asked for between Billing and Finance Hub —
// and merged with Zowasel's own vendor outflows/settlements that Billing
// never tracks. Master Account reconciliation and the Platform Ledger page
// both read this one hook, so there is exactly one truth for "what moved."
export function useLedgerTransactions() {
  const { transactions: billingTransactions } = useTransactions();
  const { isCountryInScope } = useActingFinanceOfficer();
  const [ledgerOnly, setLedgerOnly] = useState<LedgerTransaction[]>(mockLedgerTransactions);

  const billingAsLedger: LedgerTransaction[] = billingTransactions.map((t) => ({
    id: t.id,
    date: t.createdAt,
    accountName: t.organization,
    countryCode: countryForCurrency(t.currency),
    category: "Platform Fee",
    channel: "Online",
    amount: t.amount,
    currencyCode: t.currency,
    type: "credit",
    method: t.provider,
    status:
      t.status === "Completed"
        ? "Completed"
        : t.status === "Pending"
          ? "Pending"
          : t.status === "Refunded"
            ? "Refunded"
            : "Failed",
    reference: t.reference,
  }));

  // Scoped to the acting officer — a Nigeria Country Finance Officer never
  // sees Kenya's ledger, regardless of what's technically in the mock data.
  const transactions = [...ledgerOnly, ...billingAsLedger]
    .filter((t) => isCountryInScope(t.countryCode))
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  const addOfflineTransaction = (input: OfflineTransactionInput) => {
    const entry: LedgerTransaction = {
      ...input,
      id: `OFF-${Date.now().toString().slice(-8)}`,
      date: new Date().toISOString(),
      channel: "Offline / Manual",
      status: "Pending Approval",
    };
    setLedgerOnly((prev) => [entry, ...prev]);
    return entry;
  };

  const approveTransaction = (id: string, approvedBy: string) => {
    setLedgerOnly((prev) =>
      prev.map((t) => (t.id === id ? { ...t, status: "Completed", approvedBy } : t))
    );
  };

  const rejectTransaction = (id: string, approvedBy: string) => {
    setLedgerOnly((prev) =>
      prev.map((t) => (t.id === id ? { ...t, status: "Rejected", approvedBy } : t))
    );
  };

  return {
    transactions,
    addOfflineTransaction,
    approveTransaction,
    rejectTransaction,
  };
}
