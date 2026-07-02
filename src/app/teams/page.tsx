"use client";

import { Users } from "lucide-react";
import { teamQuests } from "@/lib/data";
import { PageHeader } from "@/components/section-heading";
import { TeamQuestCard } from "@/components/teams/team-quest-card";
import { AdSlot } from "@/components/ad-slot";

export default function TeamsPage() {
  return (
    <div>
      <PageHeader
        eyebrow="多学科連携"
        title="チームクエスト"
        description="機械・電気・情報など複数学科の学生が力を合わせて挑む大型クエスト。一人では解けない課題をチームで攻略しよう。"
        action={
          <div className="flex items-center gap-1.5 rounded-full border border-accent/30 bg-accent/10 px-3 py-1.5 text-xs text-accent-2">
            <Users className="h-3.5 w-3.5" /> {teamQuests.length}件 募集中
          </div>
        }
      />

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {teamQuests.map((t, i) => (
          <div key={t.id} className="contents">
            <TeamQuestCard team={t} />
            {i === 2 && (
              <div className="sm:col-span-2 lg:col-span-3">
                <AdSlot seed={2} />
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
