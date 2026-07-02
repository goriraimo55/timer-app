"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import {
  Award,
  BookOpen,
  Briefcase,
  Building2,
  CheckCircle2,
  Medal,
  Pencil,
  Sparkles,
  Star,
  Swords,
  Trophy,
} from "lucide-react";
import { useApp } from "@/lib/store";
import { badges as badgeDefs, materials, skills } from "@/lib/data";
import { getIcon } from "@/lib/icon-map";
import { titleForLevel, skillLevelFromXp } from "@/lib/level";
import { PageHeader } from "@/components/section-heading";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import type { SkillId } from "@/lib/types";

export default function ProfilePage() {
  const { state, level, allQuests, earnedBadgeIds, allReviews, updateProfile } = useApp();
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState({
    profileName: state.profileName,
    department: state.department,
    grade: state.grade,
  });

  const completedQuests = useMemo(
    () => allQuests.filter((q) => state.completedQuestIds.includes(q.id)),
    [allQuests, state.completedQuestIds]
  );
  const completedMaterials = useMemo(
    () => materials.filter((m) => state.completedMaterialIds.includes(m.id)),
    [state.completedMaterialIds]
  );

  const topSkills = useMemo(
    () =>
      [...skills]
        .sort((a, b) => (state.skillXp[b.id] ?? 0) - (state.skillXp[a.id] ?? 0))
        .slice(0, 4),
    [state.skillXp]
  );

  const myReviews = useMemo(
    () => allReviews.filter((r) => r.studentName === state.profileName),
    [allReviews, state.profileName]
  );

  const avgToStudent = average(
    myReviews.flatMap((r) => Object.values(r.toStudent).filter((v): v is number => typeof v === "number"))
  );
  const avgToCompanyGiven = average(
    myReviews.flatMap((r) => Object.values(r.toCompany).filter((v): v is number => typeof v === "number"))
  );

  function saveProfile() {
    updateProfile(draft);
    setEditing(false);
  }

  return (
    <div className="mx-auto flex max-w-5xl flex-col gap-6">
      <PageHeader
        eyebrow="ポートフォリオ"
        title="プロフィール"
        description="これまでの実績が自動でポートフォリオとして蓄積されます。就活・インターンでもそのまま提示できます。"
        action={
          <Button asChild variant="accent">
            <Link href="/certificate">
              <Award className="mr-1 h-4 w-4" /> スキル証明書を発行する
            </Link>
          </Button>
        }
      />

      <Card className="glow-primary border-primary/30">
        <CardContent className="flex flex-col gap-4 p-6 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-4">
            <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-primary to-accent text-2xl font-extrabold text-[#04121a]">
              {level}
            </div>
            {editing ? (
              <div className="flex flex-col gap-2">
                <Input
                  value={draft.profileName}
                  onChange={(e) => setDraft((d) => ({ ...d, profileName: e.target.value }))}
                  className="h-8 w-40"
                />
                <div className="flex gap-2">
                  <Input
                    value={draft.department}
                    onChange={(e) => setDraft((d) => ({ ...d, department: e.target.value }))}
                    className="h-8 w-32"
                  />
                  <Input
                    value={draft.grade}
                    onChange={(e) => setDraft((d) => ({ ...d, grade: e.target.value }))}
                    className="h-8 w-20"
                  />
                </div>
                <Button size="sm" onClick={saveProfile}>
                  保存
                </Button>
              </div>
            ) : (
              <div>
                <p className="flex items-center gap-2 text-lg font-bold text-foreground">
                  {state.profileName}
                  <button onClick={() => setEditing(true)} className="text-muted hover:text-primary cursor-pointer">
                    <Pencil className="h-3.5 w-3.5" />
                  </button>
                </p>
                <p className="text-sm text-muted">
                  {state.department} ・ {state.grade}
                </p>
                <p className="mt-1 flex items-center gap-1 text-xs text-accent-2">
                  <Trophy className="h-3.5 w-3.5" /> 称号: {titleForLevel(level)}
                </p>
              </div>
            )}
          </div>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
            <StatTile icon={Sparkles} value={state.xp.toLocaleString()} label="総経験値" />
            <StatTile icon={Swords} value={`${completedQuests.length}`} label="完了クエスト" />
            <StatTile icon={BookOpen} value={`${completedMaterials.length}`} label="学習済み教材" />
            <StatTile icon={Medal} value={`${earnedBadgeIds.length}`} label="獲得バッジ" />
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-6 lg:grid-cols-3">
        <Card className="lg:col-span-1">
          <CardHeader>
            <CardTitle>得意スキル</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col gap-3 pt-0">
            {topSkills.map((s) => {
              const Icon = getIcon(s.icon);
              const lv = skillLevelFromXp(state.skillXp[s.id as SkillId] ?? 0);
              return (
                <div key={s.id} className="flex items-center gap-3 rounded-lg border border-border bg-surface-2/60 px-3 py-2">
                  <Icon className="h-4 w-4 text-primary" />
                  <span className="flex-1 text-sm text-foreground">{s.name}</span>
                  <Badge variant="default">Lv.{lv}</Badge>
                </div>
              );
            })}
            <Link href="/skills" className="text-center text-xs text-primary hover:underline">
              スキルツリーを全て見る →
            </Link>
          </CardContent>
        </Card>

        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>獲得バッジ</CardTitle>
          </CardHeader>
          <CardContent className="grid grid-cols-3 gap-3 pt-0 sm:grid-cols-5">
            {badgeDefs.map((b) => {
              const earned = earnedBadgeIds.includes(b.id);
              const Icon = getIcon(b.icon);
              return (
                <div
                  key={b.id}
                  title={`${b.name}: ${b.condition}`}
                  className={`flex flex-col items-center gap-1 rounded-xl border p-2.5 text-center ${
                    earned ? "border-primary/40 bg-primary/10 text-primary" : "border-border bg-surface-2 text-muted opacity-50"
                  }`}
                >
                  <Icon className="h-5 w-5" />
                  <span className="text-[10px] leading-tight">{b.name}</span>
                </div>
              );
            })}
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Star className="h-4 w-4 text-warning" /> 企業からの評価(平均 {avgToStudent > 0 ? avgToStudent.toFixed(1) : "―"})
            </CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col gap-3 pt-0">
            {myReviews.length === 0 && <p className="text-sm text-muted">まだ企業からの評価はありません。</p>}
            {myReviews.map((r) => (
              <div key={r.id} className="rounded-lg border border-border bg-surface-2/60 p-3">
                <p className="flex items-center gap-1 text-xs text-muted">
                  <Building2 className="h-3.5 w-3.5" /> {r.companyName} ・ {r.questTitle}
                </p>
                <p className="mt-1 text-sm text-foreground/90">{r.toStudent.comment}</p>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Briefcase className="h-4 w-4 text-primary" /> あなたが企業につけた評価(平均 {avgToCompanyGiven > 0 ? avgToCompanyGiven.toFixed(1) : "―"})
            </CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col gap-3 pt-0">
            {myReviews.length === 0 && <p className="text-sm text-muted">まだ企業への評価はありません。</p>}
            {myReviews.map((r) => (
              <div key={r.id} className="rounded-lg border border-border bg-surface-2/60 p-3">
                <p className="flex items-center gap-1 text-xs text-muted">
                  <Building2 className="h-3.5 w-3.5" /> {r.companyName}
                </p>
                <p className="mt-1 text-sm text-foreground/90">{r.toCompany.comment}</p>
              </div>
            ))}
            <Link href="/reviews" className="text-center text-xs text-primary hover:underline">
              相互評価ページを見る →
            </Link>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>ポートフォリオ実績一覧</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col gap-2 pt-0">
          {completedQuests.length === 0 && completedMaterials.length === 0 && (
            <p className="text-sm text-muted">まだ実績がありません。クエストに挑戦して実績を増やそう。</p>
          )}
          {completedQuests.map((q) => (
            <div key={q.id} className="flex items-center justify-between rounded-lg border border-border px-3 py-2">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-success" />
                <div>
                  <p className="text-sm font-medium text-foreground">{q.title}</p>
                  <p className="text-xs text-muted">{q.companyName}</p>
                </div>
              </div>
              <Badge variant="default">+{q.rewardXp} XP</Badge>
            </div>
          ))}
          {completedMaterials.map((m) => (
            <div key={m.id} className="flex items-center justify-between rounded-lg border border-border px-3 py-2">
              <div className="flex items-center gap-2">
                <BookOpen className="h-4 w-4 text-primary" />
                <div>
                  <p className="text-sm font-medium text-foreground">{m.title}</p>
                  <p className="text-xs text-muted">{m.category}教材</p>
                </div>
              </div>
              <Badge variant="outline">+{m.rewardXp} XP</Badge>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}

function average(values: number[]): number {
  if (values.length === 0) return 0;
  return values.reduce((a, b) => a + b, 0) / values.length;
}

function StatTile({
  icon: Icon,
  value,
  label,
}: {
  icon: React.ComponentType<{ className?: string }>;
  value: string;
  label: string;
}) {
  return (
    <div className="flex flex-col items-center justify-center gap-1 rounded-xl border border-border bg-surface-2/70 px-3 py-3 text-center">
      <Icon className="h-4 w-4 text-primary" />
      <span className="text-base font-extrabold text-foreground">{value}</span>
      <span className="text-[10px] text-muted">{label}</span>
    </div>
  );
}
