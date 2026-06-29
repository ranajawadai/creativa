"use client";

import { useState, useCallback } from "react";
import { Plus, Search, FileText, Trash2, ChevronRight, ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";

interface PageNode {
  id: string;
  title: string;
  icon: string;
  parentId: string | null;
  children?: PageNode[];
}

interface SidebarProps {
  pages: PageNode[];
  currentId: string | null;
  onSelect: (id: string) => void;
  onCreate: () => void;
  onDelete: (id: string) => void;
}

function PageTreeItem({
  page,
  depth,
  currentId,
  onSelect,
  onDelete,
}: {
  page: PageNode;
  depth: number;
  currentId: string | null;
  onSelect: (id: string) => void;
  onDelete: (id: string) => void;
}) {
  const [expanded, setExpanded] = useState(true);
  const hasChildren = page.children && page.children.length > 0;

  return (
    <div>
      <div
        onClick={() => onSelect(page.id)}
        className={cn(
          "flex items-center gap-1.5 px-2 py-1.5 rounded-md text-sm cursor-pointer transition-colors",
          currentId === page.id
            ? "bg-primary/10 text-primary"
            : "text-foreground hover:bg-surface"
        )}
        style={{ paddingLeft: `${8 + depth * 16}px` }}
      >
        {hasChildren ? (
          <button
            onClick={(e) => { e.stopPropagation(); setExpanded(!expanded); }}
            className="text-muted hover:text-foreground cursor-pointer"
          >
            {expanded ? <ChevronDown size={12} /> : <ChevronRight size={12} />}
          </button>
        ) : (
          <span className="w-3" />
        )}
        <span className="text-xs">{page.icon}</span>
        <span className="flex-1 truncate text-xs">{page.title}</span>
        <button
          onClick={(e) => { e.stopPropagation(); onDelete(page.id); }}
          className="text-muted hover:text-destructive opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
        >
          <Trash2 size={10} />
        </button>
      </div>
      {expanded && hasChildren && (
        <div>
          {page.children!.map((child) => (
            <PageTreeItem
              key={child.id}
              page={child}
              depth={depth + 1}
              currentId={currentId}
              onSelect={onSelect}
              onDelete={onDelete}
            />
          ))}
        </div>
      )}
    </div>
  );
}

export function Sidebar({ pages, currentId, onSelect, onCreate, onDelete }: SidebarProps) {
  const [search, setSearch] = useState("");

  const filtered = search
    ? pages.filter((p) => p.title.toLowerCase().includes(search.toLowerCase()))
    : pages;

  return (
    <div className="w-60 border-r border-border bg-background flex flex-col h-full">
      <div className="p-3 border-b border-border">
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-xs font-semibold text-muted uppercase tracking-wider">Pages</h3>
          <button onClick={onCreate} className="text-muted hover:text-foreground cursor-pointer" aria-label="New page">
            <Plus size={14} />
          </button>
        </div>
        <div className="relative">
          <Search size={12} className="absolute left-2 top-1/2 -translate-y-1/2 text-muted" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search pages..."
            className="w-full h-7 rounded border border-border bg-background pl-7 pr-2 text-xs focus:outline-none focus:ring-1 focus:ring-primary"
          />
        </div>
      </div>
      <div className="flex-1 overflow-y-auto p-2 space-y-0.5">
        {filtered.map((page) => (
          <PageTreeItem
            key={page.id}
            page={page}
            depth={0}
            currentId={currentId}
            onSelect={onSelect}
            onDelete={onDelete}
          />
        ))}
        {filtered.length === 0 && (
          <p className="text-xs text-muted text-center py-4">
            {search ? "No pages found" : "No pages yet. Click + to create one."}
          </p>
        )}
      </div>
    </div>
  );
}
