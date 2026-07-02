"use client";

import { isValidElement, cloneElement, useId, useState } from "react";
import type { ReactElement } from "react";
import { useRouter } from "next/navigation";
import { Briefcase, CheckCircle2, Info } from "lucide-react";
import { useApp } from "@/lib/store";
import { skills } from "@/lib/data";
import { PageHeader } from "@/components/section-heading";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { Difficulty, Quest, QuestCategory, SafetyLabel } from "@/lib/types";

const skillOptions = skills.map((s) => s.id);
const safetyLabelOptions: SafetyLabel[] = [
  "リモートのみ",
  "学校設備使用",
  "現場訪問あり",
  "工具使用あり",
  "回転体あり",
  "高温部品あり",
  "高電圧注意",
  "薬品使用あり",
  "重量物あり",
  "教員立会い推奨",
];
const categoryOptions: QuestCategory[] = [
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

function splitLines(text: string): string[] {
  return text
    .split("\n")
    .map((s) => s.trim())
    .filter(Boolean);
}

export default function NewQuestPage() {
  const router = useRouter();
  const { addCompanyQuest } = useApp();
  const [done, setDone] = useState(false);

  const [form, setForm] = useState({
    title: "",
    companyName: "",
    industry: "",
    category: "改善提案" as QuestCategory,
    problem: "",
    workRequest: "",
    deliverables: "",
    usableData: "",
    confidentiality: "特に厳しい制限はない",
    skillIds: [] as string[],
    recommendedGrade: "3年以上",
    difficulty: "中級" as Difficulty,
    rewardYen: 10000,
    deadline: "",
    remoteOk: true,
    useSchoolFacility: false,
    teacherApprovalRequired: true,
    safetyNote: "",
    safetyLabels: [] as SafetyLabel[],
    isTeamQuest: false,
    learningOutcomes: "",
    submissionFormat: "",
    evaluationCriteria: "",
  });

  function update<K extends keyof typeof form>(key: K, value: (typeof form)[K]) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  function toggleFromArray<T>(arr: T[], value: T): T[] {
    return arr.includes(value) ? arr.filter((v) => v !== value) : [...arr, value];
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const id = `cq-${Date.now()}`;
    const cautions = [
      ...splitLines(form.safetyNote),
      form.usableData && `使用してよいデータ: ${form.usableData}`,
    ].filter((v): v is string => Boolean(v));

    const quest: Quest = {
      id,
      title: form.title || "(タイトル未設定の依頼)",
      companyName: form.companyName || "企業名未設定",
      industry: form.industry || "その他",
      difficulty: form.difficulty,
      recommendedGrade: form.recommendedGrade,
      requiredSkills: form.skillIds,
      rewardYen: Number(form.rewardYen) || 0,
      rewardXp: Math.max(50, Math.round((Number(form.rewardYen) || 0) / 40)),
      deadline: form.deadline || "未定",
      remoteOk: form.remoteOk,
      safetyLevel: form.safetyLabels.length >= 3 ? 4 : form.safetyLabels.length >= 1 ? 2 : 1,
      safetyLabels: form.useSchoolFacility
        ? Array.from(new Set([...form.safetyLabels, "学校設備使用" as SafetyLabel]))
        : form.safetyLabels,
      teacherApprovalRequired: form.teacherApprovalRequired,
      approvalStatus: "承認待ち",
      isTeamQuest: form.isTeamQuest,
      category: form.category,
      background: form.problem,
      requestDetails: form.workRequest,
      deliverables: [
        ...splitLines(form.deliverables),
        form.submissionFormat && `提出形式: ${form.submissionFormat}`,
      ].filter((v): v is string => Boolean(v)),
      requiredKnowledge: [],
      equipment: form.useSchoolFacility ? ["学校設備の利用を想定"] : ["特になし"],
      cautions: cautions.length > 0 ? cautions : ["特になし"],
      evaluationCriteria: splitLines(form.evaluationCriteria),
      referenceMaterials: [],
      companyRatingAvg: 0,
      companyRatingCount: 0,
      createdAt: new Date().toISOString().slice(0, 10),
      createdByCompany: true,
      learningOutcomes: form.learningOutcomes,
      confidentialityNote: form.confidentiality,
    };

    addCompanyQuest(quest);
    setDone(true);
  }

  if (done) {
    return (
      <div className="mx-auto flex max-w-xl flex-col items-center gap-4 rounded-2xl border border-success/40 bg-success/5 p-10 text-center">
        <CheckCircle2 className="h-12 w-12 text-success" />
        <h1 className="text-xl font-bold text-foreground">依頼を投稿しました</h1>
        <p className="text-sm text-muted">
          クエストは現在「教員承認待ち」の状態です。教員が安全性・妥当性を確認したのち、学生が挑戦できるようになります。
        </p>
        <div className="flex gap-2">
          <Button onClick={() => router.push("/quests")}>クエスト一覧を見る</Button>
          <Button variant="outline" onClick={() => router.push("/teacher")}>
            教員承認画面を見る
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-3xl">
      <PageHeader
        eyebrow="企業向け"
        title="技術課題を投稿する"
        description="テンプレートに沿って入力するだけで、高専生への「クエスト」として掲載されます。投稿後は教員が内容を確認してから公開されます。"
      />

      <div className="mb-6 flex items-start gap-2 rounded-xl border border-primary/30 bg-primary/5 p-4 text-xs text-muted">
        <Info className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
        <p>
          投稿されたクエストは初期状態で「教員承認待ち」となります。安全性・難易度・守秘義務の観点から教員が確認し、承認されたクエストのみ学生が挑戦できます。
        </p>
      </div>

      <form onSubmit={handleSubmit} className="flex flex-col gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Briefcase className="h-4 w-4 text-primary" /> 基本情報
            </CardTitle>
          </CardHeader>
          <CardContent className="grid gap-4 pt-0 sm:grid-cols-2">
            <Field label="依頼タイトル" required className="sm:col-span-2">
              <Input value={form.title} onChange={(e) => update("title", e.target.value)} placeholder="例: 古い図面を3D CAD化してほしい" required />
            </Field>
            <Field label="会社名" required>
              <Input value={form.companyName} onChange={(e) => update("companyName", e.target.value)} required />
            </Field>
            <Field label="業種" required>
              <Input value={form.industry} onChange={(e) => update("industry", e.target.value)} placeholder="例: 精密機械加工" required />
            </Field>
            <Field label="カテゴリ">
              <Select value={form.category} onValueChange={(v) => update("category", v as QuestCategory)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {categoryOptions.map((c) => (
                    <SelectItem key={c} value={c}>
                      {c}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </Field>
            <Field label="難易度">
              <Select value={form.difficulty} onValueChange={(v) => update("difficulty", v as Difficulty)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {(["初級", "中級", "上級", "最上級"] as Difficulty[]).map((d) => (
                    <SelectItem key={d} value={d}>
                      {d}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </Field>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>依頼の詳細</CardTitle>
          </CardHeader>
          <CardContent className="grid gap-4 pt-0">
            <Field label="困っていること" required>
              <Textarea value={form.problem} onChange={(e) => update("problem", e.target.value)} required />
            </Field>
            <Field label="依頼したい作業" required>
              <Textarea value={form.workRequest} onChange={(e) => update("workRequest", e.target.value)} required />
            </Field>
            <Field label="成果物(1行に1つ)">
              <Textarea
                value={form.deliverables}
                onChange={(e) => update("deliverables", e.target.value)}
                placeholder={"例:\n改善提案書\n3Dモデルデータ"}
              />
            </Field>
            <Field label="提出物の形式">
              <Input value={form.submissionFormat} onChange={(e) => update("submissionFormat", e.target.value)} placeholder="例: PDF、STEP形式など" />
            </Field>
            <Field label="評価基準(1行に1つ)">
              <Textarea value={form.evaluationCriteria} onChange={(e) => update("evaluationCriteria", e.target.value)} />
            </Field>
            <Field label="学生にとって学べること">
              <Textarea value={form.learningOutcomes} onChange={(e) => update("learningOutcomes", e.target.value)} />
            </Field>
            <Field label="使ってよいデータ">
              <Input value={form.usableData} onChange={(e) => update("usableData", e.target.value)} placeholder="例: サンプル図面PDF、社内マニュアル抜粋 など" />
            </Field>
            <Field label="秘密保持の必要性">
              <Input value={form.confidentiality} onChange={(e) => update("confidentiality", e.target.value)} placeholder="例: 社外秘データを含むため厳守" />
            </Field>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>必要スキル・条件</CardTitle>
          </CardHeader>
          <CardContent className="grid gap-4 pt-0">
            <Field label="必要スキル">
              <div className="flex flex-wrap gap-2">
                {skillOptions.map((s) => (
                  <button
                    type="button"
                    key={s}
                    onClick={() => update("skillIds", toggleFromArray(form.skillIds, s))}
                    className="cursor-pointer"
                  >
                    <Badge variant={form.skillIds.includes(s) ? "default" : "outline"}>{s}</Badge>
                  </button>
                ))}
              </div>
            </Field>
            <div className="grid gap-4 sm:grid-cols-2">
              <Field label="推奨学年">
                <Input value={form.recommendedGrade} onChange={(e) => update("recommendedGrade", e.target.value)} />
              </Field>
              <Field label="報酬(円)">
                <Input
                  type="number"
                  value={form.rewardYen}
                  onChange={(e) => update("rewardYen", Number(e.target.value))}
                  min={0}
                />
              </Field>
              <Field label="締切">
                <Input type="date" value={form.deadline} onChange={(e) => update("deadline", e.target.value)} />
              </Field>
            </div>
            <div className="flex flex-wrap gap-4 pt-1">
              <CheckboxField
                label="リモート可"
                checked={form.remoteOk}
                onChange={(v) => update("remoteOk", v)}
              />
              <CheckboxField
                label="学校設備の利用あり"
                checked={form.useSchoolFacility}
                onChange={(v) => update("useSchoolFacility", v)}
              />
              <CheckboxField
                label="教員確認が必要"
                checked={form.teacherApprovalRequired}
                onChange={(v) => update("teacherApprovalRequired", v)}
              />
              <CheckboxField
                label="チームクエストとして募集可能"
                checked={form.isTeamQuest}
                onChange={(v) => update("isTeamQuest", v)}
              />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>安全面について</CardTitle>
            <CardDescription>該当する危険度ラベルを選択してください(複数選択可)</CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col gap-4 pt-0">
            <div className="flex flex-wrap gap-2">
              {safetyLabelOptions.map((label) => (
                <button
                  type="button"
                  key={label}
                  onClick={() => update("safetyLabels", toggleFromArray(form.safetyLabels, label))}
                  className="cursor-pointer"
                >
                  <Badge variant={form.safetyLabels.includes(label) ? "warning" : "outline"}>{label}</Badge>
                </button>
              ))}
            </div>
            <Field label="安全面の注意(1行に1つ)">
              <Textarea value={form.safetyNote} onChange={(e) => update("safetyNote", e.target.value)} />
            </Field>
          </CardContent>
        </Card>

        <div className="flex justify-end gap-3">
          <Button type="submit" size="lg">
            この内容で投稿する(教員承認待ちになります)
          </Button>
        </div>
      </form>
    </div>
  );
}

function Field({
  label,
  required,
  children,
  className,
}: {
  label: string;
  required?: boolean;
  children: React.ReactNode;
  className?: string;
}) {
  const id = useId();
  const child = isValidElement(children)
    ? cloneElement(children as ReactElement<{ id?: string }>, { id })
    : children;
  return (
    <div className={className}>
      <Label htmlFor={id} className="mb-1.5 flex items-center gap-1">
        {label}
        {required && <span className="text-danger">*</span>}
      </Label>
      {child}
    </div>
  );
}

function CheckboxField({
  label,
  checked,
  onChange,
}: {
  label: string;
  checked: boolean;
  onChange: (v: boolean) => void;
}) {
  return (
    <label className="flex cursor-pointer items-center gap-2 text-sm text-foreground/90">
      <input
        type="checkbox"
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
        className="h-4 w-4 rounded border-border-strong accent-primary"
      />
      {label}
    </label>
  );
}
