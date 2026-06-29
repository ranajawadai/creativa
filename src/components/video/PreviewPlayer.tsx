"use client";

import { useRef, useEffect, useState } from "react";
import type { Track } from "./VideoEditor";

interface PreviewPlayerProps {
  tracks: Track[];
  currentTime: number;
  playing: boolean;
  width: number;
}

export function PreviewPlayer({ tracks, currentTime, playing, width }: PreviewPlayerProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [ratio, setRatio] = useState(16 / 9);

  useEffect(() => {
    if (!canvasRef.current) return;
    const ctx = canvasRef.current.getContext("2d");
    if (!ctx) return;

    const h = width / ratio;
    canvasRef.current.width = width;
    canvasRef.current.height = h;
    ctx.clearRect(0, 0, width, h);

    // Draw background
    ctx.fillStyle = "#0F172A";
    ctx.fillRect(0, 0, width, h);

    // Render each track's visible clips at current time
    for (const track of tracks) {
      if (!track.visible) continue;
      for (const clip of track.clips) {
        const clipStart = clip.start;
        const clipEnd = clip.start + clip.duration;
        if (currentTime >= clipStart && currentTime <= clipEnd) {
          const localTime = currentTime - clipStart + (clip.trimStart || 0);

          if (clip.type === "image") {
            const img = new Image();
            img.crossOrigin = "anonymous";
            img.src = clip.src;
            ctx.drawImage(img, 0, 0, width, h);
          } else if (clip.type === "text") {
            ctx.fillStyle = "#FFFFFF";
            ctx.font = "32px Fredoka, sans-serif";
            ctx.textAlign = "center";
            ctx.fillText(clip.name || "Text", width / 2, h / 2);
          } else if (clip.type === "video") {
            // Draw video frame placeholder
            ctx.fillStyle = "#1E293B";
            ctx.fillRect(0, 0, width, h);
            ctx.fillStyle = "#64748B";
            ctx.font = "16px Nunito, sans-serif";
            ctx.textAlign = "center";
            ctx.fillText("🎬 " + clip.name, width / 2, h / 2);
          }
        }
      }
    }

    // Draw time indicator
    ctx.fillStyle = "rgba(255,255,255,0.1)";
    ctx.fillRect(0, 0, 3, h);
  }, [tracks, currentTime, width, ratio]);

  return (
    <div className="relative rounded-lg overflow-hidden shadow-2xl border border-white/10">
      <canvas ref={canvasRef} className="w-full" style={{ maxWidth: width, maxHeight: width / ratio }} />
      {!playing && (
        <div className="absolute bottom-3 left-1/2 -translate-x-1/2 bg-black/60 text-white text-xs px-3 py-1 rounded-full">
          {formatTime(currentTime)}
        </div>
      )}
    </div>
  );
}

function formatTime(s: number) {
  const m = Math.floor(s / 60);
  const sec = Math.floor(s % 60);
  const ms = Math.floor((s % 1) * 100);
  return `${m}:${sec.toString().padStart(2, "0")}.${ms.toString().padStart(2, "0")}`;
}
