'use client';

import React from 'react';
import { Loader2, Send } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { StaffMember } from '@/types/staff';

interface SendMessageDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  staff: StaffMember | null;
  subject: string;
  onSubjectChange: (val: string) => void;
  body: string;
  onBodyChange: (val: string) => void;
  sending: boolean;
  onSend: (e: React.FormEvent) => void;
}

export function SendMessageDialog({
  open,
  onOpenChange,
  staff,
  subject,
  onSubjectChange,
  body,
  onBodyChange,
  sending,
  onSend,
}: SendMessageDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-base font-bold">
            Send Direct Message
          </DialogTitle>
          <DialogDescription className="text-xs text-muted-foreground">
            Dispatch an official email or message to {staff?.firstName} {staff?.lastName}.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={onSend} className="space-y-3.5 py-2 text-xs">
          <div className="space-y-1">
            <Label className="text-xs font-semibold">Recipient</Label>
            <Input
              value={`${staff?.firstName || ''} ${staff?.lastName || ''} <${staff?.email || ''}>`}
              disabled
              className="h-9 text-xs bg-muted/40 font-mono"
            />
          </div>

          <div className="space-y-1">
            <Label className="text-xs font-semibold">Subject</Label>
            <Input
              value={subject}
              onChange={(e) => onSubjectChange(e.target.value)}
              placeholder="e.g. Schedule Update"
              required
              className="h-9 text-xs"
            />
          </div>

          <div className="space-y-1">
            <Label className="text-xs font-semibold">Message</Label>
            <Textarea
              value={body}
              onChange={(e) => onBodyChange(e.target.value)}
              placeholder="Type your message here..."
              rows={4}
              required
              className="text-xs"
            />
          </div>

          <DialogFooter className="gap-2 pt-2">
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => onOpenChange(false)}
              className="text-xs cursor-pointer"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              size="sm"
              disabled={sending}
              className="bg-[#00A651] hover:bg-[#008C44] text-white font-bold text-xs gap-1.5 cursor-pointer"
            >
              {sending && <Loader2 className="h-3.5 w-3.5 animate-spin" />}
              <Send className="h-3.5 w-3.5" /> Send
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
