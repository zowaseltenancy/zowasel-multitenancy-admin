import { mockInvoices } from "../data/mockInvoices";
import { Invoice } from "@/types/invoice";

export const invoiceService = {
  getInvoices(): Invoice[] {
    return mockInvoices;
  },

  getInvoiceById(id: string): Invoice | undefined {
    return mockInvoices.find(
      (invoice) => invoice.id === id
    );
  },
};
