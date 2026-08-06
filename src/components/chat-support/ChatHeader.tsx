import { Chat, WhatsAppContact } from '@/types/whatsapp';
import { useWhatsAppRepo } from '@/hooks/useWhatsAppRepository';
import { useAuth } from '@/hooks/useAuth';
import { PermissionGate } from '../PermissionGate';
import { WHATSAPP_PERMISSIONS } from '@/types/permissions';
import { Button } from '@/components/ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Star, MoreVertical, ChevronLeft } from 'lucide-react';

interface Props {
  chat: Chat;
  onBack: () => void;
  onToggleContext: () => void;
  contextOpen: boolean;
}

export function ChatHeader({ chat, onBack, onToggleContext, contextOpen,onNewContact }: Props) {
  const { repo, refresh } = useWhatsAppRepo();
  const user = useAuth();
  const contact = repo.getContact(chat.contactId) as WhatsAppContact;
  const agents = repo.getConversations().map(c => c.assignedAgentId ? repo.getContact(c.assignedAgentId) : null).filter(Boolean);

  const toggleStar = () => {
    repo.toggleStar(chat.id);
    refresh();
  };

  const handleAssign = (agentId: string | null) => {
    repo.assignAgent(chat.id, agentId);
    refresh();
  };

const handleDelete = () => {
  repo.deleteChat(chat.id);
  refresh();
  onBack(); // navigate away
};

  return (
    <div className="flex items-center justify-between p-3 border-b border-border bg-card">
      <div className="flex items-center gap-3">
        <button onClick={onBack} className="lg:hidden">
          <ChevronLeft className="h-6 w-6" />
        </button>
        <div className="flex items-center gap-2 cursor-pointer" onClick={onToggleContext}>
          <img
            src={contact?.avatarUrl || 'https://i.pravatar.cc/40?u=default'}
            className="w-10 h-10 rounded-full"
            alt=""
          />
          <div>
            <h3 className="font-medium text-sm">{contact?.displayName}</h3>
            <p className="text-xs text-muted-foreground">
              {contact?.department && <span className="mr-2">{contact.department}</span>}
              {/* Simulate online/last seen */}
              <span className="text-primary">● Online</span>
            </p>
          </div>
        </div>
      </div>
      <div className="flex items-center gap-2">
        <PermissionGate required={[WHATSAPP_PERMISSIONS.MANAGE_TAGS]}>
          <button onClick={toggleStar} className="p-1">
            <Star
              className={`h-5 w-5 ${chat.isStarred ? 'fill-yellow-500 text-yellow-500' : 'text-muted-foreground'}`}
            />
          </button>
        </PermissionGate>

        <PermissionGate required={[WHATSAPP_PERMISSIONS.ASSIGN_AGENT]}>
          <DropdownMenu>
            <DropdownMenuTrigger className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 border border-input bg-background shadow-sm hover:bg-accent hover:text-accent-foreground h-9 px-3">
                Assign
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => handleAssign(null)}>Unassigned</DropdownMenuItem>
              {agents.map((agent) => (
                <DropdownMenuItem key={agent?.id} onClick={() => handleAssign(agent!.id)}>
                  {agent?.displayName}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        </PermissionGate>

        <DropdownMenu>
          <DropdownMenuTrigger className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 hover:bg-accent hover:text-accent-foreground h-9 w-9">
                <MoreVertical className="h-4 w-4" />
            </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <PermissionGate required={[WHATSAPP_PERMISSIONS.EXPORT_CHAT]}>
              <DropdownMenuItem>Export Chat</DropdownMenuItem>
            </PermissionGate>
            <PermissionGate required={[WHATSAPP_PERMISSIONS.DELETE_CHAT]}>
              <DropdownMenuItem className="text-destructive">Delete Chat</DropdownMenuItem>
            </PermissionGate>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
}