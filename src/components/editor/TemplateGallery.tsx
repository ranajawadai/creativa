"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const templates = [
  { id: "social-instagram", name: "Instagram Post", category: "Social", thumbnail: null },
  { id: "social-facebook", name: "Facebook Cover", category: "Social", thumbnail: null },
  { id: "presentation", name: "Presentation", category: "Business", thumbnail: null },
  { id: "flyer", name: "Flyer", category: "Marketing", thumbnail: null },
  { id: "logo", name: "Logo", category: "Brand", thumbnail: null },
  { id: "banner", name: "Banner", category: "Marketing", thumbnail: null },
  { id: "card", name: "Business Card", category: "Brand", thumbnail: null },
  { id: "poster", name: "Poster", category: "Marketing", thumbnail: null },
];

interface TemplateGalleryProps {
  onSelect: (templateId: string) => void;
  open: boolean;
  onClose: () => void;
}

export function TemplateGallery({ onSelect, open, onClose }: TemplateGalleryProps) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
      <div className="bg-background rounded-2xl border border-border shadow-2xl w-full max-w-3xl max-h-[80vh] overflow-hidden flex flex-col">
        <div className="flex items-center justify-between px-6 py-4 border-b border-border">
          <h2 className="text-lg font-heading font-semibold">Choose a Template</h2>
          <Button variant="ghost" size="sm" onClick={onClose}>
            ✕
          </Button>
        </div>
        <div className="flex-1 overflow-y-auto p-6">
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
            {templates.map((template) => (
              <Card
                key={template.id}
                className="cursor-pointer hover:border-primary transition-colors duration-200"
                onClick={() => {
                  onSelect(template.id);
                  onClose();
                }}
              >
                <CardContent className="p-0">
                  <div className="aspect-[4/3] bg-surface-alt rounded-t-xl flex items-center justify-center text-muted text-sm">
                    {template.name.charAt(0)}
                  </div>
                  <div className="p-3">
                    <p className="text-sm font-medium truncate">{template.name}</p>
                    <p className="text-xs text-muted">{template.category}</p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
