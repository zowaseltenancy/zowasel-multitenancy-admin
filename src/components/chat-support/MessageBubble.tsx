import { Message } from '@/types/whatsapp';
import { Check, CheckCheck, Play, MapPin } from 'lucide-react';
import { useState, useRef } from 'react';

interface Props {
  message: Message;
  isOwn: boolean;
  contactName: string;
}

export function MessageBubble({ message, isOwn, contactName }: Props) {
  const bgClass = isOwn
    ? 'bg-primary text-primary-foreground'
    : 'bg-card text-foreground border border-border';
  const noteClass = message.isInternalNote
    ? 'bg-amber-100 dark:bg-amber-900/30 border border-amber-300'
    : '';

  const statusIcon = () => {
    if (!isOwn) return null;
    switch (message.status) {
      case 'sending':
        return <span className="text-xs opacity-70">⏳</span>;
      case 'sent':
        return <Check className="h-3 w-3 opacity-50" />;
      case 'delivered':
        return <CheckCheck className="h-3 w-3 opacity-50" />;
      case 'read':
        return <CheckCheck className="h-3 w-3 text-blue-500" />;
      case 'failed':
        return <span className="text-xs text-destructive">⚠</span>;
    }
  };

  const renderAttachment = (att: any) => {
    switch (att.type) {
      case 'image':
        return (
          <div className="mb-1">
            <img
              src={att.url || att.thumbnailUrl}
              alt=""
              className="max-w-full rounded-lg"
              style={{ maxHeight: '200px' }}
            />
            {att.caption && <p className="text-xs mt-1 opacity-80">{att.caption}</p>}
          </div>
        );
      case 'video':
        return (
          <div className="mb-1 relative">
            <video
              src={att.url}
              controls
              className="max-w-full rounded-lg"
              style={{ maxHeight: '200px' }}
            />
          </div>
        );
      case 'document':
        return (
          <div className="mb-1 flex items-center gap-2 p-2 bg-muted rounded-lg">
            <div className="text-2xl">📄</div>
            <div>
              <p className="text-sm font-medium">{att.fileName}</p>
              <p className="text-xs text-muted-foreground">{Math.round(att.fileSize / 1024)} KB</p>
            </div>
            <a
              href={att.url}
              download
              className="ml-auto text-primary text-xs underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              Download
            </a>
          </div>
        );
      case 'voice':
        return <VoiceNotePlayer url={att.url} duration={att.duration} waveform={att.waveform} />;
      case 'location':
        return (
          <div className="mb-1">
            <div
              className="w-full h-40 rounded-lg bg-muted flex items-center justify-center relative overflow-hidden"
            >
              {att.mapImageUrl ? (
                <img src={att.mapImageUrl} alt="Location" className="w-full h-full object-cover" />
              ) : (
                <MapPin className="h-8 w-8 text-muted-foreground" />
              )}
              <div className="absolute bottom-2 left-2 bg-background/80 px-2 py-1 rounded text-xs">
                {att.label || `${att.latitude.toFixed(4)}, ${att.longitude.toFixed(4)}`}
              </div>
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className={`flex ${isOwn ? 'justify-end' : 'justify-start'} mb-2`}>
      <div className={`max-w-[75%] ${isOwn ? 'order-1' : ''}`}>
        {!isOwn && !message.isInternalNote && (
          <span className="text-xs font-medium text-muted-foreground ml-2 mb-1">
            {contactName}
          </span>
        )}
        <div className={`p-3 rounded-2xl ${bgClass} ${noteClass} relative`}>
          {message.isInternalNote && (
            <div className="text-xs font-bold text-amber-700 dark:text-amber-400 mb-1">
              🔒 Internal Note
            </div>
          )}
          {message.type === 'text' && <p className="whitespace-pre-wrap">{message.body}</p>}
          {message.type === 'media' && (
            <>
              {message.attachments.map((att, idx) => (
                <div key={idx}>{renderAttachment(att)}</div>
              ))}
              {message.body && <p className="text-sm mt-1">{message.body}</p>}
            </>
          )}
          <div className="flex items-center gap-1 mt-1 justify-end">
            <span className="text-xs opacity-70">
              {new Date(message.timestamp).toLocaleTimeString([], {
                hour: '2-digit',
                minute: '2-digit',
              })}
            </span>
            {statusIcon()}
          </div>
        </div>
      </div>
    </div>
  );
}

// Sub-component for voice notes
function VoiceNotePlayer({
  url,
  duration,
  waveform,
}: {
  url: string;
  duration: number;
  waveform?: number[];
}) {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [playing, setPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);

  const togglePlay = () => {
    if (!audioRef.current) return;
    if (playing) {
      audioRef.current.pause();
    } else {
      audioRef.current.play();
    }
    setPlaying(!playing);
  };

  const handleTimeUpdate = () => {
    if (audioRef.current) {
      setCurrentTime(audioRef.current.currentTime);
    }
  };

  const progress = duration > 0 ? (currentTime / duration) * 100 : 0;
  const bars = waveform || Array.from({ length: 40 }, () => Math.random() * 0.8 + 0.2);

  return (
    <div className="flex items-center gap-3 p-2 bg-muted rounded-lg min-w-[200px]">
      <button
        onClick={togglePlay}
        className="text-primary hover:scale-110 transition"
      >
        {playing ? (
          <span className="text-xl">⏸</span>
        ) : (
          <Play className="h-5 w-5" />
        )}
      </button>
      <div className="flex-1 h-10 flex items-end gap-[1px] relative">
        {bars.map((h, i) => (
          <div
            key={i}
            className="w-1 bg-primary rounded"
            style={{
              height: `${h * 100}%`,
              opacity: (i / bars.length) * 100 <= progress ? 1 : 0.5,
            }}
          />
        ))}
      </div>
      <span className="text-xs text-muted-foreground">{duration}s</span>
      <audio
        ref={audioRef}
        src={url}
        onTimeUpdate={handleTimeUpdate}
        onEnded={() => setPlaying(false)}
        preload="metadata"
      />
    </div>
  );
}