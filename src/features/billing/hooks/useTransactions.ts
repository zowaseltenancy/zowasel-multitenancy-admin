"use client";

import { useState } from "react";

import { mockTransactions } from "../data/mockTransactions";
import { DisputeNotifyTarget } from "@/types/transaction";

export function useTransactions() {
  const [transactions, setTransactions] = useState(
    mockTransactions
  );

  const raiseDispute = (
    transactionId: string,
    reason: string,
    notifyTarget: DisputeNotifyTarget
  ) => {
    setTransactions((current) =>
      current.map((transaction) =>
        transaction.id === transactionId
          ? {
              ...transaction,
              disputed: true,
              disputeReason: reason,
              disputeNotifyTarget: notifyTarget,
            }
          : transaction
      )
    );
  };

  return {
    transactions,
    raiseDispute,
  };
}
