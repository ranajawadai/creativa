"use client";

import { useState, useRef, useCallback, useEffect } from "react";
import { Canvas as FabricCanvas, IText, Image as FabricImage } from "fabric";
import { Canvas } from "./Canvas";
import { Toolbar } from "./Toolbar";
import { LayersPanel } from "./LayersPanel";
import { PropertiesPanel } from "./PropertiesPanel";
import { TemplateGallery } from "./TemplateGallery";
import { AIPanel } from "./AIPanel";
import { Toaster, toast } from "sonner";
import type { EditorState, LayerInfo } from "@/types/design";

const defaultEditorState: EditorState = {
  tool: "select",
  shapeType: "rect",
  fillColor: "#0D9488",
  strokeColor: "#134E4A",
  strokeWidth: 2,
  fontSize: 48,
  fontFamily: "Fredoka",
  opacity: 1,
  bold: false,
  italic: false,
};

export function Editor({ designId }: { designId?: string }) {
  const fabricRef = useRef<FabricCanvas | null>(null);
  const [editorState, setEditorState] = useState<EditorState>(defaultEditorState);
  const [showTemplates, setShowTemplates] = useState(false);
  const [showAI, setShowAI] = useState(false);
  const [designName, setDesignName] = useState("Untitled Design");
  const [layers, setLayers] = useState<LayerInfo[]>([]);
  const [selectedLayerId, setSelectedLayerId] = useState<string | null>(null);

  const getObjId = useCallback((obj: any): string => {
    if (!obj.__id) obj.__id = crypto.randomUUID();
    return obj.__id;
  }, []);

  const refreshLayers = useCallback(() => {
    const c = fabricRef.current;
    if (!c) return;
    const objs = c.getObjects();
    const info: LayerInfo[] = objs.map((obj, i) => {
      const o = obj as any;
      return {
        id: getObjId(o),
        name: o.name || `${(o.type || "object").charAt(0).toUpperCase()}${(o.type || "object").slice(1)} ${i + 1}`,
        type: o.type ?? "object",
        visible: o.visible ?? true,
        locked: o.lockMovementX ?? false,
        index: i,
      };
    });
    setLayers([...info].reverse());
    const active = c.getActiveObject();
    setSelectedLayerId(active ? getObjId(active) : null);
  }, [getObjId]);

  const onFabricReady = useCallback((fc: FabricCanvas) => {
    fabricRef.current = fc;
    fc.on("object:added", (e) => { getObjId(e.target); refreshLayers(); });
    fc.on("object:removed", refreshLayers);
    fc.on("selection:created", (e) => {
      const obj = e.selected?.[0];
      setSelectedLayerId(obj ? getObjId(obj) : null);
    });
    fc.on("selection:updated", (e) => {
      const obj = e.selected?.[0];
      setSelectedLayerId(obj ? getObjId(obj) : null);
    });
    fc.on("selection:cleared", () => setSelectedLayerId(null));
    fc.on("object:modified", refreshLayers);
    fc.on("mouse:down", () => { if (fabricRef.current?.getActiveObject()) refreshLayers(); });
    refreshLayers();
  }, [refreshLayers, getObjId]);

  const getSelectedObject = useCallback(() => {
    return fabricRef.current?.getActiveObject() ?? null;
  }, []);

  const updateSelectedObject = useCallback((props: Record<string, any>) => {
    const obj = fabricRef.current?.getActiveObject();
    if (!obj) return;
    obj.set(props);
    fabricRef.current?.renderAll();
    refreshLayers();
  }, [refreshLayers]);

  const handleSave = useCallback(async () => {
    const c = fabricRef.current;
    if (!c) return;
    const json = JSON.stringify(c.toJSON());
    try {
      const res = await fetch("/api/designs", {
        method: designId && designId !== "new" ? "PUT" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: designId && designId !== "new" ? designId : undefined,
          name: designName,
          canvasJSON: json,
          width: c.getWidth(),
          height: c.getHeight(),
        }),
      });
      if (!res.ok) throw new Error("Save failed");
      toast.success("Design saved!");
    } catch {
      toast.error("Failed to save design");
    }
  }, [designId, designName]);

  const handleUndo = useCallback(() => {
    toast.info("Undo/redo coming soon");
  }, []);

  const handleRedo = useCallback(() => {
    toast.info("Undo/redo coming soon");
  }, []);

  const handleSelectTemplate = useCallback(async (templateId: string) => {
    try {
      const res = await fetch(`/api/templates/${templateId}`);
      if (!res.ok) throw new Error("Template not found");
      const data = await res.json();
      const c = fabricRef.current;
      if (c && data.canvasJSON) {
        c.loadFromJSON(data.canvasJSON, () => {
          c.renderAll();
          refreshLayers();
        });
      }
    } catch {
      toast.error("Failed to load template");
    }
  }, [refreshLayers]);

  const handleAddShape = useCallback((shapeType: string) => {
    setEditorState((prev) => ({ ...prev, tool: "shape", shapeType: shapeType as any }));
  }, []);

  const handleAIResult = useCallback((result: string, type: "image" | "text") => {
    const c = fabricRef.current;
    if (!c) return;

    if (type === "image" && result.startsWith("http")) {
      FabricImage.fromURL(result).then((fimg) => {
        const scale = Math.min(400 / (fimg.width || 400), 300 / (fimg.height || 300));
        fimg.set({ left: 50, top: 50, scaleX: scale, scaleY: scale });
        c.add(fimg);
        c.setActiveObject(fimg);
        c.renderAll();
        refreshLayers();
      });
    } else if (type === "text") {
      const text = new IText(result, {
        left: 50,
        top: 50,
        fontSize: 24,
        fontFamily: "Nunito",
        fill: "#134E4A",
        width: 300,
      });
      c.add(text);
      c.setActiveObject(text);
      c.renderAll();
      refreshLayers();
    }
  }, [refreshLayers]);

  useEffect(() => {
    if (!designId || designId === "new") return;
    async function loadDesign() {
      try {
        const res = await fetch(`/api/designs/${designId}`);
        if (!res.ok) throw new Error("Not found");
        const data = await res.json();
        setDesignName(data.name);
        const c = fabricRef.current;
        if (c && data.canvasJSON) {
          c.loadFromJSON(data.canvasJSON, () => {
            c.renderAll();
            refreshLayers();
          });
        }
      } catch {
        toast.error("Failed to load design");
      }
    }
    loadDesign();
  }, [designId, refreshLayers]);

  useEffect(() => {
    const c = fabricRef.current;
    if (!c) return;
    const active = c.getActiveObject();
    if (!active) return;

    if (editorState.fillColor) active.set("fill", editorState.fillColor);
    if (editorState.strokeColor) active.set("stroke", editorState.strokeColor);
    if (editorState.strokeWidth) active.set("strokeWidth", editorState.strokeWidth);
    if (editorState.fontSize && active instanceof IText) {
      active.set("fontSize", editorState.fontSize);
    }
    if (editorState.bold && active instanceof IText) {
      active.set("fontWeight", "bold");
    } else if (active instanceof IText) {
      active.set("fontWeight", "normal");
    }
    if (editorState.italic && active instanceof IText) {
      active.set("fontStyle", "italic");
    } else if (active instanceof IText) {
      active.set("fontStyle", "normal");
    }
    active.set("opacity", editorState.opacity);
    c.renderAll();
  }, [editorState]);

  return (
    <div className="flex flex-col h-screen bg-background">
      <Toaster position="top-center" richColors />
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
        <button
          onClick={() => setShowAI(!showAI)}
          className={`text-sm transition-colors cursor-pointer px-3 py-1 rounded-md ${
            showAI ? "bg-primary text-white" : "text-muted hover:text-foreground"
          }`}
        >
          AI
        </button>
      </div>

      <Toolbar
        editorState={editorState}
        setEditorState={setEditorState}
        onSave={handleSave}
        onUndo={handleUndo}
        onRedo={handleRedo}
        onAddShape={handleAddShape}
      />

      <div className="flex flex-1 overflow-hidden">
        <div className="w-56 border-r border-border bg-background hidden lg:block overflow-y-auto">
          <LayersPanel
            layers={layers}
            selectedLayerId={selectedLayerId}
            onSelectLayer={(id) => {
              const c = fabricRef.current;
              if (!c) return;
              const objs = c.getObjects();
              const idx = layers.length - 1 - layers.findIndex((l) => l.id === id);
              const obj = objs[idx];
              if (obj) {
                c.setActiveObject(obj);
                c.renderAll();
                refreshLayers();
              }
            }}
            onToggleVisibility={(id) => {
              const c = fabricRef.current;
              if (!c) return;
              const objs = c.getObjects();
              const idx = layers.length - 1 - layers.findIndex((l) => l.id === id);
              const obj = objs[idx];
              if (obj) {
                obj.set("visible", !obj.visible);
                c.renderAll();
                refreshLayers();
              }
            }}
            onDeleteLayer={(id) => {
              const c = fabricRef.current;
              if (!c) return;
              const objs = c.getObjects();
              const idx = layers.length - 1 - layers.findIndex((l) => l.id === id);
              const obj = objs[idx];
              if (obj) {
                c.remove(obj);
                c.renderAll();
                refreshLayers();
              }
            }}
            onReorder={(fromIndex, toIndex) => {
              const c = fabricRef.current;
              if (!c) return;
              const objs = c.getObjects();
              const item = objs[fromIndex];
              if (item) {
                objs.splice(fromIndex, 1);
                objs.splice(toIndex, 0, item);
                c.renderAll();
                refreshLayers();
              }
            }}
          />
        </div>

        <Canvas editorState={editorState} onFabricReady={onFabricReady} canvas={fabricRef.current} />

        <div className="w-64 border-l border-border bg-background hidden md:block overflow-y-auto">
          <PropertiesPanel
            editorState={editorState}
            setEditorState={setEditorState}
            getSelectedObject={getSelectedObject}
            updateSelectedObject={updateSelectedObject}
          />
        </div>
      </div>

      {showAI && (
        <AIPanel
          onResult={handleAIResult}
          onClose={() => setShowAI(false)}
        />
      )}

      <TemplateGallery
        open={showTemplates}
        onClose={() => setShowTemplates(false)}
        onSelect={handleSelectTemplate}
      />
    </div>
  );
}
