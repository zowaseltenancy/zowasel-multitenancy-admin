"use client";

import { useState } from "react";

import { mockInvoices } from "../data/mockInvoices";

export function useInvoices() {
  const [invoices] = useState(mockInvoices);

  return {
    invoices,
  };
}
