'use client';

import { Check, X, Eye, Lock } from 'lucide-react';
import { TableCell } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';

interface QueueRowActionsProps {
  isSelfReview: boolean;
  onRowClick: () => void;
  onApprove: () => void;
  onReject: () => void;
}

export function QueueRowActions({
  isSelfReview,
  onRowClick,
  onApprove,
  onReject,
}: QueueRowActionsProps) {
  return (
    <TableCell className="py-3.5 text-right pr-5" onClick={(e) => e.stopPropagation()}>
      <div className="flex items-center justify-end gap-1.5">
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger
              render={
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={onRowClick}
                  className="h-8 w-8 p-0 text-muted-foreground hover:text-foreground cursor-pointer"
                >
                  <Eye className="h-4 w-4" />
                </Button>
              }
            />
            <TooltipContent side="top">Review Details</TooltipContent>
          </Tooltip>
        </TooltipProvider>

        {isSelfReview ? (
          <Badge
            variant="outline"
            className="text-[10px] font-semibold text-amber-600 dark:text-amber-400 border-amber-500/30 bg-amber-500/10 px-2 py-1 gap-1"
          >
            <Lock className="h-3 w-3" /> Self-review blocked
          </Badge>
        ) : (
          <>
            <Button
              type="button"
              size="sm"
              onClick={onApprove}
              className="h-7.5 px-2.5 bg-[#00A651] hover:bg-[#008C44] text-white font-bold text-xs gap-1 cursor-pointer shadow-2xs"
            >
              <Check className="h-3 w-3" /> Approve
            </Button>

            <Button
              type="button"
              size="sm"
              variant="ghost"
              onClick={onReject}
              className="h-7.5 px-2 text-rose-600 hover:bg-rose-500/10 font-semibold text-xs gap-1 cursor-pointer"
            >
              <X className="h-3 w-3" /> Reject
            </Button>
          </>
        )}
      </div>
    </TableCell>
  );
}