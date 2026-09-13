import { PlatformUser } from '@/types/platform';
import { WhatsAppPermission } from '@/types/permissions';
import { Chat, Message, WhatsAppContact, Organization } from '@/types/whatsapp';
import { WHATSAPP_PERMISSIONS } from '@/types/permissions';

// ---------- Mock User (current agent) ----------
export const mockUser: PlatformUser & { whatsappPermissions: WhatsAppPermission[] } = {
  id: 'agent-alice',
  firstName: 'Alice',
  lastName: 'Okonkwo',
  email: 'alice@zowasel.com',
  phone: '+2348012345678',
  role: 'Programme Manager',
  department: 'Programs',
  status: 'active',
  organizationId: 'org-zowasel',
  organizationName: 'Zowasel HQ',
  avatarUrl: 'https://i.pravatar.cc/150?u=alice',
  dateJoined: '2025-01-15T08:00:00Z',
  lastActive: new Date().toISOString(),
  permissions: [],
  whatsappPermissions: Object.values(WHATSAPP_PERMISSIONS),
};

// ---------- Organisations (10) ----------
export const mockOrganizations: Organization[] = [
  {
    id: 'org-1',
    name: 'Green Fields Co-op',
    memberContactIds: ['c-farmer-1', 'c-farmer-2', 'c-agent-1'],
  },
  {
    id: 'org-2',
    name: 'AgriPro Ltd',
    memberContactIds: ['c-buyer-1', 'c-agent-2'],
  },
  {
    id: 'org-3',
    name: 'FarmFresh Inc.',
    memberContactIds: ['c-farmer-3', 'c-farmer-4'],
  },
  {
    id: 'org-4',
    name: 'Golden Harvest',
    memberContactIds: ['c-farmer-5', 'c-buyer-2', 'c-agent-3'],
  },
  {
    id: 'org-5',
    name: 'RiceMasters Co-op',
    memberContactIds: ['c-farmer-6', 'c-farmer-7'],
  },
  {
    id: 'org-6',
    name: 'AgroAllied Traders',
    memberContactIds: ['c-buyer-3', 'c-agent-4', 'c-farmer-8'],
  },
  {
    id: 'org-7',
    name: 'Zowasel Extension',
    memberContactIds: ['c-agent-5', 'c-farmer-9', 'c-farmer-10'],
  },
  {
    id: 'org-8',
    name: 'Naija Grains Ltd',
    memberContactIds: ['c-buyer-4', 'c-agent-6'],
  },
  {
    id: 'org-9',
    name: 'Savannah Farmers Union',
    memberContactIds: ['c-farmer-11', 'c-farmer-12', 'c-farmer-13'],
  },
  {
    id: 'org-10',
    name: 'Urban Greens Supply',
    memberContactIds: ['c-merchant-1', 'c-agent-7'],
  },
];

// ---------- Agents (internal, not linked to org members) ----------
export const mockAgents: WhatsAppContact[] = [
  {
    id: 'agent-alice',
    phoneNumber: '+2348012345678',
    displayName: 'Alice Okonkwo',
    platformUserId: 'agent-alice',
    department: 'Programs',
    tags: [],
    avatarUrl: mockUser.avatarUrl,
    isExternal: false,
  },
  {
    id: 'agent-david',
    phoneNumber: '+2348023456789',
    displayName: 'David Okafor',
    platformUserId: 'agent-david',
    department: 'Programs',
    tags: [],
    avatarUrl: 'https://i.pravatar.cc/150?u=david',
    isExternal: false,
  },
  {
    id: 'agent-grace',
    phoneNumber: '+2348034567890',
    displayName: 'Grace Adebayo',
    platformUserId: 'agent-grace',
    department: 'Sales',
    tags: [],
    avatarUrl: 'https://i.pravatar.cc/150?u=grace',
    isExternal: false,
  },
  {
    id: 'agent-ibrahim',
    phoneNumber: '+2348045678901',
    displayName: 'Ibrahim Sule',
    platformUserId: 'agent-ibrahim',
    department: 'Fintech',
    tags: [],
    avatarUrl: 'https://i.pravatar.cc/150?u=ibrahim',
    isExternal: false,
  },
];

// ---------- Contacts (members of organisations) ----------
export const mockContacts: WhatsAppContact[] = [
  // Org 1
  { id: 'c-farmer-1', phoneNumber: '+2349050000011', displayName: 'Musa Abubakar', department: 'Programs', tags: ['farmer', 'maize'], avatarUrl: 'https://i.pravatar.cc/150?u=musa', isExternal: false, platformUserId: 'farmer-1' },
  { id: 'c-farmer-2', phoneNumber: '+2349050000012', displayName: 'Aisha Bello', department: 'Programs', tags: ['farmer', 'rice'], avatarUrl: 'https://i.pravatar.cc/150?u=aisha', isExternal: false },
  { id: 'c-agent-1', phoneNumber: '+2349050000013', displayName: 'Chidi Eze', department: 'Programs', tags: ['agent'], avatarUrl: 'https://i.pravatar.cc/150?u=chidi', isExternal: false },
  // Org 2
  { id: 'c-buyer-1', phoneNumber: '+2349050000021', displayName: 'Fatima Bello', department: 'Sales', tags: ['buyer', 'rice'], avatarUrl: 'https://i.pravatar.cc/150?u=fatima', isExternal: true },
  { id: 'c-agent-2', phoneNumber: '+2349050000022', displayName: 'Ibrahim Sule', department: 'Sales', tags: ['agent'], avatarUrl: 'https://i.pravatar.cc/150?u=ibrahim', isExternal: false },
  // Org 3
  { id: 'c-farmer-3', phoneNumber: '+2349050000031', displayName: 'Ngozi Uche', department: 'Programs', tags: ['farmer'], avatarUrl: 'https://i.pravatar.cc/150?u=ngozi', isExternal: false },
  { id: 'c-farmer-4', phoneNumber: '+2349050000032', displayName: 'Obinna Okoro', department: 'Programs', tags: ['farmer', 'cassava'], avatarUrl: 'https://i.pravatar.cc/150?u=obinna', isExternal: false },
  // Org 4
  { id: 'c-farmer-5', phoneNumber: '+2349050000041', displayName: 'Hassan Yusuf', department: 'Programs', tags: ['farmer', 'sorghum'], avatarUrl: 'https://i.pravatar.cc/150?u=hassan', isExternal: false },
  { id: 'c-buyer-2', phoneNumber: '+2349050000042', displayName: 'Adaeze Onu', department: 'Sales', tags: ['buyer', 'soybean'], avatarUrl: 'https://i.pravatar.cc/150?u=adaeze', isExternal: true },
  { id: 'c-agent-3', phoneNumber: '+2349050000043', displayName: 'Emeka Nwosu', department: 'Programs', tags: ['agent'], avatarUrl: 'https://i.pravatar.cc/150?u=emeka', isExternal: false },
  // Org 5
  { id: 'c-farmer-6', phoneNumber: '+2349050000051', displayName: 'Blessing Afolabi', department: 'Programs', tags: ['farmer', 'rice'], avatarUrl: 'https://i.pravatar.cc/150?u=blessing', isExternal: false },
  { id: 'c-farmer-7', phoneNumber: '+2349050000052', displayName: 'Tunde Lawal', department: 'Programs', tags: ['farmer', 'maize'], avatarUrl: 'https://i.pravatar.cc/150?u=tunde', isExternal: false },
  // Org 6
  { id: 'c-buyer-3', phoneNumber: '+2349050000061', displayName: 'Chinyere Obi', department: 'Sales', tags: ['buyer', 'beans'], avatarUrl: 'https://i.pravatar.cc/150?u=chinyere', isExternal: true },
  { id: 'c-agent-4', phoneNumber: '+2349050000062', displayName: 'Usman Bala', department: 'Sales', tags: ['agent'], avatarUrl: 'https://i.pravatar.cc/150?u=usman', isExternal: false },
  { id: 'c-farmer-8', phoneNumber: '+2349050000063', displayName: 'Rukayya Musa', department: 'Programs', tags: ['farmer', 'groundnut'], avatarUrl: 'https://i.pravatar.cc/150?u=rukayya', isExternal: false },
  // Org 7
  { id: 'c-agent-5', phoneNumber: '+2349050000071', displayName: 'Danladi John', department: 'Programs', tags: ['agent'], avatarUrl: 'https://i.pravatar.cc/150?u=danladi', isExternal: false },
  { id: 'c-farmer-9', phoneNumber: '+2349050000072', displayName: 'Amina Mohammed', department: 'Programs', tags: ['farmer', 'rice'], avatarUrl: 'https://i.pravatar.cc/150?u=amina', isExternal: false },
  { id: 'c-farmer-10', phoneNumber: '+2349050000073', displayName: 'Peter Obi', department: 'Programs', tags: ['farmer', 'yam'], avatarUrl: 'https://i.pravatar.cc/150?u=peter', isExternal: false },
  // Org 8
  { id: 'c-buyer-4', phoneNumber: '+2349050000081', displayName: 'Kemi Ajayi', department: 'Sales', tags: ['buyer', 'maize'], avatarUrl: 'https://i.pravatar.cc/150?u=kemi', isExternal: true },
  { id: 'c-agent-6', phoneNumber: '+2349050000082', displayName: 'Sunday Edet', department: 'Sales', tags: ['agent'], avatarUrl: 'https://i.pravatar.cc/150?u=sunday', isExternal: false },
  // Org 9
  { id: 'c-farmer-11', phoneNumber: '+2349050000091', displayName: 'Zainab Ibrahim', department: 'Programs', tags: ['farmer', 'soybean'], avatarUrl: 'https://i.pravatar.cc/150?u=zainab', isExternal: false },
  { id: 'c-farmer-12', phoneNumber: '+2349050000092', displayName: 'Oluwaseun Adeleke', department: 'Programs', tags: ['farmer', 'cassava'], avatarUrl: 'https://i.pravatar.cc/150?u=seun', isExternal: false },
  { id: 'c-farmer-13', phoneNumber: '+2349050000093', displayName: 'Ekaette Asuquo', department: 'Programs', tags: ['farmer', 'cocoyam'], avatarUrl: 'https://i.pravatar.cc/150?u=ekaette', isExternal: false },
  // Org 10
  { id: 'c-merchant-1', phoneNumber: '+2349050000101', displayName: 'Ifeanyi Okafor', department: 'Sales', tags: ['merchant', 'vegetables'], avatarUrl: 'https://i.pravatar.cc/150?u=ifeanyi', isExternal: true },
  { id: 'c-agent-7', phoneNumber: '+2349050000102', displayName: 'Hauwa Mohammed', department: 'Sales', tags: ['agent'], avatarUrl: 'https://i.pravatar.cc/150?u=hauwa', isExternal: false },
];

// ---------- Chats (one per contact) ----------
export const mockChats: Chat[] = [
  { id: 'chat-1', contactId: 'c-farmer-1', assignedAgentId: 'agent-alice', department: 'Programs', tags: ['farmer'], isStarred: true, unreadCount: 1, createdAt: '2025-08-01T08:00:00Z', updatedAt: '2025-08-01T09:00:00Z', status: 'active' },
  { id: 'chat-2', contactId: 'c-farmer-2', assignedAgentId: 'agent-alice', department: 'Programs', tags: ['farmer'], isStarred: false, unreadCount: 0, createdAt: '2025-08-02T10:00:00Z', updatedAt: '2025-08-02T10:30:00Z', status: 'active' },
  { id: 'chat-3', contactId: 'c-agent-1', assignedAgentId: null, department: 'Programs', tags: ['agent'], isStarred: false, unreadCount: 3, createdAt: '2025-08-03T11:00:00Z', updatedAt: '2025-08-03T11:45:00Z', status: 'active' },
  { id: 'chat-4', contactId: 'c-buyer-1', assignedAgentId: 'agent-grace', department: 'Sales', tags: ['buyer'], isStarred: false, unreadCount: 0, createdAt: '2025-08-04T12:00:00Z', updatedAt: '2025-08-04T12:15:00Z', status: 'active' },
  { id: 'chat-5', contactId: 'c-agent-2', assignedAgentId: 'agent-grace', department: 'Sales', tags: ['agent'], isStarred: true, unreadCount: 2, createdAt: '2025-08-05T13:00:00Z', updatedAt: '2025-08-05T13:20:00Z', status: 'active' },
  { id: 'chat-6', contactId: 'c-farmer-3', assignedAgentId: 'agent-alice', department: 'Programs', tags: ['farmer'], isStarred: false, unreadCount: 0, createdAt: '2025-08-06T14:00:00Z', updatedAt: '2025-08-06T14:10:00Z', status: 'active' },
  { id: 'chat-7', contactId: 'c-farmer-4', assignedAgentId: null, department: 'Programs', tags: ['farmer'], isStarred: false, unreadCount: 1, createdAt: '2025-08-07T15:00:00Z', updatedAt: '2025-08-07T15:05:00Z', status: 'active' },
  { id: 'chat-8', contactId: 'c-farmer-5', assignedAgentId: 'agent-david', department: 'Programs', tags: ['farmer'], isStarred: false, unreadCount: 0, createdAt: '2025-08-08T16:00:00Z', updatedAt: '2025-08-08T16:30:00Z', status: 'active' },
  { id: 'chat-9', contactId: 'c-buyer-2', assignedAgentId: 'agent-ibrahim', department: 'Sales', tags: ['buyer'], isStarred: false, unreadCount: 0, createdAt: '2025-08-09T17:00:00Z', updatedAt: '2025-08-09T17:45:00Z', status: 'active' },
  { id: 'chat-10', contactId: 'c-agent-3', assignedAgentId: 'agent-david', department: 'Programs', tags: ['agent'], isStarred: true, unreadCount: 4, createdAt: '2025-08-10T18:00:00Z', updatedAt: '2025-08-10T18:10:00Z', status: 'active' },
  { id: 'chat-11', contactId: 'c-farmer-6', assignedAgentId: 'agent-alice', department: 'Programs', tags: ['farmer'], isStarred: false, unreadCount: 0, createdAt: '2025-08-11T19:00:00Z', updatedAt: '2025-08-11T19:20:00Z', status: 'active' },
  { id: 'chat-12', contactId: 'c-farmer-7', assignedAgentId: null, department: 'Programs', tags: ['farmer'], isStarred: false, unreadCount: 2, createdAt: '2025-08-12T20:00:00Z', updatedAt: '2025-08-12T20:05:00Z', status: 'active' },
  { id: 'chat-13', contactId: 'c-buyer-3', assignedAgentId: 'agent-grace', department: 'Sales', tags: ['buyer'], isStarred: false, unreadCount: 0, createdAt: '2025-08-13T21:00:00Z', updatedAt: '2025-08-13T21:30:00Z', status: 'active' },
  { id: 'chat-14', contactId: 'c-agent-4', assignedAgentId: 'agent-ibrahim', department: 'Sales', tags: ['agent'], isStarred: false, unreadCount: 0, createdAt: '2025-08-14T22:00:00Z', updatedAt: '2025-08-14T22:10:00Z', status: 'active' },
  { id: 'chat-15', contactId: 'c-farmer-8', assignedAgentId: null, department: 'Programs', tags: ['farmer'], isStarred: false, unreadCount: 1, createdAt: '2025-08-15T23:00:00Z', updatedAt: '2025-08-15T23:45:00Z', status: 'active' },
  // add a few more to cover remaining contacts
  { id: 'chat-16', contactId: 'c-agent-5', assignedAgentId: 'agent-alice', department: 'Programs', tags: ['agent'], isStarred: false, unreadCount: 0, createdAt: '2025-08-16T08:00:00Z', updatedAt: '2025-08-16T08:30:00Z', status: 'active' },
  { id: 'chat-17', contactId: 'c-farmer-9', assignedAgentId: null, department: 'Programs', tags: ['farmer'], isStarred: false, unreadCount: 3, createdAt: '2025-08-17T09:00:00Z', updatedAt: '2025-08-17T09:15:00Z', status: 'active' },
  { id: 'chat-18', contactId: 'c-farmer-10', assignedAgentId: 'agent-david', department: 'Programs', tags: ['farmer'], isStarred: false, unreadCount: 0, createdAt: '2025-08-18T10:00:00Z', updatedAt: '2025-08-18T10:05:00Z', status: 'active' },
  { id: 'chat-19', contactId: 'c-buyer-4', assignedAgentId: 'agent-grace', department: 'Sales', tags: ['buyer'], isStarred: true, unreadCount: 1, createdAt: '2025-08-19T11:00:00Z', updatedAt: '2025-08-19T11:30:00Z', status: 'active' },
  { id: 'chat-20', contactId: 'c-agent-6', assignedAgentId: 'agent-ibrahim', department: 'Sales', tags: ['agent'], isStarred: false, unreadCount: 0, createdAt: '2025-08-20T12:00:00Z', updatedAt: '2025-08-20T12:45:00Z', status: 'active' },
  { id: 'chat-21', contactId: 'c-farmer-11', assignedAgentId: null, department: 'Programs', tags: ['farmer'], isStarred: false, unreadCount: 2, createdAt: '2025-08-21T13:00:00Z', updatedAt: '2025-08-21T13:10:00Z', status: 'active' },
  { id: 'chat-22', contactId: 'c-farmer-12', assignedAgentId: 'agent-alice', department: 'Programs', tags: ['farmer'], isStarred: false, unreadCount: 0, createdAt: '2025-08-22T14:00:00Z', updatedAt: '2025-08-22T14:20:00Z', status: 'active' },
  { id: 'chat-23', contactId: 'c-farmer-13', assignedAgentId: 'agent-david', department: 'Programs', tags: ['farmer'], isStarred: false, unreadCount: 0, createdAt: '2025-08-23T15:00:00Z', updatedAt: '2025-08-23T15:30:00Z', status: 'active' },
  { id: 'chat-24', contactId: 'c-merchant-1', assignedAgentId: 'agent-grace', department: 'Sales', tags: ['merchant'], isStarred: false, unreadCount: 1, createdAt: '2025-08-24T16:00:00Z', updatedAt: '2025-08-24T16:45:00Z', status: 'active' },
  { id: 'chat-25', contactId: 'c-agent-7', assignedAgentId: 'agent-ibrahim', department: 'Sales', tags: ['agent'], isStarred: false, unreadCount: 0, createdAt: '2025-08-25T17:00:00Z', updatedAt: '2025-08-25T17:05:00Z', status: 'active' },
];

// ---------- Messages (quick helper to generate for each chat) ----------
function makeSimpleMessages(chatId: string, contactId: string, agentId?: string): Message[] {
  const msgs: Message[] = [
    {
      id: `msg-${chatId}-1`,
      chatId,
      senderId: contactId,
      timestamp: new Date(Date.now() - 3600000).toISOString(),
      type: 'text',
      body: 'Hello, I have a question.',
      status: 'read',
    },
  ];
  if (agentId) {
    msgs.push({
      id: `msg-${chatId}-2`,
      chatId,
      senderId: agentId,
      timestamp: new Date(Date.now() - 3400000).toISOString(),
      type: 'text',
      body: 'Sure, I can help you.',
      status: 'read',
    });
  }
  return msgs;
}

export const mockMessages: Record<string, Message[]> = {};
mockChats.forEach((chat) => {
  mockMessages[chat.id] = makeSimpleMessages(
    chat.id,
    chat.contactId,
    chat.assignedAgentId || undefined
  );
});

// Add some richer conversation for the first few chats
mockMessages['chat-1'] = [
  { id: 'msg-chat-1-1', chatId: 'chat-1', senderId: 'c-farmer-1', timestamp: '2025-08-01T08:05:00Z', type: 'text', body: 'Hi Alice, my fertilizer order hasn’t arrived.', status: 'read' },
  { id: 'msg-chat-1-2', chatId: 'chat-1', senderId: 'agent-alice', timestamp: '2025-08-01T08:10:00Z', type: 'text', body: 'Let me check the delivery status.', status: 'read' },
  { id: 'msg-chat-1-3', chatId: 'chat-1', senderId: 'agent-alice', timestamp: '2025-08-01T08:15:00Z', type: 'text', body: 'Internal note: escalate to logistics.', status: 'sent', isInternalNote: true },
];
mockMessages['chat-3'] = [
  { id: 'msg-chat-3-1', chatId: 'chat-3', senderId: 'c-agent-1', timestamp: '2025-08-03T11:05:00Z', type: 'text', body: 'I need the new registration forms.', status: 'delivered' },
  { id: 'msg-chat-3-2', chatId: 'chat-3', senderId: 'c-agent-1', timestamp: '2025-08-03T11:10:00Z', type: 'text', body: 'Please send them urgently.', status: 'delivered' },
  { id: 'msg-chat-3-3', chatId: 'chat-3', senderId: 'c-agent-1', timestamp: '2025-08-03T11:15:00Z', type: 'text', body: 'I have farmers waiting.', status: 'delivered' },
];

export const seedDB = {
  organizations: mockOrganizations,
  contacts: [...mockAgents, ...mockContacts],
  chats: mockChats,
  messages: mockMessages,
};