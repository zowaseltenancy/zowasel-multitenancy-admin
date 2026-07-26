import { ShieldCheck } from "lucide-react";

import ComingSoonPanel from "@/components/shared/ComingSoonPanel";

export default function AdminUsersPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">
          Admins
        </h1>

        <p className="mt-2 max-w-2xl text-muted-foreground">
          Internal platform admin accounts.
        </p>
      </div>

      <ComingSoonPanel
        icon={ShieldCheck}
        title="Admin account management is coming soon"
        description="Manage internal team access to this admin panel from here once this section is built out."
      />
    </div>
  );
}
