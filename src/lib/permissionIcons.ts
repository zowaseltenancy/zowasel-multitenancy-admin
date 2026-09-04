import React from 'react';
import {
  Building2,
  FileCheck2,
  Layers,
  CreditCard,
  UserCog,
  ShieldCheck,
  SlidersHorizontal,
  Shield,
} from 'lucide-react';
import { PermissionCategory } from '@/types/permissions';

export function getCategoryIcon(category: PermissionCategory): React.ComponentType<{ className?: string }> {
  switch (category) {
    case 'organizations': return Building2;
    case 'kyb': return FileCheck2;
    case 'modules': return Layers;
    case 'billing': return CreditCard;
    case 'users': return UserCog;
    case 'roles':
    case 'permissions': return ShieldCheck;
    case 'system': return SlidersHorizontal;
    default: return Shield;
  }
}
