"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X, Compass } from "lucide-react";
import { navItems } from "./nav-items";
import { StatusBar } from "./status-bar";
import { cn } from "@/lib/utils";
import { CelebrationOverlay } from "@/components/celebration-overlay";

const groupLabels: Record<string, string> = {
  student: "冒険者メニュー",
  guild: "ギルド実績",
  staff: "企業・教員向け",
};

function NavLinks({ onNavigate }: { onNavigate?: () => void }) {
  const pathname = usePathname();
  const groups: Array<"student" | "guild" | "staff"> = ["student", "guild", "staff"];
  return (
    <nav className="flex flex-col gap-6">
      {groups.map((group) => (
        <div key={group} className="flex flex-col gap-1">
          <p className="px-3 text-[11px] font-semibold uppercase tracking-wider text-muted">
            {groupLabels[group]}
          </p>
          {navItems
            .filter((item) => item.group === group)
            .map((item) => {
              const active =
                item.href === "/" ? pathname === "/" : pathname.startsWith(item.href);
              const Icon = item.icon;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={onNavigate}
                  className={cn(
                    "group flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-colors",
                    active
                      ? "bg-gradient-to-r from-primary/15 to-accent/15 text-foreground border border-primary/30 glow-primary"
                      : "text-muted hover:bg-surface-2 hover:text-foreground border border-transparent"
                  )}
                >
                  <Icon className={cn("h-4 w-4 shrink-0", active ? "text-primary" : "text-muted group-hover:text-foreground")} />
                  <span className="flex flex-col leading-tight">
                    <span className="font-medium">{item.label}</span>
                    <span className="text-[11px] text-muted">{item.description}</span>
                  </span>
                </Link>
              );
            })}
        </div>
      ))}
    </nav>
  );
}

export function AppShell({ children }: { children: React.ReactNode }) {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <div className="min-h-screen lg:flex">
      <aside className="no-print hidden w-72 shrink-0 border-r border-border bg-surface/60 p-5 lg:flex lg:flex-col lg:h-screen lg:sticky lg:top-0 lg:overflow-y-auto">
        <Logo />
        <div className="mt-6">
          <NavLinks />
        </div>
      </aside>

      <div className="flex min-h-screen flex-1 flex-col">
        <header className="no-print sticky top-0 z-40 flex items-center justify-between gap-3 border-b border-border bg-background/85 px-4 py-3 backdrop-blur lg:px-8">
          <button
            className="flex items-center gap-2 rounded-lg border border-border-strong p-2 text-foreground lg:hidden cursor-pointer"
            onClick={() => setMobileOpen(true)}
            aria-label="メニューを開く"
          >
            <Menu className="h-5 w-5" />
          </button>
          <div className="lg:hidden">
            <Logo compact />
          </div>
          <div className="flex-1 overflow-x-auto scrollbar-thin">
            <StatusBar />
          </div>
        </header>

        <main className="flex-1 px-4 py-6 lg:px-8 lg:py-8">{children}</main>

        <footer className="no-print border-t border-border px-4 py-6 text-center text-xs text-muted lg:px-8">
          技術者ギルド β版 — 高専生のための技術クエスト型学習・仕事マッチングプロトタイプ
        </footer>
      </div>

      {mobileOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div className="absolute inset-0 bg-black/70" onClick={() => setMobileOpen(false)} />
          <div className="absolute left-0 top-0 h-full w-72 overflow-y-auto border-r border-border bg-surface p-5 animate-pop-in">
            <div className="mb-6 flex items-center justify-between">
              <Logo compact />
              <button
                className="rounded-lg p-1.5 text-muted hover:text-foreground cursor-pointer"
                onClick={() => setMobileOpen(false)}
                aria-label="メニューを閉じる"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            <NavLinks onNavigate={() => setMobileOpen(false)} />
          </div>
        </div>
      )}

      <CelebrationOverlay />
    </div>
  );
}

function Logo({ compact = false }: { compact?: boolean }) {
  return (
    <Link href="/" className="flex items-center gap-2">
      <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-primary to-accent glow-primary">
        <Compass className="h-5 w-5 text-[#04121a]" />
      </div>
      {!compact && (
        <div className="leading-tight">
          <p className="text-sm font-bold text-gradient">技術者ギルド</p>
          <p className="text-[11px] text-muted">Kosen Quest Platform</p>
        </div>
      )}
    </Link>
  );
}
