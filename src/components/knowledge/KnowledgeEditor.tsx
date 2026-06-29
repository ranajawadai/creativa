"use client";

import { useState, useCallback, useEffect } from "react";
import { BlockEditor, type Block } from "./BlockEditor";
import { Sidebar } from "./Sidebar";
import { AISearchPanel } from "./AISearchPanel";
import { Toaster, toast } from "sonner";
import { Sparkles, Plus } from "lucide-react";

interface PageNode {
  id: string;
  title: string;
  icon: string;
  parentId: string | null;
  children?: PageNode[];
}

interface KnowledgeEditorProps {
  pageId?: string;
}

export function KnowledgeEditor({ pageId }: KnowledgeEditorProps) {
  const [pages, setPages] = useState<PageNode[]>([]);
  const [currentId, setCurrentId] = useState<string | null>(pageId ?? null);
  const [title, setTitle] = useState("Untitled");
  const [icon, setIcon] = useState("📄");
  const [blocks, setBlocks] = useState<Block[]>([]);
  const [showAISearch, setShowAISearch] = useState(false);
  const [loading, setLoading] = useState(true);

  // Build tree from flat list
  const buildTree = (flat: PageNode[]): PageNode[] => {
    const roots = flat.filter((p) => !p.parentId);
    const children = flat.filter((p) => p.parentId);
    return roots.map((root) => ({
      ...root,
      children: children.filter((c) => c.parentId === root.id),
    }));
  };

  // Load all pages
  const fetchPages = useCallback(async () => {
    try {
      const res = await fetch("/api/knowledge");
      if (res.ok) {
        const data = await res.json();
        setPages(data);
      }
    } catch {}
  }, []);

  // Load current page
  const fetchPage = useCallback(async (id: string) => {
    setLoading(true);
    try {
      const res = await fetch(`/api/knowledge/${id}`);
      if (res.ok) {
        const data = await res.json();
        setTitle(data.title);
        setIcon(data.icon ?? "📄");
        const parsed = JSON.parse(data.blocksJSON ?? "[]");
        setBlocks(parsed.length > 0 ? parsed : []);
      }
    } catch {
      toast.error("Failed to load page");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchPages(); }, [fetchPages]);
  useEffect(() => {
    if (currentId) fetchPage(currentId);
    else setLoading(false);
  }, [currentId, fetchPage]);

  // Save
  const handleSave = useCallback(async () => {
    if (!currentId) return;
    try {
      await fetch(`/api/knowledge/${currentId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title,
          icon,
          blocksJSON: JSON.stringify(blocks),
        }),
      });
      toast.success("Saved!");
      fetchPages();
    } catch {
      toast.error("Failed to save");
    }
  }, [currentId, title, icon, blocks, fetchPages]);

  // Create new page
  const handleCreate = useCallback(async () => {
    try {
      const res = await fetch("/api/knowledge", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title: "Untitled", icon: "📄" }),
      });
      if (res.ok) {
        const data = await res.json();
        setCurrentId(data.id);
        setTitle("Untitled");
        setIcon("📄");
        setBlocks([]);
        fetchPages();
      }
    } catch {
      toast.error("Failed to create page");
    }
  }, [fetchPages]);

  // Delete page
  const handleDelete = useCallback(async (id: string) => {
    try {
      await fetch(`/api/knowledge/${id}`, { method: "DELETE" });
      if (currentId === id) {
        setCurrentId(null);
        setTitle("Untitled");
        setBlocks([]);
      }
      fetchPages();
    } catch {
      toast.error("Failed to delete");
    }
  }, [currentId, fetchPages]);

  // AI search insert
  const handleInsertResult = useCallback((content: string) => {
    setBlocks((prev) => [
      ...prev,
      { id: crypto.randomUUID(), type: "text", content },
    ]);
    setShowAISearch(false);
  }, []);

  return (
    <div className="flex h-screen bg-background">
      <Toaster position="top-center" richColors />
      <Sidebar
        pages={buildTree(pages)}
        currentId={currentId}
        onSelect={setCurrentId}
        onCreate={handleCreate}
        onDelete={handleDelete}
      />

      <div className="flex-1 flex flex-col overflow-hidden">
        <div className="flex items-center gap-3 px-6 py-3 border-b border-border">
          <input
            value={icon}
            onChange={(e) => setIcon(e.target.value)}
            className="w-6 text-center text-sm bg-transparent border-none outline-none"
          />
          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="flex-1 bg-transparent border-none text-lg font-heading font-semibold text-foreground focus:outline-none"
          />
          <button
            onClick={() => setShowAISearch(!showAISearch)}
            className={`text-sm transition-colors cursor-pointer px-3 py-1.5 rounded-md flex items-center gap-1.5 ${
              showAISearch ? "bg-primary text-white" : "text-muted hover:text-foreground hover:bg-surface"
            }`}
          >
            <Sparkles size={14} />
            AI Search
          </button>
          <button
            onClick={handleSave}
            className="text-sm bg-accent text-white px-4 py-1.5 rounded-md hover:bg-accent-dark transition-colors cursor-pointer font-medium"
          >
            Save
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-6 py-6">
          {loading ? (
            <div className="space-y-3 animate-pulse">
              <div className="h-8 w-48 bg-surface-alt rounded" />
              <div className="h-4 w-full bg-surface-alt rounded" />
              <div className="h-4 w-3/4 bg-surface-alt rounded" />
              <div className="h-4 w-1/2 bg-surface-alt rounded" />
            </div>
          ) : currentId ? (
            <div className="max-w-3xl mx-auto">
              <BlockEditor blocks={blocks} onChange={setBlocks} />
              <button
                onClick={() => setBlocks((prev) => [...prev, { id: crypto.randomUUID(), type: "text", content: "" }])}
                className="mt-2 flex items-center gap-1 text-sm text-muted hover:text-foreground transition-colors cursor-pointer px-1"
              >
                <Plus size={14} />
                Add block
              </button>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center h-full text-center">
              <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center text-3xl mb-4">
                🧠
              </div>
              <h2 className="text-xl font-heading font-semibold mb-2">Your Knowledge Base</h2>
              <p className="text-sm text-muted max-w-sm">
                Select a page from the sidebar or create a new one to get started.
              </p>
            </div>
          )}
        </div>
      </div>

      {showAISearch && (
        <AISearchPanel onClose={() => setShowAISearch(false)} onInsertResult={handleInsertResult} />
      )}
    </div>
  );
}
