"use client";
import { Check, CheckCheck, FileText, MapPin, Play, Mic } from 'lucide-react';
import { Message } from '@/lib/whatsapp/types';

export default function MessageBubble({ message }: { message: Message }) {
  const isAgent = message.sender === 'agent';
  const isInternal = message.type === 'internal_note';

  const bubbleClass = isInternal
    ? 'bg-amber-100 text-amber-900 border border-amber-300'
    : isAgent
    ? 'bg-primary text-primary-foreground'
    : 'bg-muted';

  return (
    <div className={`flex ${isAgent ? 'justify-end' : 'justify-start'}`}>
      <div className={`max-w-[70%] rounded-lg p-3 ${bubbleClass}`}>
        {message.type === 'text' && <p className="text-sm whitespace-pre-wrap">{message.content}</p>}

        {message.type === 'image' && (
          <div>
            <div className="bg-black/20 rounded w-64 h-40 flex items-center justify-center text-xs">
              [Image: {message.meta?.fileName || 'photo.jpg'}]
            </div>
            {message.content && <p className="text-sm mt-2">{message.content}</p>}
          </div>
        )}

        {message.type === 'video' && (
          <div className="bg-black/20 rounded w-64 h-40 flex items-center justify-center">
            <Play className="h-10 w-10" />
          </div>
        )}

        {message.type === 'document' && (
          <div className="flex items-center gap-2">
            <FileText className="h-8 w-8" />
            <div>
              <p className="text-sm font-medium">{message.meta?.fileName || 'Document'}</p>
              <p className="text-xs opacity-70">{message.meta?.fileSize || '—'}</p>
            </div>
          </div>
        )}

        {message.type === 'voice' && (
          <div className="flex items-center gap-3 min-w-[180px]">
            <Mic className="h-5 w-5" />
            <div className="flex-1 h-6 flex items-center gap-0.5">
              {Array.from({ length: 24 }).map((_, i) => (
                <div
                  key={i}
                  className="w-0.5 bg-current opacity-60"
                  style={{ height: `${Math.random() * 100}%` }}
                />
              ))}
            </div>
            <span className="text-xs">{message.meta?.duration ?? 0}s</span>
          </div>
        )}

        {message.type === 'location' && (
          <div className="flex items-center gap-2">
            <MapPin className="h-5 w-5" />
            <div>
              <p className="text-sm">{message.meta?.label || 'Shared location'}</p>
              <p className="text-xs opacity-70">
                {message.meta?.lat}, {message.meta?.lng}
              </p>
            </div>
          </div>
        )}

        {isInternal && (
          <div className="text-xs font-semibold mb-1">Internal Note</div>
        )}

        <div className="flex items-center justify-end gap-1 mt-1">
          <span className="text-xs opacity-70">
            {new Date(message.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
          </span>
          {isAgent && message.status && (
            <>
              {message.status === 'sent' && <Check className="h-3 w-3 opacity-70" />}
              {message.status === 'delivered' && <CheckCheck className="h-3 w-3 opacity-70" />}
              {message.status === 'read' && <CheckCheck className="h-3 w-3 text-blue-500" />}
            </>
          )}
        </div>
      </div>
    </div>
  );
}