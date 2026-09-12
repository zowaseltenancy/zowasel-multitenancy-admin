'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import { Play, Pause } from 'lucide-react';

interface Props {
  url: string;
  duration: number;
  waveform?: number[];
  isOwn?: boolean;
}

export function VoiceNoteBubble({ url, duration, waveform, isOwn = false }: Props) {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [playing, setPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);

  // Derived from the url, so it does not reshuffle on every render the way
  // Math.random() in the render body did.
  const bars = useMemo(() => waveform ?? deriveBars(url), [waveform, url]);

  useEffect(() => {
    const el = audioRef.current;
    if (!el) return;
    const onEnd = () => {
      setPlaying(false);
      setCurrentTime(0);
    };
    el.addEventListener('ended', onEnd);
    return () => el.removeEventListener('ended', onEnd);
  }, []);

  const togglePlay = () => {
    const el = audioRef.current;
    if (!el) return;
    if (playing) {
      el.pause();
      setPlaying(false);
    } else {
      void el.play();
      setPlaying(true);
    }
  };

  const seekTo = (fraction: number) => {
    const el = audioRef.current;
    if (!el) return;
    const target = fraction * (el.duration || duration);
    el.currentTime = target;
    setCurrentTime(target);
  };

  const total = duration || audioRef.current?.duration || 1;
  const progress = Math.min(100, (currentTime / total) * 100);

  return (
    <div
      className={`mb-1 flex min-w-[220px] items-center gap-3 rounded-lg p-2 ${
        isOwn ? 'bg-black/10' : 'bg-muted'
      }`}
    >
      <button
        onClick={togglePlay}
        aria-label={playing ? 'Pause voice note' : 'Play voice note'}
        className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground transition hover:opacity-90"
      >
        {playing ? <Pause className="h-4 w-4" /> : <Play className="ml-0.5 h-4 w-4" />}
      </button>

      <div
        role="slider"
        tabIndex={0}
        aria-label="Seek voice note"
        aria-valuenow={Math.round(progress)}
        aria-valuemin={0}
        aria-valuemax={100}
        className="flex h-9 flex-1 cursor-pointer items-end gap-[2px]"
        onClick={(e) => {
          const rect = e.currentTarget.getBoundingClientRect();
          seekTo((e.clientX - rect.left) / rect.width);
        }}
        onKeyDown={(e) => {
          if (e.key === 'ArrowRight') seekTo(Math.min(1, currentTime / total + 0.05));
          if (e.key === 'ArrowLeft') seekTo(Math.max(0, currentTime / total - 0.05));
        }}
      >
        {bars.map((h, i) => (
          <span
            key={i}
            className="flex-1 rounded-sm bg-current"
            style={{
              height: `${Math.max(12, h * 100)}%`,
              opacity: (i / bars.length) * 100 <= progress ? 0.95 : 0.35,
            }}
          />
        ))}
      </div>

      <span className="shrink-0 text-xs tabular-nums opacity-70">
        {formatTime(playing || currentTime > 0 ? total - currentTime : total)}
      </span>

      <audio
        ref={audioRef}
        src={url}
        preload="metadata"
        onTimeUpdate={(e) => setCurrentTime(e.currentTarget.currentTime)}
      />
    </div>
  );
}

function formatTime(seconds: number): string {
  const s = Math.max(0, Math.round(seconds));
  return `${Math.floor(s / 60)}:${String(s % 60).padStart(2, '0')}`;
}

/** Stable pseudo-waveform for seeded/simulated clips that carry no real peaks. */
function deriveBars(seed: string, count = 36): number[] {
  let h = 0;
  for (let i = 0; i < seed.length; i++) h = (h * 31 + seed.charCodeAt(i)) % 100_000;
  return Array.from({ length: count }, (_, i) => {
    h = (h * 1103515245 + 12345) % 2_147_483_648;
    return 0.25 + ((h >> (i % 8)) % 60) / 100;
  });
}

/**
 * Compute real peaks from a recorded Blob. Use this for MediaRecorder output
 * so the waveform actually describes the audio.
 */
export async function computeWaveform(blob: Blob, buckets = 36): Promise<number[]> {
  const AudioCtx =
    window.AudioContext ||
    (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
  const ctx = new AudioCtx();
  try {
    const buffer = await ctx.decodeAudioData(await blob.arrayBuffer());
    const data = buffer.getChannelData(0);
    const size = Math.floor(data.length / buckets);
    const peaks: number[] = [];
    for (let i = 0; i < buckets; i++) {
      let peak = 0;
      for (let j = 0; j < size; j++) peak = Math.max(peak, Math.abs(data[i * size + j] ?? 0));
      peaks.push(peak);
    }
    const max = Math.max(...peaks, 0.01);
    return peaks.map((p) => p / max);
  } finally {
    void ctx.close();
  }
}