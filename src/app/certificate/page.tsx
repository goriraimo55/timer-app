"use client";

import { useMemo } from "react";
import { Award, Compass, Printer } from "lucide-react";
import { useApp } from "@/lib/store";
import { badges as badgeDefs, materials, skills } from "@/lib/data";
import { getIcon } from "@/lib/icon-map";
import { titleForLevel, skillLevelFromXp } from "@/lib/level";
import { PageHeader } from "@/components/section-heading";
import { Button } from "@/components/ui/button";
import type { SkillId } from "@/lib/types";

export default function CertificatePage() {
  const { state, level, allQuests, earnedBadgeIds, allReviews } = useApp();

  const completedQuests = useMemo(
    () => allQuests.filter((q) => state.completedQuestIds.includes(q.id)),
    [allQuests, state.completedQuestIds]
  );
  const completedMaterials = materials.filter((m) => state.completedMaterialIds.includes(m.id));
  const approvedCompleted = completedQuests.filter((q) => q.teacherApprovalRequired);

  const topSkills = useMemo(
    () =>
      [...skills]
        .sort((a, b) => (state.skillXp[b.id] ?? 0) - (state.skillXp[a.id] ?? 0))
        .slice(0, 5),
    [state.skillXp]
  );

  const myReviews = allReviews.filter((r) => r.studentName === state.profileName && r.toStudent.comment);
  const avgCompanyRating =
    myReviews.length > 0
      ? myReviews.reduce((sum, r) => {
          const vals = Object.values(r.toStudent).filter((v): v is number => typeof v === "number");
          return sum + vals.reduce((a, b) => a + b, 0) / vals.length;
        }, 0) / myReviews.length
      : 0;

  const issuedDate = new Date().toLocaleDateString("ja-JP", { year: "numeric", month: "long", day: "numeric" });

  return (
    <div className="mx-auto max-w-3xl">
      <div className="no-print">
        <PageHeader
          eyebrow="就活・インターン用"
          title="スキル証明書"
          description="ここまでの実績をもとに、就職活動やインターン応募で使えるスキル証明書を発行できます。"
          action={
            <Button size="lg" onClick={() => window.print()}>
              <Printer className="mr-1.5 h-4 w-4" /> PDF出力(印刷)する
            </Button>
          }
        />
      </div>

      <div
        id="certificate"
        className="rounded-2xl border-2 border-primary/40 bg-gradient-to-br from-surface to-surface-2 p-8 sm:p-10 print:border print:border-black print:bg-white print:text-black"
      >
        <div className="mb-6 flex items-center justify-between border-b border-border pb-5 print:border-black">
          <div className="flex items-center gap-2">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-primary to-accent print:bg-none print:border print:border-black">
              <Compass className="h-5 w-5 text-[#04121a] print:text-black" />
            </div>
            <div>
              <p className="text-sm font-bold text-gradient print:text-black">技術者ギルド</p>
              <p className="text-[11px] text-muted print:text-black">Kosen Quest Platform</p>
            </div>
          </div>
          <div className="text-right text-xs text-muted print:text-black">
            <p>発行日: {issuedDate}</p>
            <p>証明書番号: CERT-{state.profileName.length}{state.xp}</p>
          </div>
        </div>

        <div className="mb-6 text-center">
          <p className="flex items-center justify-center gap-2 text-sm font-semibold uppercase tracking-widest text-primary print:text-black">
            <Award className="h-5 w-5" /> Skill Certificate
          </p>
          <h1 className="mt-2 text-3xl font-extrabold text-foreground print:text-black">{state.profileName}</h1>
          <p className="mt-1 text-sm text-muted print:text-black">
            {state.department} ・ {state.grade} ・ 称号「{titleForLevel(level)}」
          </p>
        </div>

        <div className="mb-6 grid grid-cols-2 gap-3 sm:grid-cols-4">
          <CertStat label="レベル" value={`Lv.${level}`} />
          <CertStat label="総経験値" value={`${state.xp.toLocaleString()} XP`} />
          <CertStat label="完了クエスト" value={`${completedQuests.length}件`} />
          <CertStat label="学習済み教材" value={`${completedMaterials.length}件`} />
        </div>

        <div className="mb-6">
          <h2 className="mb-2 text-sm font-bold text-foreground print:text-black">得意スキル</h2>
          <div className="flex flex-wrap gap-2">
            {topSkills.map((s) => {
              const Icon = getIcon(s.icon);
              const lv = skillLevelFromXp(state.skillXp[s.id as SkillId] ?? 0);
              return (
                <span
                  key={s.id}
                  className="flex items-center gap-1 rounded-full border border-primary/30 bg-primary/10 px-3 py-1 text-xs text-primary print:border-black print:bg-white print:text-black"
                >
                  <Icon className="h-3.5 w-3.5" /> {s.name} Lv.{lv}
                </span>
              );
            })}
          </div>
        </div>

        <div className="mb-6">
          <h2 className="mb-2 text-sm font-bold text-foreground print:text-black">獲得バッジ({earnedBadgeIds.length}個)</h2>
          <div className="flex flex-wrap gap-2">
            {earnedBadgeIds.length === 0 && <p className="text-xs text-muted print:text-black">まだバッジがありません</p>}
            {earnedBadgeIds.map((id) => {
              const badge = badgeDefs.find((b) => b.id === id);
              return (
                <span
                  key={id}
                  className="rounded-full border border-accent/30 bg-accent/10 px-3 py-1 text-xs text-accent-2 print:border-black print:bg-white print:text-black"
                >
                  {badge?.name ?? id}
                </span>
              );
            })}
          </div>
        </div>

        <div className="mb-6">
          <h2 className="mb-2 text-sm font-bold text-foreground print:text-black">代表的な成果物(教員承認済み実績)</h2>
          {approvedCompleted.length === 0 ? (
            <p className="text-xs text-muted print:text-black">承認済みクエストの完了実績はまだありません</p>
          ) : (
            <ul className="list-inside list-disc space-y-1 text-sm text-foreground/90 print:text-black">
              {approvedCompleted.map((q) => (
                <li key={q.id}>
                  {q.title}({q.companyName})
                </li>
              ))}
            </ul>
          )}
        </div>

        <div className="grid grid-cols-2 gap-3 border-t border-border pt-5 print:border-black">
          <CertStat label="企業評価平均" value={avgCompanyRating > 0 ? `${avgCompanyRating.toFixed(1)} / 5.0` : "評価受付中"} />
          <CertStat label="教員承認済み実績数" value={`${approvedCompleted.length}件`} />
        </div>

        <p className="mt-6 text-center text-[11px] text-muted print:text-black">
          この証明書は「技術者ギルド」プラットフォーム上での学習・クエスト実績にもとづき自動生成されたものです。
        </p>
      </div>
    </div>
  );
}

function CertStat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl border border-border bg-surface-2/60 p-3 text-center print:border-black print:bg-white">
      <p className="text-lg font-extrabold text-foreground print:text-black">{value}</p>
      <p className="text-[11px] text-muted print:text-black">{label}</p>
    </div>
  );
}
