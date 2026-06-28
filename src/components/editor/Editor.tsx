"use client";

import { useState, useRef, useCallback } from "react";
import { Canvas } from "./Canvas";
import { Toolbar } from "./Toolbar";
import { LayersPanel } from "./LayersPanel";
import { PropertiesPanel } from "./PropertiesPanel";
import { TemplateGallery } from "./TemplateGallery";
import type { EditorState } from "@/types/design";

const defaultEditorState: EditorState = {
  tool: "select",
  fillColor: "#0D9488",
  strokeColor: "#134E4A",
  strokeWidth: 2,
  fontSize: 48,
  fontFamily: "Fredoka",
  opacity: 1,
};

export function Editor() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [editorState, setEditorState] = useState<EditorState>(defaultEditorState);
  const [showTemplates, setShowTemplates] = useState(true);
  const [designName, setDesignName] = useState("Untitled Design");

  const handleSave = useCallback(() => {
    console.log("Saving design...");
  }, []);

  const handleUndo = useCallback(() => {
    console.log("Undo");
  }, []);

  const handleRedo = useCallback(() => {
    console.log("Redo");
  }, []);

  const handleSelectTemplate = useCallback((templateId: string) => {
    console.log("Selected template:", templateId);
  }, []);

  return (
    <div className="flex flex-col h-screen bg-background">
      <div className="flex items-center gap-3 px-4 py-2 border-b border-border bg-background">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center text-white font-heading font-bold text-sm">
            C
          </div>
          <span className="font-heading font-semibold text-lg">Creativa</span>
        </div>
        <input
          value={designName}
          onChange={(e) => setDesignName(e.target.value)}
          className="bg-transparent border-none text-sm font-medium text-foreground focus:outline-none px-2 py-1 rounded hover:bg-surface transition-colors"
        />
        <div className="flex-1" />
        <button
          onClick={() => setShowTemplates(true)}
          className="text-sm text-muted hover:text-foreground transition-colors cursor-pointer px-3 py-1"
        >
          Templates
        </button>
      </div>

      <Toolbar
        editorState={editorState}
        setEditorState={setEditorState}
        onSave={handleSave}
        onUndo={handleUndo}
        onRedo={handleRedo}
      />

      <div className="flex flex-1 overflow-hidden">
        <div className="w-56 border-r border-border bg-background hidden lg:block overflow-y-auto">
          <LayersPanel />
        </div>

        <Canvas editorState={editorState} canvasRef={canvasRef} />

        <div className="w-64 border-l border-border bg-background hidden md:block overflow-y-auto">
          <PropertiesPanel editorState={editorState} setEditorState={setEditorState} />
        </div>
      </div>

      <TemplateGallery
        open={showTemplates}
        onClose={() => setShowTemplates(false)}
        onSelect={handleSelectTemplate}
      />
    </div>
  );
}
