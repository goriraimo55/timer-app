"use client";

import { Flame, Medal, Sparkles } from "lucide-react";
import { useApp } from "@/lib/store";
import { titleForLevel, xpIntoLevel, xpProgressRatio, XP_PER_LEVEL } from "@/lib/level";
import { Progress } from "@/components/ui/progress";

export function StatusBar() {
  const { state, level, earnedBadgeIds } = useApp();

  return (
    <div className="flex flex-wrap items-center gap-3 rounded-xl border border-border bg-surface/70 px-3 py-2 text-xs">
      <div className="flex items-center gap-2">
        <div className="flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-br from-primary to-accent text-sm font-bold text-[#04121a]">
          {level}
        </div>
        <div className="min-w-[110px]">
          <div className="flex items-center justify-between text-[11px] text-muted">
            <span>{titleForLevel(level)}</span>
            <span>
              {xpIntoLevel(state.xp)}/{XP_PER_LEVEL}
            </span>
          </div>
          <Progress value={xpProgressRatio(state.xp) * 100} className="h-1.5 w-32" />
        </div>
      </div>
      <div className="flex items-center gap-1 rounded-full border border-warning/30 bg-warning/10 px-2.5 py-1 text-warning">
        <Flame className="h-3.5 w-3.5" />
        <span className="font-semibold">{state.streak}日連続</span>
      </div>
      <div className="flex items-center gap-1 rounded-full border border-accent/30 bg-accent/10 px-2.5 py-1 text-accent-2">
        <Medal className="h-3.5 w-3.5" />
        <span className="font-semibold">{earnedBadgeIds.length}個のバッジ</span>
      </div>
      <div className="flex items-center gap-1 rounded-full border border-primary/30 bg-primary/10 px-2.5 py-1 text-primary">
        <Sparkles className="h-3.5 w-3.5" />
        <span className="font-semibold">総XP {state.xp.toLocaleString()}</span>
      </div>
    </div>
  );
}
