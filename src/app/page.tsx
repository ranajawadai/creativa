import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function HomePage() {
  return (
    <div className="flex flex-col min-h-screen">
      <header className="fixed top-0 left-0 right-0 z-50">
        <div className="mx-4 my-3 px-6 py-3 rounded-2xl bg-background/80 backdrop-blur-xl border border-border shadow-sm">
          <div className="flex items-center justify-between max-w-7xl mx-auto">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-primary flex items-center justify-center text-white font-heading font-bold">
                C
              </div>
              <span className="font-heading font-semibold text-xl">Creativa</span>
            </div>
            <nav className="hidden md:flex items-center gap-6 text-sm text-muted">
              <Link href="/dashboard" className="hover:text-foreground transition-colors">Design</Link>
              <Link href="/write" className="hover:text-foreground transition-colors">Write</Link>
              <Link href="/video" className="hover:text-foreground transition-colors">Video</Link>
              <Link href="/media" className="hover:text-foreground transition-colors">Media</Link>
              <Link href="/knowledge" className="hover:text-foreground transition-colors">Knowledge</Link>
              <Link href="/login" className="hover:text-foreground transition-colors">Sign In</Link>
              <Button asChild>
                <Link href="/register">Get Started Free</Link>
              </Button>
            </nav>
          </div>
        </div>
      </header>

      <main className="flex-1">
        <section className="min-h-screen flex flex-col items-center justify-center text-center px-6 pt-24">
          <div className="max-w-3xl mx-auto space-y-8">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 text-primary text-sm font-medium">
              <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
              Open Source • AI-Powered
            </div>
            <h1 className="font-heading text-5xl sm:text-6xl md:text-7xl font-bold leading-tight text-balance">
              Design. Write. Create.
              <span className="text-primary block">All in One Place.</span>
            </h1>
            <p className="text-lg text-muted max-w-2xl mx-auto leading-relaxed">
              The open-source alternative to Canva, Notion, and Grammarly. 
              AI-native content creation with local-first privacy.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Button size="lg" asChild>
                <Link href="/register">Start Creating Free</Link>
              </Button>
              <Button variant="outline" size="lg" asChild>
                <a href="https://github.com" target="_blank">View on GitHub</a>
              </Button>
            </div>
            <p className="text-xs text-muted">No credit card required • Self-hostable • AGPL License</p>
          </div>
        </section>

        <section id="features" className="py-24 px-6 bg-surface">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-16 space-y-4">
              <h2 className="font-heading text-3xl sm:text-4xl font-bold">Everything You Need to Create</h2>
              <p className="text-muted max-w-2xl mx-auto">Three powerful tools, one unified workspace.</p>
            </div>
            <div className="grid md:grid-cols-3 gap-8">
              {[
                { title: "Design Studio", desc: "Drag-and-drop canvas editor with layers, shapes, text, and more.", icon: "🎨" },
                { title: "AI Writing Assistant", desc: "Smart writing with grammar check, tone adjustment, and AI generation.", icon: "✍️" },
                { title: "Knowledge Base", desc: "Block-based notes with AI search, forever free.", icon: "🧠" },
              ].map((feature) => (
                <div key={feature.title} className="rounded-2xl border border-border bg-background p-8 space-y-4 hover:shadow-lg transition-shadow duration-200">
                  <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center text-2xl">
                    {feature.icon}
                  </div>
                  <h3 className="font-heading text-xl font-semibold">{feature.title}</h3>
                  <p className="text-muted text-sm leading-relaxed">{feature.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>

      <footer className="border-t border-border py-8 px-6">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4 text-sm text-muted">
          <p>© 2026 Creativa. Open source under AGPL-3.0.</p>
          <div className="flex items-center gap-4">
            <a href="#" className="hover:text-foreground transition-colors">GitHub</a>
            <a href="#" className="hover:text-foreground transition-colors">Docs</a>
            <a href="#" className="hover:text-foreground transition-colors">Discord</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
