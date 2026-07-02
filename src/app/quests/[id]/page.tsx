"use client";

import { useMemo, useState } from "react";
import { useParams, notFound } from "next/navigation";
import Link from "next/link";
import {
  Building2,
  CalendarClock,
  CheckCircle2,
  Coins,
  FileText,
  GraduationCap,
  ListChecks,
  Package,
  ShieldAlert,
  Sparkles,
  Star,
  Wrench,
} from "lucide-react";
import { useApp } from "@/lib/store";
import { materials, templates } from "@/lib/data";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogTrigger,
  DialogClose,
} from "@/components/ui/dialog";
import {
  ApprovalStatusBadge,
  DifficultyBadge,
  SafetyLabelBadge,
  SafetyLevelMeter,
} from "@/components/quests/quest-badges";
import { AdSlot } from "@/components/ad-slot";

export default function QuestDetailPage() {
  const params = useParams<{ id: string }>();
  const { allQuests, state, completeQuest } = useApp();
  const [note, setNote] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const quest = useMemo(() => allQuests.find((q) => q.id === params.id), [allQuests, params.id]);

  if (!quest) {
    notFound();
  }

  const alreadyCompleted = state.completedQuestIds.includes(quest.id);
  const challengeable = quest.approvalStatus === "承認済み";
  const template = quest.submissionTemplateId
    ? templates.find((t) => t.id === quest.submissionTemplateId)
    : undefined;
  const referenceMaterials = materials.filter((m) => quest.referenceMaterials.includes(m.id));

  function handleSubmit() {
    if (!quest) return;
    completeQuest(quest);
    setSubmitted(true);
  }

  return (
    <div className="mx-auto flex max-w-5xl flex-col gap-6">
      <div>
        <div className="mb-3 flex flex-wrap items-center gap-1.5">
          <DifficultyBadge difficulty={quest.difficulty} />
          <ApprovalStatusBadge status={quest.approvalStatus} />
          {quest.isTeamQuest && <Badge variant="outline">チームクエスト</Badge>}
          {(alreadyCompleted || submitted) && <Badge variant="success">完了済み</Badge>}
        </div>
        <h1 className="text-2xl font-extrabold text-foreground sm:text-3xl">{quest.title}</h1>
        <p className="mt-1 flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-muted">
          <span className="flex items-center gap-1">
            <Building2 className="h-4 w-4" /> {quest.companyName} ・ {quest.industry}
          </span>
          <span className="flex items-center gap-1">
            <Star className="h-4 w-4 text-warning" />
            企業評価 {quest.companyRatingAvg > 0 ? quest.companyRatingAvg.toFixed(1) : "―"}
            {quest.companyRatingCount > 0 && `(${quest.companyRatingCount}件)`}
          </span>
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="flex flex-col gap-6 lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-4 w-4 text-primary" /> 背景
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-0 text-sm leading-relaxed text-foreground/90">
              {quest.background}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <ListChecks className="h-4 w-4 text-primary" /> 依頼内容
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-0 text-sm leading-relaxed text-foreground/90">
              {quest.requestDetails}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Package className="h-4 w-4 text-primary" /> 成果物
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-0">
              <ul className="list-inside list-disc space-y-1 text-sm text-foreground/90">
                {quest.deliverables.map((d) => (
                  <li key={d}>{d}</li>
                ))}
              </ul>
            </CardContent>
          </Card>

          <div className="grid gap-6 sm:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-sm">
                  <GraduationCap className="h-4 w-4 text-primary" /> 必要な知識
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-0">
                <ul className="list-inside list-disc space-y-1 text-sm text-foreground/90">
                  {quest.requiredKnowledge.map((k) => (
                    <li key={k}>{k}</li>
                  ))}
                </ul>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-sm">
                  <Wrench className="h-4 w-4 text-primary" /> 使用する設備
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-0">
                <ul className="list-inside list-disc space-y-1 text-sm text-foreground/90">
                  {quest.equipment.map((k) => (
                    <li key={k}>{k}</li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          </div>

          <Card className="border-warning/40">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-warning">
                <ShieldAlert className="h-4 w-4" /> 注意事項・安全レベル
              </CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col gap-3 pt-0">
              <div className="flex items-center gap-2">
                <span className="text-xs text-muted">安全注意レベル</span>
                <SafetyLevelMeter level={quest.safetyLevel} />
              </div>
              <div className="flex flex-wrap gap-1.5">
                {quest.safetyLabels.map((l) => (
                  <SafetyLabelBadge key={l} label={l} />
                ))}
              </div>
              <ul className="list-inside list-disc space-y-1 text-sm text-foreground/90">
                {quest.cautions.map((c) => (
                  <li key={c}>{c}</li>
                ))}
              </ul>
              {quest.teacherComment && (
                <p className="rounded-lg border border-border-strong bg-surface-2 p-3 text-xs text-muted">
                  教員コメント: {quest.teacherComment}
                </p>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>評価基準</CardTitle>
            </CardHeader>
            <CardContent className="pt-0">
              <ul className="list-inside list-disc space-y-1 text-sm text-foreground/90">
                {quest.evaluationCriteria.map((c) => (
                  <li key={c}>{c}</li>
                ))}
              </ul>
            </CardContent>
          </Card>

          {referenceMaterials.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle>参考教材</CardTitle>
              </CardHeader>
              <CardContent className="flex flex-wrap gap-2 pt-0">
                {referenceMaterials.map((m) => (
                  <Link key={m.id} href={`/learning/${m.id}`}>
                    <Badge variant="default">{m.title}</Badge>
                  </Link>
                ))}
              </CardContent>
            </Card>
          )}

          <AdSlot seed={3} />
        </div>

        <div className="flex flex-col gap-6">
          <Card className="glow-primary border-primary/40">
            <CardContent className="flex flex-col gap-3 p-5">
              <div className="flex items-center justify-between">
                <span className="flex items-center gap-1 text-sm text-muted">
                  <Coins className="h-4 w-4 text-warning" /> 報酬
                </span>
                <span className="font-bold text-foreground">{quest.rewardYen.toLocaleString()}円</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="flex items-center gap-1 text-sm text-muted">
                  <Sparkles className="h-4 w-4 text-primary" /> 獲得経験値
                </span>
                <span className="font-bold text-primary">+{quest.rewardXp} XP</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="flex items-center gap-1 text-sm text-muted">
                  <CalendarClock className="h-4 w-4" /> 締切
                </span>
                <span className="text-foreground">{quest.deadline}</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted">推奨学年</span>
                <span className="text-foreground">{quest.recommendedGrade}</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted">リモート</span>
                <span className="text-foreground">{quest.remoteOk ? "可" : "不可(現地対応)"}</span>
              </div>
              <div className="flex flex-wrap gap-1.5 pt-1">
                {quest.requiredSkills.map((s) => (
                  <Badge key={s} variant="outline">
                    {s}
                  </Badge>
                ))}
              </div>

              {alreadyCompleted || submitted ? (
                <div className="mt-2 flex items-center gap-2 rounded-lg border border-success/40 bg-success/10 p-3 text-sm text-success">
                  <CheckCircle2 className="h-4 w-4" /> 提出済み・経験値を獲得しました
                </div>
              ) : (
                <SubmitDialog
                  disabled={!challengeable}
                  note={note}
                  setNote={setNote}
                  onSubmit={handleSubmit}
                  templateTitle={template?.title}
                />
              )}
              {!challengeable && !alreadyCompleted && (
                <p className="text-center text-xs text-warning">
                  このクエストはまだ教員承認待ちのため挑戦できません
                </p>
              )}
            </CardContent>
          </Card>

          {template && (
            <Card>
              <CardHeader>
                <CardTitle className="text-sm">提出テンプレート: {template.title}</CardTitle>
              </CardHeader>
              <CardContent className="flex flex-col gap-2 pt-0 text-xs text-muted">
                <p>{template.purpose}</p>
                <p className="font-semibold text-foreground/80">記入項目</p>
                <ul className="list-inside list-disc space-y-0.5">
                  {template.fields.map((f) => (
                    <li key={f}>{f}</li>
                  ))}
                </ul>
                <p className="mt-1">
                  <span className="font-semibold text-foreground/80">提出形式: </span>
                  {template.fileFormat}
                </p>
                <Link href="/templates" className="mt-1 text-primary hover:underline">
                  テンプレート一覧で詳しく見る →
                </Link>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}

function SubmitDialog({
  disabled,
  note,
  setNote,
  onSubmit,
  templateTitle,
}: {
  disabled: boolean;
  note: string;
  setNote: (v: string) => void;
  onSubmit: () => void;
  templateTitle?: string;
}) {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button className="mt-2 w-full" size="lg" disabled={disabled}>
          このクエストに挑戦する
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>成果物を提出する</DialogTitle>
          <DialogDescription>
            {templateTitle
              ? `「${templateTitle}」テンプレートに沿って作成した内容を要約して入力してください。`
              : "作成した成果物の概要を入力してください。"}
            (このプロトタイプではファイルアップロードの代わりにメモを保存します)
          </DialogDescription>
        </DialogHeader>
        <div className="flex flex-col gap-2">
          <Label htmlFor="submission-note">提出メモ</Label>
          <Textarea
            id="submission-note"
            placeholder="例: STEP形式でCADデータを作成しました。面取りはC0.5で仮設定しています。"
            value={note}
            onChange={(e) => setNote(e.target.value)}
          />
        </div>
        <div className="mt-4 flex justify-end gap-2">
          <DialogClose asChild>
            <Button variant="ghost">キャンセル</Button>
          </DialogClose>
          <DialogClose asChild>
            <Button onClick={onSubmit}>提出して経験値を獲得</Button>
          </DialogClose>
        </div>
      </DialogContent>
    </Dialog>
  );
}
