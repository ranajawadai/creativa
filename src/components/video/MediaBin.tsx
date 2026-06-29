"use client";

import { useState, useCallback } from "react";
import type { TimelineClip } from "./VideoEditor";
import { Button } from "@/components/ui/button";
import { Image, Type, Video, Search } from "lucide-react";

interface MediaBinProps {
  onAddClip: (clip: TimelineClip) => void;
}

const stockMedia = [
  { name: "Sunset Beach", type: "image" as const, src: "https://placehold.co/800x450/0D9488/FFFFFF?text=Sunset+Beach" },
  { name: "City Skyline", type: "image" as const, src: "https://placehold.co/800x450/14B8A6/FFFFFF?text=City+Skyline" },
  { name: "Abstract Waves", type: "image" as const, src: "https://placehold.co/800x450/F97316/FFFFFF?text=Abstract+Waves" },
  { name: "Tech Pattern", type: "image" as const, src: "https://placehold.co/800x450/6366F1/FFFFFF?text=Tech+Pattern" },
  { name: "Heading Text", type: "text" as const, src: "Heading" },
  { name: "Subtitle Style", type: "text" as const, src: "Subtitle" },
  { name: "Caption Style", type: "text" as const, src: "Caption" },
  { name: "Sample Video", type: "video" as const, src: "video-sample" },
];

export function MediaBin({ onAddClip }: MediaBinProps) {
  const [search, setSearch] = useState("");
  const [trackIndex, setTrackIndex] = useState(0);

  const filtered = search
    ? stockMedia.filter((m) => m.name.toLowerCase().includes(search.toLowerCase()))
    : stockMedia;

  const handleAdd = useCallback(
    (item: (typeof stockMedia)[0]) => {
      const clip: TimelineClip = {
        id: crypto.randomUUID(),
        src: item.src,
        name: item.name,
        type: item.type,
        trackIndex,
        start: 0,
        duration: item.type === "text" ? 3 : 5,
        trimStart: 0,
        trimEnd: 0,
      };
      onAddClip(clip);
    },
    [trackIndex, onAddClip]
  );

  return (
    <div className="w-64 border-l border-border bg-background flex flex-col">
      <div className="p-3 border-b border-border">
        <h3 className="text-xs font-semibold text-muted uppercase tracking-wider mb-2">Media</h3>
        <div className="relative mb-2">
          <Search size={12} className="absolute left-2 top-1/2 -translate-y-1/2 text-muted" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search..."
            className="w-full h-7 rounded border border-border bg-background pl-7 pr-2 text-xs focus:outline-none focus:ring-1 focus:ring-primary"
          />
        </div>
        <select
          value={trackIndex}
          onChange={(e) => setTrackIndex(Number(e.target.value))}
          className="w-full h-7 rounded border border-border bg-background px-2 text-xs cursor-pointer"
        >
          <option value={0}>Video 1</option>
          <option value={1}>Audio 1</option>
        </select>
      </div>
      <div className="flex-1 overflow-y-auto p-3 space-y-2">
        {filtered.map((item) => (
          <div
            key={item.name}
            onClick={() => handleAdd(item)}
            className="flex items-center gap-2 p-2 rounded-lg border border-border hover:border-primary/50 hover:bg-surface cursor-pointer transition-all duration-150"
          >
            <div className="w-8 h-8 rounded bg-surface-alt flex items-center justify-center flex-shrink-0">
              {item.type === "image" ? <Image size={14} className="text-muted" />
                : item.type === "text" ? <Type size={14} className="text-muted" />
                : <Video size={14} className="text-muted" />}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-medium truncate">{item.name}</p>
              <p className="text-[10px] text-muted capitalize">{item.type}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
