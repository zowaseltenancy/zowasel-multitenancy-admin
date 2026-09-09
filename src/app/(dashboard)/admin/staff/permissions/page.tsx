// Placeholder. This file was committed empty, which Next treats as a build
// error ("is not a module") because every page must export a component — it is
// what was failing the build after the type errors were cleared.
//
// The route is not linked from navigation.ts, so nothing reaches it. Left as a
// stub rather than deleted so the intended route survives; replace this with
// the real screen. Roles and permissions are otherwise managed at
// /admin/staff/roles.
export default function StaffPermissionsPage() {
  return (
    <div className="space-y-2">
      <h1 className="text-3xl font-bold tracking-tight">Permissions</h1>
      <p className="text-sm text-muted-foreground">
        This screen hasn&apos;t been built yet. Manage roles and their permissions
        under Staff → Roles &amp; Permissions.
      </p>
    </div>
  );
}
