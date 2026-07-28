import Link from "next/link";
import { Building2, Calendar, Mail, Phone, Shield } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import UserRoleBadge from "./UserRoleBadge";
import UserStatusBadge from "./UserStatusBadge";
import { PlatformUser } from "@/types/user";

interface Props {
  user: PlatformUser;
}

export default function UserProfileHero({ user }: Props) {
  return (
    <Card className="overflow-hidden">
      <CardContent className="p-6">
        <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
          <div className="flex items-center gap-5">
            <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-primary/10 text-2xl font-bold text-primary">
              {user.firstName[0]}
              {user.lastName[0]}
            </div>
            <div>
              <div className="flex items-center gap-3">
                <h1 className="text-2xl font-bold">
                  {user.firstName} {user.lastName}
                </h1>
                <UserStatusBadge status={user.status} />
              </div>
              <div className="mt-2 flex flex-wrap items-center gap-3 text-sm text-muted-foreground">
                <div className="flex items-center gap-1.5">
                  <Shield className="h-4 w-4 text-primary" />
                  <UserRoleBadge role={user.role} />
                </div>
                <span>•</span>
                <Link
                  href={`/admin/organizations/${user.organizationId}`}
                  className="flex items-center gap-1.5 text-primary hover:underline"
                >
                  <Building2 className="h-4 w-4" />
                  {user.organizationName}
                </Link>
              </div>
            </div>
          </div>

          <div className="flex flex-wrap gap-4 text-sm text-muted-foreground border-t pt-4 md:border-t-0 md:pt-0">
            <div className="flex items-center gap-2">
              <Mail className="h-4 w-4" />
              <span>{user.email}</span>
            </div>
            <div className="flex items-center gap-2">
              <Phone className="h-4 w-4" />
              <span>{user.phone}</span>
            </div>
            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4" />
              <span>Joined {user.dateJoined}</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
