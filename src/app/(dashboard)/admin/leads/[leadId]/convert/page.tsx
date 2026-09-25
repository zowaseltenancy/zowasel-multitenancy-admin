import { redirect } from "next/navigation";

interface Props {
  params: Promise<{
    leadId: string;
  }>;
}

/**
 * Kept as a redirect so older links and bookmarks still land somewhere useful.
 *
 * Conversion is an action, not a destination: it provisions a business and
 * emails the owner a single-use link to set their own password, and it is
 * refused unless the deal is won and the lead carries an email address. This
 * route used to be a full-page form that asked for all of that before saying
 * whether the lead could be converted at all — so the pipeline's Convert
 * button navigated away from the list and then, for most leads, ended in a 409
 * the operator could do nothing about from here.
 *
 * The conversion sheet on the lead's own page does the same job in place, with
 * the Convert control disabled and the reason shown when the lead is not
 * eligible (see features/leads/utils/convertibility.ts). Two entry points into
 * one irreversible write is one too many, and this was the one that skipped
 * the checks.
 */
export default async function ConvertLeadPage({ params }: Props) {
  const { leadId: rawLeadId } = await params;
  const leadId = decodeURIComponent(rawLeadId || "").trim();

  redirect(`/admin/leads/${leadId}`);
}
