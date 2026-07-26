import Link from "next/link";
import { ArrowRight } from "lucide-react";

import { Card } from "@/components/ui/card";
import { Invoice } from "@/types/invoice";
import InvoiceStatusBadge from "./InvoiceStatusBadge";

interface Props {
  invoices: Invoice[];
}

export default function InvoiceTable({
  invoices,
}: Props) {
  if (invoices.length === 0) {
    return (
      <Card className="flex min-h-[160px] items-center justify-center p-6 text-sm text-muted-foreground">
        No invoices match this filter.
      </Card>
    );
  }

  return (
    <Card className="overflow-hidden">
      <div className="overflow-x-auto">
        <table className="min-w-full text-sm">
          <thead className="border-b bg-muted/50">
            <tr className="text-left">
              <th className="px-6 py-4 font-medium">Invoice</th>
              <th className="px-6 py-4 font-medium">Organization</th>
              <th className="px-6 py-4 font-medium">Product</th>
              <th className="px-6 py-4 font-medium">Amount</th>
              <th className="px-6 py-4 font-medium">Due Date</th>
              <th className="px-6 py-4 font-medium">Status</th>
              <th className="px-6 py-4 text-right font-medium">
                Details
              </th>
            </tr>
          </thead>

          <tbody>
            {invoices.map((invoice) => (
              <tr
                key={invoice.id}
                className="border-b transition-colors hover:bg-muted/40"
              >
                <td className="px-6 py-4 font-medium">
                  {invoice.invoiceNumber}
                </td>

                <td className="px-6 py-4">
                  {invoice.organization}
                </td>

                <td className="px-6 py-4">
                  {invoice.product}
                </td>

                <td className="px-6 py-4 whitespace-nowrap">
                  {invoice.currency}{" "}
                  {invoice.amount.toLocaleString()}
                </td>

                <td className="px-6 py-4 whitespace-nowrap">
                  {new Date(
                    invoice.dueDate
                  ).toLocaleDateString()}
                </td>

                <td className="px-6 py-4">
                  <InvoiceStatusBadge
                    status={invoice.status}
                  />
                </td>

                <td className="px-6 py-4 text-right">
                  <Link
                    href={`/admin/billing/invoices/${invoice.id}`}
                    className="inline-flex items-center gap-2 text-sm font-medium text-primary transition-colors hover:underline"
                  >
                    View
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Card>
  );
}
