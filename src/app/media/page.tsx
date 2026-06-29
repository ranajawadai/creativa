"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { MediaGrid } from "@/components/media/MediaGrid";
import type { MediaItem } from "@/components/media/MediaCard";
import { UploadDialog } from "@/components/media/UploadDialog";
import { Toaster, toast } from "sonner";
import { Upload, Search, Grid3X3, PenSquare } from "lucide-react";

export default function MediaPage() {
  const [items, setItems] = useState<MediaItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [showUpload, setShowUpload] = useState(false);
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const fetchMedia = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/media");
      if (res.ok) {
        const data = await res.json();
        setItems(data);
      }
    } catch {
      // demo fallback
      setItems([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchMedia(); }, [fetchMedia]);

  const filtered = search
    ? items.filter((i) => i.name.toLowerCase().includes(search.toLowerCase()))
    : items;

  const handleUpload = async (file: File, category: string) => {
    // In production this would upload to a storage service
    // For demo, we'll create a local object URL
    const url = URL.createObjectURL(file);
    const newItem: MediaItem = {
      id: crypto.randomUUID(),
      name: file.name,
      url,
      type: file.type,
      size: file.size,
      category,
      createdAt: new Date().toISOString(),
    };
    setItems((prev) => [newItem, ...prev]);
    toast.success("Media uploaded!");
  };

  const handleDelete = async (id: string) => {
    try {
      await fetch(`/api/media/${id}`, { method: "DELETE" });
    } catch {}
    setItems((prev) => prev.filter((i) => i.id !== id));
    toast.success("Media deleted");
  };

  return (
    <div className="min-h-screen bg-surface">
      <Toaster position="top-center" richColors />
      <div className="border-b border-border bg-background">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link href="/" className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center text-white font-heading font-bold text-sm">
                C
              </div>
              <span className="font-heading font-semibold text-lg">Creativa</span>
            </Link>
          </div>
          <div className="flex items-center gap-3">
            <Link href="/dashboard"><Button variant="ghost" size="sm">Design</Button></Link>
            <Link href="/write"><Button variant="ghost" size="sm">Write</Button></Link>
            <Link href="/video"><Button variant="ghost" size="sm">Video</Button></Link>
            <Button size="sm" onClick={() => setShowUpload(true)}>
              <Upload size={14} />
              Upload
            </Button>
          </div>
        </div>
      </div>

      <main className="max-w-7xl mx-auto px-6 py-8 space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="font-heading text-2xl font-bold flex items-center gap-2">
            <Grid3X3 size={24} className="text-primary" />
            Media Library
          </h1>
          <div className="flex items-center gap-3">
            <div className="relative">
              <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted" />
              <Input
                placeholder="Search media..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-8 h-9 w-48 text-sm"
              />
            </div>
          </div>
        </div>

        <MediaGrid
          items={filtered}
          loading={loading}
          onSelect={(item) => setSelectedId(selectedId === item.id ? null : item.id)}
          onDelete={handleDelete}
          selectedId={selectedId}
        />
      </main>

      <UploadDialog
        open={showUpload}
        onClose={() => setShowUpload(false)}
        onUpload={handleUpload}
      />
    </div>
  );
}
