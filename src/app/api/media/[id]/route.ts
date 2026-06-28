import { NextResponse } from "next/server";
export const dynamic = "force-dynamic";

import { db } from "@/lib/db";
import { media } from "@/db/schema";
import { eq } from "drizzle-orm";

export async function DELETE(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  if (!db) return NextResponse.json({ error: "Database unavailable" }, { status: 503 });
  try {
    await db.delete(media).where(eq(media.id, id));
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "Failed to delete" }, { status: 500 });
  }
}
