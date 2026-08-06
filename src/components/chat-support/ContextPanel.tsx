import { Chat, WhatsAppContact } from '@/types/whatsapp';
import { useWhatsAppRepo } from '@/hooks/useWhatsAppRepository';
import { Button } from '@/components/ui/button';
import { X } from 'lucide-react';

interface Props {
  chat: Chat;
  onClose: () => void;
  onViewContact: (contactId: string) => void;
}

export function ContextPanel({ chat, onClose, onViewContact }: Props) {
  const { repo } = useWhatsAppRepo();
  const contact = repo.getContact(chat.contactId) as WhatsAppContact;

  // Mock transfer history
  const transferHistory = [
    { date: '2025-08-01 09:00', from: null, to: 'agent-alice', by: 'admin' },
    { date: '2025-08-02 11:30', from: 'agent-alice', to: 'agent-david', by: 'agent-alice' },
    { date: '2025-08-03 08:15', from: 'agent-david', to: null, by: 'supervisor' },
  ];

  // Internal notes log (from messages that are internal notes)
  const messages = repo.getMessages(chat.id);
  const notes = messages.filter((m) => m.isInternalNote);

  return (
    <div className="p-4 h-full overflow-y-auto">
      <div className="flex justify-between items-center mb-4">
        <h3 className="font-semibold">Details</h3>
        <Button variant="ghost" size="icon" onClick={onClose}>
          <X className="h-4 w-4" />
        </Button>
      </div>

      <div className="flex flex-col items-center mb-4">
        <img
          src={contact?.avatarUrl || 'https://i.pravatar.cc/80?u=default'}
          className="w-20 h-20 rounded-full mb-2"
          alt=""
        />
        <h4 className="font-medium">{contact?.displayName}</h4>
        <p className="text-sm text-muted-foreground">{contact?.phoneNumber}</p>
        <Button variant="link" size="sm" onClick={() => onViewContact(contact.id)}>
          View Full Contact
        </Button>
      </div>

      <div className="space-y-4 text-sm">
        <div>
          <h5 className="font-medium mb-2">Assignment</h5>
          <div className="bg-muted p-2 rounded">
            <span className="text-muted-foreground">Current Agent:</span>{' '}
            {chat.assignedAgentId
              ? repo.getContact(chat.assignedAgentId)?.displayName
              : 'Unassigned'}
          </div>
        </div>

        <div>
          <h5 className="font-medium mb-2">Transfer History</h5>
          <div className="space-y-1">
            {transferHistory.map((entry, idx) => (
              <div key={idx} className="text-xs bg-muted p-2 rounded">
                {entry.date}: {entry.from ? repo.getContact(entry.from)?.displayName : 'Unassigned'} →{' '}
                {entry.to ? repo.getContact(entry.to)?.displayName : 'Unassigned'} (by {entry.by})
              </div>
            ))}
          </div>
        </div>

        <div>
          <h5 className="font-medium mb-2">Internal Notes</h5>
          {notes.length > 0 ? (
            notes.map((note) => (
              <div key={note.id} className="bg-amber-50 dark:bg-amber-900/20 p-2 rounded mb-1 text-xs">
                <div className="font-medium">
                  {repo.getContact(note.senderId)?.displayName} –{' '}
                  {new Date(note.timestamp).toLocaleString()}
                </div>
                <p>{note.body}</p>
              </div>
            ))
          ) : (
            <p className="text-muted-foreground">No internal notes yet.</p>
          )}
        </div>

        <div>
          <h5 className="font-medium mb-2">Chat Details</h5>
          <div className="text-muted-foreground">
            <p>Created: {new Date(chat.createdAt).toLocaleString()}</p>
            <p>Status: {chat.status}</p>
            <p>Tags: {chat.tags.join(', ') || 'None'}</p>
          </div>
        </div>
      </div>
    </div>
  );
}