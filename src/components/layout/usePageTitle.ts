import { navigation } from "@/config/navigation";

// Flat href -> label lookup across every top-level item and its children —
// built once, not per-render.
const LABELS_BY_HREF: Record<string, string> = (() => {
  const map: Record<string, string> = {};
  for (const item of navigation) {
    map[item.href] = item.label;
    for (const child of item.children ?? []) {
      map[child.href] = child.label;
    }
  }
  return map;
})();

const SORTED_HREFS = Object.keys(LABELS_BY_HREF).sort((a, b) => b.length - a.length);

// Resolves a pathname to a page label for the browser tab — exact match
// first (never a naive startsWith on the first candidate, that's what broke
// FinanceHubNav's active-tab state before), then falls back to the longest
// matching parent route for pages not in the nav (e.g. a provider's own
// detail page falls back to "Payment Providers").
export function resolvePageTitle(pathname: string): string {
  if (LABELS_BY_HREF[pathname]) return LABELS_BY_HREF[pathname];

  const parent = SORTED_HREFS.find(
    (href) => pathname.startsWith(href + "/") || pathname === href
  );
  return parent ? LABELS_BY_HREF[parent] : "Zowasel Admin";
}
