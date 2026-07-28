import PermissionsListView from "@/features/permissions/components/PermissionsListView";

export default function PermissionsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Permissions & Roles</h1>
        <p className="mt-1 max-w-2xl text-sm text-muted-foreground">
          Configure role-based access control (RBAC), permission scopes, and system access levels for internal platform administration staff.
        </p>
      </div>

      <PermissionsListView />
    </div>
  );
}
