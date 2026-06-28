"use client";

import { useState, useEffect } from "react";
import type { EditorState } from "@/types/design";

interface PropertiesPanelProps {
  editorState: EditorState;
  setEditorState: React.Dispatch<React.SetStateAction<EditorState>>;
  getSelectedObject: () => any;
  updateSelectedObject: (props: Record<string, any>) => void;
}

export function PropertiesPanel({
  editorState,
  setEditorState,
  getSelectedObject,
  updateSelectedObject,
}: PropertiesPanelProps) {
  const [hasSelection, setHasSelection] = useState(false);
  const [isText, setIsText] = useState(false);

  useEffect(() => {
    const obj = getSelectedObject();
    if (obj) {
      setHasSelection(true);
      setIsText(obj.type === "i-text" || obj.type === "textbox");
      setEditorState((prev) => ({
        ...prev,
        fillColor: obj.fill?.toString() || prev.fillColor,
        strokeColor: obj.stroke?.toString() || prev.strokeColor,
        strokeWidth: obj.strokeWidth ?? prev.strokeWidth,
        fontSize: obj.fontSize ?? prev.fontSize,
        opacity: obj.opacity ?? prev.opacity,
        bold: obj.fontWeight === "bold",
        italic: obj.fontStyle === "italic",
      }));
    } else {
      setHasSelection(false);
      setIsText(false);
    }
  }, [getSelectedObject, setEditorState]);

  if (!hasSelection) {
    return (
      <div className="p-3 space-y-4">
        <h3 className="text-xs font-semibold text-muted uppercase tracking-wider">Properties</h3>
        <p className="text-xs text-muted text-center py-8">
          Select an object on the canvas to edit its properties
        </p>
      </div>
    );
  }

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
              onChange={(e) => {
                setEditorState({ ...editorState, fillColor: e.target.value });
                updateSelectedObject({ fill: e.target.value });
              }}
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
              onChange={(e) => {
                setEditorState({ ...editorState, strokeColor: e.target.value });
                updateSelectedObject({ stroke: e.target.value });
              }}
              className="w-8 h-8 rounded cursor-pointer border border-border"
            />
            <input
              type="number"
              min={0}
              max={20}
              value={editorState.strokeWidth}
              onChange={(e) => {
                const sw = Number(e.target.value);
                setEditorState({ ...editorState, strokeWidth: sw });
                updateSelectedObject({ strokeWidth: sw });
              }}
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
            value={Math.round(editorState.opacity * 100)}
            onChange={(e) => {
              const op = Number(e.target.value) / 100;
              setEditorState({ ...editorState, opacity: op });
              updateSelectedObject({ opacity: op });
            }}
            className="w-full accent-primary cursor-pointer"
          />
        </div>

        {isText && (
          <>
            <div>
              <label className="text-xs text-muted block mb-1">Font Size</label>
              <input
                type="number"
                min={8}
                max={200}
                value={editorState.fontSize}
                onChange={(e) => {
                  const fs = Number(e.target.value);
                  setEditorState({ ...editorState, fontSize: fs });
                  updateSelectedObject({ fontSize: fs });
                }}
                className="w-full h-8 rounded border border-border bg-background px-2 text-xs"
              />
            </div>

            <div>
              <label className="text-xs text-muted block mb-1">Font Family</label>
              <select
                value={editorState.fontFamily}
                onChange={(e) => {
                  setEditorState({ ...editorState, fontFamily: e.target.value });
                  updateSelectedObject({ fontFamily: e.target.value });
                }}
                className="w-full h-8 rounded border border-border bg-background px-2 text-xs cursor-pointer"
              >
                <option value="Nunito">Nunito</option>
                <option value="Fredoka">Fredoka</option>
                <option value="Arial">Arial</option>
                <option value="Georgia">Georgia</option>
                <option value="Courier New">Courier New</option>
              </select>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => {
                  const bold = !editorState.bold;
                  setEditorState({ ...editorState, bold });
                  updateSelectedObject({ fontWeight: bold ? "bold" : "normal" });
                }}
                className={`px-3 py-1 text-sm rounded border cursor-pointer transition-colors ${
                  editorState.bold
                    ? "bg-primary text-white border-primary"
                    : "bg-background text-foreground border-border hover:bg-surface"
                }`}
              >
                B
              </button>
              <button
                onClick={() => {
                  const italic = !editorState.italic;
                  setEditorState({ ...editorState, italic });
                  updateSelectedObject({ fontStyle: italic ? "italic" : "normal" });
                }}
                className={`px-3 py-1 text-sm rounded border cursor-pointer transition-colors ${
                  editorState.italic
                    ? "bg-primary text-white border-primary"
                    : "bg-background text-foreground border-border hover:bg-surface"
                }`}
              >
                I
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
