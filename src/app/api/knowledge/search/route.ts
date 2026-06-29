import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { knowledgePages } from "@/db/schema";
import { like } from "drizzle-orm";

export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  if (!db) return NextResponse.json({ results: [] }, { status: 503 });
  try {
    const { query } = await req.json();
    if (!query) return NextResponse.json({ results: [] });

    const pages = await db
      .select()
      .from(knowledgePages)
      .where(like(knowledgePages.blocksJSON, `%${query}%`))
      .orderBy(knowledgePages.updatedAt)
      .limit(20);

    const results = pages.flatMap((page: any) => {
      let blocks: any[] = [];
      try {
        blocks = JSON.parse(page.blocksJSON ?? "[]");
      } catch {}
      return blocks
        .filter((b: any) => b.content?.toLowerCase().includes(query.toLowerCase()))
        .map((b: any) => ({
          page: page.title,
          content: b.content ?? "",
          score: 1,
        }));
    });

    return NextResponse.json({ results: results.slice(0, 10) });
  } catch (e) {
    return NextResponse.json({ results: [] }, { status: 500 });
  }
}
