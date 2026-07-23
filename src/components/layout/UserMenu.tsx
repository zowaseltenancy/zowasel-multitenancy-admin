import { Bell } from "lucide-react";

export default function UserMenu() {
  return (
    <div className="flex items-center gap-4">
      <button className="rounded-xl border border-border p-2 transition hover:bg-muted">
        <Bell className="h-5 w-5" />
      </button>

      <div className="flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary text-sm font-semibold text-white">
          BS
        </div>

        <div className="hidden text-left md:block">
          <p className="text-sm font-semibold">
            Busayo
          </p>

          <p className="text-xs text-muted-foreground">
            Super Admin
          </p>
        </div>
      </div>
    </div>
  );
}