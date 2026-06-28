"use client";

import type { Editor } from "@tiptap/react";
import {
  Bold, Italic, Underline as UnderlineIcon, Strikethrough,
  Heading1, Heading2, Heading3, List, ListOrdered,
  Quote, Code, Image, Link as LinkIcon, Undo2, Redo2,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useCallback } from "react";

interface WriterToolbarProps {
  editor: Editor | null;
}

export function WriterToolbar({ editor }: WriterToolbarProps) {
  const addImage = useCallback(() => {
    const url = prompt("Enter image URL:");
    if (url && editor) {
      editor.chain().focus().setImage({ src: url }).run();
    }
  }, [editor]);

  const addLink = useCallback(() => {
    const url = prompt("Enter URL:");
    if (url && editor) {
      editor.chain().focus().setLink({ href: url }).run();
    }
  }, [editor]);

  if (!editor) return null;

  const groups: { icon: React.ReactNode; action: () => void; active?: boolean; label: string }[][] = [
    [
      { icon: <Bold size={15} />, action: () => editor.chain().focus().toggleBold().run(), active: editor.isActive("bold"), label: "Bold" },
      { icon: <Italic size={15} />, action: () => editor.chain().focus().toggleItalic().run(), active: editor.isActive("italic"), label: "Italic" },
      { icon: <UnderlineIcon size={15} />, action: () => editor.chain().focus().toggleUnderline().run(), active: editor.isActive("underline"), label: "Underline" },
      { icon: <Strikethrough size={15} />, action: () => editor.chain().focus().toggleStrike().run(), active: editor.isActive("strike"), label: "Strikethrough" },
    ],
    [
      { icon: <Heading1 size={15} />, action: () => editor.chain().focus().toggleHeading({ level: 1 }).run(), active: editor.isActive("heading", { level: 1 }), label: "Heading 1" },
      { icon: <Heading2 size={15} />, action: () => editor.chain().focus().toggleHeading({ level: 2 }).run(), active: editor.isActive("heading", { level: 2 }), label: "Heading 2" },
      { icon: <Heading3 size={15} />, action: () => editor.chain().focus().toggleHeading({ level: 3 }).run(), active: editor.isActive("heading", { level: 3 }), label: "Heading 3" },
    ],
    [
      { icon: <List size={15} />, action: () => editor.chain().focus().toggleBulletList().run(), active: editor.isActive("bulletList"), label: "Bullet List" },
      { icon: <ListOrdered size={15} />, action: () => editor.chain().focus().toggleOrderedList().run(), active: editor.isActive("orderedList"), label: "Ordered List" },
      { icon: <Quote size={15} />, action: () => editor.chain().focus().toggleBlockquote().run(), active: editor.isActive("blockquote"), label: "Quote" },
      { icon: <Code size={15} />, action: () => editor.chain().focus().toggleCodeBlock().run(), active: editor.isActive("codeBlock"), label: "Code" },
    ],
    [
      { icon: <Image size={15} />, action: addImage, label: "Image" },
      { icon: <LinkIcon size={15} />, action: addLink, active: editor.isActive("link"), label: "Link" },
    ],
    [
      { icon: <Undo2 size={15} />, action: () => editor.chain().focus().undo().run(), label: "Undo" },
      { icon: <Redo2 size={15} />, action: () => editor.chain().focus().redo().run(), label: "Redo" },
    ],
  ];

  return (
    <div className="flex items-center gap-1 px-4 py-2 border-b border-border bg-background overflow-x-auto">
      {groups.map((group, gi) => (
        <div key={gi} className="flex items-center gap-1 after:content-[''] after:w-px after:h-5 after:bg-border after:mx-1 last:after:hidden">
          {group.map((btn) => (
            <button
              key={btn.label}
              onClick={btn.action}
              className={cn(
                "p-1.5 rounded transition-colors cursor-pointer",
                btn.active ? "bg-primary/10 text-primary" : "text-muted hover:bg-surface hover:text-foreground"
              )}
              aria-label={btn.label}
              title={btn.label}
            >
              {btn.icon}
            </button>
          ))}
        </div>
      ))}
    </div>
  );
}
