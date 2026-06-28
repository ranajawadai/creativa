"use client";

import { MediaCard, type MediaItem } from "./MediaCard";
import { Skeleton } from "@/components/ui/skeleton";

interface MediaGridProps {
  items: MediaItem[];
  loading?: boolean;
  onSelect?: (item: MediaItem) => void;
  onDelete?: (id: string) => void;
  selectedId?: string | null;
}

export function MediaGrid({ items, loading, onSelect, onDelete, selectedId }: MediaGridProps) {
  if (loading) {
    return (
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
        {Array.from({ length: 10 }).map((_, i) => (
          <div key={i} className="space-y-2">
            <Skeleton className="aspect-square rounded-xl" />
            <Skeleton className="h-3 w-3/4" />
            <Skeleton className="h-2 w-1/2" />
          </div>
        ))}
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-center">
        <div className="w-16 h-16 rounded-full bg-surface-alt flex items-center justify-center mb-4">
          <svg className="w-8 h-8 text-muted" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
        </div>
        <p className="text-sm text-muted font-medium">No media yet</p>
        <p className="text-xs text-muted mt-1">Upload images to get started</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
      {items.map((item) => (
        <MediaCard
          key={item.id}
          item={item}
          onSelect={onSelect}
          onDelete={onDelete}
          selected={selectedId === item.id}
        />
      ))}
    </div>
  );
}
