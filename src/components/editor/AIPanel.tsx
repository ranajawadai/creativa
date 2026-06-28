"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { X, Sparkles, ImageIcon, MessageSquareText } from "lucide-react";

interface AIPanelProps {
  onResult: (result: string, type: "image" | "text") => void;
  onClose: () => void;
}

export function AIPanel({ onResult, onClose }: AIPanelProps) {
  const [mode, setMode] = useState<"image" | "text">("image");
  const [prompt, setPrompt] = useState("");
  const [apiKey, setApiKey] = useState("");
  const [loading, setLoading] = useState(false);
  const [provider, setProvider] = useState<"openai" | "anthropic" | "ollama">("openai");

  const handleGenerate = async () => {
    if (!prompt) return;
    setLoading(true);
    try {
      const res = await fetch("/api/ai/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          prompt,
          mode,
          provider,
          apiKey: apiKey || undefined,
        }),
      });
      if (!res.ok) throw new Error("Generation failed");
      const data = await res.json();
      onResult(data.result, mode);
    } catch {
      // fallback for demo
      if (mode === "image") {
        onResult("https://placehold.co/400x300/0D9488/FFFFFF?text=AI+Generated", "image");
      } else {
        onResult(
          `Generated content for: "${prompt}"\n\nThis is AI-generated text content. In production, this would use your configured AI provider.`,
          "text"
        );
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed bottom-4 right-4 z-50 w-80 rounded-xl border border-border bg-background shadow-2xl overflow-hidden">
      <div className="flex items-center justify-between px-4 py-3 border-b border-border bg-surface">
        <div className="flex items-center gap-2">
          <Sparkles size={16} className="text-primary" />
          <span className="text-sm font-semibold">AI Assistant</span>
        </div>
        <button onClick={onClose} className="text-muted hover:text-foreground cursor-pointer" aria-label="Close AI panel">
          <X size={16} />
        </button>
      </div>

      <div className="p-4 space-y-3">
        <div className="flex rounded-lg border border-border overflow-hidden">
          <button
            onClick={() => setMode("image")}
            className={`flex-1 py-2 text-xs font-medium flex items-center justify-center gap-1.5 transition-colors cursor-pointer ${
              mode === "image" ? "bg-primary text-white" : "hover:bg-surface"
            }`}
          >
            <ImageIcon size={14} /> Image
          </button>
          <button
            onClick={() => setMode("text")}
            className={`flex-1 py-2 text-xs font-medium flex items-center justify-center gap-1.5 transition-colors cursor-pointer ${
              mode === "text" ? "bg-primary text-white" : "hover:bg-surface"
            }`}
          >
            <MessageSquareText size={14} /> Text
          </button>
        </div>

        <select
          value={provider}
          onChange={(e) => setProvider(e.target.value as any)}
          className="w-full h-8 rounded-lg border border-border bg-background px-2 text-xs cursor-pointer"
        >
          <option value="openai">OpenAI (GPT-4o)</option>
          <option value="anthropic">Anthropic (Claude)</option>
          <option value="ollama">Local (Ollama)</option>
        </select>

        <Input
          placeholder="Your API key (optional, uses env default)"
          value={apiKey}
          onChange={(e) => setApiKey(e.target.value)}
          className="text-xs"
        />

        <textarea
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          placeholder={
            mode === "image"
              ? "Describe the image to generate..."
              : "Write a prompt for text generation..."
          }
          rows={3}
          className="w-full rounded-lg border border-border bg-background p-2 text-xs resize-none focus:outline-none focus:ring-2 focus:ring-primary"
        />

        <Button
          className="w-full"
          size="sm"
          onClick={handleGenerate}
          disabled={loading || !prompt}
        >
          {loading ? (
            <span className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full border-2 border-white border-t-transparent animate-spin" />
              Generating...
            </span>
          ) : (
            <span className="flex items-center gap-2">
              <Sparkles size={14} />
              Generate
            </span>
          )}
        </Button>
      </div>
    </div>
  );
}
