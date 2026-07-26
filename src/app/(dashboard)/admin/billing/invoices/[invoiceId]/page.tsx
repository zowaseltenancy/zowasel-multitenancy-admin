import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import InvoiceStatusBadge from "@/features/billing/components/InvoiceStatusBadge";
import { invoiceService } from "@/features/billing/services/invoice.service";

interface Props {
  params: Promise<{
    invoiceId: string;
  }>;
}

export default async function InvoiceDetailsPage({
  params,
}: Props) {
  const { invoiceId } = await params;

  const invoice =
    invoiceService.getInvoiceById(invoiceId);

  if (!invoice) {
    notFound();
  }

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between">
        <div>
          <Link
            href="/admin/billing/invoices"
            className="mb-3 inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Invoices
          </Link>

          <h1 className="text-3xl font-semibold">
            {invoice.invoiceNumber}
          </h1>

          <p className="mt-2 text-muted-foreground">
            {invoice.organization}
          </p>
        </div>

        <InvoiceStatusBadge
          status={invoice.status}
        />
      </div>

      <Card>
        <CardHeader>
          <CardTitle>
            Invoice Information
          </CardTitle>
        </CardHeader>

        <CardContent className="grid gap-6 md:grid-cols-3">
          <div>
            <p className="text-sm text-muted-foreground">
              Product
            </p>
            <p className="mt-2 font-medium">
              {invoice.product}
            </p>
          </div>

          <div>
            <p className="text-sm text-muted-foreground">
              Amount
            </p>
            <p className="mt-2 font-medium">
              {invoice.currency}{" "}
              {invoice.amount.toLocaleString()}
            </p>
          </div>

          <div>
            <p className="text-sm text-muted-foreground">
              Issued
            </p>
            <p className="mt-2 font-medium">
              {new Date(
                invoice.issuedAt
              ).toLocaleDateString()}
            </p>
          </div>

          <div>
            <p className="text-sm text-muted-foreground">
              Due Date
            </p>
            <p className="mt-2 font-medium">
              {new Date(
                invoice.dueDate
              ).toLocaleDateString()}
            </p>
          </div>

          <div>
            <p className="text-sm text-muted-foreground">
              Paid
            </p>
            <p className="mt-2 font-medium">
              {invoice.paidAt
                ? new Date(
                    invoice.paidAt
                  ).toLocaleDateString()
                : "—"}
            </p>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>
            Line Items
          </CardTitle>
        </CardHeader>

        <CardContent>
          <div className="divide-y divide-border">
            {invoice.items.map((item) => (
              <div
                key={item.name}
                className="flex items-center justify-between py-3 text-sm"
              >
                <div>
                  <p className="font-medium">
                    {item.name}
                  </p>
                  <p className="text-muted-foreground">
                    Qty {item.quantity}
                  </p>
                </div>

                <p className="font-medium">
                  {invoice.currency}{" "}
                  {(
                    item.quantity * item.unitPrice
                  ).toLocaleString()}
                </p>
              </div>
            ))}
          </div>

          <div className="mt-4 flex items-center justify-between border-t border-border pt-4 text-base font-semibold">
            <span>Total</span>
            <span>
              {invoice.currency}{" "}
              {invoice.amount.toLocaleString()}
            </span>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
