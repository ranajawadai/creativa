import { createOpenAI } from "@ai-sdk/openai";
import { createAnthropic } from "@ai-sdk/anthropic";
import { generateText, type LanguageModel } from "ai";

export type AIProviderType = "openai" | "anthropic" | "ollama";

function getProvider(type: AIProviderType, apiKey?: string): LanguageModel {
  switch (type) {
    case "openai": {
      const openai = createOpenAI({ apiKey: apiKey ?? process.env.OPENAI_API_KEY });
      return openai("gpt-4o");
    }
    case "anthropic": {
      const anthropic = createAnthropic({ apiKey: apiKey ?? process.env.ANTHROPIC_API_KEY });
      return anthropic("claude-sonnet-4-20250514");
    }
    case "ollama": {
      const openai = createOpenAI({
        baseURL: "http://localhost:11434/v1",
        apiKey: "ollama",
      });
      return openai("llama3.2");
    }
  }
}

export async function generateWithAI({
  prompt,
  system,
  provider = "openai",
  apiKey,
}: {
  prompt: string;
  system?: string;
  provider?: AIProviderType;
  apiKey?: string;
}) {
  const model = getProvider(provider, apiKey);
  const result = await generateText({
    model,
    system: system ?? "You are a helpful creative assistant.",
    prompt,
  });
  return result.text;
}
