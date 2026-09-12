"use client";
import { UserPlus, FileText, Star, MoreVertical, Trash2, ArrowLeftRight, PanelRightClose } from 'lucide-react';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import PermissionGate from '@/components/PermissionGate';
import { Contact, Conversation } from '@/lib/whatsapp/types';

export default function ConversationHeader({
  conversation,
  contact,
  staffMembers,
  onAssign,
  onStar,
  onToggleContext,
  onDelete,
  onExport,
}: {
  conversation: Conversation;
  contact?: Contact;
  staffMembers: any[];
  onAssign: (agentId?: string) => void;
  onStar: () => void;
  onToggleContext: () => void;
  onDelete: () => void;
  onExport: () => void;
}) {
  const assignedAgent = staffMembers.find((s) => s.id === conversation.assignedAgentId);

  return (
    <div className="flex items-center justify-between p-4 border-b bg-card">
      <div className="flex items-center gap-3">
        <Button variant="ghost" size="icon" onClick={onToggleContext}>
          <PanelRightClose className="h-5 w-5" />
        </Button>
        <Avatar>
          <AvatarFallback>{contact?.name?.charAt(0) || '?'}</AvatarFallback>
        </Avatar>
        <div>
          <h2 className="font-semibold">{contact?.name}</h2>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <span>{contact?.phone}</span>
            <Badge variant="outline">{conversation.department}</Badge>
            {assignedAgent && (
              <Badge variant="secondary">
                Assigned: {assignedAgent.firstName} {assignedAgent.lastName}
              </Badge>
            )}
          </div>
        </div>
      </div>

      <div className="flex items-center gap-1">
        <PermissionGate permission="whatsapp:assign_agent">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" title="Assign Agent">
                <UserPlus className="h-5 w-5" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              {staffMembers.map((s) => (
                <DropdownMenuItem key={s.id} onClick={() => onAssign(s.id)}>
                  {s.firstName} {s.lastName}
                </DropdownMenuItem>
              ))}
              <DropdownMenuItem onClick={() => onAssign(undefined)}>Unassign</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </PermissionGate>

        <PermissionGate permission="whatsapp:export_chat">
          <Button variant="ghost" size="icon" onClick={onExport} title="Export chat">
            <FileText className="h-5 w-5" />
          </Button>
        </PermissionGate>

        <Button variant="ghost" size="icon" onClick={onStar} title="Star">
          <Star className={`h-5 w-5 ${conversation.starred ? 'fill-yellow-400 text-yellow-400' : ''}`} />
        </Button>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon"><MoreVertical className="h-5 w-5" /></Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <PermissionGate permission="whatsapp:delete_chat">
              <DropdownMenuItem className="text-destructive" onClick={onDelete}>
                <Trash2 className="h-4 w-4 mr-2" /> Delete conversation
              </DropdownMenuItem>
            </PermissionGate>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
}