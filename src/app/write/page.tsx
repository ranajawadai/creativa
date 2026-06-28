import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Plus, FileText } from "lucide-react";

const recentDocs = [
  { id: "1", title: "Blog Post - AI Trends 2026", updated: "1 hour ago" },
  { id: "2", title: "Product Description", updated: "Yesterday" },
  { id: "3", title: "Weekly Newsletter", updated: "3 days ago" },
];

export default function DocumentsPage() {
  return (
    <div className="min-h-screen bg-surface">
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
            <Link href="/dashboard">
              <Button variant="ghost" size="sm">Designs</Button>
            </Link>
            <Link href="/write/new">
              <Button size="sm">
                <Plus size={14} />
                New Document
              </Button>
            </Link>
          </div>
        </div>
      </div>

      <main className="max-w-7xl mx-auto px-6 py-8 space-y-8">
        <section>
          <div className="flex items-center justify-between mb-6">
            <h1 className="font-heading text-2xl font-bold">Documents</h1>
            <Link href="/write/new">
              <Button variant="outline" size="sm">
                <Plus size={14} />
                New
              </Button>
            </Link>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {recentDocs.map((doc) => (
              <Link key={doc.id} href={`/write/${doc.id}`}>
                <Card className="cursor-pointer hover:border-primary transition-all duration-200">
                  <div className="aspect-video bg-surface-alt rounded-t-xl flex items-center justify-center">
                    <FileText size={32} className="text-muted" />
                  </div>
                  <CardHeader>
                    <CardTitle className="text-sm">{doc.title}</CardTitle>
                    <p className="text-xs text-muted">Edited {doc.updated}</p>
                  </CardHeader>
                </Card>
              </Link>
            ))}
            <Link href="/write/new">
              <Card className="border-dashed hover:border-primary hover:bg-primary/5 transition-all duration-200 cursor-pointer h-full">
                <CardContent className="flex flex-col items-center justify-center h-full min-h-[200px]">
                  <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center text-primary text-2xl mb-3">
                    <Plus size={24} />
                  </div>
                  <p className="text-sm font-medium text-muted">New Document</p>
                </CardContent>
              </Card>
            </Link>
          </div>
        </section>
      </main>
    </div>
  );
}
