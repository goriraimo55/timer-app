"use client";

import { useMemo, useState } from "react";
import { Building2, MessageSquareHeart, ShieldCheck, UserRound } from "lucide-react";
import { useApp } from "@/lib/store";
import { PageHeader, SectionHeading } from "@/components/section-heading";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { RatingRow, RatingStars } from "@/components/rating-stars";
import type { CompanyReview } from "@/lib/types";

const toCompanyLabels: Record<keyof CompanyReview["toCompany"], string> = {
  clarityOfRequest: "依頼内容の明確さ",
  responseSpeed: "質問への回答の早さ",
  rewardFairness: "報酬の妥当性",
  learningValue: "学びの多さ",
  safetyConsideration: "安全配慮",
  recommendation: "おすすめ度",
  comment: "コメント",
};

const toStudentLabels: Record<keyof CompanyReview["toStudent"], string> = {
  technicalUnderstanding: "技術理解",
  deadlineAdherence: "納期遵守",
  reportClarity: "報告のわかりやすさ",
  deliverableQuality: "成果物品質",
  wantToRehire: "再依頼したい度",
  comment: "コメント",
};

const emptyForm = {
  clarityOfRequest: 0,
  responseSpeed: 0,
  rewardFairness: 0,
  learningValue: 0,
  safetyConsideration: 0,
  recommendation: 0,
  comment: "",
};

export default function ReviewsPage() {
  const { state, allQuests, allReviews, addReview } = useApp();
  const [questId, setQuestId] = useState<string>("");
  const [form, setForm] = useState(emptyForm);
  const [submittedMsg, setSubmittedMsg] = useState(false);

  const reviewedTitles = useMemo(() => new Set(allReviews.map((r) => r.questTitle)), [allReviews]);

  const reviewableQuests = useMemo(
    () =>
      allQuests.filter(
        (q) => state.completedQuestIds.includes(q.id) && !reviewedTitles.has(q.title)
      ),
    [allQuests, state.completedQuestIds, reviewedTitles]
  );

  function handleSubmit() {
    const quest = allQuests.find((q) => q.id === questId);
    if (!quest || form.comment.trim() === "") return;
    const review: CompanyReview = {
      id: `custom-${Date.now()}`,
      questTitle: quest.title,
      companyName: quest.companyName,
      studentName: state.profileName,
      toStudent: {
        technicalUnderstanding: 0,
        deadlineAdherence: 0,
        reportClarity: 0,
        deliverableQuality: 0,
        wantToRehire: 0,
        comment: "",
      },
      toCompany: { ...form },
    };
    addReview(review);
    setForm(emptyForm);
    setQuestId("");
    setSubmittedMsg(true);
    setTimeout(() => setSubmittedMsg(false), 3000);
  }

  return (
    <div className="mx-auto max-w-4xl">
      <PageHeader
        eyebrow="ブラック案件防止"
        title="企業評価・学生評価"
        description="安心して挑戦できるよう、企業と学生が案件ごとにお互いを評価します。低評価が続く企業はギルドで注意喚起されます。"
      />

      {reviewableQuests.length > 0 && (
        <Card className="mb-8 border-primary/30">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MessageSquareHeart className="h-4 w-4 text-primary" /> 企業を評価する
            </CardTitle>
            <p className="text-xs text-muted">完了したクエストについて、依頼企業を評価しましょう。</p>
          </CardHeader>
          <CardContent className="flex flex-col gap-4 pt-0">
            <div>
              <Label className="mb-1.5 block">対象クエスト</Label>
              <Select value={questId} onValueChange={setQuestId}>
                <SelectTrigger>
                  <SelectValue placeholder="評価するクエストを選択" />
                </SelectTrigger>
                <SelectContent>
                  {reviewableQuests.map((q) => (
                    <SelectItem key={q.id} value={q.id}>
                      {q.title}({q.companyName})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {questId && (
              <>
                <div className="grid gap-3 sm:grid-cols-2">
                  {(Object.keys(toCompanyLabels) as (keyof typeof toCompanyLabels)[])
                    .filter((k) => k !== "comment")
                    .map((key) => (
                      <div key={key} className="flex items-center justify-between rounded-lg border border-border px-3 py-2">
                        <span className="text-sm text-foreground/90">{toCompanyLabels[key]}</span>
                        <RatingStars
                          value={form[key as keyof typeof form] as number}
                          onChange={(v) => setForm((f) => ({ ...f, [key]: v }))}
                          size="md"
                        />
                      </div>
                    ))}
                </div>
                <div>
                  <Label className="mb-1.5 block">コメント</Label>
                  <Textarea
                    value={form.comment}
                    onChange={(e) => setForm((f) => ({ ...f, comment: e.target.value }))}
                    placeholder="依頼内容の分かりやすさや、対応の様子などを記入してください"
                  />
                </div>
                <div className="flex justify-end">
                  <Button onClick={handleSubmit}>評価を投稿する</Button>
                </div>
              </>
            )}
            {submittedMsg && (
              <p className="rounded-lg border border-success/40 bg-success/10 p-2 text-center text-xs text-success">
                評価を投稿しました。ありがとうございます!
              </p>
            )}
          </CardContent>
        </Card>
      )}

      <SectionHeading icon={ShieldCheck} title="評価一覧" description="これまでの案件に対する相互評価" />
      <div className="flex flex-col gap-4">
        {allReviews.map((r) => (
          <Card key={r.id}>
            <CardHeader className="pb-2">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <CardTitle className="text-sm">{r.questTitle}</CardTitle>
                <Badge variant="outline">{r.companyName}</Badge>
              </div>
            </CardHeader>
            <CardContent className="grid gap-4 pt-0 sm:grid-cols-2">
              <div className="rounded-lg border border-border bg-surface-2/50 p-3">
                <p className="mb-2 flex items-center gap-1 text-xs font-semibold text-foreground/80">
                  <Building2 className="h-3.5 w-3.5" /> 企業 → 学生({r.studentName})
                </p>
                {r.toStudent.comment ? (
                  <>
                    <div className="flex flex-col gap-1">
                      {(Object.keys(toStudentLabels) as (keyof typeof toStudentLabels)[])
                        .filter((k) => k !== "comment")
                        .map((k) => (
                          <RatingRow key={k} label={toStudentLabels[k]} value={r.toStudent[k] as number} />
                        ))}
                    </div>
                    <p className="mt-2 text-xs text-foreground/90">{r.toStudent.comment}</p>
                  </>
                ) : (
                  <p className="text-xs text-muted">企業からの評価は現在受付中です(評価待ち)</p>
                )}
              </div>
              <div className="rounded-lg border border-border bg-surface-2/50 p-3">
                <p className="mb-2 flex items-center gap-1 text-xs font-semibold text-foreground/80">
                  <UserRound className="h-3.5 w-3.5" /> 学生 → 企業
                </p>
                {r.toCompany.comment ? (
                  <>
                    <div className="flex flex-col gap-1">
                      {(Object.keys(toCompanyLabels) as (keyof typeof toCompanyLabels)[])
                        .filter((k) => k !== "comment")
                        .map((k) => (
                          <RatingRow key={k} label={toCompanyLabels[k]} value={r.toCompany[k] as number} />
                        ))}
                    </div>
                    <p className="mt-2 text-xs text-foreground/90">{r.toCompany.comment}</p>
                  </>
                ) : (
                  <p className="text-xs text-muted">学生からの評価はまだありません</p>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
