import { notFound } from "next/navigation";
import AccountLedgerDetailView from "@/features/finance-hub/components/AccountLedgerDetailView";
import { mockOrganizations } from "@/features/organization/data/mockOrganizations";

interface Props {
  params: Promise<{
    accountId: string;
  }>;
}

export default async function AccountLedgerDetailPage({ params }: Props) {
  const { accountId } = await params;
  const organization = mockOrganizations.find((o) => o.id === accountId);

  if (!organization) {
    notFound();
  }

  return <AccountLedgerDetailView organizationId={accountId} />;
}
