'use client';

import { useRouter } from 'next/navigation';
import { Users, UserPlus } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { StaffListTable } from '@/components/staff/StaffListTable';
import { StaffMember, StaffRole } from '@/types/staff';

interface DepartmentMembersTabProps {
  deptName: string;
  filteredMembers: StaffMember[];
  roles: StaffRole[];
}

export function DepartmentMembersTab({
  deptName,
  filteredMembers,
  roles,
}: DepartmentMembersTabProps) {
  const router = useRouter();

  return (
    <Card className="border rounded-2xl bg-card overflow-hidden shadow-2xs">
      <CardHeader className="py-4 px-6 border-b bg-muted/20">
        <CardTitle className="text-sm font-semibold flex items-center justify-between">
          <span>Staff Assigned to {deptName}</span>
          <span className="text-xs text-muted-foreground font-normal">
            {filteredMembers.length} {filteredMembers.length === 1 ? 'member' : 'members'} found
          </span>
        </CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        {filteredMembers.length === 0 ? (
          <div className="text-center py-12 space-y-3">
            <Users className="h-8 w-8 text-muted-foreground mx-auto opacity-50" />
            <p className="text-sm font-semibold">No members in this department yet</p>
            <Button
              size="sm"
              variant="outline"
              className="gap-1.5 text-xs"
              onClick={() => router.push('/admin/staff/onboarding')}
            >
              <UserPlus className="h-3.5 w-3.5" /> Onboard First Member
            </Button>
          </div>
        ) : (
          <StaffListTable staff={filteredMembers} roles={roles} />
        )}
      </CardContent>
    </Card>
  );
}