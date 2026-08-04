"use client";

import { useState } from "react";

import { mockTransactions } from "../data/mockTransactions";
import { getNextEscalationStage } from "@/constants/transaction";

export function useTransactions() {
  const [transactions, setTransactions] = useState(
    mockTransactions
  );

  // Every dispute always starts at the Operations stage — the sequential
  // Ops -> Finance -> Provider workflow, not an admin-chosen target.
  const raiseDispute = (
    transactionId: string,
    reason: string
  ) => {
    setTransactions((current) =>
      current.map((transaction) =>
        transaction.id === transactionId
          ? {
              ...transaction,
              disputed: true,
              disputeReason: reason,
              disputeNotifyTarget: "operations_team",
            }
          : transaction
      )
    );
  };

  const escalateToNextStage = (transactionId: string) => {
    setTransactions((current) =>
      current.map((transaction) => {
        if (transaction.id !== transactionId || !transaction.disputeNotifyTarget) {
          return transaction;
        }

        const next = getNextEscalationStage(transaction.disputeNotifyTarget);
        return next ? { ...transaction, disputeNotifyTarget: next } : transaction;
      })
    );
  };

  return {
    transactions,
    raiseDispute,
    escalateToNextStage,
  };
}
