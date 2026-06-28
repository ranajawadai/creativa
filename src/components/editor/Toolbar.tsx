"use client";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import type { ToolType, EditorState } from "@/types/design";

interface ToolbarProps {
  editorState: EditorState;
  setEditorState: (state: EditorState) => void;
  onSave: () => void;
  onUndo: () => void;
  onRedo: () => void;
}

const tools: { id: ToolType; label: string; icon: string }[] = [
  { id: "select", label: "Select", icon: "↖" },
  { id: "text", label: "Text", icon: "T" },
  { id: "shape", label: "Shape", icon: "□" },
  { id: "image", label: "Image", icon: "🖼" },
  { id: "line", label: "Line", icon: "╱" },
];

export function Toolbar({ editorState, setEditorState, onSave, onUndo, onRedo }: ToolbarProps) {
  return (
    <div className="flex items-center justify-between px-4 py-2 border-b border-border bg-background">
      <div className="flex items-center gap-1">
        {tools.map((tool) => (
          <button
            key={tool.id}
            onClick={() => setEditorState({ ...editorState, tool: tool.id })}
            className={cn(
              "flex items-center gap-1.5 px-3 py-1.5 text-sm rounded-md transition-all duration-150 cursor-pointer",
              editorState.tool === tool.id
                ? "bg-primary text-white"
                : "text-muted hover:bg-surface hover:text-foreground"
            )}
          >
            <span className="text-xs">{tool.icon}</span>
            <span className="hidden sm:inline">{tool.label}</span>
          </button>
        ))}
      </div>
      <div className="flex items-center gap-2">
        <Button variant="ghost" size="sm" onClick={onUndo}>
          ↩ Undo
        </Button>
        <Button variant="ghost" size="sm" onClick={onRedo}>
          Redo ↪
        </Button>
        <Button variant="accent" size="sm" onClick={onSave}>
          Save
        </Button>
      </div>
    </div>
  );
}
