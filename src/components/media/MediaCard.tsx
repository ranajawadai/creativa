"use client";

import { ImageIcon, FileIcon, Trash2 } from "lucide-react";
import { cn } from "@/lib/utils";

export interface MediaItem {
  id: string;
  name: string;
  url: string;
  type: string;
  size: number;
  width?: number;
  height?: number;
  category?: string;
  createdAt: string;
}

interface MediaCardProps {
  item: MediaItem;
  onSelect?: (item: MediaItem) => void;
  onDelete?: (id: string) => void;
  selected?: boolean;
}

export function MediaCard({ item, onSelect, onDelete, selected }: MediaCardProps) {
  const isImage = item.type.startsWith("image/") || item.url.match(/\.(png|jpg|jpeg|gif|webp|svg)$/i);

  return (
    <div
      onClick={() => onSelect?.(item)}
      className={cn(
        "group relative rounded-xl border overflow-hidden cursor-pointer transition-all duration-200",
        selected
          ? "border-primary ring-2 ring-primary/20"
          : "border-border hover:border-primary/50 hover:shadow-md"
      )}
    >
      <div className="aspect-square bg-surface-alt flex items-center justify-center overflow-hidden">
        {isImage ? (
          <img src={item.url} alt={item.name} className="w-full h-full object-cover" loading="lazy" />
        ) : (
          <FileIcon size={32} className="text-muted" />
        )}
      </div>
      <div className="p-2.5">
        <p className="text-xs font-medium truncate">{item.name}</p>
        <p className="text-[10px] text-muted">
          {item.width && item.height ? `${item.width}×${item.height}` : ""}
          {item.size ? ` · ${(item.size / 1024).toFixed(0)} KB` : ""}
        </p>
      </div>
      {onDelete && (
        <button
          onClick={(e) => { e.stopPropagation(); onDelete(item.id); }}
          className="absolute top-2 right-2 p-1.5 rounded-full bg-background/80 backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-opacity text-muted hover:text-destructive cursor-pointer"
          aria-label="Delete"
        >
          <Trash2 size={12} />
        </button>
      )}
    </div>
  );
}
