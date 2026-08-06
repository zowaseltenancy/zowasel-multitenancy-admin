// app/(admin)/admin/staff/[id]/page.tsx
'use client';
import { useState } from 'react';
import { useParams } from 'next/navigation';
import { useStaff } from '@/hooks/useStaff';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ArrowLeft, CheckCircle, XCircle } from 'lucide-react';
import Link from 'next/link';

export default function StaffProfilePage() {
  const { id } = useParams<{ id: string }>();
  const { repo, refresh } = useStaff();
  const [activeTab, setActiveTab] = useState<'leave' | 'history'>('leave');

  const staff = repo.getStaffById(id);
  const role = staff ? repo.getRoles().find((r) => r.id === staff.roleId) : null;
  const leaves = repo.getLeaveRequests().filter((r) => r.staffId === id);

  if (!staff) return <div className="p-6">Staff not found.</div>;

  const handleApproveLeave = (leaveId: string) => {
    repo.updateLeaveRequest(leaveId, { status: 'approved', approvedBy: 'staff-alice' });
    refresh();
  };
  const handleRejectLeave = (leaveId: string) => {
    repo.updateLeaveRequest(leaveId, { status: 'rejected', approvedBy: 'staff-alice' });
    refresh();
  };

  return (
    <div className="p-6 space-y-6">
      <Link
        href="/admin/staff/directory"
        className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground"
      >
        <ArrowLeft className="h-4 w-4 mr-1" /> Back to Directory
      </Link>

      <div className="flex flex-col lg:flex-row gap-6">
        {/* Personal Info Card */}
        <Card className="flex-1 lg:max-w-sm">
          <CardHeader>
            <div className="flex items-center gap-4">
              <img
                src={staff.avatarUrl || 'https://i.pravatar.cc/80?u=default'}
                className="w-16 h-16 rounded-full object-cover"
                alt=""
              />
              <div>
                <h2 className="text-xl font-bold">
                  {staff.firstName} {staff.lastName}
                </h2>
                <p className="text-muted-foreground text-sm">{role?.name}</p>
                <Badge
                  variant={staff.status === 'active' ? 'default' : 'destructive'}
                  className="mt-1 capitalize"
                >
                  {staff.status}
                </Badge>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-3 text-sm">
            <div>
              <span className="font-medium">Email:</span> {staff.email}
            </div>
            <div>
              <span className="font-medium">Phone:</span> {staff.phone}
            </div>
            <div>
              <span className="font-medium">Department:</span> {staff.department}
            </div>
            <div>
              <span className="font-medium">Joined:</span>{' '}
              {new Date(staff.dateJoined).toLocaleDateString()}
            </div>
            <div>
              <span className="font-medium">Last Active:</span>{' '}
              {new Date(staff.lastActive).toLocaleString()}
            </div>
            <div>
              <span className="font-medium">Permissions:</span>
              <div className="flex flex-wrap gap-1 mt-1">
                {role?.permissions.map((p) => (
                  <Badge key={p} variant="outline" className="text-xs">
                    {p}
                  </Badge>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Tabs Section */}
        <div className="flex-1">
          <div className="flex gap-1 border-b border-border mb-4">
            <button
              onClick={() => setActiveTab('leave')}
              className={`px-4 py-2 text-sm font-medium rounded-t-lg transition-colors ${
                activeTab === 'leave'
                  ? 'bg-card border-x border-t border-border text-foreground'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              Leave Requests
            </button>
            <button
              onClick={() => setActiveTab('history')}
              className={`px-4 py-2 text-sm font-medium rounded-t-lg transition-colors ${
                activeTab === 'history'
                  ? 'bg-card border-x border-t border-border text-foreground'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              Activity
            </button>
          </div>

          {activeTab === 'leave' && (
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Leave History</CardTitle>
              </CardHeader>
              <CardContent>
                {leaves.length === 0 ? (
                  <p className="text-muted-foreground text-sm">No leave requests.</p>
                ) : (
                  <div className="space-y-3">
                    {leaves.map((leave) => (
                      <div
                        key={leave.id}
                        className="flex items-center justify-between border-b pb-2"
                      >
                        <div>
                          <p className="text-sm font-medium">
                            {leave.startDate} → {leave.endDate}
                          </p>
                          <p className="text-xs text-muted-foreground">{leave.reason}</p>
                          <Badge
                            variant={
                              leave.status === 'approved'
                                ? 'default'
                                : leave.status === 'rejected'
                                ? 'destructive'
                                : 'secondary'
                            }
                            className="text-xs capitalize mt-1"
                          >
                            {leave.status}
                          </Badge>
                        </div>
                        {leave.status === 'pending' && (
                          <div className="flex gap-2">
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleApproveLeave(leave.id)}
                            >
                              <CheckCircle className="h-4 w-4 mr-1 text-green-600" /> Approve
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleRejectLeave(leave.id)}
                            >
                              <XCircle className="h-4 w-4 mr-1 text-red-600" /> Reject
                            </Button>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          )}

          {activeTab === 'history' && (
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Recent Activity</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground text-sm">
                  Activity log coming soon.
                </p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}