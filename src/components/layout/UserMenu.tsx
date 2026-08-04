import { Bell } from "lucide-react";

export default function UserMenu() {
  return (
    <div className="flex items-center gap-3">
      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary text-sm font-semibold text-white shadow-2xs">
        BS
      </div>

      <div className="hidden text-left md:block">
        <p className="text-sm font-semibold text-foreground">
          Busayo
        </p>

        <p className="text-xs text-muted-foreground">
          Super Admin
        </p>
      </div>
    </div>
  );
}