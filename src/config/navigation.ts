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
        label: "Pending Approval",
        href: "/admin/organizations/pending",
      },
      {
        label: "Cooperatives",
        href: "/admin/organizations/cooperatives",
      },
    ],
  },

  {
    label: "Users",
    href: "/admin/users",
    icon: Users,
    children: [
      {
        label: "Admins",
        href: "/admin/users/admins",
      },
      {
        label: "Farmers",
        href: "/admin/users/farmers",
      },
      {
        label: "Buyers",
        href: "/admin/users/buyers",
      },
      {
        label: "Merchants",
        href: "/admin/users/merchants",
      },
    ],
  },

  {
    label: "Roles",
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
    label: "Modules",
    href: "/admin/modules",
    icon: LayoutGrid,
    children: [
      {
        label: "Installed Modules",
        href: "/admin/modules/installed",
      },
      {
        label: "Marketplace",
        href: "/admin/modules/marketplace",
      },
    ],
  },

  {
    label: "KYB",
    href: "/admin/kyb",
    icon: FileCheck,
    children: [
      {
        label: "Pending",
        href: "/admin/kyb/pending",
      },
      {
        label: "Approved",
        href: "/admin/kyb/approved",
      },
      {
        label: "Rejected",
        href: "/admin/kyb/rejected",
      },
    ],
  },

  {
    label: "Billing",
    href: "/admin/billing",
    icon: CreditCard,
    children: [
      {
        label: "Providers",
        href: "/admin/billing/providers",
      },
      {
        label: "Currency",
        href: "/admin/billing/currency",
      },
      {
        label: "Transactions",
        href: "/admin/billing/transactions",
      },
      {
        label: "Subscriptions",
        href: "/admin/billing/subscriptions",
      },
      {
        label: "Settings",
        href: "/admin/billing/settings",
      },
    ],
  },
];