import Link from "next/link";
import { Building2, CalendarClock, Coins, Sparkles, Users } from "lucide-react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { DifficultyBadge } from "@/components/quests/quest-badges";
import type { TeamQuest } from "@/lib/types";

export function TeamQuestCard({ team }: { team: TeamQuest }) {
  const filledRatio = Math.min(1, team.currentMembers.length / team.recruitCount);

  return (
    <Card className="flex flex-col transition-transform hover:-translate-y-0.5 hover:border-accent/40">
      <CardHeader className="pb-2">
        <div className="flex flex-wrap items-center gap-1.5">
          <DifficultyBadge difficulty={team.difficulty} />
          <Badge variant="accent" className="gap-1">
            <Users className="h-3 w-3" /> チームクエスト
          </Badge>
        </div>
        <Link href={`/teams/${team.id}`} className="mt-1 block">
          <h3 className="text-base font-bold leading-snug text-foreground hover:text-primary">{team.title}</h3>
        </Link>
        <p className="flex items-center gap-1 text-xs text-muted">
          <Building2 className="h-3.5 w-3.5" /> {team.companyName}
        </p>
      </CardHeader>
      <CardContent className="flex flex-1 flex-col gap-3 pt-0">
        <p className="line-clamp-2 text-xs text-muted">{team.description}</p>
        <div className="flex flex-wrap gap-1.5">
          {team.recruitingRoles.map((r) => (
            <Badge key={r} variant="outline">
              {r}
            </Badge>
          ))}
        </div>
        <div>
          <div className="mb-1 flex items-center justify-between text-[11px] text-muted">
            <span>メンバー {team.currentMembers.length}/{team.recruitCount}人</span>
            <span>{team.deadline}</span>
          </div>
          <Progress value={filledRatio * 100} className="h-1.5" />
        </div>
        <div className="flex items-center justify-between text-xs text-muted">
          <span className="flex items-center gap-1">
            <Coins className="h-3.5 w-3.5 text-warning" /> {team.rewardYen.toLocaleString()}円
          </span>
          <span className="flex items-center gap-1">
            <Sparkles className="h-3.5 w-3.5 text-primary" /> {team.rewardXp} XP
          </span>
          <span className="flex items-center gap-1">
            <CalendarClock className="h-3.5 w-3.5" /> 〆{team.deadline}
          </span>
        </div>
        <Button asChild size="sm" className="mt-auto">
          <Link href={`/teams/${team.id}`}>詳細・参加申請</Link>
        </Button>
      </CardContent>
    </Card>
  );
}
