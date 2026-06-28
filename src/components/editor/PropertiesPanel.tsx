"use client";

import type { EditorState } from "@/types/design";

interface PropertiesPanelProps {
  editorState: EditorState;
  setEditorState: (state: EditorState) => void;
}

export function PropertiesPanel({ editorState, setEditorState }: PropertiesPanelProps) {
  return (
    <div className="p-3 space-y-4">
      <h3 className="text-xs font-semibold text-muted uppercase tracking-wider">Properties</h3>

      <div className="space-y-3">
        <div>
          <label className="text-xs text-muted block mb-1">Fill Color</label>
          <div className="flex items-center gap-2">
            <input
              type="color"
              value={editorState.fillColor}
              onChange={(e) =>
                setEditorState({ ...editorState, fillColor: e.target.value })
              }
              className="w-8 h-8 rounded cursor-pointer border border-border"
            />
            <span className="text-xs font-mono text-muted">{editorState.fillColor}</span>
          </div>
        </div>

        <div>
          <label className="text-xs text-muted block mb-1">Stroke</label>
          <div className="flex items-center gap-2">
            <input
              type="color"
              value={editorState.strokeColor}
              onChange={(e) =>
                setEditorState({ ...editorState, strokeColor: e.target.value })
              }
              className="w-8 h-8 rounded cursor-pointer border border-border"
            />
            <input
              type="number"
              min={0}
              max={20}
              value={editorState.strokeWidth}
              onChange={(e) =>
                setEditorState({ ...editorState, strokeWidth: Number(e.target.value) })
              }
              className="w-16 h-8 rounded border border-border bg-background px-2 text-xs"
            />
          </div>
        </div>

        <div>
          <label className="text-xs text-muted block mb-1">Opacity</label>
          <input
            type="range"
            min={0}
            max={100}
            value={editorState.opacity * 100}
            onChange={(e) =>
              setEditorState({ ...editorState, opacity: Number(e.target.value) / 100 })
            }
            className="w-full accent-primary"
          />
        </div>

        <div>
          <label className="text-xs text-muted block mb-1">Font Size</label>
          <input
            type="number"
            min={8}
            max={200}
            value={editorState.fontSize}
            onChange={(e) =>
              setEditorState({ ...editorState, fontSize: Number(e.target.value) })
            }
            className="w-full h-8 rounded border border-border bg-background px-2 text-xs"
          />
        </div>
      </div>
    </div>
  );
}
