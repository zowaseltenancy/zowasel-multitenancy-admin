'use client';
import { useStaff } from '@/hooks/useStaff';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { CheckCircle, XCircle } from 'lucide-react';

export default function LeaveRequestsPage() {
  const { repo, refresh } = useStaff();
  const requests = repo.getLeaveRequests();
  const staffList = repo.getAllStaff();

  const handleAction = (id: string, status: 'approved' | 'rejected') => {
    repo.updateLeaveRequest(id, { status, approvedBy: 'staff-alice' }); // current user
    refresh();
  };

  return (
    <div className="p-6 space-y-6">
      <div>
        <h2 className="text-2xl font-bold">Leave Requests</h2>
        <p className="text-muted-foreground">Manage staff leave requests</p>
      </div>
      <div className="grid gap-4 md:grid-cols-2">
        {requests.map(req => {
          const staff = staffList.find(s => s.id === req.staffId);
          return (
            <Card key={req.id}>
              <CardHeader className="flex flex-row items-center justify-between">
                <div>
                  <CardTitle className="text-base">{staff?.firstName} {staff?.lastName}</CardTitle>
                  <p className="text-sm text-muted-foreground">{staff?.department}</p>
                </div>
                <Badge variant={req.status === 'approved' ? 'default' : req.status === 'rejected' ? 'destructive' : 'secondary'}>
                  {req.status}
                </Badge>
              </CardHeader>
              <CardContent className="space-y-2">
                <p className="text-sm">{req.startDate} → {req.endDate}</p>
                <p className="text-sm text-muted-foreground">{req.reason}</p>
                {req.status === 'pending' && (
                  <div className="flex gap-2 mt-2">
                    <Button size="sm" onClick={() => handleAction(req.id, 'approved')}><CheckCircle className="h-4 w-4 mr-1" /> Approve</Button>
                    <Button size="sm" variant="outline" onClick={() => handleAction(req.id, 'rejected')}><XCircle className="h-4 w-4 mr-1" /> Reject</Button>
                  </div>
                )}
              </CardContent>
            </Card>
          );
        })}
        {requests.length === 0 && <p className="text-muted-foreground col-span-full text-center py-8">No leave requests.</p>}
      </div>
    </div>
  );
}