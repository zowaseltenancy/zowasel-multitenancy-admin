'use client';

import { Building2, Clock3, Layers, LayoutDashboard } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ReactNode } from 'react';

const TABS = [
  {
    label: 'Overview',
    href: '/admin/organizations',
    icon: LayoutDashboard,
    exact: true,
  },
  {
    label: 'All Organizations',
    href: '/admin/organizations/all',
    icon: Building2,
  },
  {
    label: 'Pending Approval',
    href: '/admin/organizations/pending',
    icon: Clock3,
  },
  {
    label: 'Cooperatives',
    href: '/admin/organizations/cooperatives',
    icon: Layers,
  },
];

export default function OrganizationTabs({
  rightElement,
}: {
  rightElement?: ReactNode;
}) {
  const pathname = usePathname();

  return (
    <div className="flex flex-col gap-4 border-b border-border pb-3 sm:flex-row sm:items-center sm:justify-between">
      <div className="flex flex-wrap items-center gap-2">
        {TABS.map((tab) => {
          const Icon = tab.icon;
          const isActive = tab.exact
            ? pathname === tab.href
            : pathname.startsWith(tab.href);

          return (
            <Link
              key={tab.href}
              href={tab.href}
              className={`flex items-center gap-2 rounded-xl px-3.5 py-2 text-xs font-semibold transition-all ${
                isActive
                  ? 'bg-primary text-primary-foreground shadow-xs font-bold'
                  : 'bg-muted/50 text-muted-foreground hover:bg-muted hover:text-foreground'
              }`}
            >
              <Icon className="h-4 w-4" />
              <span>{tab.label}</span>
            </Link>
          );
        })}
      </div>
      {rightElement ? (
        <div className="flex shrink-0">{rightElement}</div>
      ) : null}
    </div>
  );
}
