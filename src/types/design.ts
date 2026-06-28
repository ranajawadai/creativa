export interface Design {
  id: string;
  name: string;
  userId: string;
  canvasJSON: string;
  width: number;
  height: number;
  thumbnail?: string;
  createdAt: string;
  updatedAt: string;
}

export interface DesignTemplate {
  id: string;
  name: string;
  category: string;
  canvasJSON: string;
  width: number;
  height: number;
  thumbnail: string;
}

export type ToolType = "select" | "text" | "shape" | "image" | "line" | "draw";

export interface EditorState {
  tool: ToolType;
  fillColor: string;
  strokeColor: string;
  strokeWidth: number;
  fontSize: number;
  fontFamily: string;
  opacity: number;
}
