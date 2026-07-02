"use client";

import { useEffect } from "react";
import { PartyPopper, Sparkles } from "lucide-react";
import { useApp } from "@/lib/store";

const CONFETTI_COLORS = ["#22d3ee", "#a855f7", "#f472b6", "#34d399", "#fbbf24"];

export function CelebrationOverlay() {
  const { state, clearCelebration } = useApp();
  const celebration = state.celebration;

  useEffect(() => {
    if (!celebration) return;
    const timer = setTimeout(() => clearCelebration(), 2600);
    return () => clearTimeout(timer);
  }, [celebration, clearCelebration]);

  if (!celebration) return null;

  return (
    <div className="pointer-events-none fixed inset-x-0 top-6 z-[100] flex justify-center px-4">
      <div className="relative animate-pop-in">
        <div className="absolute inset-0 -z-10 flex justify-center overflow-visible">
          {Array.from({ length: 16 }).map((_, i) => (
            <span
              key={i}
              className="absolute top-0 h-2 w-2 rounded-sm animate-[confetti-fall_1.6s_ease-in_forwards]"
              style={{
                left: `${(i / 16) * 100}%`,
                backgroundColor: CONFETTI_COLORS[i % CONFETTI_COLORS.length],
                animationDelay: `${(i % 5) * 0.08}s`,
              }}
            />
          ))}
        </div>
        <div className="flex items-center gap-3 rounded-2xl border border-primary/40 bg-surface px-5 py-4 shadow-[0_0_40px_rgba(34,211,238,0.35)] glow-primary">
          <div className="flex h-11 w-11 items-center justify-center rounded-full bg-gradient-to-br from-primary to-accent">
            <PartyPopper className="h-6 w-6 text-[#04121a]" />
          </div>
          <div>
            <p className="text-sm font-bold text-foreground">
              {celebration.type === "quest" ? "クエスト完了!" : "学習完了!"}
            </p>
            <p className="text-xs text-muted">{celebration.label}</p>
            <p className="mt-0.5 flex items-center gap-1 text-xs font-semibold text-primary">
              <Sparkles className="h-3 w-3" /> +{celebration.xp} XP 獲得
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
