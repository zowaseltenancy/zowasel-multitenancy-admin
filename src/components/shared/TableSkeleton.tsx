import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

interface Props {
  /** Header labels, so the skeleton keeps the table's real column count. */
  columns: string[];
  rows?: number;
}

/**
 * Placeholder that holds the table's shape while the first page loads.
 *
 * Rendering the real empty state instead ("No results match this filter") is
 * actively misleading — it tells the user their filter found nothing when the
 * request has not even come back yet.
 */
export default function TableSkeleton({ columns, rows = 5 }: Props) {
  return (
    <Card className="overflow-hidden p-0" aria-busy="true" aria-live="polite">
      <span className="sr-only">Loading…</span>
      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm">
          <thead className="border-b border-border bg-muted/40 text-xs uppercase text-muted-foreground">
            <tr>
              {columns.map((column) => (
                <th key={column} className="px-6 py-4 font-medium">
                  {column}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {Array.from({ length: rows }).map((_, rowIndex) => (
              <tr key={rowIndex} className="border-b border-border/60 last:border-0">
                {columns.map((column, columnIndex) => (
                  <td key={column} className="px-6 py-4">
                    {/* First column is the identity column — wider bar. */}
                    <Skeleton className={columnIndex === 0 ? "h-4 w-48" : "h-4 w-20"} />
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Card>
  );
}
