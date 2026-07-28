import {
  Building2,
  CreditCard,
  FileCheck,
  Home,
  LayoutGrid,
  ShieldCheck,
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
        label: "Pending KYB",
        href: "/admin/organizations/pending",
      },
      {
        label: "Cooperatives",
        href: "/admin/organizations/cooperatives",
      },
    ],
  },

  {
    label: "Modules",
    href: "/admin/modules",
    icon: LayoutGrid,
    children: [
      {
        label: "Installed Modules",
        href: "/admin/modules/installed",
      },
      {
        label: "Marketplace Trading",
        href: "/admin/modules/marketplace",
      },
      {
        label: "CropPilot Core",
        href: "/admin/modules?category=croppilot",
      },
      {
        label: "Analytics",
        href: "/admin/modules?category=analytics",
      },
      {
        label: "Carbon & Sustainability",
        href: "/admin/modules?category=carbon_sustainability",
      },
    ],
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
    label: "Users & Staff",
    href: "/admin/users",
    icon: Users,
    children: [
      {
        label: "Tenant Admins",
        href: "/admin/users/admins",
      },
      {
        label: "Farmers & Producers",
        href: "/admin/users/farmers",
      },
      {
        label: "Commodity Buyers",
        href: "/admin/users/buyers",
      },
      {
        label: "Input Merchants",
        href: "/admin/users/merchants",
      },
    ],
  },

  {
    label: "Roles & Security",
    href: "/admin/roles",
    icon: ShieldCheck,
    children: [
      {
        label: "Permissions Matrix",
        href: "/admin/roles/permissions",
      },
    ],
  },

  {
    label: "Billing & Finance",
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