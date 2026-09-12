export type ScopeLevel = 'super_admin' | 'admin' | 'department_admin' | 'staff';

export type Permission =
  | 'whatsapp:chat_read_all'
  | 'whatsapp:chat_read_assigned'
  | 'whatsapp:send_media'
  | 'whatsapp:send_voice'
  | 'whatsapp:export_chat'
  | 'whatsapp:manage_tags'
  | 'whatsapp:assign_agent'
  | 'whatsapp:delete_chat'
  | 'whatsapp:transfer_ownership'
  | 'whatsapp:view_performance';

export interface WhatsAppRole {
  id: string;
  name: string;
  scopeLevel: ScopeLevel;
  permissions: Permission[];
  departmentId?: string; // only for department_admin
}

export interface Contact {
  id: string;
  name: string;
  phone: string;
  department?: string;
  tags: string[];
  metadata: Record<string, string>;
  source: 'directory' | 'adhoc';
  avatar?: string;
  profileLink?: string;
  staffId?: string; // if linked to a staff member
}

export type MessageType =
  | 'text'
  | 'image'
  | 'video'
  | 'document'
  | 'voice'
  | 'location'
  | 'internal_note';

export type MessageStatus = 'sent' | 'delivered' | 'read';

export interface Message {
  id: string;
  conversationId: string;
  sender: 'agent' | 'contact' | 'internal';
  content: string;
  type: MessageType;
  timestamp: string;
  status?: MessageStatus;
  agentId?: string;
  meta?: {
    fileName?: string;
    fileSize?: string;
    duration?: number; // seconds for voice
    lat?: number;
    lng?: number;
    label?: string;
  };
}

export interface TransferRecord {
  fromAgentId?: string;
  toAgentId?: string;
  at: string;
  reason?: string;
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
  transferHistory: TransferRecord[];
  notesLog: { id: string; authorId: string; content: string; at: string }[];
}

export interface CurrentUser {
  id: string;
  name: string;
  scopeLevel: ScopeLevel;
  departmentId?: string;
  permissions: Permission[];
  roleId: string;
}