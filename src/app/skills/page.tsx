"use client";

import { Network } from "lucide-react";
import { useApp } from "@/lib/store";
import { skills } from "@/lib/data";
import { getIcon } from "@/lib/icon-map";
import { PageHeader } from "@/components/section-heading";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import {
  MAX_SKILL_LEVEL,
  SKILL_XP_PER_LEVEL,
  skillLevelFromXp,
  skillProgressRatio,
} from "@/lib/level";
import type { SkillId } from "@/lib/types";

export default function SkillsPage() {
  const { state, allQuests } = useApp();

  const totalLevel = skills.reduce((sum, s) => sum + skillLevelFromXp(state.skillXp[s.id] ?? 0), 0);

  return (
    <div>
      <PageHeader
        eyebrow="ギルド技能"
        title="スキルツリー"
        description="クエスト完了や教材学習でスキル経験値が伸びます。10種のスキルを育てて一人前のエンジニアを目指そう。"
        action={
          <div className="flex items-center gap-1.5 rounded-full border border-accent/30 bg-accent/10 px-3 py-1.5 text-xs text-accent-2">
            <Network className="h-3.5 w-3.5" /> 合計スキルレベル {totalLevel}
          </div>
        }
      />

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {skills.map((skill) => {
          const xp = state.skillXp[skill.id as SkillId] ?? 0;
          const level = skillLevelFromXp(xp);
          const isMax = level >= MAX_SKILL_LEVEL;
          const ratio = skillProgressRatio(xp);
          const Icon = getIcon(skill.icon);
          const relatedQuestCount = allQuests.filter((q) => q.requiredSkills.includes(skill.id)).length;

          return (
            <Card key={skill.id} className="relative overflow-hidden">
              <div className="pointer-events-none absolute -right-8 -top-8 h-24 w-24 rounded-full bg-primary/10 blur-2xl" />
              <CardContent className="flex flex-col gap-3 p-5">
                <div className="flex items-center gap-3">
                  <div className="relative flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl border border-primary/30 bg-gradient-to-br from-primary/15 to-accent/15">
                    <Icon className="h-7 w-7 text-primary" />
                    <span className="absolute -bottom-1.5 -right-1.5 flex h-6 w-6 items-center justify-center rounded-full border border-border-strong bg-surface text-[11px] font-bold text-foreground">
                      {level}
                    </span>
                  </div>
                  <div>
                    <p className="font-bold text-foreground">{skill.name}</p>
                    <p className="text-xs text-muted">関連クエスト {relatedQuestCount}件</p>
                  </div>
                </div>
                <p className="text-xs leading-relaxed text-muted">{skill.description}</p>
                <div>
                  <div className="mb-1 flex items-center justify-between text-[11px] text-muted">
                    <span>Lv.{level}</span>
                    <span>{isMax ? "最大レベル" : `${xp % SKILL_XP_PER_LEVEL}/${SKILL_XP_PER_LEVEL}`}</span>
                  </div>
                  <Progress value={isMax ? 100 : ratio * 100} className="h-2" />
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
