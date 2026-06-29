import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { knowledgePages } from "@/db/schema";
import { eq } from "drizzle-orm";

export const dynamic = "force-dynamic";

export async function GET(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  if (!db) return NextResponse.json({ error: "DB offline" }, { status: 503 });
  try {
    const [page] = await db
      .select()
      .from(knowledgePages)
      .where(eq(knowledgePages.id, id))
      .limit(1);
    if (!page) return NextResponse.json({ error: "Not found" }, { status: 404 });
    return NextResponse.json(page);
  } catch (e) {
    return NextResponse.json({ error: String(e) }, { status: 500 });
  }
}

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  if (!db) return NextResponse.json({ error: "DB offline" }, { status: 503 });
  try {
    const body = await req.json();
    await db
      .update(knowledgePages)
      .set({
        title: body.title,
        icon: body.icon,
        parentId: body.parentId,
        blocksJSON: body.blocksJSON,
        updatedAt: new Date().toISOString(),
      })
      .where(eq(knowledgePages.id, id));
    return NextResponse.json({ ok: true });
  } catch (e) {
    return NextResponse.json({ error: String(e) }, { status: 500 });
  }
}

export async function DELETE(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  if (!db) return NextResponse.json({ error: "DB offline" }, { status: 503 });
  try {
    await db.delete(knowledgePages).where(eq(knowledgePages.id, id));
    return NextResponse.json({ ok: true });
  } catch (e) {
    return NextResponse.json({ error: String(e) }, { status: 500 });
  }
}
