import { type LucideIcon } from 'lucide-react';
import { getDepartmentTheme as resolveDepartmentTheme } from '@/config/departmentThemes';

// Card presentation for a department, derived from the one department theme
// resolver in config/departmentThemes.
//
// This file used to hold a second, parallel palette: a
// `Record<StaffDepartment, …>` over nine hardcoded names, alongside a
// `getDepartmentTheme` in config doing the same job with a different shape.
// Two resolvers meant a department could render in one colour on the dashboard
// and another on its own detail page — and both were keyed on names that
// mostly did not exist, so the grid showed four permanently-empty cards while
// the real departments went uncounted.
//
// Now there is one resolver, keyword-matched then hash-assigned, and this
// module only narrows its output to the three fields the cards consume.

export interface DepartmentCardTheme {
  icon: LucideIcon;
  cardBg: string;
  iconClassName: string;
}

export function getDepartmentTheme(name: string): DepartmentCardTheme {
  const theme = resolveDepartmentTheme(name);

  return {
    icon: theme.icon,
    // The cards want a tinted surface plus a border; the shared theme carries
    // both as separate tokens.
    cardBg: `${theme.tintBg} ${theme.badgeBorder}`,
    iconClassName: `${theme.iconBg} ${theme.iconColor} ${theme.badgeBorder}`,
  };
}
