"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { Briefcase, Search, SlidersHorizontal } from "lucide-react";
import { useApp } from "@/lib/store";
import { PageHeader } from "@/components/section-heading";
import { QuestCard } from "@/components/quests/quest-card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { AdSlot } from "@/components/ad-slot";
import type { Difficulty, QuestCategory } from "@/lib/types";

const categories: (QuestCategory | "すべて")[] = [
  "すべて",
  "CAD",
  "図面",
  "測定・実験",
  "3Dプリンタ",
  "作業手順",
  "機械設計",
  "部品選定",
  "改善提案",
  "電気・制御",
  "安全レビュー",
];

const difficulties: (Difficulty | "すべて")[] = ["すべて", "初級", "中級", "上級", "最上級"];

export default function QuestsPage() {
  const { state, allQuests } = useApp();
  const [keyword, setKeyword] = useState("");
  const [category, setCategory] = useState<string>("すべて");
  const [difficulty, setDifficulty] = useState<string>("すべて");
  const [remoteOnly, setRemoteOnly] = useState(false);
  const [showPendingToo, setShowPendingToo] = useState(true);

  const filtered = useMemo(() => {
    return allQuests
      .filter((q) => (category === "すべて" ? true : q.category === category))
      .filter((q) => (difficulty === "すべて" ? true : q.difficulty === difficulty))
      .filter((q) => (remoteOnly ? q.remoteOk : true))
      .filter((q) => (showPendingToo ? true : q.approvalStatus === "承認済み"))
      .filter(
        (q) =>
          keyword.trim() === "" ||
          q.title.includes(keyword) ||
          q.companyName.includes(keyword) ||
          q.requiredSkills.some((s) => s.includes(keyword))
      )
      .sort((a, b) => Number(b.approvalStatus === "承認済み") - Number(a.approvalStatus === "承認済み"));
  }, [allQuests, category, difficulty, remoteOnly, showPendingToo, keyword]);

  return (
    <div>
      <PageHeader
        eyebrow="クエストボード"
        title="クエスト一覧"
        description="企業から届いた技術課題が「クエスト」として並んでいます。挑戦して経験値とスキルを獲得しよう。"
        action={
          <Button asChild variant="outline">
            <Link href="/quests/new">
              <Briefcase className="mr-1 h-4 w-4" /> 企業の方はこちら(案件投稿)
            </Link>
          </Button>
        }
      />

      <div className="mb-6 flex flex-col gap-3 rounded-2xl border border-border bg-surface/70 p-4 sm:flex-row sm:flex-wrap sm:items-center">
        <div className="relative flex-1 min-w-[200px]">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted" />
          <Input
            placeholder="キーワードで検索(タイトル・企業名・スキル)"
            value={keyword}
            onChange={(e) => setKeyword(e.target.value)}
            className="pl-9"
          />
        </div>
        <Select value={category} onValueChange={setCategory}>
          <SelectTrigger className="w-full sm:w-40">
            <SelectValue placeholder="カテゴリ" />
          </SelectTrigger>
          <SelectContent>
            {categories.map((c) => (
              <SelectItem key={c} value={c}>
                {c}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select value={difficulty} onValueChange={setDifficulty}>
          <SelectTrigger className="w-full sm:w-32">
            <SelectValue placeholder="難易度" />
          </SelectTrigger>
          <SelectContent>
            {difficulties.map((d) => (
              <SelectItem key={d} value={d}>
                {d}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Button
          variant={remoteOnly ? "default" : "outline"}
          size="sm"
          onClick={() => setRemoteOnly((v) => !v)}
        >
          <SlidersHorizontal className="mr-1 h-3.5 w-3.5" /> リモート可のみ
        </Button>
        <Button
          variant={showPendingToo ? "default" : "outline"}
          size="sm"
          onClick={() => setShowPendingToo((v) => !v)}
        >
          承認待ちも表示
        </Button>
      </div>

      <p className="mb-3 text-xs text-muted">{filtered.length}件のクエストが見つかりました</p>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {filtered.map((q, i) => (
          <div key={q.id} className="contents">
            <QuestCard quest={q} completed={state.completedQuestIds.includes(q.id)} />
            {i === 5 && (
              <div className="sm:col-span-2 lg:col-span-3">
                <AdSlot seed={1} />
              </div>
            )}
          </div>
        ))}
      </div>

      {filtered.length === 0 && (
        <div className="rounded-2xl border border-dashed border-border p-10 text-center text-sm text-muted">
          条件に合うクエストが見つかりませんでした。
        </div>
      )}
    </div>
  );
}
