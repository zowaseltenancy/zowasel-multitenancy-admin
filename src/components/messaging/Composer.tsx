"use client";
import { useState, useRef, useEffect } from 'react';
import { Send, Paperclip, Smile, Mic, FileText, MapPin, StickyNote } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import PermissionGate from '@/components/PermissionGate';
import { Message } from '@/lib/whatsapp/types';

const CANNED_RESPONSES = [
  { trigger: '/hi', text: 'Hello! How can I help you today?' },
  { trigger: '/thanks', text: 'Thank you for reaching out. Have a great day!' },
  { trigger: '/wait', text: 'Please give me a moment while I check that for you.' },
  { trigger: '/bye', text: 'Goodbye! Feel free to reach out anytime.' },
];

const EMOJIS = ['😀', '😂', '❤️', '👍', '🙏', '🔥', '🎉', '😊', '😢', '😮', '🙌', '✨'];

export default function Composer({
  onSend,
  onInternalNote,
  currentAgentId,
}: {
  onSend: (content: string, type: Message['type'], meta?: Message['meta']) => void;
  onInternalNote: (content: string) => void;
  currentAgentId: string;
}) {
  const [text, setText] = useState('');
  const [showCanned, setShowCanned] = useState(false);
  const [showEmoji, setShowEmoji] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (text.startsWith('/')) {
      setShowCanned(true);
    } else {
      setShowCanned(false);
    }
  }, [text]);

  const filteredCanned = CANNED_RESPONSES.filter((c) =>
    c.trigger.startsWith(text.split(' ')[0])
  );

  const send = () => {
    if (!text.trim()) return;
    onSend(text.trim(), 'text');
    setText('');
    setShowCanned(false);
  };

  const handleKey = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      send();
    }
  };

  return (
    <div className="p-4 border-t relative">
      {showCanned && filteredCanned.length > 0 && (
        <div className="absolute bottom-full left-4 right-4 mb-2 bg-popover border rounded-lg shadow-lg max-h-48 overflow-y-auto">
          {filteredCanned.map((c) => (
            <button
              key={c.trigger}
              className="w-full text-left px-4 py-2 hover:bg-muted text-sm"
              onClick={() => {
                setText(c.text);
                setShowCanned(false);
                textareaRef.current?.focus();
              }}
            >
              <span className="font-mono text-xs text-primary mr-2">{c.trigger}</span>
              {c.text}
            </button>
          ))}
        </div>
      )}

      {showEmoji && (
        <div className="absolute bottom-full right-4 mb-2 bg-popover border rounded-lg shadow-lg p-2 grid grid-cols-6 gap-1">
          {EMOJIS.map((e) => (
            <button
              key={e}
              className="text-xl hover:bg-muted rounded p-1"
              onClick={() => {
                setText((t) => t + e);
                setShowEmoji(false);
              }}
            >
              {e}
            </button>
          ))}
        </div>
      )}

      <div className="flex items-end gap-2">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon"><Paperclip className="h-5 w-5" /></Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="start">
            <PermissionGate permission="whatsapp:send_media">
              <DropdownMenuItem onClick={() => onSend('', 'image', { fileName: 'photo.jpg', fileSize: '120 KB' })}>
                <FileText className="h-4 w-4 mr-2" /> Image
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => onSend('', 'document', { fileName: 'invoice.pdf', fileSize: '240 KB' })}>
                <FileText className="h-4 w-4 mr-2" /> Document
              </DropdownMenuItem>
            </PermissionGate>
            <PermissionGate permission="whatsapp:send_voice">
              <DropdownMenuItem onClick={() => onSend('', 'voice', { duration: 12 })}>
                <Mic className="h-4 w-4 mr-2" /> Voice Note
              </DropdownMenuItem>
            </PermissionGate>
            <DropdownMenuItem onClick={() => onSend('', 'location', { lat: 6.5244, lng: 3.3792, label: 'Shared location' })}>
              <MapPin className="h-4 w-4 mr-2" /> Location
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => {
              const note = prompt('Internal note (visible only to agents):');
              if (note?.trim()) onInternalNote(note.trim());
            }}>
              <StickyNote className="h-4 w-4 mr-2" /> Internal Note
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        <div className="flex-1">
          <textarea
            ref={textareaRef}
            value={text}
            onChange={(e) => setText(e.target.value)}
            onKeyDown={handleKey}
            placeholder="Type a message (use / for canned responses)"
            rows={1}
            className="w-full resize-none rounded-lg border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
          />
        </div>

        <Button variant="ghost" size="icon" onClick={() => setShowEmoji((s) => !s)}>
          <Smile className="h-5 w-5" />
        </Button>
        <Button onClick={send} size="icon" disabled={!text.trim()}>
          <Send className="h-5 w-5" />
        </Button>
      </div>
    </div>
  );
}