import { Megaphone } from "lucide-react";
import { ads } from "@/lib/data";
import type { Ad } from "@/lib/types";

function pick(seed: number): Ad {
  return ads[seed % ads.length];
}

export function AdSlot({ seed = 0, className }: { seed?: number; className?: string }) {
  const ad = pick(seed);
  return (
    <div
      className={`relative overflow-hidden rounded-2xl border border-border p-4 ${className ?? ""}`}
      style={{
        background: `linear-gradient(135deg, ${ad.colorFrom}22, ${ad.colorTo}22)`,
      }}
    >
      <div className="mb-2 flex items-center justify-between">
        <span className="inline-flex items-center gap-1 rounded-full border border-border-strong bg-surface/70 px-2 py-0.5 text-[10px] text-muted">
          <Megaphone className="h-3 w-3" /> PR ・ {ad.category}
        </span>
      </div>
      <p className="text-sm font-bold text-foreground">{ad.title}</p>
      <p className="mt-1 text-xs text-muted">{ad.description}</p>
      <div className="mt-3 flex items-center justify-between">
        <span className="text-[11px] text-muted">{ad.advertiser}</span>
        <span
          className="rounded-lg px-3 py-1.5 text-[11px] font-semibold text-white"
          style={{ background: `linear-gradient(90deg, ${ad.colorFrom}, ${ad.colorTo})` }}
        >
          {ad.ctaLabel}
        </span>
      </div>
    </div>
  );
}
