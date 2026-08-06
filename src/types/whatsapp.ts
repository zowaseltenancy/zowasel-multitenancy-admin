export interface Organization {
  id: string;
  name: string;
  memberContactIds: string[];   // references WhatsAppContact.id
}

// A WhatsApp-specific contact (can be linked to PlatformUser or external)
export interface WhatsAppContact {
  id: string;
  phoneNumber: string;           // E.164 format
  displayName: string;
  platformUserId?: string;       // optional FK to PlatformUser
  department?: string;           // derived from PlatformUser.department
  tags: string[];
  customMetadata?: Record<string, any>;
  avatarUrl?: string;
  isExternal: boolean;           // true if added ad‑hoc
}

export type MessageStatus = 'sending' | 'sent' | 'delivered' | 'read' | 'failed';

export interface BaseMessage {
  id: string;
  chatId: string;
  senderId: string;              // contact id (could be agent or external)
  timestamp: string;             // ISO
  status: MessageStatus;
  isInternalNote?: boolean;      // true → amber bubble, not sent to WhatsApp
}

export interface TextMessage extends BaseMessage {
  type: 'text';
  body: string;
}

export interface ImageAttachment {
  type: 'image';
  url: string;
  thumbnailUrl?: string;
  caption?: string;
  mimeType: string;
  size?: number; // bytes
}

export interface VideoAttachment {
  type: 'video';
  url: string;
  thumbnailUrl?: string;
  duration?: number; // seconds
  mimeType: string;
  size?: number;
}

export interface DocumentAttachment {
  type: 'document';
  url: string;
  fileName: string;
  fileSize: number;
  mimeType: string;
}

export interface VoiceNoteAttachment {
  type: 'voice';
  url: string;
  duration: number; // seconds
  waveform?: number[]; // normalized amplitude samples for visualization
}

export interface LocationAttachment {
  type: 'location';
  latitude: number;
  longitude: number;
  label?: string;
  mapImageUrl?: string; // static thumbnail
}

export type Attachment =
  | ImageAttachment
  | VideoAttachment
  | DocumentAttachment
  | VoiceNoteAttachment
  | LocationAttachment;

export interface MediaMessage extends BaseMessage {
  type: 'media';
  attachments: Attachment[];
  body?: string; // optional caption
}

export type Message = TextMessage | MediaMessage;

export interface Chat {
  id: string;
  contactId: string;              // the external contact (or main contact)
  assignedAgentId?: string | null; // null → unassigned pool
  department: string;             // department the chat belongs to
  tags: string[];
  isStarred: boolean;             // per‑agent starred (simplified: global flag for mock, can be extended)
  lastMessage?: Pick<Message, 'id' | 'body' | 'timestamp'>;
  unreadCount: number;
  createdAt: string;
  updatedAt: string;
  status: 'active' | 'resolved' | 'archived';
}