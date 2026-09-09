'use client';

import { ArrowLeft, Edit3, UserPlus, UserX, Mail, Phone, ShieldCheck, Building2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Department, StaffMember } from '@/types/staff';
import { getDepartmentIcon } from '@/lib/departmentIcons';
import { useRouter } from 'next/navigation';

interface DepartmentDetailHeaderProps {
  dept: Department;
  head: StaffMember | null;
  membersCount: number;
  onEditDept: () => void;
}

export function DepartmentDetailHeader({
  dept,
  head,
  membersCount,
  onEditDept,
}: DepartmentDetailHeaderProps) {
  const router = useRouter();
  const DeptIcon = getDepartmentIcon(dept.name);

  const headInitials = head
    ? `${head.firstName?.[0] || ''}${head.lastName?.[0] || ''}`.toUpperCase()
    : null;

  return (
    <div className="space-y-4">
      {/* Back Button & Actions */}
      <div>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => router.push('/admin/staff/departments')}
          className="mb-2 -ml-2 text-muted-foreground hover:text-foreground gap-1.5"
        >
          <ArrowLeft className="h-4 w-4" /> Back to Departments
        </Button>

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-xl bg-muted flex items-center justify-center text-foreground shrink-0 border">
              <DeptIcon className="h-5 w-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">{dept.name}</h1>
                <Badge variant="secondary" className="text-xs">
                  {membersCount} {membersCount === 1 ? 'member' : 'members'}
                </Badge>
              </div>
              <p className="text-sm text-muted-foreground mt-0.5">{dept.description || 'Department details and overview'}</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" onClick={onEditDept} className="gap-1.5">
              <Edit3 className="h-4 w-4" /> Edit Department
            </Button>
            <Button size="sm" onClick={() => router.push('/admin/staff/onboarding')} className="gap-1.5">
              <UserPlus className="h-4 w-4" /> Onboard Staff
            </Button>
          </div>
        </div>
      </div>

      {/* Leadership Profile Card & Unit Meta */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="bg-card border rounded-xl shadow-2xs md:col-span-2">
          <CardContent className="p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              {head ? (
                head.avatarUrl ? (
                  <img src={head.avatarUrl} alt={head.firstName} className="h-12 w-12 rounded-full object-cover border" />
                ) : (
                  <div className="h-12 w-12 rounded-full bg-muted text-foreground font-semibold text-base flex items-center justify-center border">
                    {headInitials}
                  </div>
                )
              ) : (
                <div className="h-12 w-12 rounded-full bg-muted text-muted-foreground font-semibold text-base flex items-center justify-center border border-dashed">
                  <UserX className="h-5 w-5" />
                </div>
              )}

              <div>
                <div className="flex items-center gap-2">
                  <span className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">Department Head</span>
                  {head && <Badge variant="secondary" className="text-[10px]">Appointed</Badge>}
                </div>
                <p className="font-semibold text-base text-foreground mt-0.5">
                  {head ? `${head.firstName} ${head.lastName}` : 'No Department Head Appointed'}
                </p>
                {head ? (
                  <div className="flex items-center gap-4 mt-1 text-xs text-muted-foreground">
                    <span className="flex items-center gap-1.5"><Mail className="h-3.5 w-3.5" /> {head.email}</span>
                    {head.phone && <span className="flex items-center gap-1.5"><Phone className="h-3.5 w-3.5" /> {head.phone}</span>}
                  </div>
                ) : (
                  <p className="text-xs text-muted-foreground mt-0.5">Appoint a staff member to lead this unit and authorize requests.</p>
                )}
              </div>
            </div>

            <Button variant="outline" size="sm" onClick={onEditDept} className="text-xs">
              {head ? 'Reassign Head' : 'Appoint Head'}
            </Button>
          </CardContent>
        </Card>

        <Card className="bg-card border rounded-xl shadow-2xs">
          <CardContent className="p-5 flex flex-col justify-between h-full space-y-2">
            <span className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">Unit Status</span>
            <div className="flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-[#00A651]" />
              <span className="font-semibold text-sm">Active Operational Unit</span>
            </div>
            <p className="text-xs text-muted-foreground">All department members inherit core visibility and assigned unit roles.</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
