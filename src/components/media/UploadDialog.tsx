"use client";

import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { X, Upload, ImageIcon } from "lucide-react";

interface UploadDialogProps {
  open: boolean;
  onClose: () => void;
  onUpload: (file: File, category: string) => Promise<void>;
}

export function UploadDialog({ open, onClose, onUpload }: UploadDialogProps) {
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [category, setCategory] = useState("uncategorized");
  const [uploading, setUploading] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  if (!open) return null;

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (f) {
      setFile(f);
      setPreview(URL.createObjectURL(f));
    }
  };

  const handleUpload = async () => {
    if (!file) return;
    setUploading(true);
    try {
      await onUpload(file, category);
      setFile(null);
      setPreview(null);
      onClose();
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
      <div className="bg-background rounded-2xl border border-border shadow-2xl w-full max-w-md overflow-hidden">
        <div className="flex items-center justify-between px-6 py-4 border-b border-border">
          <h2 className="text-lg font-heading font-semibold">Upload Media</h2>
          <button onClick={onClose} className="text-muted hover:text-foreground cursor-pointer" aria-label="Close">
            <X size={16} />
          </button>
        </div>

        <div className="p-6 space-y-4">
          {preview ? (
            <div className="relative rounded-xl overflow-hidden border border-border">
              <img src={preview} alt="Preview" className="w-full h-48 object-cover" />
              <button
                onClick={() => { setFile(null); setPreview(null); }}
                className="absolute top-2 right-2 p-1 rounded-full bg-background/80 text-muted hover:text-foreground cursor-pointer"
              >
                <X size={14} />
              </button>
            </div>
          ) : (
            <div
              onClick={() => fileRef.current?.click()}
              className="border-2 border-dashed border-border rounded-xl p-8 text-center cursor-pointer hover:border-primary/50 hover:bg-surface/50 transition-colors"
            >
              <Upload size={32} className="mx-auto text-muted mb-2" />
              <p className="text-sm text-muted">Click to upload or drag & drop</p>
              <p className="text-xs text-muted mt-1">PNG, JPG, WebP, SVG (max 10MB)</p>
            </div>
          )}

          <input ref={fileRef} type="file" accept="image/*" onChange={handleFileChange} className="hidden" />

          <div>
            <label className="text-xs text-muted block mb-1">Category</label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full h-9 rounded-lg border border-border bg-background px-3 text-sm cursor-pointer"
            >
              <option value="uncategorized">Uncategorized</option>
              <option value="logos">Logos</option>
              <option value="icons">Icons</option>
              <option value="backgrounds">Backgrounds</option>
              <option value="photos">Photos</option>
              <option value="illustrations">Illustrations</option>
            </select>
          </div>

          {file && (
            <p className="text-xs text-muted">
              {file.name} · {(file.size / 1024).toFixed(0)} KB
            </p>
          )}

          <Button className="w-full" onClick={handleUpload} disabled={!file || uploading}>
            {uploading ? (
              <span className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full border-2 border-white border-t-transparent animate-spin" />
                Uploading...
              </span>
            ) : (
              <span className="flex items-center gap-2">
                <Upload size={14} />
                Upload
              </span>
            )}
          </Button>
        </div>
      </div>
    </div>
  );
}
