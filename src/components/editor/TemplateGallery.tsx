"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { X, Layout, Presentation, Image, FileText, Command, Shapes, PanelsTopLeft } from "lucide-react";
import { cn } from "@/lib/utils";

const templateCategories = [
  {
    name: "Social Media",
    templates: [
      { id: "social-instagram", name: "Instagram Post", icon: Image },
      { id: "social-facebook", name: "Facebook Cover", icon: Image },
      { id: "social-twitter", name: "Twitter Header", icon: Image },
      { id: "social-linkedin", name: "LinkedIn Banner", icon: Image },
    ],
  },
  {
    name: "Marketing",
    templates: [
      { id: "mkt-flyer", name: "Flyer", icon: FileText },
      { id: "mkt-banner", name: "Web Banner", icon: PanelsTopLeft },
      { id: "mkt-poster", name: "Poster", icon: Layout },
      { id: "mkt-presentation", name: "Presentation", icon: Presentation },
    ],
  },
  {
    name: "Brand",
    templates: [
      { id: "brand-logo", name: "Logo", icon: Command },
      { id: "brand-card", name: "Business Card", icon: Shapes },
    ],
  },
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
          <Button variant="ghost" size="sm" onClick={onClose} aria-label="Close">
            <X size={16} />
          </Button>
        </div>
        <div className="flex-1 overflow-y-auto p-6">
          {templateCategories.map((cat) => (
            <div key={cat.name} className="mb-8 last:mb-0">
              <h3 className="text-xs font-semibold text-muted uppercase tracking-wider mb-3">
                {cat.name}
              </h3>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {cat.templates.map((t) => {
                  const Icon = t.icon;
                  return (
                    <Card
                      key={t.id}
                      className="cursor-pointer hover:border-primary hover:shadow-md transition-all duration-200"
                      onClick={() => {
                        onSelect(t.id);
                        onClose();
                      }}
                    >
                      <CardContent className="p-0">
                        <div className="aspect-[4/3] bg-surface-alt rounded-t-xl flex items-center justify-center">
                          <Icon size={32} className="text-muted" />
                        </div>
                        <div className="p-3">
                          <p className="text-sm font-medium truncate">{t.name}</p>
                          <p className="text-xs text-muted">{cat.name}</p>
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
