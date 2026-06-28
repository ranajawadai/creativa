import { NextResponse } from "next/server";
export const dynamic = "force-dynamic";
import { generateWithAI } from "@/ai";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { prompt, mode, provider, apiKey } = body;

    if (!prompt) {
      return NextResponse.json({ error: "Prompt is required" }, { status: 400 });
    }

    if (mode === "image") {
      const result = await generateWithAI({
        prompt,
        system: "You are a creative assistant. Generate a detailed image description for the following prompt. Return only the description, no extra text.",
        provider: provider ?? "openai",
        apiKey,
      });
      return NextResponse.json({ result, type: "image" });
    }

    const result = await generateWithAI({
      prompt,
      system: "You are a creative writing assistant. Generate high-quality content based on the user's request. Return only the content, no extra text.",
      provider: provider ?? "openai",
      apiKey,
    });
    return NextResponse.json({ result, type: "text" });
  } catch (e) {
    return NextResponse.json({ error: "AI generation failed" }, { status: 500 });
  }
}
