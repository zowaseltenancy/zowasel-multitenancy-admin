export type PermissionCategory =
  | "staff"
  | "departments"
  | "leave"
  | "leads"
  | "businesses"
  | "organizations"
  | "kyb"
  | "modules"
  | "billing"
  | "users"
  | "roles"
  | "permissions"
  | "system"
  // Anything in the server's catalogue whose resource prefix is not one of the
  // categories above — including scopes an operator adds from the Permissions
  // screen. Without it a custom scope would have nowhere to appear in the
  // matrix, which is the same as not existing.
  | "custom";

export type PermissionAction = "read" | "create" | "update" | "delete" | "approve" | "export";

export interface Permission {
  id: string;
  code: string;
  name: string;
  description: string;
  category: PermissionCategory;
  action: PermissionAction;
  isSensitive?: boolean;
}

export interface Role {
  id: string;
  name: string;
  description: string;
  isSystemRole: boolean;
  permissions: string[]; // array of permission codes
  userCount: number;
  createdAt: string;
  updatedAt: string;
}

export interface PermissionCategoryGroup {
  category: PermissionCategory;
  label: string;
  description: string;
  permissions: Permission[];
}


export const WHATSAPP_PERMISSIONS = {
  CHAT_READ_ALL: 'whatsapp:chat_read_all',
  CHAT_READ_ASSIGNED: 'whatsapp:chat_read_assigned',
  SEND_MEDIA: 'whatsapp:send_media',
  SEND_VOICE: 'whatsapp:send_voice',
  EXPORT_CHAT: 'whatsapp:export_chat',
  MANAGE_TAGS: 'whatsapp:manage_tags',
  ASSIGN_AGENT: 'whatsapp:assign_agent',
  DELETE_CHAT: 'whatsapp:delete_chat',
  VIEW_INTERNAL_NOTES: 'whatsapp:view_internal_notes',
} as const;
export type WhatsAppPermission = (typeof WHATSAPP_PERMISSIONS)[keyof typeof WHATSAPP_PERMISSIONS];