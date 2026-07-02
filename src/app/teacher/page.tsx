"use client";

import { useMemo, useState } from "react";
import {
  Building2,
  Calendar,
  CheckCircle2,
  Coins,
  GraduationCap,
  Lock,
  RotateCcw,
  ShieldCheck,
  Wrench,
  XCircle,
} from "lucide-react";
import { useApp } from "@/lib/store";
import { PageHeader } from "@/components/section-heading";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import {
  ApprovalStatusBadge,
  DifficultyBadge,
  SafetyLabelBadge,
  SafetyLevelMeter,
} from "@/components/quests/quest-badges";
import type { Quest } from "@/lib/types";

export default function TeacherPage() {
  const { allQuests, setQuestApproval } = useApp();
  const [flash, setFlash] = useState<string | null>(null);

  const pending = useMemo(() => allQuests.filter((q) => q.approvalStatus === "承認待ち"), [allQuests]);
  const processed = useMemo(() => allQuests.filter((q) => q.approvalStatus !== "承認待ち"), [allQuests]);

  function handleDecide(quest: Quest, status: "承認済み" | "差し戻し" | "却下", comment: string) {
    setQuestApproval(quest.id, status, comment);
    setFlash(`「${quest.title}」を${status}にしました。`);
    window.setTimeout(() => setFlash(null), 3200);
  }

  return (
    <div className="mx-auto max-w-4xl">
      <PageHeader
        eyebrow="教員コンソール"
        title="教員承認画面"
        description="企業から投稿されたクエストの安全性・難易度・守秘義務を確認し、承認・差し戻し・却下を判断してください。承認されたクエストのみ学生が挑戦できます。"
      />

      {flash && (
        <div className="mb-4 flex items-center gap-2 rounded-xl border border-success/40 bg-success/10 px-4 py-3 text-sm text-success">
          <CheckCircle2 className="h-4 w-4" /> {flash}
        </div>
      )}

      <Tabs defaultValue="pending">
        <TabsList>
          <TabsTrigger value="pending">承認待ち ({pending.length})</TabsTrigger>
          <TabsTrigger value="processed">処理済み ({processed.length})</TabsTrigger>
        </TabsList>

        <TabsContent value="pending">
          {pending.length === 0 ? (
            <EmptyState />
          ) : (
            <div className="flex flex-col gap-5">
              {pending.map((q) => (
                <PendingQuestCard key={q.id} quest={q} onDecide={handleDecide} />
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="processed">
          <div className="flex flex-col gap-3">
            {processed.map((q) => (
              <div
                key={q.id}
                className="flex flex-wrap items-center justify-between gap-2 rounded-xl border border-border bg-surface/70 px-4 py-3"
              >
                <div>
                  <p className="text-sm font-semibold text-foreground">{q.title}</p>
                  <p className="text-xs text-muted">{q.companyName}</p>
                  {q.teacherComment && <p className="mt-1 text-xs text-muted">コメント: {q.teacherComment}</p>}
                </div>
                <ApprovalStatusBadge status={q.approvalStatus} />
              </div>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}

function EmptyState() {
  return (
    <div className="rounded-2xl border border-dashed border-border p-10 text-center text-sm text-muted">
      現在、承認待ちのクエストはありません。
    </div>
  );
}

function PendingQuestCard({
  quest,
  onDecide,
}: {
  quest: Quest;
  onDecide: (quest: Quest, status: "承認済み" | "差し戻し" | "却下", comment: string) => void;
}) {
  const [comment, setComment] = useState("");

  return (
    <Card className="border-warning/30">
      <CardHeader>
        <div className="mb-1 flex flex-wrap items-center gap-1.5">
          <DifficultyBadge difficulty={quest.difficulty} />
          <ApprovalStatusBadge status={quest.approvalStatus} />
          {quest.createdByCompany && <Badge variant="accent">企業フォームからの新規投稿</Badge>}
        </div>
        <CardTitle>{quest.title}</CardTitle>
        <p className="flex items-center gap-1 text-xs text-muted">
          <Building2 className="h-3.5 w-3.5" /> {quest.companyName} ・ {quest.industry}
        </p>
      </CardHeader>
      <CardContent className="flex flex-col gap-4 pt-0">
        <p className="text-sm text-foreground/90">{quest.background}</p>

        <div className="grid gap-3 sm:grid-cols-2">
          <InfoRow icon={Coins} label="報酬">
            {quest.rewardYen.toLocaleString()}円 / {quest.rewardXp} XP
          </InfoRow>
          <InfoRow icon={GraduationCap} label="推奨学年">
            {quest.recommendedGrade}
          </InfoRow>
          <InfoRow icon={Calendar} label="締切">
            {quest.deadline}
          </InfoRow>
          <InfoRow icon={Wrench} label="使用設備">
            {quest.equipment.join("、")}
          </InfoRow>
          <InfoRow icon={Lock} label="秘密保持の必要性">
            {quest.confidentialityNote ?? "特に記載なし"}
          </InfoRow>
        </div>

        <div>
          <p className="mb-1 text-xs font-semibold text-foreground/80">学生にとって学べること</p>
          <p className="rounded-lg border border-primary/30 bg-primary/5 p-3 text-sm text-foreground/90">
            {quest.learningOutcomes ?? "(未記入)"}
          </p>
        </div>

        <div>
          <p className="mb-1.5 flex items-center gap-1 text-xs font-semibold text-foreground/80">
            危険度ラベル・安全レベル
          </p>
          <div className="flex items-center gap-2 mb-1.5">
            <SafetyLevelMeter level={quest.safetyLevel} />
          </div>
          <div className="flex flex-wrap gap-1.5">
            {quest.safetyLabels.length > 0 ? (
              quest.safetyLabels.map((l) => <SafetyLabelBadge key={l} label={l} />)
            ) : (
              <span className="text-xs text-muted">特に危険度ラベルの指定なし</span>
            )}
          </div>
        </div>

        <div>
          <p className="mb-1 text-xs font-semibold text-foreground/80">安全面の注意事項</p>
          <ul className="list-inside list-disc text-sm text-foreground/90">
            {quest.cautions.map((c) => (
              <li key={c}>{c}</li>
            ))}
          </ul>
        </div>

        <div>
          <p className="mb-1 text-xs font-semibold text-foreground/80">教員コメント</p>
          <Textarea
            placeholder="差し戻し・却下の場合は理由を記入してください"
            value={comment}
            onChange={(e) => setComment(e.target.value)}
          />
        </div>

        <div className="flex flex-wrap justify-end gap-2 pt-1">
          <Button variant="danger" onClick={() => onDecide(quest, "却下", comment)}>
            <XCircle className="mr-1 h-4 w-4" /> 却下
          </Button>
          <Button variant="outline" onClick={() => onDecide(quest, "差し戻し", comment)}>
            <RotateCcw className="mr-1 h-4 w-4" /> 差し戻し
          </Button>
          <Button onClick={() => onDecide(quest, "承認済み", comment)}>
            <ShieldCheck className="mr-1 h-4 w-4" /> 承認する
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

function InfoRow({
  icon: Icon,
  label,
  children,
}: {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex items-start gap-2 rounded-lg border border-border bg-surface-2/50 px-3 py-2 text-sm">
      <Icon className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
      <div>
        <p className="text-[11px] text-muted">{label}</p>
        <p className="text-foreground/90">{children}</p>
      </div>
    </div>
  );
}
