"use client";

import { useState, useCallback, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { X, Sparkles, Search, ArrowRight, Loader2 } from "lucide-react";

interface AISearchPanelProps {
  onClose: () => void;
  onInsertResult: (content: string) => void;
}

export function AISearchPanel({ onClose, onInsertResult }: AISearchPanelProps) {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<{ page: string; content: string; score: number }[]>([]);
  const [searching, setSearching] = useState(false);
  const [searched, setSearched] = useState(false);

  const handleSearch = useCallback(async () => {
    if (!query.trim()) return;
    setSearching(true);
    setSearched(true);
    try {
      const res = await fetch("/api/knowledge/search", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ query }),
      });
      if (res.ok) {
        const data = await res.json();
        setResults(data.results ?? []);
      } else {
        setResults([]);
      }
    } catch {
      setResults([]);
    } finally {
      setSearching(false);
    }
  }, [query]);

  return (
    <div className="fixed bottom-4 right-4 z-50 w-80 rounded-xl border border-border bg-background shadow-2xl overflow-hidden">
      <div className="flex items-center justify-between px-4 py-3 border-b border-border bg-surface">
        <div className="flex items-center gap-2">
          <Search size={16} className="text-primary" />
          <span className="text-sm font-semibold">AI Search</span>
        </div>
        <button onClick={onClose} className="text-muted hover:text-foreground cursor-pointer" aria-label="Close">
          <X size={16} />
        </button>
      </div>

      <div className="p-4 space-y-3">
        <div className="flex gap-2">
          <Input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search across all pages..."
            className="text-xs h-9"
            onKeyDown={(e) => e.key === "Enter" && handleSearch()}
          />
          <Button size="sm" onClick={handleSearch} disabled={searching || !query}>
            {searching ? <Loader2 size={14} className="animate-spin" /> : <ArrowRight size={14} />}
          </Button>
        </div>

        {searching && (
          <div className="flex items-center gap-2 py-4 text-sm text-muted">
            <Loader2 size={14} className="animate-spin" />
            Searching...
          </div>
        )}

        {searched && !searching && results.length === 0 && (
          <p className="text-xs text-muted text-center py-4">No results found</p>
        )}

        {results.map((r, i) => (
          <div
            key={i}
            className="p-3 rounded-lg border border-border hover:border-primary/50 cursor-pointer transition-colors"
            onClick={() => onInsertResult(r.content)}
          >
            <p className="text-xs text-muted mb-1">From: {r.page}</p>
            <p className="text-sm line-clamp-3">{r.content}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
