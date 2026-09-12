'use client';

import { Lock } from 'lucide-react';
import type { Message } from '@/types/whatsapp';
import { AttachmentBubble } from './AttachmentBubble';

interface Props {
  message: Message;
  authorName: string;
}

/**
 * Internal notes live inside the conversation but never leave the building.
 * The amber treatment, the dashed border and the explicit "Not sent to
 * WhatsApp" label are all load-bearing — this bubble must never be mistaken
 * for something the contact can see.
 */
export function TeamNoteBubble({ message, authorName }: Props) {
  return (
    <div className="mb-3 flex justify-center">
      <div className="w-full max-w-[85%] rounded-xl border-2 border-dashed border-amber-400 bg-amber-50 p-3 text-amber-950 dark:border-amber-500/60 dark:bg-amber-950/30 dark:text-amber-100">
        <div className="mb-1.5 flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-wide text-amber-700 dark:text-amber-400">
          <Lock className="h-3 w-3" />
          Internal note · not sent to WhatsApp
        </div>

        {message.attachments?.map((att) => (
          <AttachmentBubble key={att.id} attachment={att} isOwn={false} />
        ))}

        {message.body && <p className="whitespace-pre-wrap text-sm">{message.body}</p>}

        <div className="mt-1.5 text-[11px] opacity-70">
          {authorName} ·{' '}
          {new Date(message.timestamp).toLocaleTimeString([], {
            hour: '2-digit',
            minute: '2-digit',
          })}
        </div>
      </div>
    </div>
  );
}