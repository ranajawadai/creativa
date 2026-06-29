import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { knowledgePages } from "@/db/schema";
import { eq, like } from "drizzle-orm";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  if (!db) return NextResponse.json([], { status: 503 });
  try {
    const pages = await db
      .select({
        id: knowledgePages.id,
        title: knowledgePages.title,
        icon: knowledgePages.icon,
        parentId: knowledgePages.parentId,
      })
      .from(knowledgePages)
      .orderBy(knowledgePages.updatedAt);
    return NextResponse.json(pages);
  } catch (e) {
    return NextResponse.json({ error: String(e) }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  if (!db) return NextResponse.json({ error: "DB offline" }, { status: 503 });
  try {
    const body = await req.json();
    const id = crypto.randomUUID();
    await db.insert(knowledgePages).values({
      id,
      userId: "default",
      title: body.title ?? "Untitled",
      icon: body.icon ?? "📄",
      parentId: body.parentId ?? null,
    });
    return NextResponse.json({ id });
  } catch (e) {
    return NextResponse.json({ error: String(e) }, { status: 500 });
  }
}
