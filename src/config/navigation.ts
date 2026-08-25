import {
  BarChart3,
  Bell,
  Building2,
  CreditCard,
  FileCheck,
  Home,
  LayoutGrid,
  Megaphone,
  ShieldCheck,
  TrendingUp,
  UserCheck,
  UserPlus,
  Users,
} from "lucide-react";

export interface NavigationChild {
  label: string;
  href: string;
  permission?: string | null;
  badge?: string | null;
}

export interface NavigationItem {
  label: string;
  href: string;
  icon?: React.ComponentType<{ className?: string }>;
  permission?: string | null;
  badge?: string | null;
  children?: NavigationChild[];
}

export const navigation: NavigationItem[] = [
  {
    label: "Dashboard",
    href: "/admin",
    icon: Home,
  },

  {
    label: "Organizations",
    href: "/admin/organizations",
    icon: Building2,
    children: [
      {
        label: "All Organizations",
        href: "/admin/organizations/all",
      },
      {
        label: "Pending Organizations",
        href: "/admin/organizations/pending",
      },
    ],
  },

  {
    label: "Leads",
    href: "/admin/leads",
    icon: UserPlus,
    children: [
      {
        label: "Lead Pipeline",
        href: "/admin/leads/pipeline",
      },
    ],
  },

  {
    label: "Finance Hub",
    href: "/admin/finance-hub",
    icon: TrendingUp,
    children: [
      {
        label: "Finance Analytics",
        href: "/admin/finance-hub/analytics",
      },
      {
        label: "Budget Performance",
        href: "/admin/finance-hub/budget",
      },
      {
        label: "Accounts & Statements",
        href: "/admin/finance-hub/account",
      },
      {
        label: "Ledger & Outflows",
        href: "/admin/finance-hub/transactions",
      },
      {
        label: "Finance Monitoring",
        href: "/admin/finance-hub/accounts-monitor",
      },
      {
        label: "Finance Governance",
        href: "/admin/finance-hub/governance",
      },
      {
        label: "Ceviant",
        href: "/admin/finance-hub/ceviant",
      },
      {
        label: "Digital Requisitions",
        href: "/admin/finance-hub/requisitions",
      },
      {
        label: "Activity Log",
        href: "/admin/finance-hub/activity",
      },
    ],
  },

  {
    label: "Analysis",
    href: "/admin/analysis",
    icon: BarChart3,
    children: [
      {
        label: "CRM 360 & Pipeline",
        href: "/admin/analysis/crm",
      },
      {
        label: "CropPilot MRV & Carbon",
        href: "/admin/analysis/sustainability",
      },
    ],
  },

  {
    label: "Product Modules",
    href: "/admin/modules",
    icon: LayoutGrid,
    children: [
      {
        label: "CropPilot",
        href: "/admin/modules/products/croppilot",
      },
      {
        label: "Marketplace",
        href: "/admin/modules/products/marketplace",
      },
      {
        label: "ACESS",
        href: "/admin/modules/products/acess",
      },
    ],
  },

  {
    label: "ACESS",
    href: "/admin/acess",
    icon: CreditCard,
  },

  {
    label: "KYB Review",
    href: "/admin/kyb",
    icon: FileCheck,
    children: [
      {
        label: "Pending Queue",
        href: "/admin/kyb/pending",
      },
      {
        label: "Approved Tenants",
        href: "/admin/kyb/approved",
      },
      {
        label: "Rejected Applications",
        href: "/admin/kyb/rejected",
      },
    ],
  },

  {
    label: "Platform Users",
    href: "/admin/users",
    icon: Users,
    children: [
      {
        label: "Field Agents",
        href: "/admin/users/agents",
      },
      {
        label: "Merchants",
        href: "/admin/users/merchants",
      },
      {
        label: "Agrodealers",
        href: "/admin/users/agrodealers",
      },
      {
        label: "Cooperatives",
        href: "/admin/users/cooperatives",
      },
      {
        label: "Commodity Buyers",
        href: "/admin/users/buyers",
      },
    ],
  },

  {
    label: "Staff Management",
    href: "/admin/staff",
    icon: UserCheck,
    children: [
      {
        label: "Staff Directory",
        href: "/admin/staff/directory",
      },
      {
        label: "Onboard Staff",
        href: "/admin/staff/onboarding",
      },
    ],
  },
  {
    label: "Departments",
    href: "/admin/staff/departments",
    icon: Building2,
    children: [
      { label: "Overview", href: "/admin/staff/departments" },
    ],
  },
  {
    label: "Notifications",
    href: "/admin/notifications",
    icon: Bell,
    children: [
      {
        label: "KYB Status",
        href: "/admin/notifications/kyb",
      },
      {
        label: "Module Activity",
        href: "/admin/notifications/modules",
      },
      {
        label: "Password & Security",
        href: "/admin/notifications/security",
      },
      {
        label: "Billing",
        href: "/admin/notifications/billing",
      },
    ],
  },
  {
    label: "Broadcasts",
    href: "/admin/marketing",
    icon: Megaphone,
    children: [
      {
        label: "Newsletters",
        href: "/admin/marketing/newsletters",
      },
      {
        label: "SMS",
        href: "/admin/marketing/sms",
      },
      {
        label: "WhatsApp",
        href: "/admin/marketing/whatsapp",
      },
    ],
  },

  {
    label: "Roles & Security",
    href: "/admin/roles",
    icon: ShieldCheck,
    children: [
      {
        label: "Permissions",
        href: "/admin/roles/permissions",
      },
    ],
  },

  {
    label: "Billing & Payments",
    href: "/admin/billing",
    icon: CreditCard,
    children: [
      {
        label: "Payment Providers",
        href: "/admin/billing/providers",
      },
      {
        label: "Currencies & Rates",
        href: "/admin/billing/currency",
      },
      {
        label: "Subscriptions",
        href: "/admin/billing/subscriptions",
      },
      {
        label: "Transactions",
        href: "/admin/billing/transactions",
      },
      {
        label: "Invoices",
        href: "/admin/billing/invoices",
      },
      {
        label: "Settlements",
        href: "/admin/billing/settlements",
      },
      {
        label: "Expirations & Reminders",
        href: "/admin/billing/reminders",
      },
      {
        label: "Platform Settings",
        href: "/admin/billing/settings",
      },
    ],
  },
];