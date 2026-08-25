'use client';

import { useParams, useRouter } from 'next/navigation';
import { useStaff } from '@/hooks/useStaff';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Users, UserCog, Settings, ListChecks } from 'lucide-react';
import { useEffect, useState } from 'react';
import { Department, StaffMember } from '@/types/staff';
import { StaffListTable } from '@/components/staff/StaffListTable';

export default function DepartmentDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { repo } = useStaff();
  const [mounted, setMounted] = useState(false);
  const [dept, setDept] = useState<Department | null>(null);
  const [members, setMembers] = useState<StaffMember[]>([]);

  useEffect(() => { setMounted(true); }, []);
  useEffect(() => {
    if (!mounted) return;
    const d = repo.getDepartmentById(params.id as string);
    if (!d) { router.push('/admin/staff/departments'); return; }
    setDept(d);
    setMembers(repo.getAllStaff().filter(s => s.department === d.name));
  }, [mounted, params.id]);

  if (!dept) return <div className="p-6 text-center">Loading...</div>;

  const head = dept.headId ? repo.getStaffById(dept.headId) : null;

  return (
    <div className="p-6 space-y-6 max-w-5xl mx-auto">
      <Button variant="ghost" onClick={() => router.back()} className="mb-2">
        <ArrowLeft className="h-4 w-4 mr-2" /> Back
      </Button>

      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">{dept.name}</h2>
          <p className="text-muted-foreground">{dept.description}</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={() => router.push(`/admin/staff/departments/${dept.id}/roles`)}>
            <Settings className="h-4 w-4 mr-2" /> Department Roles
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <Users className="h-4 w-4" /> Total Members
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">{members.length}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <UserCog className="h-4 w-4" /> Department Head
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">{head ? `${head.firstName} ${head.lastName}` : '—'}</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Members</CardTitle>
        </CardHeader>
        <CardContent>
          <StaffListTable staff={members} roles={repo.getRoles()} />
        </CardContent>
      </Card>
    </div>
  );
}