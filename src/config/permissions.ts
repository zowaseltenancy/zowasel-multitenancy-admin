import { PermissionModule } from '@/types/staff';
import { Building2, CreditCard, FileCheck, LayoutGrid, Megaphone, ShieldCheck, TrendingUp, UserCheck } from 'lucide-react';

export const PERMISSION_MODULES: PermissionModule[] = [
  { key: 'staff', label: 'Staff Management', icon: UserCheck },
  { key: 'kyb', label: 'KYB Review', icon: FileCheck },
  { key: 'finance', label: 'Finance', icon: TrendingUp },
  { key: 'modules', label: 'Modules', icon: LayoutGrid },
  { key: 'broadcast', label: 'Broadcasts', icon: Megaphone },
  { key: 'roles', label: 'Roles & Security', icon: ShieldCheck },
  { key: 'billing', label: 'Billing', icon: CreditCard },
  { key: 'organizations', label: 'Organizations', icon: Building2 },
];