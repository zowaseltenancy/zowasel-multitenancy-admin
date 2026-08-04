"use client";

import { useMemo } from "react";
import { toast } from "sonner";
import { ArrowLeftRight, UserX } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useUsers } from "@/features/users/hooks/useUsers";
import { AssignedStaffMember, Organization } from "@/types/organization";

interface Props {
  organization: Organization;
  onAssign: (organizationId: string, slot: "primary" | "secondary", staff: AssignedStaffMember | null) => void;
  onSwap: (organizationId: string) => void;
}

function StaffSlot({
  label,
  staff,
  onPick,
  onUnassign,
  eligibleStaff,
}: {
  label: string;
  staff?: AssignedStaffMember;
  onPick: (staff: AssignedStaffMember) => void;
  onUnassign: () => void;
  eligibleStaff: AssignedStaffMember[];
}) {
  return (
    <div className="flex items-center justify-between gap-3 rounded-lg border p-3">
      <div>
        <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
          {label}
        </p>
        <p className="mt-1 font-medium">
          {staff ? staff.name : <span className="text-muted-foreground">Unassigned</span>}
        </p>
      </div>

      <div className="flex items-center gap-2">
        <select
          value=""
          onChange={(e) => {
            const staffId = e.target.value;
            if (!staffId) return;
            const picked = eligibleStaff.find((candidate) => candidate.id === staffId);
            if (picked) onPick(picked);
          }}
          className="h-8 rounded-lg border border-input bg-card px-2 text-xs font-medium outline-none focus-visible:border-primary cursor-pointer"
        >
          <option value="">{staff ? "Reassign..." : "Assign..."}</option>
          {eligibleStaff
            .filter((candidate) => candidate.id !== staff?.id)
            .map((candidate) => (
              <option key={candidate.id} value={candidate.id}>
                {candidate.name}
              </option>
            ))}
        </select>

        {staff && (
          <Button size="sm" variant="ghost" className="h-8 w-8 p-0" onClick={onUnassign} title="Unassign">
            <UserX className="h-3.5 w-3.5" />
          </Button>
        )}
      </div>
    </div>
  );
}

export default function StaffAssignmentCard({ organization, onAssign, onSwap }: Props) {
  const { users } = useUsers();

  const eligibleStaff = useMemo<AssignedStaffMember[]>(() => {
    return users
      .filter(
        (user) =>
          user.userCategory === "staff" &&
          (user.department === "Sales" || user.department === "Regional Operations") &&
          (user.geographicScopeLevel !== "country" ||
            !organization.countryCode ||
            user.countryCode === organization.countryCode ||
            user.countryCode === "all")
      )
      .map((user) => ({ id: user.id, name: `${user.firstName} ${user.lastName}` }));
  }, [users, organization.countryCode]);

  const handleAssign = (slot: "primary" | "secondary", staff: AssignedStaffMember) => {
    onAssign(organization.id, slot, staff);
    toast.success(`${staff.name} assigned as ${slot} contact for ${organization.name}. Notification email sent to staff and client.`);
  };

  const handleUnassign = (slot: "primary" | "secondary") => {
    onAssign(organization.id, slot, null);
    toast.info(`${slot === "primary" ? "Primary" : "Secondary"} staff unassigned from ${organization.name}.`);
  };

  const handleSwap = () => {
    onSwap(organization.id);
    toast.success(`Primary and secondary staff swapped for ${organization.name}.`);
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Staff Assignment</CardTitle>
        {(organization.assignedStaff?.primary || organization.assignedStaff?.secondary) && (
          <Button size="sm" variant="outline" className="gap-1.5" onClick={handleSwap}>
            <ArrowLeftRight className="h-3.5 w-3.5" />
            Swap
          </Button>
        )}
      </CardHeader>

      <CardContent className="grid gap-3 md:grid-cols-2">
        <StaffSlot
          label="Primary Contact"
          staff={organization.assignedStaff?.primary}
          eligibleStaff={eligibleStaff}
          onPick={(staff) => handleAssign("primary", staff)}
          onUnassign={() => handleUnassign("primary")}
        />
        <StaffSlot
          label="Secondary Contact"
          staff={organization.assignedStaff?.secondary}
          eligibleStaff={eligibleStaff}
          onPick={(staff) => handleAssign("secondary", staff)}
          onUnassign={() => handleUnassign("secondary")}
        />
      </CardContent>
    </Card>
  );
}
