'use client';
import { StaffMember, StaffRole } from '@/types/staff';
import { useStaff } from '@/hooks/useStaff';
import { Badge } from '@/components/ui/badge';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { MoreHorizontal } from 'lucide-react';
import { useRouter } from 'next/navigation';

interface Props {
  staff: StaffMember[];
  roles: StaffRole[];
}

export function StaffListTable({ staff, roles }: Props) {
  const { repo, refresh } = useStaff();
  const router = useRouter();

  const getRoleName = (roleId: string) =>
    roles.find((r) => r.id === roleId)?.name || 'Unknown';

  const handleDelete = (id: string) => {
    if (confirm('Delete this staff member?')) {
      repo.deleteStaff(id);
      refresh();
    }
  };

  return (
    <div className="rounded-lg border overflow-hidden">
      <table className="w-full text-sm">
        <thead>
          <tr className="bg-muted/50 border-b">
            <th className="text-left p-3 font-medium">Name</th>
            <th className="text-left p-3 font-medium hidden md:table-cell">Email</th>
            <th className="text-left p-3 font-medium hidden lg:table-cell">Phone</th>
            <th className="text-left p-3 font-medium hidden xl:table-cell">Department</th>
            <th className="text-left p-3 font-medium">Role</th>
            <th className="text-left p-3 font-medium">Status</th>
            <th className="text-right p-3 font-medium">Actions</th>
          </tr>
        </thead>
        <tbody>
          {staff.map((member) => (
            <tr
              key={member.id}
              className="border-b hover:bg-muted/30 cursor-pointer"
              onClick={() => router.push(`/admin/staff/${member.id}`)}
            >
              <td className="p-3">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full overflow-hidden bg-primary/10 flex items-center justify-center">
                    {member.avatarUrl ? (
                      <img src={member.avatarUrl} alt="" className="h-full w-full object-cover" />
                    ) : (
                      <span className="text-sm font-bold text-primary uppercase">
                        {member.firstName?.[0]}{member.lastName?.[0]}
                      </span>
                    )}
                  </div>
                  <span className="font-medium">{member.firstName} {member.lastName}</span>
                </div>
              </td>
              <td className="p-3 hidden md:table-cell text-muted-foreground">{member.email}</td>
              <td className="p-3 hidden lg:table-cell text-muted-foreground">{member.phone}</td>
              <td className="p-3 hidden xl:table-cell text-muted-foreground">{member.department}</td>
              <td className="p-3">
                <div className="flex flex-wrap items-center gap-1">
                  {member.systemRole && member.systemRole !== 'staff' && (
                    <Badge variant="outline" className={`text-[10px] px-1.5 py-0 font-semibold ${
                      member.systemRole === 'super_admin'
                        ? 'border-amber-500/40 text-amber-600 bg-amber-500/10'
                        : 'border-[#00A651]/40 text-[#00A651] bg-[#00A651]/10'
                    }`}>
                      {member.systemRole === 'super_admin' ? 'Super Admin' : 'Admin'}
                    </Badge>
                  )}
                  {member.roleIds && member.roleIds.length > 0 ? (
                    member.roleIds.map((rId) => (
                      <Badge key={rId} variant="secondary" className="text-[10.5px]">
                        {getRoleName(rId)}
                      </Badge>
                    ))
                  ) : (
                    <Badge variant="secondary" className="text-[10.5px]">
                      {getRoleName(member.roleId)}
                    </Badge>
                  )}
                </div>
              </td>
              <td className="p-3">
                <Badge variant={member.status === 'active' ? 'default' : 'destructive'} className="capitalize">
                  {member.status}
                </Badge>
              </td>
              <td className="p-3 text-right" onClick={(e) => e.stopPropagation()}>
                <DropdownMenu>
                  <DropdownMenuTrigger className="inline-flex items-center justify-center rounded-md p-2 hover:bg-accent hover:text-accent-foreground">
                    <MoreHorizontal className="h-4 w-4" />
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem onClick={() => router.push(`/admin/staff/${member.id}`)}>
                      View Profile
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => router.push(`/admin/staff/${member.id}/edit`)}>
                      Edit
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => handleDelete(member.id)} className="text-destructive">
                      Delete
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </td>
            </tr>
          ))}
          {staff.length === 0 && (
            <tr>
              <td colSpan={7} className="text-center text-muted-foreground py-8">
                No staff found.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}