"use client";

import { cn } from "@/lib/utils";
import { useState } from "react";

interface Layer {
  id: string;
  name: string;
  type: "text" | "shape" | "image" | "group";
  visible: boolean;
  locked: boolean;
}

const mockLayers: Layer[] = [
  { id: "1", name: "Background", type: "shape", visible: true, locked: true },
  { id: "2", name: "Heading Text", type: "text", visible: true, locked: false },
  { id: "3", name: "Logo", type: "image", visible: true, locked: false },
  { id: "4", name: "Button", type: "shape", visible: false, locked: false },
];

const typeIcons: Record<string, string> = {
  text: "T",
  shape: "□",
  image: "🖼",
  group: "🗂",
};

export function LayersPanel() {
  const [layers] = useState<Layer[]>(mockLayers);
  const [selected, setSelected] = useState("2");

  return (
    <div className="p-3 space-y-1">
      <h3 className="text-xs font-semibold text-muted uppercase tracking-wider mb-2">Layers</h3>
      {layers.map((layer) => (
        <div
          key={layer.id}
          onClick={() => setSelected(layer.id)}
          className={cn(
            "flex items-center gap-2 px-2 py-1.5 text-sm rounded-md cursor-pointer transition-colors duration-150",
            selected === layer.id
              ? "bg-primary/10 text-primary"
              : "text-foreground hover:bg-surface"
          )}
        >
          <span className="text-xs w-4 text-center">{typeIcons[layer.type]}</span>
          <span className="flex-1 truncate">{layer.name}</span>
          <button className="text-muted hover:text-foreground text-xs cursor-pointer">
            {layer.visible ? "👁" : "—"}
          </button>
        </div>
      ))}
    </div>
  );
}
