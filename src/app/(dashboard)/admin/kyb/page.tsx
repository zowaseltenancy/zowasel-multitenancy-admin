'use client';

import {
  ArrowRight,
  CheckCircle2,
  Clock3,
  FileCheck,
  FileText,
  XCircle,
} from 'lucide-react';
import Link from 'next/link';
import { useEffect, useState } from 'react';

import Pagination from '@/components/shared/Pagination';
import CompactRegionScopeSelector from '@/components/shared/CompactRegionScopeSelector';
import { Card, CardContent } from '@/components/ui/card';
import { KYB_DOCUMENT_LABELS } from '@/constants/kyb';
import {
  useKybDocuments,
  useOrganizationStats,
} from '@/features/organization/hooks/useOrganizations';
import { GeographicFilterState } from '@/types/geo';
import { KybDocumentType } from '@/types/kyb';

// The API returns the document type as the free-form string the country
// requirements use; the label map is keyed on the union this app knows about.
// Anything outside it gets the "other" label rather than being mislabelled.
const KNOWN_DOCUMENT_TYPES: KybDocumentType[] = [
  'business_registration',
  'tax_clearance',
  'directors_id',
  'utility_bill',
  'memorandum',
  'shareholder_mapping',
  'bvn',
  'proof_of_address',
];

function toDocumentLabelKey(value: string): KybDocumentType {
  const normalized = value.toLowerCase() as KybDocumentType;
  return KNOWN_DOCUMENT_TYPES.includes(normalized) ? normalized : 'other';
}

export default function KybOverviewPage() {
  const [geoFilter, setGeoFilter] = useState<GeographicFilterState>({
    scope: 'global',
    continent: 'all',
    subRegion: 'all',
    countryCode: 'all',
  });

  const [page, setPage] = useState(1);
  const pageSize = 10;

  // GET /admin/kyb/documents — one row per document.
  //
  // This page used to flat-map `kybDocuments` off GET /admin/businesses, which
  // carries no documents at all (a business can have a dozen, so the directory
  // does not pay for them on every page). The table was therefore always
  // empty, no matter what had been submitted.
  const {
    documents,
    meta,
    isLoading,
    error,
  } = useKybDocuments({
    page,
    limit: pageSize,
    ...(geoFilter.continent !== 'all' ? { continent: geoFilter.continent } : {}),
    ...(geoFilter.subRegion !== 'all' ? { subRegion: geoFilter.subRegion } : {}),
    ...(geoFilter.countryCode !== 'all' ? { country: geoFilter.countryCode } : {}),
  });

  // Platform-wide business counts, from GET /admin/businesses/stats. These
  // count businesses by KYB status, which is what the three status tiles mean —
  // counting the documents on the current page would answer a different
  // question and change as you paged.
  const { stats: businessStats } = useOrganizationStats();

  const approved = businessStats?.kyb.APPROVED ?? 0;
  const pending = businessStats?.kyb.PENDING ?? 0;
  const rejected = businessStats?.kyb.REJECTED ?? 0;

  const totalSubmissions = meta?.total ?? documents.length;
  const pageCount = Math.max(1, meta?.totalPages ?? 1);

  useEffect(() => {
    // Reset to page 1 when the regional scope changes — the page number from
    // the previous scope has no meaning in the new one.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setPage(1);
  }, [geoFilter.continent, geoFilter.subRegion, geoFilter.countryCode]);

  const stats = [
    {
      label: 'Total Submissions',
      value: totalSubmissions,
      icon: FileCheck,
      cardBg: 'bg-cyan-500/5 dark:bg-cyan-500/10 border-cyan-500/20',
      iconClassName: 'bg-cyan-500/15 text-cyan-600 border-cyan-500/30 dark:text-cyan-400',
    },
    {
      label: 'Approved',
      value: approved,
      icon: CheckCircle2,
      cardBg: 'bg-emerald-500/5 dark:bg-emerald-500/10 border-emerald-500/20',
      iconClassName: 'bg-emerald-500/15 text-emerald-600 border-emerald-500/30 dark:text-emerald-400',
    },
    {
      label: 'Pending',
      value: pending,
      icon: Clock3,
      cardBg: 'bg-amber-500/5 dark:bg-amber-500/10 border-amber-500/20',
      iconClassName: 'bg-amber-500/15 text-amber-600 border-amber-500/30 dark:text-amber-400',
    },
    {
      label: 'Rejected',
      value: rejected,
      icon: XCircle,
      cardBg: 'bg-red-500/5 dark:bg-red-500/10 border-red-500/30',
      iconClassName: 'bg-red-500/15 text-red-600 border-red-500/30 dark:text-red-400',
    },
  ];

  return (
    <div className="space-y-6">
      {/* Top Section Grid: Title + Stat Cards on Left, Map Selector at Top Right */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
        <div className="lg:col-span-6 xl:col-span-7 flex flex-col justify-between h-full space-y-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">KYB Review</h1>
            <p className="mt-1.5 text-sm text-muted-foreground">
              Review and decide on business verification submissions across operating regions.
            </p>
          </div>

          {/* Snapshot Cards with Status Color Background Tints */}
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {stats.map((stat) => {
              const Icon = stat.icon;

              return (
                <Card key={stat.label} className={`border shadow-2xs transition-colors ${stat.cardBg}`}>
                  <CardContent className="flex items-center gap-3 p-4">
                    <div
                      className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border ${stat.iconClassName}`}
                    >
                      <Icon className="h-4 w-4" />
                    </div>

                    <div>
                      <p className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider">{stat.label}</p>
                      <h3 className="text-xl font-bold mt-0.5">{stat.value}</h3>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>

        <div className="lg:col-span-6 xl:col-span-5 flex justify-end w-full h-full">
          <CompactRegionScopeSelector
            value={geoFilter}
            onChange={(newFilter) => {
              setGeoFilter(newFilter);
              setPage(1);
            }}
          />
        </div>
      </div>

      <section className="space-y-3">
        <div>
          <h2 className="text-lg font-semibold">
            Recently Submitted Documents
          </h2>

          <p className="text-sm text-muted-foreground">
            Chronological audit feed of all document uploads submitted across
            organizations.
          </p>
        </div>

        <Card className="overflow-hidden p-0 bg-card">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="border-b border-border bg-muted/40 text-xs uppercase text-muted-foreground">
                <tr>
                  <th className="px-6 py-4 font-medium">Document Type</th>
                  <th className="px-6 py-4 font-medium">Organization</th>
                  <th className="px-6 py-4 font-medium">Uploaded Date</th>
                  <th className="px-6 py-4 font-medium">Doc Status</th>
                  <th className="px-6 py-4 text-right font-medium">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {isLoading ? (
                  <tr>
                    <td
                      colSpan={5}
                      className="p-6 text-center text-sm text-muted-foreground"
                    >
                      Loading submitted documents…
                    </td>
                  </tr>
                ) : error ? (
                  <tr>
                    <td
                      colSpan={5}
                      className="p-6 text-center text-sm text-muted-foreground"
                    >
                      {error}
                    </td>
                  </tr>
                ) : documents.length === 0 ? (
                  <tr>
                    <td
                      colSpan={5}
                      className="p-6 text-center text-sm text-muted-foreground"
                    >
                      No document submissions found matching this regional filter.
                    </td>
                  </tr>
                ) : (
                  documents.map((doc) => (
                    <tr
                      key={doc.id}
                      className="transition-colors hover:bg-muted/30"
                    >
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <FileText className="h-4 w-4 text-primary shrink-0" />
                          <span className="font-medium">
                            {KYB_DOCUMENT_LABELS[toDocumentLabelKey(doc.type)] ?? doc.type}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <p className="font-medium">{doc.business.name}</p>
                        <p className="text-xs text-muted-foreground">
                          {doc.business.businessId}
                          {doc.business.ownerName ? ` • ${doc.business.ownerName}` : ''}
                        </p>
                      </td>
                      <td className="px-6 py-4 text-muted-foreground">
                        {new Date(doc.uploadedAt).toLocaleDateString()}{' '}
                        {new Date(doc.uploadedAt).toLocaleTimeString([], {
                          hour: '2-digit',
                          minute: '2-digit',
                        })}
                      </td>
                      <td className="px-6 py-4 capitalize">
                        <span
                          className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium border ${
                            doc.status === 'verified'
                              ? 'border-green-200 bg-green-100 text-green-700 dark:border-green-900 dark:bg-green-950 dark:text-green-300'
                              : doc.status === 'rejected'
                                ? 'border-red-200 bg-red-100 text-red-700 dark:border-red-900 dark:bg-red-950 dark:text-red-300'
                                : 'border-amber-200 bg-amber-100 text-amber-700 dark:border-amber-900 dark:bg-amber-950 dark:text-amber-300'
                          }`}
                        >
                          {doc.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <Link
                          href={`/admin/kyb/${doc.business.id}`}
                          className="inline-flex items-center gap-1 text-sm font-medium text-primary hover:underline"
                        >
                          Inspect Document
                          <ArrowRight className="h-4 w-4" />
                        </Link>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </Card>
        <div className="p-4">
          <Pagination
            page={page}
            pageCount={pageCount}
            onPageChange={setPage}
          />
        </div>
      </section>
    </div>
  );
}
