"use client";
import { useEffect, useMemo, useRef, useState } from 'react';
import { Search, ChevronDown, Star, Zap, Plus } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { toast } from 'sonner';
import { useStaff } from '@/hooks/useStaff';
import { useWhatsApp } from '@/context/whatsappContext';
import { Contact, Message, Conversation } from '@/lib/whatsapp/types';
import ConversationHeader from '@/components/messaging/ConversationHeader';
import MessageBubble from '@/components/messaging/MessageBubble';
import Composer from '@/components/messaging/Composer';
import ContextPanel from '@/components/messaging/ContextPanel';
import ContactDrawer from '@/components/messaging/ContactDrawer';
import DevUtilityBar from '@/components/messaging/DevUtilityBar';

export default function MessagingPage() {
  const { repo, currentUser, refresh } = useWhatsApp();
  const { repo: staffRepo } = useStaff();
  const staffMembers = useMemo(() => staffRepo.getAllStaff(), [staffRepo]);
  const departments = useMemo(
    () => Array.from(new Set(staffMembers.map((s) => s.department).filter(Boolean))).sort(),
    [staffMembers]
  );

  const [mounted, setMounted] = useState(false);
  const [activeFilter, setActiveFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [contextOpen, setContextOpen] = useState(true);
  const [showDev, setShowDev] = useState(false);
  const [contactDrawerOpen, setContactDrawerOpen] = useState(false);
  const [editingContact, setEditingContact] = useState<Contact | null>(null);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setMounted(true);
    const staffContacts: Contact[] = staffMembers.map((s) => ({
      id: `sc-${s.id}`,
      name: `${s.firstName} ${s.lastName}`,
      phone: s.phone || '',
      department: s.department,
      tags: [],
      metadata: {},
      source: 'directory',
      staffId: s.id,
    }));
    const existing = repo.getContacts();
    const merged = [
      ...existing.filter((c) => c.source === 'adhoc'),
      ...staffContacts,
    ];
    setContacts(merged);
    // persist staff contacts into repo
    staffContacts.forEach((c) => {
      if (!repo.getContact(c.id)) repo.addContact(c);
    });
    setConversations(repo.getConversations(activeFilter, currentUser.id));
  }, [staffMembers, currentUser.id]);

  useEffect(() => {
    if (!mounted) return;
    setConversations(repo.getConversations(activeFilter, currentUser.id));
  }, [activeFilter, mounted, currentUser.id]);

  const selected = selectedId ? repo.getConversation(selectedId) : null;
  const selectedContact = selected ? repo.getContact(selected.contactId) : undefined;

  const filtered = useMemo(() => {
    if (!searchTerm) return conversations;
    return conversations.filter((c) => {
      const contact = repo.getContact(c.contactId);
      return (
        contact?.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        contact?.phone.includes(searchTerm)
      );
    });
  }, [conversations, searchTerm, repo]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [selectedId, selected?.messages.length]);

  const handleSelect = (id: string) => {
    setSelectedId(id);
    repo.markAsRead(id);
    refresh();
  };

  const handleSend = (content: string, type: Message['type'], meta?: Message['meta']) => {
    if (!selectedId) return;
    repo.sendMessage(selectedId, content, type, 'agent', currentUser.id, meta);
    setConversations(repo.getConversations(activeFilter, currentUser.id));
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleInternalNote = (content: string) => {
    if (!selectedId) return;
    repo.sendMessage(selectedId, content, 'internal_note', 'internal', currentUser.id);
    repo.addNote(selectedId, currentUser.id, content);
    setConversations(repo.getConversations(activeFilter, currentUser.id));
  };

  const handleExport = () => {
    if (!selected) return;
    const blob = new Blob([JSON.stringify(selected.messages, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `chat-${selected.id}.json`;
    a.click();
    URL.revokeObjectURL(url);
    toast.success('Chat exported');
  };

  const handleDelete = () => {
    if (!selectedId) return;
    repo.deleteConversation(selectedId);
    setSelectedId(null);
    setConversations(repo.getConversations(activeFilter, currentUser.id));
    toast.success('Conversation deleted');
  };

  const handleSaveContact = (data: Partial<Contact>) => {
    if (editingContact) {
      repo.updateContact(editingContact.id, data);
    } else {
      repo.addContact({
        id: `c-${Date.now()}`,
        name: data.name!,
        phone: data.phone!,
        department: data.department,
        tags: data.tags || [],
        metadata: data.metadata || {},
        source: 'adhoc',
      });
    }
    setContacts(repo.getContacts());
    refresh();
  };

  if (!mounted) return <div className="p-6">Loading...</div>;

  return (
    <div className="h-[calc(100vh-4rem)] flex overflow-hidden bg-background">
      {/* Pane 1 */}
      <div className="w-80 border-r flex flex-col bg-card shrink-0">
        <div className="p-4 border-b space-y-3">
          <div className="flex items-center justify-between">
            <h2 className="font-bold text-lg">Inbox</h2>
            <div className="flex gap-1">
              <Button
                variant="ghost"
                size="icon"
                title="Add contact"
                onClick={() => {
                  setEditingContact(null);
                  setContactDrawerOpen(true);
                }}
              >
                <Plus className="h-5 w-5" />
              </Button>
              <Button variant="ghost" size="icon" onClick={() => setShowDev((s) => !s)} title="Dev tools">
                <Zap className="h-5 w-5" />
              </Button>
            </div>
          </div>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search chats or contacts..."
              className="pl-9"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="flex flex-wrap gap-2">
            {['all', 'mine', 'unassigned', 'starred'].map((f) => (
              <Button
                key={f}
                size="sm"
                variant={activeFilter === f ? 'default' : 'outline'}
                onClick={() => setActiveFilter(f)}
                className="capitalize"
              >
                {f}
              </Button>
            ))}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button size="sm" variant="outline">
                  Dept <ChevronDown className="ml-1 h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                {departments.map((d) => (
                  <DropdownMenuItem key={d} onClick={() => setActiveFilter(d)}>
                    {d}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto">
          {filtered.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground text-sm">No conversations</div>
          ) : (
            filtered.map((c) => {
              const contact = repo.getContact(c.contactId);
              const assigned = staffMembers.find((s) => s.id === c.assignedAgentId);
              const last = c.messages[c.messages.length - 1];
              return (
                <button
                  key={c.id}
                  onClick={() => handleSelect(c.id)}
                  className={`w-full flex items-start gap-3 p-4 border-b hover:bg-muted/50 text-left ${
                    selectedId === c.id ? 'bg-muted' : ''
                  }`}
                >
                  <Avatar>
                    <AvatarFallback>{contact?.name?.charAt(0) || '?'}</AvatarFallback>
                  </Avatar>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <span className="font-medium truncate">{contact?.name}</span>
                      <span className="text-xs text-muted-foreground">
                        {new Date(c.lastMessageAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </div>
                    <div className="flex items-center justify-between mt-1">
                      <span className="text-sm text-muted-foreground truncate">
                        {last?.content || 'No messages yet'}
                      </span>
                      {c.unreadCount > 0 && <Badge variant="destructive">{c.unreadCount}</Badge>}
                    </div>
                    <div className="flex items-center gap-2 mt-1">
                      {c.starred && <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />}
                      {assigned && (
                        <span className="text-xs text-muted-foreground">
                          {assigned.firstName}
                        </span>
                      )}
                      {c.tags.map((t) => (
                        <span key={t} className="text-xs text-muted-foreground">#{t}</span>
                      ))}
                    </div>
                  </div>
                </button>
              );
            })
          )}
        </div>
      </div>

      {/* Pane 2 */}
      <div className="flex-1 flex flex-col min-w-0">
        {selected ? (
          <>
            <ConversationHeader
              conversation={selected}
              contact={selectedContact}
              staffMembers={staffMembers}
              onAssign={(id) => {
                repo.assignAgent(selected.id, id);
                refresh();
              }}
              onStar={() => {
                repo.toggleStar(selected.id);
                refresh();
              }}
              onToggleContext={() => setContextOpen((o) => !o)}
              onDelete={handleDelete}
              onExport={handleExport}
            />
            <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-muted/20">
              {selected.messages.map((m) => (
                <MessageBubble key={m.id} message={m} />
              ))}
              <div ref={bottomRef} />
            </div>
            <Composer
              onSend={handleSend}
              onInternalNote={handleInternalNote}
              currentAgentId={currentUser.id}
            />
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center text-muted-foreground">
            Select a conversation to start
          </div>
        )}
      </div>

      {/* Pane 3 */}
      {contextOpen && selected && (
        <div className="w-80 border-l bg-card shrink-0 overflow-hidden">
          <ContextPanel
            conversation={selected}
            contact={selectedContact}
            staffMembers={staffMembers}
            onEditContact={() => {
              setEditingContact(selectedContact || null);
              setContactDrawerOpen(true);
            }}
            onAddNote={(content) => {
              repo.addNote(selected.id, currentUser.id, content);
              refresh();
            }}
            currentAgentId={currentUser.id}
          />
        </div>
      )}

      {/* Drawers and dev bar */}
      <ContactDrawer
        open={contactDrawerOpen}
        onOpenChange={setContactDrawerOpen}
        contact={editingContact}
        onSave={handleSaveContact}
      />

      <DevUtilityBar
        open={showDev}
        onClose={() => setShowDev(false)}
        repo={repo}
        conversationId={selectedId}
        onUpdate={() => {
          setConversations(repo.getConversations(activeFilter, currentUser.id));
          refresh();
        }}
      />
    </div>
  );
}