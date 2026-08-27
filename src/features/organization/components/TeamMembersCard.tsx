'use client';

import { Users } from 'lucide-react';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { statusBadgeClass } from '@/lib/statusTone';
import { TeamMember } from '@/types/organization';

interface Props {
  members: TeamMember[];
}

// The accounts that can actually sign in to this business, from the detail
// response's `teamMembers`. Previously fetched and rendered nowhere — the team
// tab showed only key officers, so a business with members still looked empty.
//
// Distinct from key officers (a role in the business, usually no login) and
// from field agents (a member holding the FIELD_AGENT role, listed on its own
// tab).
export default function TeamMembersCard({ members }: Props) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-base font-semibold">
          <Users className="h-4 w-4 text-primary" />
          Team Members ({members.length})
        </CardTitle>
      </CardHeader>

      <CardContent>
        {members.length === 0 ? (
          <p className="py-4 text-center text-sm text-muted-foreground">
            No team members have been added to this organization.
          </p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="border-b border-border bg-muted/40 text-xs uppercase text-muted-foreground">
                <tr>
                  <th className="px-4 py-3 font-medium">Name</th>
                  <th className="px-4 py-3 font-medium">Email</th>
                  <th className="px-4 py-3 font-medium">Role</th>
                  <th className="px-4 py-3 font-medium">Joined</th>
                  <th className="px-4 py-3 font-medium">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {members.map((member) => (
                  <tr key={member.id} className="hover:bg-muted/30">
                    <td className="px-4 py-3 font-medium text-foreground">{member.name}</td>
                    <td className="px-4 py-3 text-muted-foreground">{member.email}</td>
                    <td className="px-4 py-3">
                      <span className="inline-flex items-center rounded border border-border bg-muted/50 px-2 py-0.5 text-xs font-semibold capitalize">
                        {member.role}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-muted-foreground">
                      {member.joinedAt ? new Date(member.joinedAt).toLocaleDateString() : '—'}
                    </td>
                    <td className="px-4 py-3">
                      <span
                        className={`inline-flex items-center rounded border px-2 py-0.5 text-xs font-semibold ${statusBadgeClass(
                          member.isActive ? 'success' : 'neutral',
                        )}`}
                      >
                        {member.isActive ? 'Active' : 'Inactive'}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
