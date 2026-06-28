import type { Metadata } from "next";
import { Fredoka, Nunito } from "next/font/google";
import "./globals.css";

const fredoka = Fredoka({
  subsets: ["latin"],
  variable: "--font-heading",
});

const nunito = Nunito({
  subsets: ["latin"],
  variable: "--font-sans",
});

export const metadata: Metadata = {
  title: "Creativa - AI-Native Design Studio",
  description: "Open-source, AI-powered content creation platform. Design, write, create.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${fredoka.variable} ${nunito.variable}`}>
      <body className="min-h-screen bg-background text-foreground font-sans antialiased">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}

function Providers({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
