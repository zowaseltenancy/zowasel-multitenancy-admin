import { useState, useMemo } from 'react';
import { useWhatsAppRepo } from '@/hooks/useWhatsAppRepository';
import { useAuth } from '@/hooks/useAuth';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { PlusCircle } from 'lucide-react';

interface Props {
  selectedChatId: string | null;
  onSelectChat: (chatId: string) => void;
  onMobileBack: () => void;
  /** Opens the quick-add contact panel. Passed by WorkspaceLayout. */
  onNewContact: () => void;
}

export function Sidebar({ selectedChatId, onSelectChat, onMobileBack,onNewContact  }: Props) {
  const { repo, resetTrigger } = useWhatsAppRepo();
  const user = useAuth();

  const [filter, setFilter] = useState<'all' | 'mine' | 'unassigned' | 'starred'>('all');
  const [selectedOrgId, setSelectedOrgId] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');

  const organizations = useMemo(() => repo.getOrganizations(), [repo, resetTrigger]);

  const chats = useMemo(() => {
    const f: any = {};
    if (filter === 'mine') f.agentId = user.id;
    else if (filter === 'unassigned') f.agentId = null;
    else if (filter === 'starred') f.starred = true;
    if (selectedOrgId !== 'all') f.organizationId = selectedOrgId;
    if (searchQuery) f.searchQuery = searchQuery;
    return repo.getConversations(f);
  }, [filter, selectedOrgId, searchQuery, repo, user.id, resetTrigger]);

  // Ensure we never map over undefined
  if (!organizations) {
    return (
      <div className="flex flex-col h-full bg-sidebar text-sidebar-foreground items-center justify-center">
        <p className="text-muted-foreground">Loading organisations…</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full bg-sidebar text-sidebar-foreground">
      <div className="p-4 border-b border-sidebar-border">
        <h2 className="text-lg font-semibold mb-3">Inbox

            <button
                onClick={onNewContact}
                className="w-full mt-3 flex items-center justify-center gap-2 text-sm py-2 border border-dashed border-sidebar-border rounded-md hover:bg-sidebar-accent transition"
                >
                <PlusCircle className="h-4 w-4" />
                New External Contact
            </button>
        </h2>

        <select
            value={selectedOrgId}
            onChange={(e) => setSelectedOrgId(e.target.value)}
            className="w-full p-2 rounded text-sm bg-[#1e2535] text-white border border-gray-600 focus:outline-none focus:ring-2 focus:ring-primary/50 appearance-none mb-3"
            style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' fill='white' viewBox='0 0 16 16'%3E%3Cpath d='M8 11L3 6h10z'/%3E%3C/svg%3E")`, backgroundRepeat: 'no-repeat', backgroundPosition: 'right 0.75rem center', backgroundSize: '12px' }}
            >
            <option value="all" className="bg-[#1e2535] text-white">All Organisations</option>
            {organizations.map((org) => (
                <option key={org.id} value={org.id} className="bg-[#1e2535] text-white">
                {org.name}
                </option>
            ))}
            </select>

        <div className="flex gap-1 mb-3">
          {(['all', 'mine', 'unassigned', 'starred'] as const).map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-2 py-1 text-xs rounded-md ${
                filter === f
                  ? 'bg-sidebar-primary text-sidebar-primary-foreground'
                  : 'hover:bg-sidebar-accent'
              }`}
            >
              {f.charAt(0).toUpperCase() + f.slice(1)}
            </button>
          ))}
        </div>

        <Input
          placeholder="Search chats..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      <div className="flex-1 overflow-y-auto">
        {chats.map((chat) => {
          const contact = repo.getContact(chat.contactId);
          const isActive = chat.id === selectedChatId;
          return (
            <div
              key={chat.id}
              onClick={() => onSelectChat(chat.id)}
              className={`flex items-center gap-3 p-3 cursor-pointer hover:bg-sidebar-accent transition-colors ${
                isActive ? 'bg-sidebar-accent' : ''
              }`}
            >
              <div className="relative">
                <img
                  src={contact?.avatarUrl || 'https://i.pravatar.cc/40?u=default'}
                  className="w-10 h-10 rounded-full"
                  alt=""
                />
                <span className="absolute bottom-0 right-0 w-3 h-3 bg-primary rounded-full border-2 border-sidebar" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex justify-between">
                  <span className="font-medium truncate">{contact?.displayName}</span>
                  <span className="text-xs text-muted-foreground">
                    {chat.lastMessage?.timestamp
                      ? new Date(chat.lastMessage.timestamp).toLocaleTimeString([], {
                          hour: '2-digit',
                          minute: '2-digit',
                        })
                      : ''}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <p className="text-sm text-muted-foreground truncate">
                    {chat.lastMessage?.body || 'No messages yet'}
                  </p>
                  {chat.unreadCount > 0 && (
                    <Badge
                      variant="default"
                      className="ml-1 h-5 w-5 rounded-full p-0 flex items-center justify-center text-xs"
                    >
                      {chat.unreadCount}
                    </Badge>
                  )}
                </div>
              </div>
            </div>
          );
        })}
        {chats.length === 0 && (
          <div className="p-4 text-sm text-muted-foreground">No conversations</div>
        )}
      </div>
    </div>
  );
}