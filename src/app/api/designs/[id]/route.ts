import { NextResponse } from "next/server";
export const dynamic = "force-dynamic";

import { db } from "@/lib/db";
import { designs } from "@/db/schema";
import { eq } from "drizzle-orm";

export async function GET(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  if (!db) return NextResponse.json({ error: "Database unavailable" }, { status: 503 });
  try {
    const [design] = await db.select().from(designs).where(eq(designs.id, id));
    if (!design) return NextResponse.json({ error: "Not found" }, { status: 404 });
    return NextResponse.json(design);
  } catch {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }
}

export async function PUT(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  if (!db) return NextResponse.json({ error: "Database unavailable" }, { status: 503 });
  try {
    const body = await req.json();
    await db.update(designs)
      .set({
        name: body.name,
        canvasJSON: body.canvasJSON,
        width: body.width,
        height: body.height,
        updatedAt: new Date().toISOString(),
      })
      .where(eq(designs.id, id));
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "Failed to update" }, { status: 500 });
  }
}

export async function DELETE(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  if (!db) return NextResponse.json({ error: "Database unavailable" }, { status: 503 });
  try {
    await db.delete(designs).where(eq(designs.id, id));
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "Failed to delete" }, { status: 500 });
  }
}
