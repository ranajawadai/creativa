"use client";

import { cn } from "@/lib/utils";
import { Eye, EyeOff, Trash2 } from "lucide-react";
import type { LayerInfo } from "@/types/design";

interface LayersPanelProps {
  layers: LayerInfo[];
  selectedLayerId: string | null;
  onSelectLayer: (id: string) => void;
  onToggleVisibility: (id: string) => void;
  onDeleteLayer: (id: string) => void;
  onReorder: (fromIndex: number, toIndex: number) => void;
}

const typeLabels: Record<string, string> = {
  "i-text": "Text",
  rect: "Rectangle",
  ellipse: "Circle",
  triangle: "Triangle",
  image: "Image",
  line: "Line",
  polygon: "Polygon",
};

export function LayersPanel({
  layers,
  selectedLayerId,
  onSelectLayer,
  onToggleVisibility,
  onDeleteLayer,
}: LayersPanelProps) {
  return (
    <div className="p-3 space-y-1">
      <h3 className="text-xs font-semibold text-muted uppercase tracking-wider mb-2">Layers</h3>
      {layers.length === 0 && (
        <p className="text-xs text-muted text-center py-4">No objects yet</p>
      )}
      {layers.map((layer) => (
        <div
          key={layer.id}
          onClick={() => onSelectLayer(layer.id)}
          className={cn(
            "flex items-center gap-2 px-2 py-1.5 text-sm rounded-md cursor-pointer transition-colors duration-150 group",
            selectedLayerId === layer.id
              ? "bg-primary/10 text-primary"
              : "text-foreground hover:bg-surface"
          )}
        >
          <span className="w-4 h-4 rounded border border-border flex items-center justify-center text-[10px] font-mono text-muted flex-shrink-0">
            {layer.index + 1}
          </span>
          <span className="flex-1 truncate text-xs">{layer.name}</span>
          <span className="text-[10px] text-muted mr-1 hidden group-hover:hidden">
            {typeLabels[layer.type] || layer.type}
          </span>
          <button
            onClick={(e) => {
              e.stopPropagation();
              onToggleVisibility(layer.id);
            }}
            className="text-muted hover:text-foreground transition-colors cursor-pointer"
            aria-label={layer.visible ? "Hide layer" : "Show layer"}
          >
            {layer.visible ? <Eye size={12} /> : <EyeOff size={12} />}
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              onDeleteLayer(layer.id);
            }}
            className="text-muted hover:text-destructive transition-colors opacity-0 group-hover:opacity-100 cursor-pointer"
            aria-label="Delete layer"
          >
            <Trash2 size={12} />
          </button>
        </div>
      ))}
    </div>
  );
}
