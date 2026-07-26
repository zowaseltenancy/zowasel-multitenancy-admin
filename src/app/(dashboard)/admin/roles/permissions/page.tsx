import { ShieldCheck } from "lucide-react";

import ComingSoonPanel from "@/components/shared/ComingSoonPanel";

export default function PermissionsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">
          Permissions
        </h1>

        <p className="mt-2 max-w-2xl text-muted-foreground">
          Define what each admin role can see and do.
        </p>
      </div>

      <ComingSoonPanel
        icon={ShieldCheck}
        title="Permission management is coming soon"
        description="Role-based permission scopes for internal admin staff will be configurable from here."
      />
    </div>
  );
}
