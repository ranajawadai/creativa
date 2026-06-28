import { NextResponse } from "next/server";
export const dynamic = "force-dynamic";

import { db } from "@/lib/db";
import { media } from "@/db/schema";
import { generateId } from "@/lib/utils";

export async function GET() {
  if (!db) return NextResponse.json([], { status: 200 });
  try {
    const all = await db.select().from(media).orderBy(media.createdAt).limit(100);
    return NextResponse.json(all);
  } catch {
    return NextResponse.json([], { status: 200 });
  }
}

export async function POST(req: Request) {
  if (!db) return NextResponse.json({ error: "Database unavailable" }, { status: 503 });
  try {
    const body = await req.json();
    const id = body.id || generateId();
    await db.insert(media).values({
      id,
      userId: body.userId ?? "anonymous",
      name: body.name ?? "Untitled",
      url: body.url ?? "",
      type: body.type ?? "image",
      size: body.size ?? 0,
      width: body.width ?? null,
      height: body.height ?? null,
      alt: body.alt ?? null,
      category: body.category ?? "uncategorized",
    });
    return NextResponse.json({ id, success: true });
  } catch {
    return NextResponse.json({ error: "Failed to upload media" }, { status: 500 });
  }
}
