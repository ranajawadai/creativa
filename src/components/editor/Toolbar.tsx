"use client";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import type { ToolType, EditorState, ShapeType } from "@/types/design";
import {
  MousePointer2,
  Type,
  Square,
  Circle,
  ImageIcon,
  Minus,
  Triangle,
  Diamond,
  Undo2,
  Redo2,
  Save,
} from "lucide-react";

interface ToolbarProps {
  editorState: EditorState;
  setEditorState: React.Dispatch<React.SetStateAction<EditorState>>;
  onSave: () => void;
  onUndo: () => void;
  onRedo: () => void;
  onAddShape: (shape: string) => void;
}

const tools: { id: ToolType; label: string; icon: React.ReactNode }[] = [
  { id: "select", label: "Select", icon: <MousePointer2 size={16} /> },
  { id: "text", label: "Text", icon: <Type size={16} /> },
  { id: "shape", label: "Shape", icon: <Square size={16} /> },
  { id: "image", label: "Image", icon: <ImageIcon size={16} /> },
  { id: "line", label: "Line", icon: <Minus size={16} /> },
];

const shapes: { id: ShapeType; label: string; icon: React.ReactNode }[] = [
  { id: "rect", label: "Rect", icon: <Square size={14} /> },
  { id: "circle", label: "Circle", icon: <Circle size={14} /> },
  { id: "triangle", label: "Triangle", icon: <Triangle size={14} /> },
  { id: "diamond", label: "Diamond", icon: <Diamond size={14} /> },
];

export function Toolbar({ editorState, setEditorState, onSave, onUndo, onRedo }: ToolbarProps) {
  return (
    <div className="flex items-center justify-between px-4 py-2 border-b border-border bg-background gap-2 flex-wrap">
      <div className="flex items-center gap-1">
        {tools.map((tool) => (
          <button
            key={tool.id}
            onClick={() => setEditorState({ ...editorState, tool: tool.id })}
            className={cn(
              "flex items-center gap-1.5 px-3 py-1.5 text-sm rounded-md transition-all duration-150 cursor-pointer",
              editorState.tool === tool.id
                ? "bg-primary text-white shadow-sm"
                : "text-muted hover:bg-surface hover:text-foreground"
            )}
            aria-label={tool.label}
          >
            {tool.icon}
            <span className="hidden sm:inline">{tool.label}</span>
          </button>
        ))}
      </div>

      {editorState.tool === "shape" && (
        <div className="flex items-center gap-1 px-2 py-1 bg-surface rounded-md">
          {shapes.map((s) => (
            <button
              key={s.id}
              onClick={() => setEditorState({ ...editorState, shapeType: s.id })}
              className={cn(
                "p-1.5 rounded transition-colors cursor-pointer",
                editorState.shapeType === s.id
                  ? "bg-primary text-white"
                  : "text-muted hover:text-foreground"
              )}
              aria-label={s.label}
            >
              {s.icon}
            </button>
          ))}
        </div>
      )}

      <div className="flex-1" />

      <div className="flex items-center gap-2">
        <Button variant="ghost" size="sm" onClick={onUndo} aria-label="Undo">
          <Undo2 size={14} />
          <span className="hidden sm:inline ml-1">Undo</span>
        </Button>
        <Button variant="ghost" size="sm" onClick={onRedo} aria-label="Redo">
          <Redo2 size={14} />
          <span className="hidden sm:inline ml-1">Redo</span>
        </Button>
        <Button variant="accent" size="sm" onClick={onSave} aria-label="Save">
          <Save size={14} />
          <span className="ml-1">Save</span>
        </Button>
      </div>
    </div>
  );
}
