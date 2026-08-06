'use client';
import { StaffMember, StaffRole } from '@/types/staff';
import { useStaff } from '@/hooks/useStaff';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { MoreHorizontal, Pencil, Trash2, UserCog } from 'lucide-react';
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
    <div className="rounded-lg border border-border overflow-hidden">
      <table className="w-full text-sm">
        <thead>
          <tr className="bg-muted/50 border-b border-border">
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
              className="border-b border-border hover:bg-muted/30 cursor-pointer"
              onClick={() => router.push(`/admin/staff/${member.id}`)}
            >
              <td className="p-3">
                <div className="flex items-center gap-2">
                  <img
                    src={member.avatarUrl || 'https://i.pravatar.cc/30?u=default'}
                    className="w-8 h-8 rounded-full object-cover"
                    alt=""
                  />
                  <span className="font-medium">
                    {member.firstName} {member.lastName}
                  </span>
                </div>
              </td>
              <td className="p-3 hidden md:table-cell text-muted-foreground">
                {member.email}
              </td>
              <td className="p-3 hidden lg:table-cell text-muted-foreground">
                {member.phone}
              </td>
              <td className="p-3 hidden xl:table-cell text-muted-foreground">
                {member.department}
              </td>
              <td className="p-3">
                <Badge variant="secondary">{getRoleName(member.roleId)}</Badge>
              </td>
              <td className="p-3">
                <Badge
                  variant={
                    member.status === 'active' ? 'default' : 'destructive'
                  }
                  className="capitalize"
                >
                  {member.status}
                </Badge>
              </td>
              <td
                className="p-3 text-right"
                onClick={(e) => e.stopPropagation()}
              >
                <DropdownMenu>
                    <DropdownMenuTrigger>
                        <button
                        type="button"
                        className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 hover:bg-accent hover:text-accent-foreground h-9 w-9"
                        >
                        <MoreHorizontal className="h-4 w-4" />
                        </button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => router.push(`/admin/staff/${member.id}`)}>
                        <UserCog className="h-4 w-4 mr-2" /> View Profile
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => {/* edit */}}>
                        <Pencil className="h-4 w-4 mr-2" /> Edit
                        </DropdownMenuItem>
                        <DropdownMenuItem
                        className="text-destructive"
                        onClick={() => handleDelete(member.id)}
                        >
                        <Trash2 className="h-4 w-4 mr-2" /> Delete
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                    </DropdownMenu>
              </td>
            </tr>
          ))}
          {staff.length === 0 && (
            <tr>
              <td
                colSpan={7}
                className="text-center text-muted-foreground py-8"
              >
                No staff found.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}