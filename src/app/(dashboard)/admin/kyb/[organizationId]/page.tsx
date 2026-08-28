import KybDetailView from "@/features/organization/components/KybDetailView";

interface Props {
  params: Promise<{
    organizationId: string;
  }>;
}

// Existence is the client view's call — it queries GET /admin/businesses/{id}.
// This previously checked the id against the mock array and 404'd every real
// UUID before the view could render.
export default async function KybDetailPage({ params }: Props) {
  const { organizationId } = await params;

  return <KybDetailView organizationId={organizationId} />;
}
