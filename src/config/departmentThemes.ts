import {
  Trees,
  Code,
  TrendingUp,
  Wallet,
  Briefcase,
  ShieldCheck,
  Building2,
  Globe,
  LucideIcon,
} from 'lucide-react';

export interface DepartmentTheme {
  icon: LucideIcon;
  gradient: string;
  lightGradient: string;
  iconBg: string;
  iconColor: string;
  badgeBg: string;
  badgeBorder: string;
  badgeText: string;
  borderHover: string;
  ringFocus: string;
  tintBg: string;
}

export const DEFAULT_DEPT_THEME: DepartmentTheme = {
  icon: Building2,
  gradient: 'from-blue-600 to-indigo-600',
  lightGradient: 'from-blue-500/10 via-indigo-500/5 to-transparent',
  iconBg: 'bg-blue-500/15 dark:bg-blue-500/25',
  iconColor: 'text-blue-600 dark:text-blue-400',
  badgeBg: 'bg-blue-500/10',
  badgeBorder: 'border-blue-500/25',
  badgeText: 'text-blue-700 dark:text-blue-300',
  borderHover: 'hover:border-blue-500/40 hover:shadow-blue-500/5',
  ringFocus: 'focus-visible:ring-blue-500',
  tintBg: 'bg-blue-500/5',
};

export const DEPARTMENT_THEMES: Record<string, DepartmentTheme> = {
  'Field Agents': {
    icon: Trees,
    gradient: 'from-emerald-500 to-teal-600',
    lightGradient: 'from-emerald-500/15 via-teal-500/5 to-transparent',
    iconBg: 'bg-emerald-500/15 dark:bg-emerald-500/25',
    iconColor: 'text-emerald-600 dark:text-emerald-400',
    badgeBg: 'bg-emerald-500/10',
    badgeBorder: 'border-emerald-500/30',
    badgeText: 'text-emerald-700 dark:text-emerald-300',
    borderHover: 'hover:border-emerald-500/50 hover:shadow-emerald-500/5',
    ringFocus: 'focus-visible:ring-emerald-500',
    tintBg: 'bg-emerald-500/5',
  },
  'Technology': {
    icon: Code,
    gradient: 'from-indigo-500 via-purple-500 to-pink-500',
    lightGradient: 'from-indigo-500/15 via-purple-500/5 to-transparent',
    iconBg: 'bg-indigo-500/15 dark:bg-indigo-500/25',
    iconColor: 'text-indigo-600 dark:text-indigo-400',
    badgeBg: 'bg-indigo-500/10',
    badgeBorder: 'border-indigo-500/30',
    badgeText: 'text-indigo-700 dark:text-indigo-300',
    borderHover: 'hover:border-indigo-500/50 hover:shadow-indigo-500/5',
    ringFocus: 'focus-visible:ring-indigo-500',
    tintBg: 'bg-indigo-500/5',
  },
  'Sales': {
    icon: TrendingUp,
    gradient: 'from-amber-500 to-orange-600',
    lightGradient: 'from-amber-500/15 via-orange-500/5 to-transparent',
    iconBg: 'bg-amber-500/15 dark:bg-amber-500/25',
    iconColor: 'text-amber-600 dark:text-amber-400',
    badgeBg: 'bg-amber-500/10',
    badgeBorder: 'border-amber-500/30',
    badgeText: 'text-amber-700 dark:text-amber-300',
    borderHover: 'hover:border-amber-500/50 hover:shadow-amber-500/5',
    ringFocus: 'focus-visible:ring-amber-500',
    tintBg: 'bg-amber-500/5',
  },
  'Finance': {
    icon: Wallet,
    gradient: 'from-cyan-500 to-blue-600',
    lightGradient: 'from-cyan-500/15 via-blue-500/5 to-transparent',
    iconBg: 'bg-cyan-500/15 dark:bg-cyan-500/25',
    iconColor: 'text-cyan-600 dark:text-cyan-400',
    badgeBg: 'bg-cyan-500/10',
    badgeBorder: 'border-cyan-500/30',
    badgeText: 'text-cyan-700 dark:text-cyan-300',
    borderHover: 'hover:border-cyan-500/50 hover:shadow-cyan-500/5',
    ringFocus: 'focus-visible:ring-cyan-500',
    tintBg: 'bg-cyan-500/5',
  },
  'Programs': {
    icon: Briefcase,
    gradient: 'from-purple-500 to-violet-600',
    lightGradient: 'from-purple-500/15 via-violet-500/5 to-transparent',
    iconBg: 'bg-purple-500/15 dark:bg-purple-500/25',
    iconColor: 'text-purple-600 dark:text-purple-400',
    badgeBg: 'bg-purple-500/10',
    badgeBorder: 'border-purple-500/30',
    badgeText: 'text-purple-700 dark:text-purple-300',
    borderHover: 'hover:border-purple-500/50 hover:shadow-purple-500/5',
    ringFocus: 'focus-visible:ring-purple-500',
    tintBg: 'bg-purple-500/5',
  },
  'Compliance': {
    icon: ShieldCheck,
    gradient: 'from-rose-500 to-red-600',
    lightGradient: 'from-rose-500/15 via-red-500/5 to-transparent',
    iconBg: 'bg-rose-500/15 dark:bg-rose-500/25',
    iconColor: 'text-rose-600 dark:text-rose-400',
    badgeBg: 'bg-rose-500/10',
    badgeBorder: 'border-rose-500/30',
    badgeText: 'text-rose-700 dark:text-rose-300',
    borderHover: 'hover:border-rose-500/50 hover:shadow-rose-500/5',
    ringFocus: 'focus-visible:ring-rose-500',
    tintBg: 'bg-rose-500/5',
  },
  'Executive': {
    icon: Building2,
    gradient: 'from-sky-500 to-blue-600',
    lightGradient: 'from-sky-500/15 via-blue-500/5 to-transparent',
    iconBg: 'bg-sky-500/15 dark:bg-sky-500/25',
    iconColor: 'text-sky-600 dark:text-sky-400',
    badgeBg: 'bg-sky-500/10',
    badgeBorder: 'border-sky-500/30',
    badgeText: 'text-sky-700 dark:text-sky-300',
    borderHover: 'hover:border-sky-500/50 hover:shadow-sky-500/5',
    ringFocus: 'focus-visible:ring-sky-500',
    tintBg: 'bg-sky-500/5',
  },
  'Regional Operations': {
    icon: Globe,
    gradient: 'from-teal-500 to-emerald-600',
    lightGradient: 'from-teal-500/15 via-emerald-500/5 to-transparent',
    iconBg: 'bg-teal-500/15 dark:bg-teal-500/25',
    iconColor: 'text-teal-600 dark:text-teal-400',
    badgeBg: 'bg-teal-500/10',
    badgeBorder: 'border-teal-500/30',
    badgeText: 'text-teal-700 dark:text-teal-300',
    borderHover: 'hover:border-teal-500/50 hover:shadow-teal-500/5',
    ringFocus: 'focus-visible:ring-teal-500',
    tintBg: 'bg-teal-500/5',
  },
};

export function getDepartmentTheme(deptName?: string): DepartmentTheme {
  if (!deptName) return DEFAULT_DEPT_THEME;
  return DEPARTMENT_THEMES[deptName] || DEFAULT_DEPT_THEME;
}
