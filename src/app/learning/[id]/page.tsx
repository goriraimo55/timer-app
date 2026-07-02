"use client";

import { useMemo, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { CheckCircle2, Clock, HelpCircle, Sparkles, XCircle } from "lucide-react";
import { useApp } from "@/lib/store";
import { materials } from "@/lib/data";
import { getIcon } from "@/lib/icon-map";
import { skills } from "@/lib/data";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { DifficultyBadge } from "@/components/quests/quest-badges";
import { QuestCard } from "@/components/quests/quest-card";
import { AdSlot } from "@/components/ad-slot";
import { cn } from "@/lib/utils";
import type { SkillId } from "@/lib/types";

export default function MaterialDetailPage() {
  const params = useParams<{ id: string }>();
  const { state, allQuests, completeMaterial } = useApp();
  const [answers, setAnswers] = useState<Record<number, number>>({});

  const material = useMemo(() => materials.find((m) => m.id === params.id), [params.id]);

  if (!material) {
    return (
      <div className="rounded-2xl border border-dashed border-border p-10 text-center text-sm text-muted">
        教材が見つかりませんでした。
      </div>
    );
  }

  const completed = state.completedMaterialIds.includes(material.id);
  const relatedQuests = allQuests.filter((q) => material.relatedQuestIds.includes(q.id));

  function handleComplete() {
    if (!material) return;
    completeMaterial(material.id, material.rewardXp, material.relatedSkillIds as SkillId[], material.title);
  }

  return (
    <div className="mx-auto flex max-w-4xl flex-col gap-6">
      <div>
        <div className="mb-3 flex flex-wrap items-center gap-1.5">
          <Badge variant="outline">{material.category}</Badge>
          <DifficultyBadge difficulty={material.difficulty} />
          {completed && (
            <Badge variant="success" className="gap-1">
              <CheckCircle2 className="h-3 w-3" /> 修了済み
            </Badge>
          )}
        </div>
        <h1 className="text-2xl font-extrabold text-foreground sm:text-3xl">{material.title}</h1>
        <div className="mt-2 flex flex-wrap items-center gap-4 text-sm text-muted">
          <span className="flex items-center gap-1">
            <Clock className="h-4 w-4" /> 学習時間 約{material.studyMinutes}分
          </span>
          <span className="flex items-center gap-1 text-primary">
            <Sparkles className="h-4 w-4" /> 獲得経験値 +{material.rewardXp} XP
          </span>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>内容の要約</CardTitle>
        </CardHeader>
        <CardContent className="pt-0 text-sm leading-relaxed text-foreground/90">{material.summary}</CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>関連スキル</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-wrap gap-2 pt-0">
          {material.relatedSkillIds.map((sid) => {
            const skill = skills.find((s) => s.id === sid);
            if (!skill) return null;
            const Icon = getIcon(skill.icon);
            return (
              <Badge key={sid} variant="default" className="gap-1">
                <Icon className="h-3 w-3" /> {skill.name}
              </Badge>
            );
          })}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <HelpCircle className="h-4 w-4 text-primary" /> ミニクイズ
          </CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col gap-5 pt-0">
          {material.quiz.map((q, qi) => {
            const chosen = answers[qi];
            return (
              <div key={qi}>
                <p className="mb-2 text-sm font-semibold text-foreground">
                  Q{qi + 1}. {q.question}
                </p>
                <div className="flex flex-col gap-2">
                  {q.choices.map((choice, ci) => {
                    const isChosen = chosen === ci;
                    const isCorrect = ci === q.answerIndex;
                    const showResult = chosen !== undefined;
                    return (
                      <button
                        key={ci}
                        type="button"
                        onClick={() => setAnswers((prev) => ({ ...prev, [qi]: ci }))}
                        className={cn(
                          "flex items-center justify-between rounded-lg border px-3 py-2 text-left text-sm transition-colors cursor-pointer",
                          !showResult && "border-border-strong bg-surface-2 hover:border-primary/50",
                          showResult && isCorrect && "border-success/60 bg-success/10 text-success",
                          showResult && isChosen && !isCorrect && "border-danger/60 bg-danger/10 text-danger",
                          showResult && !isChosen && !isCorrect && "border-border bg-surface-2/50 text-muted"
                        )}
                      >
                        {choice}
                        {showResult && isCorrect && <CheckCircle2 className="h-4 w-4 shrink-0" />}
                        {showResult && isChosen && !isCorrect && <XCircle className="h-4 w-4 shrink-0" />}
                      </button>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </CardContent>
      </Card>

      {relatedQuests.length > 0 && (
        <div>
          <h2 className="mb-3 text-base font-bold text-foreground">関連クエスト</h2>
          <div className="grid gap-4 sm:grid-cols-2">
            {relatedQuests.map((q) => (
              <QuestCard key={q.id} quest={q} completed={state.completedQuestIds.includes(q.id)} />
            ))}
          </div>
        </div>
      )}

      <AdSlot seed={6} />

      <div className="sticky bottom-4 flex justify-center">
        <Button size="lg" onClick={handleComplete} disabled={completed} className="shadow-2xl">
          {completed ? (
            <>
              <CheckCircle2 className="mr-1.5 h-4 w-4" /> 学習完了済み
            </>
          ) : (
            <>学習完了にする(+{material.rewardXp} XP)</>
          )}
        </Button>
      </div>

      <p className="text-center text-xs text-muted">
        <Link href="/learning" className="hover:underline">
          ← 学習ページに戻る
        </Link>
      </p>
    </div>
  );
}
