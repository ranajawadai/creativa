"use client";

import { useEffect, useRef, useCallback, useState } from "react";
import { Canvas as FabricCanvas, Rect, IText, Ellipse, Triangle, Line, Polygon, Image as FabricImage } from "fabric";
import type { EditorState, ShapeType } from "@/types/design";

interface CanvasProps {
  editorState: EditorState;
  onFabricReady: (canvas: FabricCanvas) => void;
  canvas: FabricCanvas | null;
}

export function Canvas({ editorState, onFabricReady, canvas }: CanvasProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasElRef = useRef<HTMLCanvasElement>(null);
  const initialized = useRef(false);
  const [dimensions, setDimensions] = useState({ width: 800, height: 600 });

  useEffect(() => {
    function updateSize() {
      if (containerRef.current) {
        const rect = containerRef.current.getBoundingClientRect();
        setDimensions({
          width: Math.min(rect.width - 32, 1200),
          height: Math.max(rect.height - 32, 500),
        });
      }
    }
    updateSize();
    window.addEventListener("resize", updateSize);
    return () => window.removeEventListener("resize", updateSize);
  }, []);

  useEffect(() => {
    if (!canvasElRef.current || initialized.current) return;
    initialized.current = true;

    const fc = new FabricCanvas(canvasElRef.current, {
      width: dimensions.width,
      height: dimensions.height,
      backgroundColor: "#ffffff",
      preserveObjectStacking: true,
      selection: true,
    });

    onFabricReady(fc);

    return () => {
      fc.dispose();
      initialized.current = false;
    };
  }, []);

  useEffect(() => {
    if (!canvas) return;
    canvas.setWidth(dimensions.width);
    canvas.setHeight(dimensions.height);
    canvas.renderAll();
  }, [dimensions, canvas]);

  const makeShape = useCallback(
    (shape: ShapeType, left: number, top: number) => {
      if (!canvas) return;
      const fill = editorState.fillColor;
      const stroke = editorState.strokeColor;
      const sw = editorState.strokeWidth;

      let obj: any;
      switch (shape) {
        case "rect":
          obj = new Rect({ left, top, width: 120, height: 80, fill, stroke, strokeWidth: sw, rx: 4, ry: 4 });
          break;
        case "circle":
          obj = new Ellipse({ left, top, rx: 50, ry: 50, fill, stroke, strokeWidth: sw });
          break;
        case "triangle":
          obj = new Triangle({ left, top, width: 100, height: 100, fill, stroke, strokeWidth: sw });
          break;
        case "diamond":
          obj = new Polygon([
            { x: 60, y: 0 }, { x: 120, y: 60 }, { x: 60, y: 120 }, { x: 0, y: 60 }
          ], { left, top, fill, stroke, strokeWidth: sw });
          break;
      }
      if (obj) {
        canvas.add(obj);
        canvas.setActiveObject(obj);
        canvas.renderAll();
      }
    },
    [canvas, editorState]
  );

  const addText = useCallback(
    (left: number, top: number) => {
      if (!canvas) return;
      const text = new IText("Double-click to edit", {
        left,
        top,
        fontSize: editorState.fontSize,
        fontFamily: editorState.fontFamily,
        fill: editorState.fillColor,
      });
      canvas.add(text);
      canvas.setActiveObject(text);
      canvas.renderAll();
    },
    [canvas, editorState]
  );

  const addImage = useCallback(
    (url: string) => {
      if (!canvas) return;
      FabricImage.fromURL(url).then((img) => {
        img.set({ left: 50, top: 50 });
        canvas.add(img);
        canvas.setActiveObject(img);
        canvas.renderAll();
      });
    },
    [canvas]
  );

  const handleCanvasClick = useCallback(
    (e: React.MouseEvent) => {
      if (!canvas) return;
      const rect = canvasElRef.current?.getBoundingClientRect();
      if (!rect) return;
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      switch (editorState.tool) {
        case "shape":
          makeShape(editorState.shapeType, x, y);
          break;
        case "text":
          addText(x, y);
          break;
        case "line": {
          const line = new Line([x, y, x + 80, y + 80], {
            stroke: editorState.strokeColor,
            strokeWidth: editorState.strokeWidth,
          });
          canvas.add(line);
          canvas.renderAll();
          break;
        }
      }
    },
    [canvas, editorState, makeShape, addText]
  );

  return (
    <div
      ref={containerRef}
      className="flex-1 flex items-center justify-center bg-[#E8E8E8] dark:bg-[#1A1A2E] overflow-hidden p-4"
      onClick={handleCanvasClick}
    >
      <div
        className="relative bg-white shadow-lg rounded-sm overflow-hidden"
        style={{ width: dimensions.width, height: dimensions.height }}
      >
        <canvas ref={canvasElRef} />
      </div>
    </div>
  );
}
