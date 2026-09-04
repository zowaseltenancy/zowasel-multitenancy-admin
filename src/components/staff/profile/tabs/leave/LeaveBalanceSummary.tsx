export interface LeaveQuota {
  type: string;
  name: string;
  entitled: number;
  used: number;
  pending: number;
  available: number;
  color: string;
  bg: string;
}

export const DEFAULT_LEAVE_BALANCES: LeaveQuota[] = [
  { type: 'ANNUAL', name: 'Annual Leave', entitled: 20, used: 4, pending: 2, available: 14, color: 'text-emerald-600 dark:text-emerald-400', bg: 'bg-emerald-500/10' },
  { type: 'SICK', name: 'Sick Leave', entitled: 10, used: 1, pending: 0, available: 9, color: 'text-blue-600 dark:text-blue-400', bg: 'bg-blue-500/10' },
  { type: 'COMPASSIONATE', name: 'Compassionate', entitled: 5, used: 0, pending: 0, available: 5, color: 'text-purple-600 dark:text-purple-400', bg: 'bg-purple-500/10' },
  { type: 'MATERNITY/PATERNITY', name: 'Parental Leave', entitled: 14, used: 0, pending: 0, available: 14, color: 'text-pink-600 dark:text-pink-400', bg: 'bg-pink-500/10' },
  { type: 'UNPAID', name: 'Unpaid Leave', entitled: 0, used: 0, pending: 0, available: 0, color: 'text-slate-600 dark:text-slate-400', bg: 'bg-slate-500/10' },
];

interface LeaveBalanceSummaryProps {
  balances?: LeaveQuota[];
}

export function LeaveBalanceSummary({ balances = DEFAULT_LEAVE_BALANCES }: LeaveBalanceSummaryProps) {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 pt-1">
      {balances.map((item) => (
        <div
          key={item.type}
          className="rounded-xl border border-border/80 bg-muted/20 p-3.5 space-y-2"
        >
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground truncate">
              {item.name}
            </span>
            <span className="text-[10px] font-mono px-1 rounded bg-muted text-muted-foreground">
              2026
            </span>
          </div>

          <div>
            <div className="flex items-baseline gap-1">
              <span className="text-2xl font-bold font-mono tracking-tight text-slate-900 dark:text-white">
                {item.available}
              </span>
              <span className="text-xs text-muted-foreground font-medium">days left</span>
            </div>
          </div>

          <div className="pt-2 border-t border-border/50 text-[10.5px] text-muted-foreground flex justify-between">
            <span>Used: {item.used}d</span>
            <span>Entitled: {item.entitled}d</span>
          </div>
        </div>
      ))}
    </div>
  );
}