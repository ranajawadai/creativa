import { NextResponse } from "next/server";
export const dynamic = "force-dynamic";

import { db } from "@/lib/db";
import { documents } from "@/db/schema";
import { eq } from "drizzle-orm";

export async function GET(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  if (!db) return NextResponse.json({ error: "Database unavailable" }, { status: 503 });
  try {
    const [doc] = await db.select().from(documents).where(eq(documents.id, id));
    if (!doc) return NextResponse.json({ error: "Not found" }, { status: 404 });
    return NextResponse.json(doc);
  } catch {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }
}

export async function PUT(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  if (!db) return NextResponse.json({ error: "Database unavailable" }, { status: 503 });
  try {
    const body = await req.json();
    await db.update(documents)
      .set({
        title: body.title,
        content: body.content,
        updatedAt: new Date().toISOString(),
      })
      .where(eq(documents.id, id));
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "Failed to update" }, { status: 500 });
  }
}

export async function DELETE(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  if (!db) return NextResponse.json({ error: "Database unavailable" }, { status: 503 });
  try {
    await db.delete(documents).where(eq(documents.id, id));
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "Failed to delete" }, { status: 500 });
  }
}
