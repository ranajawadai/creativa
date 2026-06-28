import { NextResponse } from "next/server";
export const dynamic = "force-dynamic";

import { db } from "@/lib/db";
import { designs } from "@/db/schema";
import { generateId } from "@/lib/utils";

export async function GET() {
  if (!db) return NextResponse.json([], { status: 200 });
  try {
    const all = await db.select().from(designs).orderBy(designs.updatedAt).limit(50);
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
    await db.insert(designs).values({
      id,
      name: body.name ?? "Untitled Design",
      userId: body.userId ?? "anonymous",
      canvasJSON: body.canvasJSON ?? "{}",
      width: body.width ?? 1920,
      height: body.height ?? 1080,
    });
    return NextResponse.json({ id, success: true });
  } catch {
    return NextResponse.json({ error: "Failed to create design" }, { status: 500 });
  }
}
