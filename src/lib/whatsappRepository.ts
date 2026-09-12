// lib/whatsappRepository.ts
export interface Contact {
  id: string;
  name: string;
  phone: string;
  department?: string;
  tags: string[];
  metadata: Record<string, string>;
  source: 'directory' | 'adhoc';
  avatar?: string;
}

export interface Message {
  id: string;
  conversationId: string;
  sender: 'agent' | 'contact' | 'internal';
  content: string;
  type: 'text' | 'image' | 'video' | 'document' | 'voice' | 'location';
  timestamp: string;
  status?: 'sent' | 'delivered' | 'read';
  agentId?: string;
  meta?: any;
}

export interface Conversation {
  id: string;
  contactId: string;
  assignedAgentId?: string;
  department: string;
  starred: boolean;
  tags: string[];
  unreadCount: number;
  lastMessageAt: string;
  messages: Message[];
}

const STORAGE_KEY = 'whatsapp_mock_data';

export class WhatsAppRepository {
  private data: { contacts: Contact[]; conversations: Conversation[] } = {
    contacts: [],
    conversations: [],
  };

  constructor() {
    this.load();
  }

  private load() {
    if (typeof window === 'undefined') return;
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      this.data = JSON.parse(raw);
    } else {
      this.seed();
    }
  }

  private persist() {
    if (typeof window === 'undefined') return;
    localStorage.setItem(STORAGE_KEY, JSON.stringify(this.data));
  }

  private seed() {
    const contacts: Contact[] = [
      {
        id: 'c1',
        name: 'John Farmer',
        phone: '+2348012345678',
        department: 'Sales',
        tags: ['VIP', 'Follow-up'],
        metadata: { location: 'Kaduna' },
        source: 'adhoc',
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
        messages: [],
      },
    ];

    this.data = { contacts, conversations };
    this.persist();
  }

  getContacts(): Contact[] {
    return this.data.contacts;
  }

  getConversations(filter?: string): Conversation[] {
    let convs = this.data.conversations;
    const currentAgentId = 'staff-1';
    switch (filter) {
      case 'all':
        return convs;
      case 'mine':
        return convs.filter((c) => c.assignedAgentId === currentAgentId);
      case 'unassigned':
        return convs.filter((c) => !c.assignedAgentId);
      case 'starred':
        return convs.filter((c) => c.starred);
      default:
        return convs.filter((c) => c.department === filter);
    }
  }

  getConversation(id: string): Conversation | undefined {
    return this.data.conversations.find((c) => c.id === id);
  }

  getMessages(conversationId: string): Message[] {
    const conv = this.getConversation(conversationId);
    return conv ? conv.messages : [];
  }

  sendMessage(
    conversationId: string,
    content: string,
    type: Message['type'] = 'text',
    sender: 'agent' | 'contact' | 'internal' = 'agent',
    agentId?: string
  ) {
    const conv = this.getConversation(conversationId);
    if (!conv) return;
    const msg: Message = {
      id: `m${Date.now()}`,
      conversationId,
      sender,
      content,
      type,
      timestamp: new Date().toISOString(),
      status: sender === 'agent' ? 'sent' : undefined,
      agentId,
    };
    conv.messages.push(msg);
    conv.lastMessageAt = msg.timestamp;
    if (sender === 'contact') conv.unreadCount += 1;
    this.persist();
  }

  updateMessageStatus(messageId: string, status: 'sent' | 'delivered' | 'read') {
    for (const conv of this.data.conversations) {
      const msg = conv.messages.find((m) => m.id === messageId);
      if (msg) {
        msg.status = status;
        break;
      }
    }
    this.persist();
  }

  assignAgent(conversationId: string, agentId?: string) {
    const conv = this.getConversation(conversationId);
    if (conv) {
      conv.assignedAgentId = agentId;
      this.persist();
    }
  }

  toggleStar(conversationId: string) {
    const conv = this.getConversation(conversationId);
    if (conv) {
      conv.starred = !conv.starred;
      this.persist();
    }
  }

  addTag(conversationId: string, tag: string) {
    const conv = this.getConversation(conversationId);
    if (conv && !conv.tags.includes(tag)) {
      conv.tags.push(tag);
      this.persist();
    }
  }

  addContact(contact: Contact) {
    this.data.contacts.push(contact);
    this.persist();
  }

  simulateIncoming(conversationId: string, content: string, type: Message['type'] = 'text') {
    this.sendMessage(conversationId, content, type, 'contact');
  }

  markAsRead(conversationId: string) {
    const conv = this.getConversation(conversationId);
    if (conv) {
      conv.unreadCount = 0;
      this.persist();
    }
  }
}