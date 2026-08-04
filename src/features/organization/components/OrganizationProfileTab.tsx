import KybStatusBadge from '@/components/shared/KybStatusBadge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { AssignedStaffMember, Organization } from '@/types/organization';
import StaffAssignmentCard from './StaffAssignmentCard';

interface Props {
  organization: Organization;
  onAssignStaff: (organizationId: string, slot: "primary" | "secondary", staff: AssignedStaffMember | null) => void;
  onSwapStaff: (organizationId: string) => void;
}

function Info({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="text-sm text-muted-foreground">{label}</p>

      <p className="mt-2 font-medium">{value}</p>
    </div>
  );
}

export default function OrganizationProfileTab({ organization, onAssignStaff, onSwapStaff }: Props) {
  const moduleCount = organization.subscriptions.reduce(
    (total, subscription) => total + subscription.activeModules.length,
    0
  );

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Business Profile</CardTitle>
        </CardHeader>

        <CardContent className="grid gap-6 md:grid-cols-2">
          <Info label="Business Name" value={organization.name} />

          <Info label="Business ID" value={organization.businessId} />

          <Info label="Type" value={organization.type} />

          <Info
            label="Registered"
            value={new Date(organization.createdAt).toLocaleDateString()}
          />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Account Owner</CardTitle>
        </CardHeader>

        <CardContent className="grid gap-6 md:grid-cols-3">
          <Info label="Name" value={organization.owner.name} />

          <Info label="Email" value={organization.owner.email} />

          <Info label="Phone" value={organization.owner.phone} />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Summary</CardTitle>
        </CardHeader>

        <CardContent className="grid gap-6 md:grid-cols-4">
          <Info label="Active Modules" value={moduleCount.toString()} />

          <Info
            label="Subscriptions"
            value={organization.subscriptions.length.toString()}
          />

          <Info
            label="Team Members"
            value={organization.teamMembers.length.toString()}
          />

          <div>
            <p className="text-sm text-muted-foreground">KYB Status</p>

            <div className="mt-2">
              <KybStatusBadge status={organization.kybStatus} />
            </div>
          </div>
        </CardContent>
      </Card>

      <StaffAssignmentCard
        organization={organization}
        onAssign={onAssignStaff}
        onSwap={onSwapStaff}
      />
    </div>
  );
}
