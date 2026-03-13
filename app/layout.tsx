import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import Link from "next/link";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Privacy Eraser — 你的个人公关 Agent",
  description: "像明星经纪人一样管理你的数字身份",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh-CN">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <nav className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50">
          <div className="container max-w-5xl mx-auto flex items-center justify-between h-14 px-4">
            <Link href="/" className="font-bold text-lg flex items-center gap-2">
              <span>🛡️</span>
              <span>Privacy Eraser</span>
            </Link>
            <div className="flex items-center gap-6 text-sm">
              <Link href="/" className="text-muted-foreground hover:text-foreground transition-colors">
                Demo
              </Link>
              <Link href="/architecture" className="text-muted-foreground hover:text-foreground transition-colors">
                架构
              </Link>
              <Link href="/cases" className="text-muted-foreground hover:text-foreground transition-colors">
                案例
              </Link>
            </div>
          </div>
        </nav>
        <main>{children}</main>
      </body>
    </html>
  );
}
