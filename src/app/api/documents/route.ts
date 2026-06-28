import { NextResponse } from "next/server";
export const dynamic = "force-dynamic";

import { db } from "@/lib/db";
import { documents } from "@/db/schema";
import { generateId } from "@/lib/utils";

export async function GET() {
  if (!db) return NextResponse.json([], { status: 200 });
  try {
    const all = await db.select().from(documents).orderBy(documents.updatedAt).limit(50);
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
    await db.insert(documents).values({
      id,
      title: body.title ?? "Untitled Document",
      userId: body.userId ?? "anonymous",
      content: body.content ?? "",
    });
    return NextResponse.json({ id, success: true });
  } catch {
    return NextResponse.json({ error: "Failed to create document" }, { status: 500 });
  }
}
