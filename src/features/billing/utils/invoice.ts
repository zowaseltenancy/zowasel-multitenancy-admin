import { Invoice } from "@/types/invoice";
import { ORGANIZATION_TYPE_LABELS } from "@/constants/organization";
import { ExportTable } from "@/lib/export";

export function toInvoiceExportTable(
  invoices: Invoice[],
  title = "Invoices"
): ExportTable {
  return {
    title,
    headers: [
      "Invoice",
      "Organization",
      "Entity Type",
      "Product",
      "Amount",
      "Currency",
      "Status",
      "Issued",
      "Due Date",
      "Paid",
    ],
    rows: invoices.map((invoice) => [
      invoice.invoiceNumber,
      invoice.organization,
      ORGANIZATION_TYPE_LABELS[invoice.entityType],
      invoice.product,
      invoice.amount,
      invoice.currency,
      invoice.status,
      new Date(invoice.issuedAt).toLocaleDateString(),
      new Date(invoice.dueDate).toLocaleDateString(),
      invoice.paidAt
        ? new Date(invoice.paidAt).toLocaleDateString()
        : "—",
    ]),
  };
}
