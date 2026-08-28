import type { WorkspaceRole } from '@/constants/whatsappPermissions';

// ---------------------------------------------------------------- attachments

export type AttachmentType = 'image' | 'video' | 'document' | 'voice' | 'location';

export interface BaseAttachment {
  id: string;
  type: AttachmentType;
}

export interface ImageAttachment extends BaseAttachment {
  type: 'image';
  url: string;
  thumbnailUrl?: string;
  caption?: string;
  width?: number;
  height?: number;
}

export interface VideoAttachment extends BaseAttachment {
  type: 'video';
  url: string;
  thumbnailUrl?: string;
  duration?: number;
  caption?: string;
}

export interface DocumentAttachment extends BaseAttachment {
  type: 'document';
  url: string;
  fileName: string;
  fileSize: number;
  mimeType?: string;
}

export interface VoiceAttachment extends BaseAttachment {
  type: 'voice';
  url: string;
  duration: number;
  /** Normalised 0–1 peaks. Computed from the real buffer, never random. */
  waveform?: number[];
}

export interface LocationAttachment extends BaseAttachment {
  type: 'location';
  latitude: number;
  longitude: number;
  label?: string;
  mapImageUrl?: string;
}

export type Attachment =
  | ImageAttachment
  | VideoAttachment
  | DocumentAttachment
  | VoiceAttachment
  | LocationAttachment;

// ------------------------------------------------------------------- messages

export type MessageStatus = 'sending' | 'sent' | 'delivered' | 'read' | 'failed';
export type MessageType = 'text' | 'media' | 'system';

export interface Message {
  id: string;
  chatId: string;
  senderId: string;
  timestamp: string;
  type: MessageType;
  body?: string;
  status: MessageStatus;
  attachments?: Attachment[];
  /** Amber bubble. Stored on the chat, never delivered to WhatsApp. */
  isInternalNote?: boolean;
  /** Set when a send is simulated as failed, so the retry path has a reason. */
  failureReason?: string;
}

export interface SendMessageInput {
  chatId: string;
  senderId: string;
  body?: string;
  attachments?: Attachment[];
  isInternalNote?: boolean;
  /** Optional client-generated id so optimistic UI can reconcile. */
  id?: string;
  status?: MessageStatus;
  timestamp?: string;
}

// ---------------------------------------------------------------------- chats

export type ChatStatus = 'active' | 'resolved' | 'archived';

export interface ChatSummaryMessage {
  id: string;
  body: string;
  timestamp: string;
  senderId: string;
  status: MessageStatus;
  isInternalNote?: boolean;
}

export interface Chat {
  id: string;
  contactId: string;
  assignedAgentId: string | null;
  department: string;
  tags: string[];
  isStarred: boolean;
  unreadCount: number;
  createdAt: string;
  updatedAt: string;
  status: ChatStatus;
  lastMessage?: ChatSummaryMessage;
}

export interface ChatFilter {
  /** `null` means explicitly unassigned. `undefined` means "don't filter". */
  agentId?: string | null;
  department?: string;
  starred?: boolean;
  searchQuery?: string;
  organizationId?: string;
  status?: ChatStatus;
}

// ------------------------------------------------------------------- contacts

export interface WhatsAppContact {
  id: string;
  phoneNumber: string;
  displayName: string;
  platformUserId?: string;
  department?: string;
  tags: string[];
  avatarUrl?: string;
  /** True for ad-hoc numbers added without a platform account. */
  isExternal: boolean;
  customMetadata?: Record<string, string>;
  createdAt?: string;
}

export interface Organization {
  id: string;
  name: string;
  memberContactIds: string[];
}

/**
 * 6b, source two: people who exist in the Staff/Customer directory but are not
 * yet WhatsApp contacts. Importing one creates a WhatsAppContact linked by
 * platformUserId.
 */
export interface DirectoryEntry {
  platformUserId: string;
  fullName: string;
  email: string;
  phoneNumber: string;
  department: string;
  kind: 'staff' | 'customer';
  avatarUrl?: string;
}

// --------------------------------------------------------------- audit events

export type ChatEventType =
  | 'chat_created'
  | 'assigned'
  | 'unassigned'
  | 'claimed'
  | 'transferred'
  | 'note_added'
  | 'tag_added'
  | 'tag_removed'
  | 'chat_deleted'
  | 'exported'
  | 'status_changed';

/**
 * One append-only log. Feeds transfer history, the notes log, destructive
 * action tracking, and the performance figures on the admin screen.
 */
export interface ChatEvent {
  id: string;
  chatId: string;
  actorId: string;
  type: ChatEventType;
  payload: Record<string, unknown>;
  at: string;
}

// -------------------------------------------------------------------- ancillary

export interface PresenceState {
  contactId: string;
  online: boolean;
  lastSeen: string;
}

export interface CannedResponse {
  id: string;
  shortcode: string;
  title: string;
  body: string;
}

export interface AgentPerformance {
  agentId: string;
  displayName: string;
  role: WorkspaceRole;
  department?: string;
  openChats: number;
  totalChats: number;
  messagesSent: number;
  notesWritten: number;
  transfersOut: number;
  /** Minutes between the first inbound message and the first agent reply. */
  avgFirstResponseMinutes: number | null;
}

// -------------------------------------------------------------- persistence

export interface WhatsAppDB {
  organizations: Organization[];
  chats: Chat[];
  messages: Record<string, Message[]>;
  contacts: WhatsAppContact[];
  events: ChatEvent[];
  presence: Record<string, PresenceState>;
  cannedResponses: CannedResponse[];
  directory: DirectoryEntry[];
}