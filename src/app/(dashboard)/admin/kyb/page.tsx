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
import { useEffect, useMemo, useState } from 'react';

import Pagination from '@/components/shared/Pagination';
import CompactRegionScopeSelector from '@/components/shared/CompactRegionScopeSelector';
import { Card, CardContent } from '@/components/ui/card';
import { KYB_DOCUMENT_LABELS } from '@/constants/kyb';
import { useOrganizations } from '@/features/organization/hooks/useOrganizations';
import { GeographicFilterState } from '@/types/geo';

export default function KybOverviewPage() {
  const { organizations } = useOrganizations();

  const [geoFilter, setGeoFilter] = useState<GeographicFilterState>({
    scope: 'global',
    continent: 'all',
    subRegion: 'all',
    countryCode: 'all',
  });

  const filteredOrganizations = useMemo(() => {
    return organizations.filter((org) => {
      const matchesContinent =
        geoFilter.continent === 'all' || org.continent === geoFilter.continent;
      const matchesSubRegion =
        geoFilter.subRegion === 'all' || org.subRegion === geoFilter.subRegion;
      const matchesCountry =
        geoFilter.countryCode === 'all' || org.countryCode === geoFilter.countryCode;

      return matchesContinent && matchesSubRegion && matchesCountry;
    });
  }, [organizations, geoFilter]);

  const approved = filteredOrganizations.filter(
    (organization) => organization.kybStatus === 'approved'
  ).length;

  const pending = filteredOrganizations.filter(
    (organization) => organization.kybStatus === 'pending'
  ).length;

  const rejected = filteredOrganizations.filter(
    (organization) => organization.kybStatus === 'rejected'
  ).length;

  const allSubmittedDocuments = useMemo(() => {
    return filteredOrganizations
      .flatMap((org) =>
        org.kybDocuments.map((doc) => ({
          ...doc,
          organizationId: org.id,
          organizationName: org.name,
          businessId: org.businessId,
          ownerName: org.owner.name,
          kybStatus: org.kybStatus,
        }))
      )
      .sort(
        (a, b) =>
          new Date(b.uploadedAt).getTime() - new Date(a.uploadedAt).getTime()
      );
  }, [filteredOrganizations]);

  const [page, setPage] = useState(1);
  const pageSize = 10;
  const pageCount = Math.max(
    1,
    Math.ceil(allSubmittedDocuments.length / pageSize)
  );

  useEffect(() => {
    // Reset to page 1 when the underlying (filtered) document count changes
    // rather than clamping the current page — this mirrors the pagination
    // reset already done inline for direct filter-control changes elsewhere.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setPage(1);
  }, [allSubmittedDocuments.length]);

  const paginatedDocuments = allSubmittedDocuments.slice(
    (page - 1) * pageSize,
    page * pageSize
  );

  const stats = [
    {
      label: 'Total Submissions',
      value: allSubmittedDocuments.length,
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

  const quickLinks = [
    {
      title: 'Pending KYB',
      description: `${pending} submission${pending === 1 ? '' : 's'} waiting on a decision.`,
      href: '/admin/kyb/pending',
      icon: Clock3,
    },
    {
      title: 'Approved',
      description: `${approved} business${approved === 1 ? '' : 'es'} verified.`,
      href: '/admin/kyb/approved',
      icon: CheckCircle2,
    },
    {
      title: 'Rejected',
      description: `${rejected} submission${rejected === 1 ? '' : 's'} awaiting resubmission.`,
      href: '/admin/kyb/rejected',
      icon: XCircle,
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <h1 className="text-3xl font-bold">KYB Review</h1>

          <p className="mt-2 max-w-2xl text-muted-foreground">
            Review and decide on business verification submissions across operating regions.
          </p>
        </div>

        <CompactRegionScopeSelector
          value={geoFilter}
          onChange={(newFilter) => {
            setGeoFilter(newFilter);
            setPage(1);
          }}
        />
      </div>

      {/* Snapshot Cards with Status Color Background Tints */}
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {stats.map((stat) => {
          const Icon = stat.icon;

          return (
            <Card key={stat.label} className={`border shadow-2xs transition-colors ${stat.cardBg}`}>
              <CardContent className="flex items-center gap-4 p-6">
                <div
                  className={`flex h-11 w-11 items-center justify-center rounded-xl border ${stat.iconClassName}`}
                >
                  <Icon className="h-5 w-5" />
                </div>

                <div>
                  <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">{stat.label}</p>

                  <h3 className="text-2xl font-bold mt-1">{stat.value}</h3>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <section className="space-y-3">
        <div>
          <h2 className="text-lg font-semibold">Quick Links</h2>

          <p className="text-sm text-muted-foreground">
            Jump straight into a review queue.
          </p>
        </div>

        <div className="grid gap-4 md:grid-cols-3">
          {quickLinks.map((link) => {
            const Icon = link.icon;

            return (
              <Link key={link.href} href={link.href}>
                <Card className="group h-full transition-all duration-200 hover:-translate-y-1 hover:border-primary hover:shadow-lg bg-card">
                  <CardContent className="flex h-full flex-col justify-between gap-5 p-5">
                    <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary/10 text-primary transition-colors group-hover:bg-primary group-hover:text-white">
                      <Icon className="h-5 w-5" />
                    </div>

                    <div>
                      <h3 className="font-semibold">{link.title}</h3>

                      <p className="mt-1 text-sm text-muted-foreground">
                        {link.description}
                      </p>
                    </div>

                    <div className="flex justify-end">
                      <ArrowRight className="h-5 w-5 text-muted-foreground transition-transform group-hover:translate-x-1" />
                    </div>
                  </CardContent>
                </Card>
              </Link>
            );
          })}
        </div>
      </section>

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
                {allSubmittedDocuments.length === 0 ? (
                  <tr>
                    <td
                      colSpan={5}
                      className="p-6 text-center text-sm text-muted-foreground"
                    >
                      No document submissions found matching this regional filter.
                    </td>
                  </tr>
                ) : (
                  paginatedDocuments.map((doc, idx) => (
                    <tr
                      key={`${doc.organizationId}-${doc.type}-${idx}`}
                      className="transition-colors hover:bg-muted/30"
                    >
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <FileText className="h-4 w-4 text-primary shrink-0" />
                          <span className="font-medium">
                            {KYB_DOCUMENT_LABELS[doc.type] ?? doc.type}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <p className="font-medium">{doc.organizationName}</p>
                        <p className="text-xs text-muted-foreground">
                          {doc.businessId} • {doc.ownerName}
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
                          href={`/admin/kyb/${doc.organizationId}`}
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
