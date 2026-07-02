"use client";

import Link from "next/link";
import { useMemo } from "react";
import {
  Flame,
  Medal,
  Sparkles,
  Swords,
  BookOpen,
  Trophy,
  ChevronRight,
  Crown,
  Target,
} from "lucide-react";
import { useApp } from "@/lib/store";
import { titleForLevel, xpIntoLevel, xpProgressRatio, XP_PER_LEVEL } from "@/lib/level";
import { badges, materials, ranking } from "@/lib/data";
import { getIcon } from "@/lib/icon-map";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { SectionHeading } from "@/components/section-heading";
import { QuestCard } from "@/components/quests/quest-card";
import { MaterialCard } from "@/components/materials/material-card";
import { AdSlot } from "@/components/ad-slot";

export default function HomePage() {
  const { state, level, allQuests, earnedBadgeIds } = useApp();

  const dailyQuests = useMemo(
    () => allQuests.filter((q) => q.isDaily && q.approvalStatus === "承認済み"),
    [allQuests]
  );

  const recommendedQuests = useMemo(
    () =>
      allQuests
        .filter((q) => q.approvalStatus === "承認済み" && !state.completedQuestIds.includes(q.id))
        .slice(0, 3),
    [allQuests, state.completedQuestIds]
  );

  const recommendedMaterials = useMemo(
    () => materials.filter((m) => !state.completedMaterialIds.includes(m.id)).slice(0, 3),
    [state.completedMaterialIds]
  );

  return (
    <div className="flex flex-col gap-10">
      {/* Hero */}
      <section className="relative overflow-hidden rounded-2xl border border-border-strong bg-gradient-to-br from-surface via-surface to-surface-2 p-6 sm:p-8">
        <div className="pointer-events-none absolute -right-24 -top-24 h-72 w-72 rounded-full bg-primary/20 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-24 -left-10 h-64 w-64 rounded-full bg-accent/20 blur-3xl" />
        <div className="relative flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-widest text-primary">
              おかえりなさい、ギルド員
            </p>
            <h1 className="mt-1 text-3xl font-extrabold text-foreground sm:text-4xl">
              {state.profileName} <span className="text-muted text-lg font-medium">/ {state.department} {state.grade}</span>
            </h1>
            <p className="mt-2 flex items-center gap-2 text-sm text-accent-2">
              <Crown className="h-4 w-4" /> 称号: {titleForLevel(level)}
            </p>
            <div className="mt-5 max-w-md">
              <div className="mb-1 flex items-center justify-between text-xs text-muted">
                <span>Lv.{level}</span>
                <span>
                  次のレベルまで {XP_PER_LEVEL - xpIntoLevel(state.xp)} XP ({xpIntoLevel(state.xp)}/{XP_PER_LEVEL})
                </span>
              </div>
              <Progress value={xpProgressRatio(state.xp) * 100} className="h-3" />
            </div>
            <div className="mt-5 flex flex-wrap gap-2">
              <Button asChild>
                <Link href="/quests">
                  <Swords className="mr-1 h-4 w-4" /> クエストに挑戦する
                </Link>
              </Button>
              <Button asChild variant="outline">
                <Link href="/learning">
                  <BookOpen className="mr-1 h-4 w-4" /> 学習する
                </Link>
              </Button>
            </div>
          </div>

          <div className="grid w-full grid-cols-2 gap-3 sm:grid-cols-4 lg:w-auto">
            <StatTile icon={Trophy} label="レベル" value={`${level}`} color="text-primary" />
            <StatTile icon={Sparkles} label="総経験値" value={state.xp.toLocaleString()} color="text-accent-2" />
            <StatTile icon={Flame} label="連続学習日数" value={`${state.streak}日`} color="text-warning" />
            <StatTile icon={Medal} label="所持バッジ" value={`${earnedBadgeIds.length}/${badges.length}`} color="text-success" />
          </div>
        </div>
      </section>

      {/* デイリークエスト */}
      {dailyQuests.length > 0 && (
        <section>
          <SectionHeading
            icon={Target}
            title="デイリークエスト"
            description="毎日挑戦できる短時間クエスト。連続学習日数を伸ばそう。"
          />
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {dailyQuests.map((q) => (
              <QuestCard key={q.id} quest={q} completed={state.completedQuestIds.includes(q.id)} />
            ))}
          </div>
        </section>
      )}

      <AdSlot seed={0} />

      {/* おすすめクエスト */}
      <section>
        <SectionHeading
          icon={Swords}
          title="おすすめクエスト"
          description="あなたのスキルに合わせて選ばれた企業案件"
          action={
            <Link href="/quests" className="flex items-center gap-1 text-sm text-primary hover:underline">
              すべて見る <ChevronRight className="h-4 w-4" />
            </Link>
          }
        />
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {recommendedQuests.map((q) => (
            <QuestCard key={q.id} quest={q} completed={state.completedQuestIds.includes(q.id)} />
          ))}
        </div>
      </section>

      {/* おすすめ学習コンテンツ */}
      <section>
        <SectionHeading
          icon={BookOpen}
          title="おすすめ学習コンテンツ"
          description="スキルアップに直結する教材をピックアップ"
          action={
            <Link href="/learning" className="flex items-center gap-1 text-sm text-primary hover:underline">
              すべて見る <ChevronRight className="h-4 w-4" />
            </Link>
          }
        />
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {recommendedMaterials.map((m) => (
            <MaterialCard key={m.id} material={m} completed={state.completedMaterialIds.includes(m.id)} />
          ))}
        </div>
      </section>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* ランキング */}
        <section className="lg:col-span-2">
          <SectionHeading icon={Trophy} title="今週のランキング" description="ギルド内の経験値ランキング" />
          <Card>
            <CardContent className="divide-y divide-border p-0">
              {ranking.map((r) => (
                <div key={r.rank} className="flex items-center gap-3 px-4 py-3">
                  <RankBadge rank={r.rank} />
                  <div className="flex-1 min-w-0">
                    <p className="truncate text-sm font-semibold text-foreground">{r.name}</p>
                    <p className="truncate text-xs text-muted">
                      {r.department} ・ {r.title}
                    </p>
                  </div>
                  <div className="text-right shrink-0">
                    <p className="text-sm font-bold text-primary">{r.weeklyXp.toLocaleString()} XP</p>
                    <p className="text-[11px] text-muted">Lv.{r.level}</p>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </section>

        {/* バッジ */}
        <section>
          <SectionHeading icon={Medal} title="所持バッジ" />
          <Card>
            <CardContent className="grid grid-cols-3 gap-3 p-4">
              {badges.slice(0, 9).map((b) => {
                const earned = earnedBadgeIds.includes(b.id);
                const Icon = getIcon(b.icon);
                return (
                  <div
                    key={b.id}
                    title={`${b.name}: ${b.condition}`}
                    className={`flex flex-col items-center gap-1 rounded-xl border p-2.5 text-center ${
                      earned
                        ? "border-primary/40 bg-primary/10 text-primary"
                        : "border-border bg-surface-2 text-muted opacity-50"
                    }`}
                  >
                    <Icon className="h-5 w-5" />
                    <span className="text-[10px] leading-tight">{b.name}</span>
                  </div>
                );
              })}
            </CardContent>
          </Card>
          <Link href="/profile" className="mt-2 flex items-center justify-end gap-1 text-xs text-primary hover:underline">
            プロフィールで全実績を見る <ChevronRight className="h-3.5 w-3.5" />
          </Link>
        </section>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <AdSlot seed={2} />
        <AdSlot seed={4} />
      </div>
    </div>
  );
}

function StatTile({
  icon: Icon,
  label,
  value,
  color,
}: {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  value: string;
  color: string;
}) {
  return (
    <div className="flex flex-col items-center justify-center gap-1 rounded-xl border border-border bg-surface-2/70 px-3 py-3 text-center">
      <Icon className={`h-5 w-5 ${color}`} />
      <span className="text-lg font-extrabold text-foreground">{value}</span>
      <span className="text-[10px] text-muted">{label}</span>
    </div>
  );
}

function RankBadge({ rank }: { rank: number }) {
  const styles: Record<number, string> = {
    1: "bg-gradient-to-br from-yellow-300 to-yellow-500 text-[#3a2a00]",
    2: "bg-gradient-to-br from-slate-200 to-slate-400 text-[#20242c]",
    3: "bg-gradient-to-br from-amber-500 to-amber-700 text-white",
  };
  return (
    <div
      className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-sm font-bold ${
        styles[rank] ?? "bg-surface-2 text-muted"
      }`}
    >
      {rank}
    </div>
  );
}
