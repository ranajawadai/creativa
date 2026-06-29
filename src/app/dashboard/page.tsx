import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const recentDesigns = [
  { id: "1", name: "Social Media Banner", updated: "2 hours ago", thumbnail: null },
  { id: "2", name: "Product Presentation", updated: "Yesterday", thumbnail: null },
  { id: "3", name: "Instagram Story", updated: "3 days ago", thumbnail: null },
];

export default function DashboardPage() {
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
            <Link href="/knowledge"><Button variant="ghost" size="sm">Knowledge</Button></Link>
            <Link href="/write"><Button variant="ghost" size="sm">Write</Button></Link>
            <Link href="/video"><Button variant="ghost" size="sm">Video</Button></Link>
            <Link href="/media"><Button variant="ghost" size="sm">Media</Button></Link>
            <Link href="/design/new">
              <Button>New Design</Button>
            </Link>
          </div>
        </div>
      </div>

      <main className="max-w-7xl mx-auto px-6 py-8 space-y-8">
        <section>
          <div className="flex items-center justify-between mb-6">
            <h1 className="font-heading text-2xl font-bold">Recent Designs</h1>
            <Button variant="outline" size="sm">View All</Button>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {recentDesigns.map((design) => (
              <Link key={design.id} href={`/design/${design.id}`}>
                <Card className="cursor-pointer hover:border-primary transition-all duration-200">
                  <div className="aspect-video bg-surface-alt rounded-t-xl flex items-center justify-center text-muted text-sm">
                    {design.name.charAt(0)}
                  </div>
                  <CardHeader>
                    <CardTitle className="text-sm">{design.name}</CardTitle>
                    <p className="text-xs text-muted">Edited {design.updated}</p>
                  </CardHeader>
                </Card>
              </Link>
            ))}
            <Link href="/design/new">
              <Card className="border-dashed hover:border-primary hover:bg-primary/5 transition-all duration-200 cursor-pointer h-full">
                <CardContent className="flex flex-col items-center justify-center h-full min-h-[200px]">
                  <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center text-primary text-2xl mb-3">
                    +
                  </div>
                  <p className="text-sm font-medium text-muted">Create New Design</p>
                </CardContent>
              </Card>
            </Link>
          </div>
        </section>
      </main>
    </div>
  );
}
