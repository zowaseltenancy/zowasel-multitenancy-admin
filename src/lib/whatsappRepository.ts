import { Chat, Message, WhatsAppContact, Organization } from '@/types/whatsapp';

interface DB {
  organizations: Organization[];
  chats: Chat[];
  messages: Record<string, Message[]>;
  contacts: WhatsAppContact[];
}

export class WhatsAppRepository {
  private storageKey = 'whatsapp_mock_db';

  deleteChat(chatId: string) {
    const db = this.readDB();
    db.chats = db.chats.filter(c => c.id !== chatId);
    delete db.messages[chatId];
    this.writeDB(db);
    }

    addMemberToOrganization(orgId: string, contactId: string) {
  const db = this.readDB();
  const org = db.organizations.find(o => o.id === orgId);
  if (org && !org.memberContactIds.includes(contactId)) {
    org.memberContactIds.push(contactId);
    this.writeDB(db);
  }
}
  private readDB(): DB {
    if (typeof window === 'undefined')
        return { organizations: [], chats: [], messages: {}, contacts: [] };
    const raw = localStorage.getItem(this.storageKey);
    if (!raw) return { organizations: [], chats: [], messages: {}, contacts: [] };
    return JSON.parse(raw);
    }

  private writeDB(db: DB) {
    if (typeof window !== 'undefined') {
      localStorage.setItem(this.storageKey, JSON.stringify(db));
    }
  }

  init(seed: DB) {
    if (typeof window !== 'undefined' && !localStorage.getItem(this.storageKey)) {
      this.writeDB(seed);
    }
  }

getOrganizations(): Organization[] {
  const db = this.readDB();
  return db.organizations || [];
}

getMembersByOrganization(orgId: string): WhatsAppContact[] {
  const db = this.readDB();
  const org = (db.organizations || []).find(o => o.id === orgId);
  if (!org) return [];
  return org.memberContactIds
    .map(id => db.contacts.find(c => c.id === id))
    .filter(Boolean) as WhatsAppContact[];
}

  // ---- Conversation filters ----
  getConversations(filter?: {
    agentId?: string | null;
    department?: string;
    starred?: boolean;
    searchQuery?: string;
    organizationId?: string;
  }): Chat[] {
    let chats = this.readDB().chats;
    const db = this.readDB();

    if (filter?.organizationId) {
      const org = db.organizations.find((o) => o.id === filter.organizationId);
      const memberIds = org?.memberContactIds || [];
      chats = chats.filter((c) => memberIds.includes(c.contactId));
    }

    if (filter?.agentId !== undefined) {
      chats = chats.filter((c) => c.assignedAgentId === filter.agentId);
    }
    if (filter?.department) {
      chats = chats.filter((c) => c.department === filter.department);
    }
    if (filter?.starred) {
      chats = chats.filter((c) => c.isStarred);
    }
    if (filter?.searchQuery) {
      const q = filter.searchQuery.toLowerCase();
      chats = chats.filter((c) => {
        const contact = this.getContact(c.contactId);
        return (
          c.id.toLowerCase().includes(q) ||
          contact?.displayName.toLowerCase().includes(q) ||
          c.lastMessage?.body?.toLowerCase().includes(q)
        );
      });
    }

    return chats.sort(
      (a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
    );
  }

  getMessages(chatId: string): Message[] {
    const db = this.readDB();
    return (db.messages[chatId] || []).sort(
      (a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime()
    );
  }

  sendMessage(message: Message) {
    const db = this.readDB();
    if (!db.messages[message.chatId]) db.messages[message.chatId] = [];
    db.messages[message.chatId].push(message);

    const chat = db.chats.find((c) => c.id === message.chatId);
    if (chat) {
      chat.lastMessage = {
        id: message.id,
        body: message.body || 'Media',
        timestamp: message.timestamp,
        senderId: message.senderId,
        status: message.status,
        ...(message.isInternalNote ? { isInternalNote: true } : {}),
      };
      chat.updatedAt = message.timestamp;
      if (message.senderId === chat.contactId && !message.isInternalNote) {
        chat.unreadCount += 1;
      }
    }
    this.writeDB(db);
  }

  markRead(chatId: string) {
    const db = this.readDB();
    const chat = db.chats.find((c) => c.id === chatId);
    if (chat) chat.unreadCount = 0;
    const msgs = db.messages[chatId];
    if (msgs) {
      msgs.forEach((m) => {
        if (m.status !== 'read') m.status = 'read';
      });
    }
    this.writeDB(db);
  }

  toggleStar(chatId: string) {
    const db = this.readDB();
    const chat = db.chats.find((c) => c.id === chatId);
    if (chat) chat.isStarred = !chat.isStarred;
    this.writeDB(db);
  }

  assignAgent(chatId: string, agentId: string | null) {
    const db = this.readDB();
    const chat = db.chats.find((c) => c.id === chatId);
    if (chat) chat.assignedAgentId = agentId;
    this.writeDB(db);
  }

  getContact(contactId: string): WhatsAppContact | undefined {
    return this.readDB().contacts.find((c) => c.id === contactId);
  }

  searchContacts(query: string): WhatsAppContact[] {
    const q = query.toLowerCase();
    return this.readDB().contacts.filter(
      (c) =>
        c.displayName.toLowerCase().includes(q) || c.phoneNumber.includes(q)
    );
  }

  addExternalContact(contact: Omit<WhatsAppContact, 'id' | 'isExternal'>): WhatsAppContact {
    const db = this.readDB();
    const newContact: WhatsAppContact = { ...contact, id: `ext-${Date.now()}`, isExternal: true };
    db.contacts.push(newContact);
    this.writeDB(db);
    return newContact;
  }

  addChat(chat: Chat) {
    const db = this.readDB();
    db.chats.push(chat);
    this.writeDB(db);
  }

  resetDB(seed: DB) {
    this.writeDB(seed);
  }
}