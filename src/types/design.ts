export type ToolType = "select" | "text" | "shape" | "image" | "line" | "draw";

export type ShapeType = "rect" | "circle" | "triangle" | "diamond";

export interface EditorState {
  tool: ToolType;
  shapeType: ShapeType;
  fillColor: string;
  strokeColor: string;
  strokeWidth: number;
  fontSize: number;
  fontFamily: string;
  opacity: number;
  bold: boolean;
  italic: boolean;
}

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

export interface LayerInfo {
  id: string;
  name: string;
  type: string;
  visible: boolean;
  locked: boolean;
  index: number;
}
