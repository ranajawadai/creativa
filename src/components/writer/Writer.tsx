"use client";

import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import ImageExt from "@tiptap/extension-image";
import Link from "@tiptap/extension-link";
import Placeholder from "@tiptap/extension-placeholder";
import Underline from "@tiptap/extension-underline";
import { WriterToolbar } from "./WriterToolbar";
import { AIWriterPanel } from "./AIWriterPanel";
import { useState, useCallback, useEffect } from "react";
import { Toaster, toast } from "sonner";

interface WriterProps {
  documentId?: string;
}

export function Writer({ documentId }: WriterProps) {
  const [title, setTitle] = useState("Untitled Document");
  const [showAI, setShowAI] = useState(false);
  const [aiLoading, setAiLoading] = useState(false);

  const editor = useEditor({
    extensions: [
      StarterKit.configure({ heading: { levels: [1, 2, 3] } }),
      ImageExt.configure({ inline: true }),
      Link.configure({ openOnClick: true }),
      Underline,
      Placeholder.configure({ placeholder: "Start writing..." }),
    ],
    editorProps: {
      attributes: { class: "prose prose-sm sm:prose-base max-w-none focus:outline-none min-h-[500px] px-8 py-6" },
    },
  });

  const handleSave = useCallback(async () => {
    if (!editor) return;
    const content = JSON.stringify(editor.getJSON());
    try {
      const res = await fetch("/api/documents", {
        method: documentId && documentId !== "new" ? "PUT" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: documentId && documentId !== "new" ? documentId : undefined,
          title,
          content,
        }),
      });
      if (!res.ok) throw new Error("Save failed");
      toast.success("Document saved!");
    } catch {
      toast.error("Failed to save document");
    }
  }, [editor, documentId, title]);

  const handleAIWrite = useCallback(async (prompt: string, action: string) => {
    if (!editor) return;
    setAiLoading(true);
    try {
      const res = await fetch("/api/ai/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt, mode: "text", provider: "openai" }),
      });
      const data = await res.json();
      if (action === "replace") {
        editor.commands.setContent(data.result);
      } else {
        editor.commands.insertContent("\n\n" + data.result);
      }
    } catch {
      editor.commands.insertContent(
        `\n\n[AI Generated: "${prompt}"]\n\nThis is where AI-generated content would appear. Configure your API key in the AI panel.`
      );
    } finally {
      setAiLoading(false);
    }
  }, [editor]);

  useEffect(() => {
    if (!documentId || documentId === "new" || !editor) return;
    async function loadDoc() {
      try {
        const res = await fetch(`/api/documents/${documentId}`);
        if (!res.ok) throw new Error("Not found");
        const data = await res.json();
        setTitle(data.title);
        const json = JSON.parse(data.content);
        editor.commands.setContent(json);
      } catch {
        toast.error("Failed to load document");
      }
    }
    loadDoc();
  }, [documentId, editor]);

  return (
    <div className="flex flex-col h-screen bg-background">
      <Toaster position="top-center" richColors />
      <div className="flex items-center gap-3 px-4 py-2 border-b border-border bg-background">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center text-white font-heading font-bold text-sm">
            C
          </div>
          <span className="font-heading font-semibold text-lg">Creativa</span>
        </div>
        <input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="bg-transparent border-none text-sm font-medium text-foreground focus:outline-none px-2 py-1 rounded hover:bg-surface transition-colors flex-1 max-w-md"
        />
        <div className="flex-1" />
        <button
          onClick={() => setShowAI(!showAI)}
          className={`text-sm transition-colors cursor-pointer px-3 py-1 rounded-md ${
            showAI ? "bg-primary text-white" : "text-muted hover:text-foreground"
          }`}
        >
          AI
        </button>
        <button
          onClick={handleSave}
          className="text-sm bg-accent text-white px-4 py-1.5 rounded-md hover:bg-accent-dark transition-colors cursor-pointer font-medium"
        >
          Save
        </button>
      </div>

      <WriterToolbar editor={editor} />

      <div className="flex flex-1 overflow-hidden">
        <div className="flex-1 overflow-y-auto bg-surface">
          <div className="max-w-3xl mx-auto bg-background my-6 rounded-xl border border-border shadow-sm">
            <EditorContent editor={editor} />
          </div>
        </div>
      </div>

      {showAI && (
        <AIWriterPanel
          onGenerate={handleAIWrite}
          loading={aiLoading}
          onClose={() => setShowAI(false)}
        />
      )}
    </div>
  );
}
