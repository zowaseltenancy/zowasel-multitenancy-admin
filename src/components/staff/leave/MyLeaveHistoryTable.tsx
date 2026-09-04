'use client';

import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { LeaveRequest } from '@/types/staff';
import { formatDate, StatusBadge } from './leaveUtils';

interface MyLeaveHistoryTableProps {
  requests: LeaveRequest[];
  userName: string;
  userDepartment: string;
  onWithdraw: (id: string) => void;
  onSelectAbsence: (leave: LeaveRequest) => void;
}

export function MyLeaveHistoryTable({
  requests,
  userName,
  userDepartment,
  onWithdraw,
  onSelectAbsence,
}: MyLeaveHistoryTableProps) {
  return (
    <Card className="border border-border/60 rounded-2xl bg-card shadow-2xs overflow-hidden">
      <CardHeader className="p-4 sm:p-5 border-b border-border/50 flex flex-row items-center justify-between">
        <div>
          <CardTitle className="text-base font-bold text-foreground">
            My Submissions & History
          </CardTitle>
          <p className="text-xs text-muted-foreground mt-0.5">
            Records of leave applications submitted by {userName} ({userDepartment}).
          </p>
        </div>
        <Badge variant="secondary" className="text-xs font-bold">
          {requests.length} Record{requests.length === 1 ? '' : 's'}
        </Badge>
      </CardHeader>
      <CardContent className="p-0">
        <Table>
          <TableHeader>
            <TableRow className="bg-muted/30 border-b border-border/60">
              <TableHead className="text-xs font-bold pl-4">Type</TableHead>
              <TableHead className="text-xs font-bold">Date Range</TableHead>
              <TableHead className="text-xs font-bold text-center">Working Days</TableHead>
              <TableHead className="text-xs font-bold">Reason & Justification</TableHead>
              <TableHead className="text-xs font-bold">Status</TableHead>
              <TableHead className="text-xs font-bold text-right pr-4">Action</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {requests.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-8 text-xs text-muted-foreground">
                  No leave requests submitted yet. Click &quot;Request Time Off&quot; to apply.
                </TableCell>
              </TableRow>
            ) : (
              requests.map((req) => (
                <TableRow key={req.id} className="hover:bg-muted/20 border-b border-border/40 text-xs">
                  <TableCell className="pl-4 font-semibold text-foreground">
                    {req.type}
                  </TableCell>
                  <TableCell className="font-mono text-muted-foreground text-[11.5px]">
                    {formatDate(req.startDate)} → {formatDate(req.endDate)}
                  </TableCell>
                  <TableCell className="text-center font-semibold font-mono">
                    {req.workingDays}d
                  </TableCell>
                  <TableCell className="max-w-xs truncate text-muted-foreground">
                    {req.reason}
                  </TableCell>
                  <TableCell>
                    <StatusBadge status={req.status} />
                  </TableCell>
                  <TableCell className="text-right pr-4">
                    {(req.status || '').toLowerCase() === 'pending' ? (
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => onWithdraw(req.id)}
                        className="h-7 text-xs text-rose-600 hover:bg-rose-500/10 cursor-pointer"
                      >
                        Withdraw
                      </Button>
                    ) : (
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => onSelectAbsence(req)}
                        className="h-7 text-xs text-muted-foreground hover:text-foreground cursor-pointer"
                      >
                        View
                      </Button>
                    )}
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
