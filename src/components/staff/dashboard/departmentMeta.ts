import {
  Building2,
  Cpu,
  Layers,
  Landmark,
  TrendingUp,
  Wallet,
  ShieldCheck,
  Globe2,
  UserCheck,
} from 'lucide-react';
import { StaffDepartment } from '@/types/user';

export const DEPARTMENT_META: Record<
  StaffDepartment,
  { icon: typeof Building2; cardBg: string; iconClassName: string }
> = {
  Executive: {
    icon: Building2,
    cardBg: 'bg-cyan-500/5 dark:bg-cyan-500/10 border-cyan-500/20',
    iconClassName: 'bg-cyan-500/15 text-cyan-600 border-cyan-500/30 dark:text-cyan-400',
  },
  Technology: {
    icon: Cpu,
    cardBg: 'bg-indigo-500/5 dark:bg-indigo-500/10 border-indigo-500/20',
    iconClassName: 'bg-indigo-500/15 text-indigo-600 border-indigo-500/30 dark:text-indigo-400',
  },
  Programs: {
    icon: Layers,
    cardBg: 'bg-emerald-500/5 dark:bg-emerald-500/10 border-emerald-500/20',
    iconClassName: 'bg-emerald-500/15 text-emerald-600 border-emerald-500/30 dark:text-emerald-400',
  },
  Fintech: {
    icon: Wallet,
    cardBg: 'bg-amber-500/5 dark:bg-amber-500/10 border-amber-500/20',
    iconClassName: 'bg-amber-500/15 text-amber-600 border-amber-500/30 dark:text-amber-400',
  },
  Sales: {
    icon: TrendingUp,
    cardBg: 'bg-rose-500/5 dark:bg-rose-500/10 border-rose-500/20',
    iconClassName: 'bg-rose-500/15 text-rose-600 border-rose-500/30 dark:text-rose-400',
  },
  Finance: {
    icon: Landmark,
    cardBg: 'bg-purple-500/5 dark:bg-purple-500/10 border-purple-500/20',
    iconClassName: 'bg-purple-500/15 text-purple-600 border-purple-500/30 dark:text-purple-400',
  },
  Administration: {
    icon: UserCheck,
    cardBg: 'bg-slate-500/5 dark:bg-slate-500/10 border-slate-500/20',
    iconClassName: 'bg-slate-500/15 text-slate-600 border-slate-500/30 dark:text-slate-400',
  },
  Compliance: {
    icon: ShieldCheck,
    cardBg: 'bg-red-500/5 dark:bg-red-500/10 border-red-500/30',
    iconClassName: 'bg-red-500/15 text-red-600 border-red-500/30 dark:text-red-400',
  },
  'Regional Operations': {
    icon: Globe2,
    cardBg: 'bg-teal-500/5 dark:bg-teal-500/10 border-teal-500/20',
    iconClassName: 'bg-teal-500/15 text-teal-600 border-teal-500/30 dark:text-teal-400',
  },
};

export const DEPARTMENTS = Object.keys(DEPARTMENT_META) as StaffDepartment[];