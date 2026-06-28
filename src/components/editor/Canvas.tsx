"use client";

import { useEffect, useRef, useCallback, useState } from "react";
import type { EditorState } from "@/types/design";
import { cn } from "@/lib/utils";

interface CanvasProps {
  editorState: EditorState;
  canvasRef: React.RefObject<HTMLCanvasElement | null>;
}

export function Canvas({ editorState, canvasRef }: CanvasProps) {
  const containerRef = useRef<HTMLDivElement>(null);
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

  return (
    <div
      ref={containerRef}
      className="flex-1 flex items-center justify-center bg-[#E8E8E8] dark:bg-[#1A1A2E] overflow-hidden p-4"
    >
      <div
        className={cn(
          "relative bg-white shadow-lg rounded-sm overflow-hidden",
          "transition-shadow duration-200"
        )}
        style={{
          width: dimensions.width,
          height: dimensions.height,
        }}
      >
        <canvas
          ref={canvasRef}
          width={dimensions.width}
          height={dimensions.height}
          className="absolute inset-0"
        />
      </div>
    </div>
  );
}
