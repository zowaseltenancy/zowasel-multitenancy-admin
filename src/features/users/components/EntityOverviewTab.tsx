import Link from "next/link";
import { Building2 } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import UserAvatar from "@/components/shared/UserAvatar";
import GenderBadge from "@/components/shared/GenderBadge";
import UserStatusBadge from "./UserStatusBadge";
import UserRoleBadge from "./UserRoleBadge";
import BuyerTierBadge from "./BuyerTierBadge";
import { USER_CATEGORY_LABELS } from "@/constants/user";
import { PlatformUser } from "@/types/user";

interface Props {
  user: PlatformUser;
}

function titleCase(value?: string) {
  if (!value || value === "all") return null;
  return value
    .split("_")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}

function Field({ label, value }: { label: string; value?: string | null }) {
  return (
    <div>
      <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">{label}</p>
      <p className="mt-1 font-medium text-foreground break-words">{value || "—"}</p>
    </div>
  );
}

// The redesigned "Entity Overview" primary tab — a single full-width card,
// 3 columns matching Busayo's hand sketch: photo + names | core identity &
// contact | BVN/National ID + geographic jurisdiction.
export default function EntityOverviewTab({ user }: Props) {
  const regionLabel = [titleCase(user.subRegion), titleCase(user.continent)].filter(Boolean).join(" / ");

  return (
    <Card>
      <CardContent className="p-6">
        <div className="flex flex-wrap items-center gap-2 border-b pb-6 mb-6">
          <UserStatusBadge status={user.status} />
          <UserRoleBadge role={user.role} />
          {user.buyerTier && <BuyerTierBadge tier={user.buyerTier} />}
          <GenderBadge gender={user.gender} />
        </div>

        <div className="grid gap-8 md:grid-cols-3">
          <div className="space-y-5">
            <UserAvatar
              avatarUrl={user.avatarUrl}
              firstName={user.firstName}
              lastName={user.lastName}
              className="h-24 w-24 text-3xl"
            />
            <Field label="Surname" value={user.lastName} />
            <Field label="Other Names" value={user.firstName} />
          </div>

          <div className="space-y-5">
            <Field label="Entity Type" value={user.userCategory ? USER_CATEGORY_LABELS[user.userCategory] : null} />
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Organization Name
              </p>
              <Link
                href={`/admin/organizations/${user.organizationId}`}
                className="mt-1 flex items-center gap-1.5 font-medium text-primary hover:underline"
              >
                <Building2 className="h-3.5 w-3.5" />
                {user.organizationName}
              </Link>
            </div>
            <Field label="Email Address" value={user.email} />
            <Field label="Phone Number" value={user.phone} />
          </div>

          <div className="space-y-5">
            {user.bvn && <Field label="BVN" value={user.bvn} />}
            <Field label="National ID No." value={user.nationalId} />
            <Field label="Country" value={user.countryName} />
            <Field label="Sub Region / Region" value={regionLabel} />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
