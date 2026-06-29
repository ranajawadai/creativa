"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { Timeline } from "./Timeline";
import { PreviewPlayer } from "./PreviewPlayer";
import { MediaBin } from "./MediaBin";
import { Toaster, toast } from "sonner";
import { Play, Square, Settings2 } from "lucide-react";

export interface TimelineClip {
  id: string;
  src: string;
  name: string;
  type: "video" | "image" | "text";
  trackIndex: number;
  start: number;
  duration: number;
  trimStart: number;
  trimEnd: number;
}

export interface Track {
  id: string;
  name: string;
  type: "video" | "audio" | "text";
  clips: TimelineClip[];
  locked: boolean;
  visible: boolean;
}

interface VideoEditorProps {
  projectId?: string;
}

export function VideoEditor({ projectId }: VideoEditorProps) {
  const [tracks, setTracks] = useState<Track[]>([
    { id: "v1", name: "Video 1", type: "video", clips: [], locked: false, visible: true },
    { id: "a1", name: "Audio 1", type: "audio", clips: [], locked: false, visible: true },
  ]);
  const [currentTime, setCurrentTime] = useState(0);
  const [playing, setPlaying] = useState(false);
  const [duration, setDuration] = useState(30);
  const [projectName, setProjectName] = useState("Untitled Video");
  const animFrame = useRef<number>(0);
  const lastTime = useRef(0);

  const play = useCallback(() => {
    setPlaying(true);
    lastTime.current = performance.now();
    const tick = (now: number) => {
      const delta = (now - lastTime.current) / 1000;
      lastTime.current = now;
      setCurrentTime((prev) => {
        const next = prev + delta;
        if (next >= duration) {
          setPlaying(false);
          return 0;
        }
        return next;
      });
      animFrame.current = requestAnimationFrame(tick);
    };
    animFrame.current = requestAnimationFrame(tick);
  }, [duration]);

  const stop = useCallback(() => {
    setPlaying(false);
    cancelAnimationFrame(animFrame.current);
  }, []);

  const addClipToTrack = useCallback((clip: TimelineClip) => {
    setTracks((prev) => {
      const next = [...prev];
      const track = next[clip.trackIndex];
      if (track) {
        track.clips = [...track.clips, clip];
      }
      return next;
    });
  }, []);

  const removeClip = useCallback((trackIndex: number, clipId: string) => {
    setTracks((prev) => {
      const next = [...prev];
      const track = next[trackIndex];
      if (track) {
        track.clips = track.clips.filter((c) => c.id !== clipId);
      }
      return next;
    });
  }, []);

  const handleExport = useCallback(async () => {
    toast.info("Export started — processing video...");
    try {
      const res = await fetch("/api/video/export", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ tracks, duration, width: 1920, height: 1080, fps: 30 }),
      });
      if (!res.ok) throw new Error("Export failed");
      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `${projectName.replace(/\s+/g, "_")}.webm`;
      a.click();
      toast.success("Video exported!");
    } catch {
      toast.error("Export failed — check console for details");
    }
  }, [tracks, duration, projectName]);

  return (
    <div className="flex flex-col h-screen bg-background">
      <Toaster position="top-center" richColors />
      <div className="flex items-center gap-3 px-4 py-2 border-b border-border bg-background">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center text-white font-heading font-bold text-sm">
            C
          </div>
          <span className="font-heading font-semibold text-lg">Creativa</span>
        </div>
        <input
          value={projectName}
          onChange={(e) => setProjectName(e.target.value)}
          className="bg-transparent border-none text-sm font-medium text-foreground focus:outline-none px-2 py-1 rounded hover:bg-surface transition-colors max-w-xs"
        />
        <div className="flex-1" />
        <span className="text-xs text-muted">{duration}s</span>
        <button
          onClick={playing ? stop : play}
          className="p-2 rounded-lg bg-primary text-white hover:bg-primary-dark transition-colors cursor-pointer"
          aria-label={playing ? "Stop" : "Play"}
        >
          {playing ? <Square size={14} /> : <Play size={14} />}
        </button>
        <button
          onClick={handleExport}
          className="text-sm bg-accent text-white px-4 py-1.5 rounded-md hover:bg-accent-dark transition-colors cursor-pointer font-medium flex items-center gap-1.5"
        >
          <Settings2 size={14} />
          Export
        </button>
      </div>

      <div className="flex flex-1 overflow-hidden">
        <div className="flex-1 flex flex-col">
          <div className="flex-1 bg-[#1A1A2E] flex items-center justify-center relative">
            <PreviewPlayer
              tracks={tracks}
              currentTime={currentTime}
              playing={playing}
              width={640}
            />
          </div>

          <Timeline
            tracks={tracks}
            currentTime={currentTime}
            duration={duration}
            playing={playing}
            onSeek={setCurrentTime}
            onRemoveClip={removeClip}
            onUpdateClip={(trackIndex, clipId, updates) => {
              setTracks((prev) => {
                const next = [...prev];
                const clip = next[trackIndex]?.clips.find((c) => c.id === clipId);
                if (clip) Object.assign(clip, updates);
                return next;
              });
            }}
          />
        </div>

        <MediaBin onAddClip={addClipToTrack} />
      </div>
    </div>
  );
}
