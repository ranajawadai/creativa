"use client";

import { useState, useCallback, useRef, useEffect } from "react";
import { Plus } from "lucide-react";

export type BlockType = "text" | "heading1" | "heading2" | "heading3" | "bullet" | "numbered" | "todo" | "divider" | "quote";

export interface Block {
  id: string;
  type: BlockType;
  content: string;
  checked?: boolean;
}

interface BlockEditorProps {
  blocks: Block[];
  onChange: (blocks: Block[]) => void;
  readOnly?: boolean;
}

const blockStyles: Record<BlockType, string> = {
  text: "text-base",
  heading1: "text-3xl font-heading font-bold",
  heading2: "text-2xl font-heading font-semibold",
  heading3: "text-xl font-heading font-semibold",
  bullet: "text-base before:content-['•'] before:mr-2 before:text-primary",
  numbered: "text-base",
  todo: "text-base",
  divider: "border-t border-border my-2",
  quote: "text-base italic border-l-4 border-primary pl-4 text-muted",
};

const placeholderMap: Record<BlockType, string> = {
  text: "Type '/' for commands, or just start typing...",
  heading1: "Heading 1",
  heading2: "Heading 2",
  heading3: "Heading 3",
  bullet: "List item",
  numbered: "Numbered item",
  todo: "Task",
  divider: "",
  quote: "Quote",
};

type SlashCommand = { id: BlockType; label: string; icon: string; description: string };

const slashCommands: SlashCommand[] = [
  { id: "text", label: "Text", icon: "Aa", description: "Plain text block" },
  { id: "heading1", label: "Heading 1", icon: "H1", description: "Big heading" },
  { id: "heading2", label: "Heading 2", icon: "H2", description: "Medium heading" },
  { id: "heading3", label: "Heading 3", icon: "H3", description: "Small heading" },
  { id: "bullet", label: "Bullet List", icon: "•", description: "Create a bullet list" },
  { id: "numbered", label: "Numbered List", icon: "1.", description: "Create a numbered list" },
  { id: "todo", label: "To-do", icon: "☐", description: "Add a task with checkbox" },
  { id: "quote", label: "Quote", icon: '"', description: "Add a quote block" },
  { id: "divider", label: "Divider", icon: "—", description: "Add a horizontal divider" },
];

function BlockComponent({
  block,
  index,
  onChange,
  onDelete,
  onAddBelow,
  readOnly,
}: {
  block: Block;
  index: number;
  onChange: (id: string, updates: Partial<Block>) => void;
  onDelete: (id: string) => void;
  onAddBelow: (id: string) => void;
  readOnly?: boolean;
}) {
  const [showSlash, setShowSlash] = useState(false);
  const [slashFilter, setSlashFilter] = useState("");
  const inputRef = useRef<HTMLTextAreaElement | HTMLInputElement>(null);

  const filteredCommands = slashCommands.filter(
    (c) => c.label.toLowerCase().includes(slashFilter.toLowerCase()) || c.id.includes(slashFilter)
  );

  const handleInput = useCallback(
    (value: string) => {
      if (value === "/") {
        setShowSlash(true);
        setSlashFilter("");
        return;
      }
      if (showSlash) {
        setSlashFilter(value.slice(1));
        if (!value.startsWith("/")) {
          setShowSlash(false);
          onChange(block.id, { content: value });
        }
        return;
      }
      onChange(block.id, { content: value });
    },
    [block.id, onChange, showSlash]
  );

  const handleSlashSelect = useCallback(
    (cmd: SlashCommand) => {
      onChange(block.id, { type: cmd.id, content: "" });
      setShowSlash(false);
      inputRef.current?.focus();
    },
    [block.id, onChange]
  );

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === "Enter" && !e.shiftKey) {
        e.preventDefault();
        onAddBelow(block.id);
      }
      if (e.key === "Backspace" && !block.content) {
        e.preventDefault();
        onDelete(block.id);
      }
      if (e.key === "ArrowUp" && showSlash) {
        e.preventDefault();
      }
    },
    [block.id, block.content, onAddBelow, onDelete, showSlash]
  );

  if (block.type === "divider") {
    return <hr className="border-t border-border my-2" />;
  }

  if (block.type === "todo") {
    return (
      <div className="flex items-start gap-2 group">
        <input
          type="checkbox"
          checked={block.checked ?? false}
          onChange={(e) => onChange(block.id, { checked: e.target.checked })}
          className="mt-1 accent-primary cursor-pointer"
        />
        <input
          value={block.content}
          onChange={(e) => onChange(block.id, { content: e.target.value })}
          onKeyDown={handleKeyDown}
          placeholder={placeholderMap[block.type]}
          className={`flex-1 bg-transparent border-none outline-none text-sm ${
            block.checked ? "line-through text-muted" : ""
          }`}
          ref={inputRef as any}
        />
      </div>
    );
  }

  return (
    <div className="relative group">
      <div className="flex items-start gap-2">
        {block.type === "numbered" && (
          <span className="text-sm text-muted mt-0.5 w-5 text-right flex-shrink-0">{index + 1}.</span>
        )}
        <textarea
          value={block.content}
          onChange={(e) => handleInput(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={placeholderMap[block.type]}
          className={`w-full bg-transparent border-none outline-none resize-none overflow-hidden text-sm ${
            blockStyles[block.type]
          }`}
          rows={1}
          ref={inputRef as any}
          onInput={(e) => {
            const el = e.currentTarget;
            el.style.height = "auto";
            el.style.height = el.scrollHeight + "px";
          }}
        />
      </div>

      {/* Slash command menu */}
      {showSlash && (
        <div className="absolute left-0 top-full mt-1 w-64 bg-background border border-border rounded-xl shadow-2xl z-50 overflow-hidden">
          <div className="px-3 py-2 border-b border-border text-[10px] text-muted uppercase tracking-wider">
            Commands
          </div>
          <div className="max-h-48 overflow-y-auto">
            {filteredCommands.map((cmd) => (
              <button
                key={cmd.id}
                onClick={() => handleSlashSelect(cmd)}
                className="w-full flex items-center gap-3 px-3 py-2 text-left hover:bg-surface text-sm transition-colors cursor-pointer"
              >
                <span className="w-6 h-6 rounded bg-surface-alt flex items-center justify-center text-xs font-medium">
                  {cmd.icon}
                </span>
                <div>
                  <p className="text-sm font-medium">{cmd.label}</p>
                  <p className="text-xs text-muted">{cmd.description}</p>
                </div>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export function BlockEditor({ blocks, onChange, readOnly }: BlockEditorProps) {
  const addBlock = useCallback(
    (afterId?: string) => {
      const newBlock: Block = { id: crypto.randomUUID(), type: "text", content: "" };
      if (afterId) {
        const idx = blocks.findIndex((b) => b.id === afterId);
        const next = [...blocks];
        next.splice(idx + 1, 0, newBlock);
        onChange(next);
      } else {
        onChange([...blocks, newBlock]);
      }
    },
    [blocks, onChange]
  );

  const updateBlock = useCallback(
    (id: string, updates: Partial<Block>) => {
      onChange(blocks.map((b) => (b.id === id ? { ...b, ...updates } : b)));
    },
    [blocks, onChange]
  );

  const deleteBlock = useCallback(
    (id: string) => {
      if (blocks.length <= 1) {
        onChange([{ id: crypto.randomUUID(), type: "text", content: "" }]);
        return;
      }
      onChange(blocks.filter((b) => b.id !== id));
    },
    [blocks, onChange]
  );

  // Auto-add first block if empty
  useEffect(() => {
    if (blocks.length === 0) {
      onChange([{ id: crypto.randomUUID(), type: "text", content: "" }]);
    }
  }, []);

  return (
    <div className="space-y-0.5">
      {blocks.map((block, i) => (
        <div key={block.id} className="group flex items-start gap-1">
          <button
            onClick={() => addBlock(block.id)}
            className="opacity-0 group-hover:opacity-100 transition-opacity mt-1 text-muted hover:text-foreground cursor-pointer flex-shrink-0"
            aria-label="Add block below"
          >
            <Plus size={14} />
          </button>
          <div className="flex-1">
            <BlockComponent
              block={block}
              index={i}
              onChange={updateBlock}
              onDelete={deleteBlock}
              onAddBelow={addBlock}
              readOnly={readOnly}
            />
          </div>
        </div>
      ))}
    </div>
  );
}
