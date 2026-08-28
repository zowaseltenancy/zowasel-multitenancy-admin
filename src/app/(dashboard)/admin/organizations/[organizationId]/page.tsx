import OrganizationDetailView from "@/features/organization/components/OrganizationDetailView";

interface Props {
  params: Promise<{
    organizationId: string;
  }>;
}

// No existence check here on purpose.
//
// This used to call organizationService.getOrganizationById(), which reads the
// mock array (ids like "biz_1001"), and notFound() fired for every real UUID
// before the view could render — so every organization 404'd even though
// GET /admin/businesses/{id} returns 200.
//
// The client view owns that decision now: it queries the real endpoint and
// distinguishes "loading" from "genuinely 404" from "the request failed", which
// a server component reading a mock list cannot do.
export default async function OrganizationDetailPage({ params }: Props) {
  const { organizationId } = await params;

  return <OrganizationDetailView organizationId={organizationId} />;
}
