"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { X, Sparkles, ArrowRight, RefreshCw, Wand2, FileText } from "lucide-react";

interface AIWriterPanelProps {
  onGenerate: (prompt: string, action: string) => void;
  loading: boolean;
  onClose: () => void;
}

const quickActions = [
  { label: "Write a blog post about...", action: "replace", icon: FileText },
  { label: "Rewrite to be more professional", action: "insert", icon: RefreshCw },
  { label: "Summarize this section", action: "replace", icon: Wand2 },
  { label: "Make it more engaging", action: "replace", icon: Sparkles },
];

export function AIWriterPanel({ onGenerate, loading, onClose }: AIWriterPanelProps) {
  const [prompt, setPrompt] = useState("");
  const [action, setAction] = useState("insert");

  const handleGenerate = () => {
    if (!prompt) return;
    onGenerate(prompt, action);
  };

  return (
    <div className="fixed bottom-4 right-4 z-50 w-80 rounded-xl border border-border bg-background shadow-2xl overflow-hidden">
      <div className="flex items-center justify-between px-4 py-3 border-b border-border bg-surface">
        <div className="flex items-center gap-2">
          <Sparkles size={16} className="text-primary" />
          <span className="text-sm font-semibold">AI Writing</span>
        </div>
        <button onClick={onClose} className="text-muted hover:text-foreground cursor-pointer" aria-label="Close">
          <X size={16} />
        </button>
      </div>

      <div className="p-4 space-y-3">
        <div className="flex rounded-lg border border-border overflow-hidden">
          <button
            onClick={() => setAction("insert")}
            className={`flex-1 py-2 text-xs font-medium transition-colors cursor-pointer ${
              action === "insert" ? "bg-primary text-white" : "hover:bg-surface"
            }`}
          >
            Insert
          </button>
          <button
            onClick={() => setAction("replace")}
            className={`flex-1 py-2 text-xs font-medium transition-colors cursor-pointer ${
              action === "replace" ? "bg-primary text-white" : "hover:bg-surface"
            }`}
          >
            Replace All
          </button>
        </div>

        <div className="space-y-1.5">
          <p className="text-xs text-muted font-medium">Quick actions</p>
          {quickActions.map((qa) => {
            const Icon = qa.icon;
            return (
              <button
                key={qa.label}
                onClick={() => {
                  setPrompt(qa.label);
                }}
                className="w-full flex items-center gap-2 px-3 py-2 text-xs text-left text-muted hover:text-foreground hover:bg-surface rounded-md transition-colors cursor-pointer"
              >
                <Icon size={14} />
                {qa.label}
              </button>
            );
          })}
        </div>

        <textarea
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          placeholder="Describe what you want to write..."
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
              Generate {action === "insert" ? "& Insert" : "& Replace"}
            </span>
          )}
        </Button>
      </div>
    </div>
  );
}
