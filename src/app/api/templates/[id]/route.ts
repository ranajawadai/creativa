import { NextResponse } from "next/server";
export const dynamic = "force-dynamic";

const templateData: Record<string, any> = {
  "social-instagram": {
    name: "Instagram Post",
    canvasJSON: JSON.stringify({
      version: "5.3.0",
      objects: [
        { type: "rect", left: 0, top: 0, width: 1080, height: 1080, fill: "#F0FDFA", selectable: false, evented: false },
        { type: "i-text", left: 80, top: 300, fontSize: 72, fontFamily: "Fredoka", fill: "#0D9488", text: "Your Story\nStarts Here" },
        { type: "rect", left: 80, top: 550, width: 200, height: 60, rx: 30, ry: 30, fill: "#F97316" },
      ],
    }),
    width: 1080,
    height: 1080,
  },
  "social-facebook": {
    name: "Facebook Cover",
    canvasJSON: JSON.stringify({
      version: "5.3.0",
      objects: [
        { type: "rect", left: 0, top: 0, width: 1640, height: 624, fill: "#0D9488", selectable: false, evented: false },
        { type: "i-text", left: 60, top: 200, fontSize: 54, fontFamily: "Fredoka", fill: "#FFFFFF", text: "Creativa Studio" },
        { type: "i-text", left: 60, top: 280, fontSize: 24, fontFamily: "Nunito", fill: "#E2E8F0", text: "Design. Write. Create." },
      ],
    }),
    width: 1640,
    height: 624,
  },
  "mkt-presentation": {
    name: "Presentation",
    canvasJSON: JSON.stringify({
      version: "5.3.0",
      objects: [
        { type: "rect", left: 0, top: 0, width: 1920, height: 1080, fill: "#1E293B", selectable: false, evented: false },
        { type: "i-text", left: 200, top: 350, fontSize: 80, fontFamily: "Fredoka", fill: "#14B8A6", text: "Welcome" },
        { type: "i-text", left: 200, top: 450, fontSize: 32, fontFamily: "Nunito", fill: "#94A3B8", text: "AI-Powered Content Creation" },
      ],
    }),
    width: 1920,
    height: 1080,
  },
  "mkt-flyer": {
    name: "Flyer",
    canvasJSON: JSON.stringify({
      version: "5.3.0",
      objects: [
        { type: "rect", left: 0, top: 0, width: 600, height: 900, fill: "#FFFFFF", selectable: false, evented: false },
        { type: "rect", left: 0, top: 0, width: 600, height: 400, fill: "#0D9488", selectable: false, evented: false },
        { type: "i-text", left: 40, top: 80, fontSize: 48, fontFamily: "Fredoka", fill: "#FFFFFF", text: "Big Event" },
        { type: "i-text", left: 40, top: 150, fontSize: 20, fontFamily: "Nunito", fill: "#E2E8F0", text: "Coming Soon" },
        { type: "rect", left: 40, top: 500, width: 520, height: 300, rx: 16, ry: 16, fill: "#F0FDFA", stroke: "#0D9488", strokeWidth: 2 },
        { type: "i-text", left: 60, top: 530, fontSize: 18, fontFamily: "Nunito", fill: "#134E4A", text: "Details here" },
      ],
    }),
    width: 600,
    height: 900,
  },
  "brand-logo": {
    name: "Logo",
    canvasJSON: JSON.stringify({
      version: "5.3.0",
      objects: [
        { type: "rect", left: 0, top: 0, width: 500, height: 500, fill: "#F0FDFA", selectable: false, evented: false },
        { type: "rect", left: 150, top: 150, width: 200, height: 200, rx: 40, ry: 40, fill: "#0D9488" },
        { type: "i-text", left: 200, top: 215, fontSize: 60, fontFamily: "Fredoka", fill: "#FFFFFF", text: "C", fontWeight: "bold" },
      ],
    }),
    width: 500,
    height: 500,
  },
  "brand-card": {
    name: "Business Card",
    canvasJSON: JSON.stringify({
      version: "5.3.0",
      objects: [
        { type: "rect", left: 0, top: 0, width: 1050, height: 600, fill: "#FFFFFF", selectable: false, evented: false },
        { type: "rect", left: 0, top: 0, width: 350, height: 600, fill: "#0D9488", selectable: false, evented: false },
        { type: "i-text", left: 30, top: 240, fontSize: 36, fontFamily: "Fredoka", fill: "#FFFFFF", text: "C" },
        { type: "i-text", left: 400, top: 200, fontSize: 28, fontFamily: "Fredoka", fill: "#134E4A", text: "Your Name" },
        { type: "i-text", left: 400, top: 250, fontSize: 16, fontFamily: "Nunito", fill: "#64748B", text: "Title" },
        { type: "i-text", left: 400, top: 350, fontSize: 14, fontFamily: "Nunito", fill: "#64748B", text: "email@example.com" },
      ],
    }),
    width: 1050,
    height: 600,
  },
  "mkt-banner": {
    name: "Web Banner",
    canvasJSON: JSON.stringify({
      version: "5.3.0",
      objects: [
        { type: "rect", left: 0, top: 0, width: 728, height: 90, fill: "#1E293B", selectable: false, evented: false },
        { type: "i-text", left: 30, top: 25, fontSize: 28, fontFamily: "Fredoka", fill: "#14B8A6", text: "Creativa" },
        { type: "i-text", left: 170, top: 32, fontSize: 16, fontFamily: "Nunito", fill: "#94A3B8", text: "AI-Powered Design Studio" },
        { type: "rect", left: 580, top: 25, width: 120, height: 40, rx: 20, ry: 20, fill: "#F97316" },
        { type: "i-text", left: 595, top: 34, fontSize: 14, fontFamily: "Nunito", fill: "#FFFFFF", text: "Try Free", fontWeight: "bold" },
      ],
    }),
    width: 728,
    height: 90,
  },
  "mkt-poster": {
    name: "Poster",
    canvasJSON: JSON.stringify({
      version: "5.3.0",
      objects: [
        { type: "rect", left: 0, top: 0, width: 800, height: 1200, fill: "#0F172A", selectable: false, evented: false },
        { type: "i-text", left: 60, top: 300, fontSize: 64, fontFamily: "Fredoka", fill: "#14B8A6", text: "Launch Event" },
        { type: "i-text", left: 60, top: 400, fontSize: 24, fontFamily: "Nunito", fill: "#94A3B8", text: "Join us for the biggest launch of the year" },
        { type: "rect", left: 60, top: 500, width: 240, height: 56, rx: 28, ry: 28, fill: "#F97316" },
        { type: "i-text", left: 90, top: 516, fontSize: 18, fontFamily: "Nunito", fill: "#FFFFFF", text: "RSVP Now", fontWeight: "bold" },
      ],
    }),
    width: 800,
    height: 1200,
  },
  "social-twitter": {
    name: "Twitter Header",
    canvasJSON: JSON.stringify({
      version: "5.3.0",
      objects: [
        { type: "rect", left: 0, top: 0, width: 1500, height: 500, fill: "#0D9488", selectable: false, evented: false },
        { type: "i-text", left: 100, top: 180, fontSize: 48, fontFamily: "Fredoka", fill: "#FFFFFF", text: "Creativa" },
        { type: "i-text", left: 100, top: 250, fontSize: 20, fontFamily: "Nunito", fill: "#E2E8F0", text: "Open Source AI Content Studio" },
      ],
    }),
    width: 1500,
    height: 500,
  },
  "social-linkedin": {
    name: "LinkedIn Banner",
    canvasJSON: JSON.stringify({
      version: "5.3.0",
      objects: [
        { type: "rect", left: 0, top: 0, width: 1584, height: 396, fill: "#F0FDFA", selectable: false, evented: false },
        { type: "rect", left: 0, top: 0, width: 1584, height: 8, fill: "#0D9488", selectable: false, evented: false },
        { type: "i-text", left: 80, top: 120, fontSize: 40, fontFamily: "Fredoka", fill: "#0D9488", text: "Creativa Studio" },
        { type: "i-text", left: 80, top: 180, fontSize: 18, fontFamily: "Nunito", fill: "#64748B", text: "AI-Powered Content Creation | Open Source" },
      ],
    }),
    width: 1584,
    height: 396,
  },
};

export async function GET(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const template = templateData[id];
  if (!template) {
    return NextResponse.json({ error: "Template not found" }, { status: 404 });
  }
  return NextResponse.json(template);
}
