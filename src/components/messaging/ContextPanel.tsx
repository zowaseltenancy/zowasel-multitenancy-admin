"use client";
import { useState } from 'react';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Pencil, Plus, ArrowRight } from 'lucide-react';
import { Contact, Conversation } from '@/lib/whatsapp/types';

export default function ContextPanel({
  conversation,
  contact,
  staffMembers,
  onEditContact,
  onAddNote,
  currentAgentId,
}: {
  conversation: Conversation;
  contact?: Contact;
  staffMembers: any[];
  onEditContact: () => void;
  onAddNote: (content: string) => void;
  currentAgentId: string;
}) {
  const [note, setNote] = useState('');
  const assignedAgent = staffMembers.find((s) => s.id === conversation.assignedAgentId);

  const findAgent = (id?: string) => staffMembers.find((s) => s.id === id);
  const agentName = (id?: string) => {
    const a = findAgent(id);
    return a ? `${a.firstName} ${a.lastName}` : 'Unassigned';
  };

  return (
    <div className="p-5 space-y-7 overflow-y-auto h-full">
      <div className="flex items-center gap-3">
        <Avatar className="h-14 w-14">
          <AvatarFallback className="text-lg">{contact?.name?.charAt(0) || '?'}</AvatarFallback>
        </Avatar>
        <div className="flex-1">
          <h3 className="font-semibold">{contact?.name}</h3>
          <p className="text-sm text-muted-foreground">{contact?.phone}</p>
          {contact?.department && (
            <Badge variant="outline" className="mt-1">{contact.department}</Badge>
          )}
        </div>
        <Button variant="ghost" size="icon" onClick={onEditContact} title="Edit contact">
          <Pencil className="h-4 w-4" />
        </Button>
      </div>

      <div>
        <h4 className="text-xs font-semibold uppercase text-muted-foreground mb-2">Assignment</h4>
        <p className="text-sm">{agentName(conversation.assignedAgentId)}</p>
      </div>

      <div>
        <h4 className="text-xs font-semibold uppercase text-muted-foreground mb-2">Tags</h4>
        <div className="flex flex-wrap gap-2">
          {conversation.tags.length === 0 ? (
            <span className="text-sm text-muted-foreground">No tags</span>
          ) : (
            conversation.tags.map((t) => <Badge key={t} variant="secondary">#{t}</Badge>)
          )}
        </div>
      </div>

      {contact?.metadata && Object.keys(contact.metadata).length > 0 && (
        <div>
          <h4 className="text-xs font-semibold uppercase text-muted-foreground mb-2">Metadata</h4>
          <div className="space-y-1 text-sm">
            {Object.entries(contact.metadata).map(([k, v]) => (
              <div key={k} className="flex justify-between">
                <span className="text-muted-foreground">{k}</span>
                <span>{v}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      <div>
        <h4 className="text-xs font-semibold uppercase text-muted-foreground mb-2">Transfer History</h4>
        {conversation.transferHistory.length === 0 ? (
          <p className="text-sm text-muted-foreground">No transfers yet</p>
        ) : (
          <div className="space-y-3">
            {conversation.transferHistory.slice().reverse().map((t, i) => (
              <div key={i} className="text-xs flex items-center gap-2 text-muted-foreground">
                <span>{agentName(t.fromAgentId)}</span>
                <ArrowRight className="h-3 w-3" />
                <span>{agentName(t.toAgentId)}</span>
                <span className="ml-auto">{new Date(t.at).toLocaleDateString()}</span>
              </div>
            ))}
          </div>
        )}
      </div>

      <div>
        <h4 className="text-xs font-semibold uppercase text-muted-foreground mb-2">Notes Log</h4>
        <div className="flex gap-2 mb-3">
          <Input
            value={note}
            onChange={(e) => setNote(e.target.value)}
            placeholder="Add a note..."
            onKeyDown={(e) => {
              if (e.key === 'Enter' && note.trim()) {
                onAddNote(note.trim());
                setNote('');
              }
            }}
          />
          <Button
            size="icon"
            variant="outline"
            onClick={() => {
              if (note.trim()) {
                onAddNote(note.trim());
                setNote('');
              }
            }}
          >
            <Plus className="h-4 w-4" />
          </Button>
        </div>
        {conversation.notesLog.length === 0 ? (
          <p className="text-sm text-muted-foreground">No notes yet</p>
        ) : (
          <div className="space-y-3">
            {conversation.notesLog.slice().reverse().map((n) => (
              <div key={n.id} className="text-xs bg-muted/40 rounded p-2">
                <p className="text-foreground">{n.content}</p>
                <p className="text-muted-foreground mt-1">
                  {agentName(n.authorId)} · {new Date(n.at).toLocaleString()}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}