'use client';

import { FileText, MapPin, Download } from 'lucide-react';
import type { Attachment } from '@/types/whatsapp';
import { VoiceNoteBubble } from './VoiceNoteBubble';

interface Props {
  attachment: Attachment;
  isOwn: boolean;
}

export function AttachmentBubble({ attachment, isOwn }: Props) {
  switch (attachment.type) {
    case 'image':
      return (
        <figure className="mb-1">
          <img
            src={attachment.thumbnailUrl || attachment.url}
            alt={attachment.caption || 'Shared image'}
            loading="lazy"
            className="max-w-full rounded-lg object-cover"
            style={{ maxHeight: 240 }}
          />
          {attachment.caption && (
            <figcaption className="mt-1 text-xs opacity-80">{attachment.caption}</figcaption>
          )}
        </figure>
      );

    case 'video':
      return (
        <div className="mb-1">
          <video
            src={attachment.url}
            controls
            preload="metadata"
            poster={attachment.thumbnailUrl}
            className="max-w-full rounded-lg"
            style={{ maxHeight: 240 }}
          />
          {attachment.caption && (
            <p className="mt-1 text-xs opacity-80">{attachment.caption}</p>
          )}
        </div>
      );

    case 'document':
      return (
        <div
          className={`mb-1 flex items-center gap-3 rounded-lg p-2 ${
            isOwn ? 'bg-black/10' : 'bg-muted'
          }`}
        >
          <FileText className="h-6 w-6 shrink-0 opacity-70" />
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-medium">{attachment.fileName}</p>
            <p className="text-xs opacity-70">{formatBytes(attachment.fileSize)}</p>
          </div>
          <a
            href={attachment.url}
            download={attachment.fileName}
            target="_blank"
            rel="noopener noreferrer"
            className="shrink-0 rounded p-1 hover:bg-black/10"
            aria-label={`Download ${attachment.fileName}`}
          >
            <Download className="h-4 w-4" />
          </a>
        </div>
      );

    case 'voice':
      return (
        <VoiceNoteBubble
          url={attachment.url}
          duration={attachment.duration}
          waveform={attachment.waveform}
          isOwn={isOwn}
        />
      );

    case 'location': {
      const label =
        attachment.label ||
        `${attachment.latitude.toFixed(4)}, ${attachment.longitude.toFixed(4)}`;
      const mapsUrl = `https://www.google.com/maps?q=${attachment.latitude},${attachment.longitude}`;
      return (
        <a
          href={mapsUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="mb-1 block overflow-hidden rounded-lg"
        >
          <div className="relative flex h-36 w-full items-center justify-center bg-muted">
            {attachment.mapImageUrl ? (
              <img
                src={attachment.mapImageUrl}
                alt={label}
                className="h-full w-full object-cover"
              />
            ) : (
              <MapPin className="h-8 w-8 text-muted-foreground" />
            )}
            <span className="absolute bottom-2 left-2 rounded bg-background/85 px-2 py-1 text-xs text-foreground">
              {label}
            </span>
          </div>
        </a>
      );
    }

    default:
      return null;
  }
}

function formatBytes(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${Math.round(bytes / 1024)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}