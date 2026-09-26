import Link from "next/link";
import {
  Eye,
  Users,
  MoreHorizontal,
  ShieldAlert,
  ShieldCheck,
  LockOpen,
  UserCheck,
  UserX,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import UserAvatar from "@/components/shared/UserAvatar";
import OnboardedByCell from "@/components/shared/OnboardedByCell";
import GenderBadge from "@/components/shared/GenderBadge";
import UserRoleBadge from "./UserRoleBadge";
import UserStatusBadge from "./UserStatusBadge";
import BuyerTierBadge from "./BuyerTierBadge";
import { PlatformUser } from "@/types/user";

/**
 * The account actions a row offers, when the rows come from the API.
 *
 * Optional because the category directories still render fixture rows, and
 * offering Suspend on a row that does not exist server-side would be a button
 * that can only fail.
 */
export interface UserRowActions {
  /** Suspension and deactivation are different states, not one switch. */
  onSetActive: (user: PlatformUser, isActive: boolean) => void;
  onSetSuspended: (user: PlatformUser, isSuspended: boolean) => void;
  /** Clears a failed-sign-in lockout. */
  onUnlock: (user: PlatformUser) => void;
  isMutating?: boolean;
}

interface Props {
  users: PlatformUser[];
  actions?: UserRowActions;
}

export default function UserTable({ users, actions }: Props) {
  return (
    <div className="rounded-xl border bg-card shadow-sm overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm">
          <thead className="border-b bg-muted/50 text-xs font-semibold uppercase text-muted-foreground">
            <tr>
              <th className="p-4">User</th>
              <th className="p-4">Role & Position</th>
              <th className="p-4">Organization</th>
              <th className="p-4">Onboarding</th>
              <th className="p-4">Status</th>
              <th className="p-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {users.map((user) => (
              <tr key={user.id} className="hover:bg-muted/30 transition-colors">
                <td className="p-4 font-medium">
                  <div className="flex items-center gap-3">
                    <UserAvatar
                      avatarUrl={user.avatarUrl}
                      firstName={user.firstName}
                      lastName={user.lastName}
                      className="h-9 w-9"
                    />
                    <div>
                      <div className="font-semibold text-foreground flex items-center gap-2">
                        <span>{user.firstName} {user.lastName}</span>
                        <GenderBadge gender={user.gender} />
                      </div>
                      <div className="text-xs text-muted-foreground">{user.email}</div>
                    </div>
                  </div>
                </td>
                <td className="p-4">
                  <div className="space-y-1">
                    <div className="flex items-center gap-1.5 flex-wrap">
                      <UserRoleBadge role={user.role} />
                      {user.buyerTier && <BuyerTierBadge tier={user.buyerTier} />}
                    </div>
                    {user.position && (
                      <p className="text-xs text-muted-foreground font-medium">
                        {user.position}
                      </p>
                    )}
                  </div>
                </td>
                <td className="p-4">
                  <Link
                    href={`/admin/organizations/${user.organizationId}`}
                    className="text-primary hover:underline font-medium"
                  >
                    {user.organizationName}
                  </Link>
                </td>
                <td className="p-4">
                  {user.role === "Field Agent" && user.agentMeta?.onboardedEntitiesCount !== undefined ? (
                    <div className="flex items-center gap-1.5 text-xs text-primary font-medium">
                      <Users className="h-3.5 w-3.5" />
                      <span>{user.agentMeta.onboardedEntitiesCount} entities onboarded</span>
                    </div>
                  ) : (
                    <OnboardedByCell onboardedByAgent={user.onboardedByAgent} />
                  )}
                </td>
                <td className="p-4">
                  <UserStatusBadge status={user.status} />
                </td>
                <td className="p-4 text-right">
                  <div className="flex items-center justify-end gap-2">
                    <Link
                      href={`/admin/users/${user.id}`}
                      className="inline-flex items-center gap-1.5 rounded-lg border px-3 py-1.5 text-xs font-medium transition-colors hover:bg-accent"
                    >
                      <Eye className="h-3.5 w-3.5" />
                      View Profile
                    </Link>

                    {actions && (
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8"
                            disabled={actions.isMutating}
                            aria-label={`Actions for ${user.firstName} ${user.lastName}`}
                          >
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-52">
                          {/* Suspended covers a lockout too — the badge has no
                              separate word for it — so both ways out are
                              offered rather than guessing which applies. */}
                          {user.status === "suspended" ? (
                            <>
                              <DropdownMenuItem
                                onClick={() => actions.onSetSuspended(user, false)}
                                className="gap-2 text-xs cursor-pointer"
                              >
                                <ShieldCheck className="h-3.5 w-3.5 text-[#00A651]" />
                                Lift suspension
                              </DropdownMenuItem>
                              <DropdownMenuItem
                                onClick={() => actions.onUnlock(user)}
                                className="gap-2 text-xs cursor-pointer"
                              >
                                <LockOpen className="h-3.5 w-3.5 text-muted-foreground" />
                                Unlock account
                              </DropdownMenuItem>
                            </>
                          ) : (
                            <DropdownMenuItem
                              onClick={() => actions.onSetSuspended(user, true)}
                              className="gap-2 text-xs cursor-pointer text-amber-600 dark:text-amber-400"
                            >
                              <ShieldAlert className="h-3.5 w-3.5" />
                              Suspend user
                            </DropdownMenuItem>
                          )}

                          {user.status === "inactive" ? (
                            <DropdownMenuItem
                              onClick={() => actions.onSetActive(user, true)}
                              className="gap-2 text-xs cursor-pointer text-[#00A651]"
                            >
                              <UserCheck className="h-3.5 w-3.5" />
                              Reactivate account
                            </DropdownMenuItem>
                          ) : (
                            <DropdownMenuItem
                              onClick={() => actions.onSetActive(user, false)}
                              className="gap-2 text-xs cursor-pointer"
                            >
                              <UserX className="h-3.5 w-3.5 text-muted-foreground" />
                              Deactivate account
                            </DropdownMenuItem>
                          )}
                        </DropdownMenuContent>
                      </DropdownMenu>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
