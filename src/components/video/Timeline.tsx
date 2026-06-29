"use client";

import { useRef, useEffect, useCallback } from "react";
import type { Track, TimelineClip } from "./VideoEditor";
import { Trash2, Eye, EyeOff, Lock, Unlock } from "lucide-react";

interface TimelineProps {
  tracks: Track[];
  currentTime: number;
  duration: number;
  playing: boolean;
  onSeek: (time: number) => void;
  onRemoveClip: (trackIndex: number, clipId: string) => void;
  onUpdateClip: (trackIndex: number, clipId: string, updates: Partial<TimelineClip>) => void;
}

const PIXELS_PER_SECOND = 80;
const TRACK_HEIGHT = 64;

export function Timeline({
  tracks, currentTime, duration, playing, onSeek, onRemoveClip, onUpdateClip,
}: TimelineProps) {
  const rulerRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const totalWidth = duration * PIXELS_PER_SECOND;

  const handleRulerClick = useCallback(
    (e: React.MouseEvent) => {
      const rect = rulerRef.current?.getBoundingClientRect();
      if (!rect) return;
      const x = e.clientX - rect.left;
      const time = Math.max(0, Math.min(duration, x / PIXELS_PER_SECOND));
      onSeek(time);
    },
    [duration, onSeek]
  );

  // Auto-scroll timeline to follow playhead
  useEffect(() => {
    if (!playing || !containerRef.current) return;
    const scrollLeft = currentTime * PIXELS_PER_SECOND - containerRef.current.clientWidth / 3;
    containerRef.current.scrollTo({ left: Math.max(0, scrollLeft), behavior: "smooth" });
  }, [currentTime, playing]);

  return (
    <div className="h-48 border-t border-border bg-[#0F172A] flex flex-col">
      {/* Ruler */}
      <div
        ref={rulerRef}
        className="h-6 bg-[#1E293B] border-b border-white/10 relative cursor-pointer flex-shrink-0 overflow-hidden"
        onClick={handleRulerClick}
      >
        {Array.from({ length: Math.ceil(duration) + 1 }).map((_, i) => (
          <div
            key={i}
            className="absolute top-0 text-[10px] text-muted select-none"
            style={{ left: i * PIXELS_PER_SECOND }}
          >
            <span className="ml-1">{formatTimeShort(i)}</span>
            <div className="w-px h-3 bg-white/20 mt-0.5" />
          </div>
        ))}
        {/* Playhead */}
        <div
          className="absolute top-0 w-0.5 h-full bg-accent z-10 pointer-events-none"
          style={{ left: currentTime * PIXELS_PER_SECOND }}
        >
          <div className="w-3 h-3 rounded-full bg-accent -ml-[5px] -mt-0.5" />
        </div>
      </div>

      {/* Tracks */}
      <div ref={containerRef} className="flex-1 overflow-x-auto overflow-y-auto">
        <div style={{ width: Math.max(totalWidth, 400), minHeight: "100%" }}>
          {tracks.map((track, ti) => (
            <div
              key={track.id}
              className="relative border-b border-white/5"
              style={{ height: TRACK_HEIGHT }}
            >
              <div className="absolute left-0 top-0 bottom-0 w-24 bg-[#1E293B] border-r border-white/10 z-10 flex items-center gap-1 px-2">
                <span className="text-[10px] text-muted truncate flex-1">{track.name}</span>
                <button
                  onClick={() => {
                    const t = tracks[ti];
                    t.visible = !t.visible;
                  }}
                  className="text-muted hover:text-white cursor-pointer"
                >
                  {track.visible ? <Eye size={10} /> : <EyeOff size={10} />}
                </button>
              </div>
              <div className="ml-24 h-full relative">
                {track.clips.map((clip) => {
                  const left = clip.start * PIXELS_PER_SECOND;
                  const w = clip.duration * PIXELS_PER_SECOND;
                  return (
                    <div
                      key={clip.id}
                      className="absolute top-1 bottom-1 rounded cursor-pointer group transition-shadow"
                      style={{
                        left,
                        width: Math.max(w, 20),
                        background: clip.type === "video" ? "#0D9488"
                          : clip.type === "image" ? "#F97316"
                          : "#6366F1",
                        opacity: track.visible ? 1 : 0.4,
                      }}
                      onClick={() => onSeek(clip.start)}
                    >
                      <div className="flex items-center gap-1 px-2 py-1 h-full">
                        <span className="text-[10px] text-white truncate flex-1">{clip.name}</span>
                        <button
                          onClick={(e) => { e.stopPropagation(); onRemoveClip(ti, clip.id); }}
                          className="text-white/60 hover:text-white opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
                        >
                          <Trash2 size={10} />
                        </button>
                      </div>
                      {/* Trim handles */}
                      <div
                        className="absolute left-0 top-0 bottom-0 w-1 bg-white/30 cursor-ew-resize opacity-0 group-hover:opacity-100 hover:bg-white/60 transition-opacity"
                        onMouseDown={(e) => {
                          e.stopPropagation();
                          const startX = e.clientX;
                          const origStart = clip.start;
                          const origDuration = clip.duration;
                          const onMove = (ev: MouseEvent) => {
                            const dx = ev.clientX - startX;
                            const dt = dx / PIXELS_PER_SECOND;
                            const newStart = Math.max(0, origStart + dt);
                            const newDuration = origDuration - (newStart - origStart);
                            if (newDuration > 0.5) {
                              onUpdateClip(ti, clip.id, { start: newStart, duration: newDuration });
                            }
                          };
                          const onUp = () => {
                            document.removeEventListener("mousemove", onMove);
                            document.removeEventListener("mouseup", onUp);
                          };
                          document.addEventListener("mousemove", onMove);
                          document.addEventListener("mouseup", onUp);
                        }}
                      />
                      <div
                        className="absolute right-0 top-0 bottom-0 w-1 bg-white/30 cursor-ew-resize opacity-0 group-hover:opacity-100 hover:bg-white/60 transition-opacity"
                        onMouseDown={(e) => {
                          e.stopPropagation();
                          const startX = e.clientX;
                          const origDuration = clip.duration;
                          const onMove = (ev: MouseEvent) => {
                            const dx = ev.clientX - startX;
                            const dt = dx / PIXELS_PER_SECOND;
                            const newDuration = Math.max(0.5, origDuration + dt);
                            onUpdateClip(ti, clip.id, { duration: newDuration });
                          };
                          const onUp = () => {
                            document.removeEventListener("mousemove", onMove);
                            document.removeEventListener("mouseup", onUp);
                          };
                          document.addEventListener("mousemove", onMove);
                          document.addEventListener("mouseup", onUp);
                        }}
                      />
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function formatTimeShort(s: number) {
  const m = Math.floor(s / 60);
  const sec = Math.floor(s % 60);
  return `${m}:${sec.toString().padStart(2, "0")}`;
}
