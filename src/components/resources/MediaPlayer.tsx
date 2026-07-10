'use client';

import { useEffect, useRef, useState } from 'react';

/**
 * APA media experiences.
 * - VideoPlayer: branded wrapper around a native <video> (poster, faststart mp4).
 * - PodcastPlayer: custom audio player — play/pause, seek, time, speed, download.
 * - InProductionCard: honest placeholder for episodes whose master audio is
 *   still in post-production (transcript + screenplay remain available).
 */

const fmt = (s: number) => {
  if (!Number.isFinite(s)) return '0:00';
  const m = Math.floor(s / 60);
  const sec = Math.floor(s % 60).toString().padStart(2, '0');
  return `${m}:${sec}`;
};

export function VideoPlayer({ src, poster, title }: { src: string; poster?: string; title: string }) {
  return (
    <figure className="overflow-hidden rounded-apa-lg border border-apa-line bg-black shadow-md">
      {/* eslint-disable-next-line jsx-a11y/media-has-caption */}
      <video controls preload="metadata" poster={poster} className="aspect-video w-full" title={title}>
        <source src={src} type="video/mp4" />
        Your browser does not support HTML5 video.
      </video>
    </figure>
  );
}

const SPEEDS = [1, 1.25, 1.5, 2];

export function PodcastPlayer({
  src,
  poster,
  title,
  series,
  episode,
  durationSec,
}: {
  src: string;
  poster?: string;
  title: string;
  series?: string;
  episode?: number;
  durationSec?: number;
}) {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [playing, setPlaying] = useState(false);
  const [current, setCurrent] = useState(0);
  const [duration, setDuration] = useState(durationSec ?? 0);
  const [speed, setSpeed] = useState(1);

  useEffect(() => {
    const a = audioRef.current;
    if (!a) return;
    const onTime = () => setCurrent(a.currentTime);
    const onMeta = () => setDuration(a.duration);
    const onEnd = () => setPlaying(false);
    a.addEventListener('timeupdate', onTime);
    a.addEventListener('loadedmetadata', onMeta);
    a.addEventListener('ended', onEnd);
    return () => {
      a.removeEventListener('timeupdate', onTime);
      a.removeEventListener('loadedmetadata', onMeta);
      a.removeEventListener('ended', onEnd);
    };
  }, []);

  function toggle() {
    const a = audioRef.current;
    if (!a) return;
    if (playing) { a.pause(); setPlaying(false); }
    else {
      a.play().then(() => setPlaying(true)).catch(() => setPlaying(false));
    }
  }
  function seek(e: React.ChangeEvent<HTMLInputElement>) {
    const a = audioRef.current;
    if (!a) return;
    a.currentTime = Number(e.target.value);
    setCurrent(a.currentTime);
  }
  function cycleSpeed() {
    const next = SPEEDS[(SPEEDS.indexOf(speed) + 1) % SPEEDS.length];
    setSpeed(next);
    if (audioRef.current) audioRef.current.playbackRate = next;
  }

  return (
    <div className="overflow-hidden rounded-apa-lg border border-apa-line bg-white shadow-md">
      <audio ref={audioRef} src={src} preload="metadata" />
      <div className="flex flex-col gap-4 p-5 sm:flex-row sm:items-center">
        {/* Episode art */}
        <div className="relative h-28 w-28 shrink-0 overflow-hidden rounded-apa-lg">
          {poster ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={poster} alt="" className="h-full w-full object-cover" />
          ) : (
            <div className="apa-gradient flex h-full w-full items-center justify-center text-3xl">🎙️</div>
          )}
        </div>

        <div className="min-w-0 flex-1">
          {series ? (
            <div className="text-[11px] font-bold uppercase tracking-wide text-apa-gold-bright">
              {series}{episode ? ` · Episode ${episode}` : ''}
            </div>
          ) : null}
          <div className="mt-0.5 truncate font-bold text-apa-navy">{title}</div>

          {/* Transport */}
          <div className="mt-3 flex items-center gap-3">
            <button
              type="button"
              onClick={toggle}
              aria-label={playing ? 'Pause' : 'Play'}
              className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full apa-gradient text-lg text-white shadow-md transition-transform hover:scale-105"
            >
              {playing ? '❚❚' : '▶'}
            </button>
            <div className="min-w-0 flex-1">
              <input
                type="range"
                min={0}
                max={duration || 1}
                step={1}
                value={current}
                onChange={seek}
                aria-label="Seek"
                className="w-full accent-apa-green"
              />
              <div className="flex justify-between text-[11px] font-semibold text-apa-grey">
                <span>{fmt(current)}</span>
                <span>{fmt(duration)}</span>
              </div>
            </div>
            <button
              type="button"
              onClick={cycleSpeed}
              className="shrink-0 rounded-md border border-apa-line px-2.5 py-1.5 text-xs font-bold text-apa-navy hover:border-apa-green"
              title="Playback speed"
            >
              {speed}×
            </button>
            <a
              href={src}
              download
              className="shrink-0 rounded-md border border-apa-line px-2.5 py-1.5 text-xs font-bold text-apa-navy hover:border-apa-green"
              title="Download audio"
            >
              ⬇ Audio
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}

export function InProductionCard({
  title,
  series,
  episode,
  poster,
  docUrl,
  docLabel,
}: {
  title: string;
  series?: string;
  episode?: number;
  poster?: string;
  docUrl?: string;
  docLabel?: string;
}) {
  return (
    <div className="overflow-hidden rounded-apa-lg border border-apa-line bg-white shadow-md">
      <div className="flex flex-col gap-4 p-5 sm:flex-row sm:items-center">
        <div className="relative h-28 w-28 shrink-0 overflow-hidden rounded-apa-lg">
          {poster ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={poster} alt="" className="h-full w-full object-cover opacity-80 grayscale-[30%]" />
          ) : (
            <div className="apa-gradient flex h-full w-full items-center justify-center text-3xl">🎙️</div>
          )}
        </div>
        <div className="min-w-0 flex-1">
          {series ? (
            <div className="text-[11px] font-bold uppercase tracking-wide text-apa-gold-bright">
              {series}{episode ? ` · Episode ${episode}` : ''}
            </div>
          ) : null}
          <div className="mt-0.5 font-bold text-apa-navy">{title}</div>
          <p className="mt-1.5 text-sm text-apa-grey">
            🎧 Master audio in final production — releasing soon. The full episode transcript is available below
            {docUrl ? ', and the official screenplay can be downloaded now.' : '.'}
          </p>
          {docUrl ? (
            <a href={docUrl} download className="mt-3 inline-block rounded-md bg-apa-green px-4 py-2 text-xs font-bold text-white hover:bg-apa-green-mid">
              ⬇ {docLabel ?? 'Download document'}
            </a>
          ) : null}
        </div>
      </div>
    </div>
  );
}
