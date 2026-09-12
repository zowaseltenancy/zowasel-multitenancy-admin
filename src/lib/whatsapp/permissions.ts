import { Permission, ScopeLevel, WhatsAppRole } from './types';

export const ALL_WHATSAPP_PERMISSIONS: { id: Permission; label: string; group: string }[] = [
  { id: 'whatsapp:chat_read_all', label: 'Read all conversations', group: 'Inbox Access' },
  { id: 'whatsapp:chat_read_assigned', label: 'Read assigned conversations', group: 'Inbox Access' },
  { id: 'whatsapp:assign_agent', label: 'Assign agent to conversation', group: 'Inbox Access' },
  { id: 'whatsapp:transfer_ownership', label: 'Transfer ownership', group: 'Inbox Access' },
  { id: 'whatsapp:send_media', label: 'Send media (image, video, doc)', group: 'Messaging' },
  { id: 'whatsapp:send_voice', label: 'Send voice notes', group: 'Messaging' },
  { id: 'whatsapp:manage_tags', label: 'Manage tags', group: 'Contact Management' },
  { id: 'whatsapp:export_chat', label: 'Export chat', group: 'Admin Actions' },
  { id: 'whatsapp:delete_chat', label: 'Delete conversation', group: 'Admin Actions' },
  { id: 'whatsapp:view_performance', label: 'View performance logs', group: 'Admin Actions' },
];

export const SCOPE_LEVEL_LABELS: Record<ScopeLevel, string> = {
  super_admin: 'Super Admin',
  admin: 'Admin',
  department_admin: 'Department Admin',
  staff: 'Staff / Agent',
};

export const DEFAULT_WHATSAPP_ROLES: WhatsAppRole[] = [
  {
    id: 'wa-role-super',
    name: 'Super Admin',
    scopeLevel: 'super_admin',
    permissions: ALL_WHATSAPP_PERMISSIONS.map((p) => p.id),
  },
  {
    id: 'wa-role-admin',
    name: 'Admin',
    scopeLevel: 'admin',
    permissions: [
      'whatsapp:chat_read_all',
      'whatsapp:assign_agent',
      'whatsapp:transfer_ownership',
      'whatsapp:send_media',
      'whatsapp:send_voice',
      'whatsapp:manage_tags',
      'whatsapp:export_chat',
      'whatsapp:view_performance',
    ],
  },
  {
    id: 'wa-role-dept-admin',
    name: 'Department Admin',
    scopeLevel: 'department_admin',
    permissions: [
      'whatsapp:chat_read_all',
      'whatsapp:assign_agent',
      'whatsapp:send_media',
      'whatsapp:send_voice',
      'whatsapp:manage_tags',
      'whatsapp:view_performance',
    ],
  },
  {
    id: 'wa-role-agent',
    name: 'Staff / Agent',
    scopeLevel: 'staff',
    permissions: [
      'whatsapp:chat_read_assigned',
      'whatsapp:send_media',
      'whatsapp:send_voice',
      'whatsapp:manage_tags',
    ],
  },
];