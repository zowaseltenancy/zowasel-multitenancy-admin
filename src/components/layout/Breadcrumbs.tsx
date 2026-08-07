"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { ArrowLeft, ChevronRight, Home } from "lucide-react";
import { usePageHeaderValue } from "./PageHeaderContext";

const SEGMENT_LABELS: Record<string, string> = {
  admin: "Dashboard",
  organizations: "Organizations",
  all: "All",
  pending: "Pending",
  cooperatives: "Cooperatives",
  leads: "Leads",
  pipeline: "Lead Pipeline",
  "finance-hub": "Finance Hub",
  analytics: "Analytics",
  account: "Master Account & Statements",
  "accounts-monitor": "Accounts Monitoring",
  activity: "Activity Log",
  analysis: "Analysis",
  acess: "ACESS",
  crm: "CRM 360 & Pipeline",
  sustainability: "CropPilot MRV & Carbon",
  marketing: "Marketing Pro",
  newsletters: "Newsletters",
  sms: "SMS",
  whatsapp: "WhatsApp",
  modules: "Modules",
  products: "Products",
  croppilot: "CropPilot",
  installed: "Installed",
  marketplace: "Marketplace",
  kyb: "KYB Review",
  approved: "Approved",
  rejected: "Rejected",
  users: "Platform Users",
  agents: "Field Agents",
  agrodealers: "Agrodealers",
  staff: "Zowasel Staff",
  directory: "Staff Directory",
  notifications: "Notifications",
  security: "Password & Security",
  buyers: "Commodity Buyers",
  merchants: "Merchants",
  roles: "Roles & Security",
  permissions: "Permissions Matrix",
  billing: "Billing & Finance",
  currency: "Currencies & Rates",
  providers: "Payment Providers",
  subscriptions: "Subscriptions",
  transactions: "Transactions",
  invoices: "Invoices",
  settlements: "Settlements",
  settings: "Platform Settings",
  overdue: "Overdue",
  paid: "Paid",
  void: "Void",
  completed: "Completed",
  failed: "Failed",
  processing: "Processing",
  scheduled: "Scheduled",
  refunded: "Refunded",
  disputed: "Disputed",
};

export default function Breadcrumbs() {
  const pathname = usePathname();
  const router = useRouter();
  const { title } = usePageHeaderValue();

  const segments = pathname.split("/").filter(Boolean);
  const isHome = pathname === "/admin" || segments.length === 0;

  return (
    <nav aria-label="Breadcrumb" className="flex items-center gap-2 text-xs text-muted-foreground">
      {!isHome && (
        <button
          type="button"
          onClick={() => router.back()}
          className="flex items-center gap-1 font-medium text-foreground hover:text-primary transition-colors pr-2 border-r border-border"
          title="Go back"
        >
          <ArrowLeft className="h-3.5 w-3.5 text-primary" />
          <span>Back</span>
        </button>
      )}

      <Link
        href="/admin"
        className="flex items-center gap-1.5 font-medium text-foreground hover:text-primary transition-colors"
      >
        <Home className="h-3.5 w-3.5 text-muted-foreground" />
        <span className="capitalize">Dashboard</span>
      </Link>

      {!isHome &&
        segments.map((seg, idx) => {
          if (seg === "admin") return null;
          const path = "/" + segments.slice(0, idx + 1).join("/");
          const isLast = idx === segments.length - 1;
          const mappedLabel = SEGMENT_LABELS[seg.toLowerCase()];
          const label = isLast && title ? title : mappedLabel || seg.replace("-", " ");

          return (
            <div key={path} className="flex items-center gap-1.5 capitalize">
              <ChevronRight className="h-3 w-3 text-muted-foreground/60 shrink-0" />
              {isLast ? (
                <span className="font-semibold text-foreground truncate max-w-[250px]">
                  {label}
                </span>
              ) : (
                <Link
                  href={path}
                  className="hover:text-primary transition-colors truncate max-w-[150px]"
                >
                  {label}
                </Link>
              )}
            </div>
          );
        })}
    </nav>
  );
}
