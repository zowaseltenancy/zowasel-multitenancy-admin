import { Contact, Conversation, Message, WhatsAppRole, Permission } from './types';
import { DEFAULT_WHATSAPP_ROLES } from './permissions';

const STORAGE_KEY = 'whatsapp_mock_data_v2';
const ROLES_KEY = 'whatsapp_roles_v2';

interface DB {
  contacts: Contact[];
  conversations: Conversation[];
}

export class WhatsAppRepository {
  private data: DB = { contacts: [], conversations: [] };
  private roles: WhatsAppRole[] = [];

  constructor() {
    this.load();
  }

  private load() {
    if (typeof window === 'undefined') return;
    const raw = localStorage.getItem(STORAGE_KEY);
    this.data = raw ? JSON.parse(raw) : this.seedData();
    const roleRaw = localStorage.getItem(ROLES_KEY);
    this.roles = roleRaw ? JSON.parse(roleRaw) : DEFAULT_WHATSAPP_ROLES;
    if (!raw) this.persist();
    if (!roleRaw) this.persistRoles();
  }

  private persist() {
    if (typeof window !== 'undefined')
      localStorage.setItem(STORAGE_KEY, JSON.stringify(this.data));
  }

  private persistRoles() {
    if (typeof window !== 'undefined')
      localStorage.setItem(ROLES_KEY, JSON.stringify(this.roles));
  }

  private seedData(): DB {
    const contacts: Contact[] = [
      {
        id: 'c1',
        name: 'John Farmer',
        phone: '+2348012345678',
        department: 'Sales',
        tags: ['VIP', 'Follow-up'],
        metadata: { location: 'Kaduna' },
        source: 'adhoc',
        profileLink: 'https://wa.me/2348012345678',
      },
      {
        id: 'c2',
        name: 'Mary Trader',
        phone: '+2348098765432',
        department: 'Support',
        tags: ['New'],
        metadata: { location: 'Lagos' },
        source: 'adhoc',
      },
    ];

    const conversations: Conversation[] = [
      {
        id: 'conv1',
        contactId: 'c1',
        assignedAgentId: 'staff-1',
        department: 'Sales',
        starred: true,
        tags: ['VIP'],
        unreadCount: 2,
        lastMessageAt: new Date().toISOString(),
        transferHistory: [],
        notesLog: [],
        messages: [
          {
            id: 'm1',
            conversationId: 'conv1',
            sender: 'contact',
            content: 'Hello, I need help with my order',
            type: 'text',
            timestamp: new Date(Date.now() - 3600000).toISOString(),
          },
          {
            id: 'm2',
            conversationId: 'conv1',
            sender: 'agent',
            content: 'Hi John, let me check',
            type: 'text',
            timestamp: new Date(Date.now() - 3500000).toISOString(),
            status: 'read',
            agentId: 'staff-1',
          },
        ],
      },
      {
        id: 'conv2',
        contactId: 'c2',
        department: 'Support',
        starred: false,
        tags: [],
        unreadCount: 0,
        lastMessageAt: new Date().toISOString(),
        transferHistory: [],
        notesLog: [],
        messages: [],
      },
    ];

    const seeded = { contacts, conversations };
    this.data = seeded;
    return seeded;
  }

  // --- Contacts ---
  getContacts() {
    return this.data.contacts;
  }

  getContact(id: string) {
    return this.data.contacts.find((c) => c.id === id);
  }

  addContact(contact: Contact) {
    this.data.contacts.push(contact);
    this.persist();
  }

  updateContact(id: string, updates: Partial<Contact>) {
    const idx = this.data.contacts.findIndex((c) => c.id === id);
    if (idx !== -1) {
      this.data.contacts[idx] = { ...this.data.contacts[idx], ...updates };
      this.persist();
    }
  }

  // --- Conversations ---
  getConversations(filter?: string, agentId?: string, departmentId?: string): Conversation[] {
    let convs = this.data.conversations;
    switch (filter) {
      case 'all':
        return convs;
      case 'mine':
        return convs.filter((c) => c.assignedAgentId === agentId);
      case 'unassigned':
        return convs.filter((c) => !c.assignedAgentId);
      case 'starred':
        return convs.filter((c) => c.starred);
      default:
        return convs.filter((c) => c.department === filter);
    }
  }

  getConversation(id: string) {
    return this.data.conversations.find((c) => c.id === id);
  }

  getMessages(conversationId: string): Message[] {
    return this.getConversation(conversationId)?.messages ?? [];
  }

  sendMessage(
    conversationId: string,
    content: string,
    type: Message['type'] = 'text',
    sender: Message['sender'] = 'agent',
    agentId?: string,
    meta?: Message['meta']
  ) {
    const conv = this.getConversation(conversationId);
    if (!conv) return;
    const msg: Message = {
      id: `m${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
      conversationId,
      sender,
      content,
      type,
      timestamp: new Date().toISOString(),
      status: sender === 'agent' ? 'sent' : undefined,
      agentId,
      meta,
    };
    conv.messages.push(msg);
    conv.lastMessageAt = msg.timestamp;
    if (sender === 'contact') conv.unreadCount += 1;
    this.persist();
  }

  markAsRead(id: string) {
    const c = this.getConversation(id);
    if (c) {
      c.unreadCount = 0;
      this.persist();
    }
  }

  updateMessageStatus(messageId: string, status: Message['status']) {
    for (const c of this.data.conversations) {
      const m = c.messages.find((x) => x.id === messageId);
      if (m) {
        m.status = status;
        this.persist();
        return;
      }
    }
  }

  assignAgent(conversationId: string, agentId?: string) {
    const c = this.getConversation(conversationId);
    if (c) {
      c.transferHistory.push({
        fromAgentId: c.assignedAgentId,
        toAgentId: agentId,
        at: new Date().toISOString(),
      });
      c.assignedAgentId = agentId;
      this.persist();
    }
  }

  toggleStar(id: string) {
    const c = this.getConversation(id);
    if (c) {
      c.starred = !c.starred;
      this.persist();
    }
  }

  addTag(conversationId: string, tag: string) {
    const c = this.getConversation(conversationId);
    if (c && !c.tags.includes(tag)) {
      c.tags.push(tag);
      this.persist();
    }
  }

  removeTag(conversationId: string, tag: string) {
    const c = this.getConversation(conversationId);
    if (c) {
      c.tags = c.tags.filter((t) => t !== tag);
      this.persist();
    }
  }

  addNote(conversationId: string, authorId: string, content: string) {
    const c = this.getConversation(conversationId);
    if (c) {
      c.notesLog.push({
        id: `n${Date.now()}`,
        authorId,
        content,
        at: new Date().toISOString(),
      });
      this.persist();
    }
  }

  deleteConversation(id: string) {
    this.data.conversations = this.data.conversations.filter((c) => c.id !== id);
    this.persist();
  }

  // --- Roles ---
  getRoles(): WhatsAppRole[] {
    return this.roles;
  }

  updateRole(id: string, updates: Partial<WhatsAppRole>) {
    const idx = this.roles.findIndex((r) => r.id === id);
    if (idx !== -1) {
      this.roles[idx] = { ...this.roles[idx], ...updates };
      this.persistRoles();
    }
  }

  addRole(role: WhatsAppRole) {
    this.roles.push(role);
    this.persistRoles();
  }

  deleteRole(id: string) {
    this.roles = this.roles.filter((r) => r.id !== id);
    this.persistRoles();
  }

  // --- Simulation ---
  simulateIncoming(conversationId: string, content: string, type: Message['type'] = 'text', meta?: Message['meta']) {
    this.sendMessage(conversationId, content, type, 'contact', undefined, meta);
  }
}