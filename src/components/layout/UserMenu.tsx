export default function UserMenu() {
  return (
    <div className="flex items-center gap-2.5">
      <div className="relative flex h-9 w-9 items-center justify-center rounded-full bg-primary text-sm font-semibold text-white shadow-2xs">
        BS
        <span
          className="absolute bottom-0 right-0 h-2.5 w-2.5 rounded-full bg-emerald-500 ring-2 ring-card"
          title="Online"
        />
      </div>

      <div className="hidden text-left md:block">
        <p className="text-sm font-semibold leading-tight text-foreground">
          Busayo
        </p>

        <p className="text-xs text-muted-foreground leading-tight">
          Super Admin
        </p>
      </div>
    </div>
  );
}