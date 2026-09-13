import { useEffect, useRef, useState } from 'react';
import { Chat, Message } from '@/types/whatsapp';
import { useWhatsAppRepo } from '@/hooks/useWhatsAppRepository';
import { useAuth } from '@/hooks/useAuth';
import { ChatHeader } from './ChatHeader';
import { MessageBubble } from './MessageBubble';
import { Composer } from './Composer';
import { PermissionGate } from '../PermissionGate';
import { WHATSAPP_PERMISSIONS } from '@/types/permissions';

interface Props {
  chat: Chat;
  onBack: () => void;
  onToggleContext: () => void;
  contextOpen: boolean;
  /** Forwarded to ChatHeader, which opens the contact drawer. */
  onViewContact: (contactId: string) => void;
}

let idCounter = 0;

export function ConversationView({ chat, onBack, onToggleContext, contextOpen, onViewContact }: Props) {
  const { repo, resetTrigger } = useWhatsAppRepo();
  const user = useAuth();
  const [messages, setMessages] = useState<Message[]>([]);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [isAtBottom, setIsAtBottom] = useState(true);

  // Reload when chat or reset changes
  useEffect(() => {
    const msgs = repo.getMessages(chat.id);
    setMessages(msgs);
    repo.markRead(chat.id);
  }, [chat.id, resetTrigger, repo]);

  // Auto‑scroll
  useEffect(() => {
    if (isAtBottom) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isAtBottom]);

  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    const target = e.currentTarget;
    const bottom = target.scrollHeight - target.scrollTop <= target.clientHeight + 50;
    setIsAtBottom(bottom);
  };

  const handleSendMessage = (text: string, attachments?: any[]) => {
    if (!text.trim() && !attachments) return;

    const optimisticId = `temp-${Date.now()}-${++idCounter}-${Math.random().toString(36).slice(2, 9)}`;

    const optimisticMsg: Message = {
      id: optimisticId,
      chatId: chat.id,
      senderId: user.id,
      timestamp: new Date().toISOString(),
      type: attachments ? 'media' : 'text',
      body: text,
      status: 'sending',
      ...(attachments && { attachments }),
    } as Message;

    // Prevent duplicate IDs (just in case)
    setMessages((prev) => {
      if (prev.some((m) => m.id === optimisticId)) return prev;
      return [...prev, optimisticMsg];
    });

    repo.sendMessage(optimisticMsg);

    setTimeout(() => {
      setMessages((prev) =>
        prev.map((msg) =>
          msg.id === optimisticId ? { ...msg, status: 'sent' } : msg
        )
      );
      repo.sendMessage({ ...optimisticMsg, status: 'sent' });
    }, 800);

    setTimeout(() => {
      setMessages((prev) =>
        prev.map((msg) =>
          msg.id === optimisticId ? { ...msg, status: 'delivered' } : msg
        )
      );
    }, 2000);
  };

  // Group by date
  const grouped = messages.reduce<{ date: string; messages: Message[] }[]>((acc, msg) => {
    const dateStr = new Date(msg.timestamp).toLocaleDateString();
    const lastGroup = acc[acc.length - 1];
    if (lastGroup && lastGroup.date === dateStr) {
      lastGroup.messages.push(msg);
    } else {
      acc.push({ date: dateStr, messages: [msg] });
    }
    return acc;
  }, []);

  return (
    <div className="flex flex-col h-full">
      <ChatHeader
        chat={chat}
        onBack={onBack}
        onViewContact={onViewContact}
        onToggleContext={onToggleContext}
        contextOpen={contextOpen}
      />

      {/* Full‑width conversation, no max‑w */}
      <div className="flex-1 flex flex-col min-h-0">
        <div
          className="flex-1 overflow-y-auto p-4 space-y-6"
          onScroll={handleScroll}
        >
          {grouped.map((group) => (
            <div key={group.date}>
              <div className="flex justify-center mb-4">
                <span className="text-xs bg-muted px-3 py-1 rounded-full text-muted-foreground">
                  {group.date}
                </span>
              </div>
              {group.messages.map((msg) => (
                <MessageBubble
                  key={msg.id}
                  message={msg}
                  isOwn={msg.senderId === user.id}
                  contactName={repo.getContact(msg.senderId)?.displayName || 'Unknown'}
                />
              ))}
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>

        <PermissionGate required={[WHATSAPP_PERMISSIONS.CHAT_READ_ASSIGNED]}>
          <Composer onSend={handleSendMessage} />
        </PermissionGate>
      </div>
    </div>
  );
}