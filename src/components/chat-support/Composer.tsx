import { useState, useRef, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { PermissionGate } from '../PermissionGate';
import { WHATSAPP_PERMISSIONS } from '@/types/permissions';
import { Button } from '@/components/ui/button';
import { Smile, Paperclip, Send } from 'lucide-react';

const CANNED_RESPONSES = [
  'Thank you for contacting us. How can I help?',
  'I’ll look into this and get back to you shortly.',
  'Your request has been forwarded to the relevant department.',
  'Please provide your order number for faster assistance.',
  'Apologies for the delay. I’m checking your account now.',
];

interface Props {
  onSend: (text: string, attachments?: any[]) => void;
}

export function Composer({ onSend }: Props) {
  const [text, setText] = useState('');
  const [showEmoji, setShowEmoji] = useState(false);
  const [showCanned, setShowCanned] = useState(false);
  const [cannedFilter, setCannedFilter] = useState('');
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const user = useAuth();

  // Detect "/" trigger
  useEffect(() => {
    const cursorPos = textareaRef.current?.selectionStart || 0;
    const textBeforeCursor = text.slice(0, cursorPos);
    const match = textBeforeCursor.match(/\/(\w*)$/);
    if (match) {
      setShowCanned(true);
      setCannedFilter(match[1]);
    } else {
      setShowCanned(false);
    }
  }, [text]);

  const autoResize = () => {
    const el = textareaRef.current;
    if (el) {
      el.style.height = 'auto';
      el.style.height = el.scrollHeight + 'px';
    }
  };

  useEffect(autoResize, [text]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey && !showCanned) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleSend = () => {
    if (!text.trim()) return;
    onSend(text);
    setText('');
    setShowEmoji(false);
  };

  const insertEmoji = (emoji: string) => {
    setText((prev) => prev + emoji);
    textareaRef.current?.focus();
  };

  const insertCannedResponse = (response: string) => {
    // Replace the "/" trigger text with the full response
    const cursorPos = textareaRef.current?.selectionStart || 0;
    const textBefore = text.slice(0, cursorPos);
    const lastSlash = textBefore.lastIndexOf('/');
    const newText = text.slice(0, lastSlash) + response + text.slice(cursorPos);
    setText(newText);
    setShowCanned(false);
  };

  const filteredCanned = CANNED_RESPONSES.filter((r) =>
    r.toLowerCase().includes(cannedFilter.toLowerCase())
  );

  const emojis = ['😀', '😂', '😍', '👍', '🙏', '💚', '🌾', '💰', '📞', '📷'];

  return (
    <div className="p-3 border-t border-border bg-card relative">
      {showCanned && filteredCanned.length > 0 && (
        <div className="absolute bottom-full left-0 mb-2 w-full bg-popover rounded-lg shadow-lg border border-border z-10 max-h-48 overflow-y-auto">
          {filteredCanned.map((resp, idx) => (
            <div
              key={idx}
              className="px-3 py-2 hover:bg-accent cursor-pointer text-sm"
              onClick={() => insertCannedResponse(resp)}
            >
              {resp}
            </div>
          ))}
        </div>
      )}

      <div className="flex items-end gap-2">
        <PermissionGate required={[WHATSAPP_PERMISSIONS.SEND_MEDIA]}>
          <Button variant="ghost" size="icon">
            <Paperclip className="h-5 w-5" />
          </Button>
        </PermissionGate>

        <div className="flex-1 relative">
          <textarea
            ref={textareaRef}
            rows={1}
            value={text}
            onChange={(e) => setText(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Type a message... use / for canned replies"
            className="w-full resize-none rounded-lg border border-input bg-background px-3 py-2 text-sm outline-none focus:ring-1 focus:ring-ring"
            style={{ maxHeight: '120px' }}
          />
          {showEmoji && (
            <div className="absolute bottom-full left-0 mb-2 p-2 bg-popover rounded-lg shadow-lg border border-border grid grid-cols-5 gap-1">
              {emojis.map((emoji) => (
                <button
                  key={emoji}
                  onClick={() => insertEmoji(emoji)}
                  className="text-xl hover:bg-muted p-1 rounded"
                >
                  {emoji}
                </button>
              ))}
            </div>
          )}
        </div>

        <button onClick={() => setShowEmoji(!showEmoji)} className="p-1">
          <Smile className="h-5 w-5 text-muted-foreground" />
        </button>

        <Button onClick={handleSend} size="icon" disabled={!text.trim()}>
          <Send className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}