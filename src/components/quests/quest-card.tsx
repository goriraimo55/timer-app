import Link from "next/link";
import { Building2, CalendarClock, Coins, Gem, Sparkles, Users, Wifi, WifiOff } from "lucide-react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  ApprovalStatusBadge,
  DifficultyBadge,
  SafetyLevelMeter,
} from "@/components/quests/quest-badges";
import type { Quest } from "@/lib/types";

export function QuestCard({ quest, completed = false }: { quest: Quest; completed?: boolean }) {
  const challengeable = quest.approvalStatus === "承認済み";

  return (
    <Card className="flex flex-col transition-transform hover:-translate-y-0.5 hover:border-primary/40">
      <CardHeader className="pb-2">
        <div className="flex flex-wrap items-center gap-1.5">
          <DifficultyBadge difficulty={quest.difficulty} />
          <ApprovalStatusBadge status={quest.approvalStatus} />
          {quest.isRare && (
            <Badge variant="accent" className="gap-1">
              <Gem className="h-3 w-3" /> レアクエスト
            </Badge>
          )}
          {quest.isDaily && (
            <Badge variant="default" className="gap-1">
              <Sparkles className="h-3 w-3" /> デイリー
            </Badge>
          )}
          {quest.isTeamQuest && (
            <Badge variant="outline" className="gap-1">
              <Users className="h-3 w-3" /> チーム
            </Badge>
          )}
          {completed && <Badge variant="success">完了済み</Badge>}
        </div>
        <Link href={`/quests/detail?id=${quest.id}`} className="mt-1 block">
          <h3 className="text-base font-bold leading-snug text-foreground hover:text-primary">
            {quest.title}
          </h3>
        </Link>
        <p className="flex items-center gap-1 text-xs text-muted">
          <Building2 className="h-3.5 w-3.5" /> {quest.companyName}
        </p>
      </CardHeader>
      <CardContent className="flex flex-1 flex-col gap-3 pt-0">
        <div className="flex flex-wrap gap-1.5">
          {quest.requiredSkills.slice(0, 4).map((s) => (
            <Badge key={s} variant="outline">
              {s}
            </Badge>
          ))}
        </div>

        <div className="grid grid-cols-2 gap-2 text-xs text-muted">
          <span className="flex items-center gap-1">
            <Coins className="h-3.5 w-3.5 text-warning" /> {quest.rewardYen.toLocaleString()}円
          </span>
          <span className="flex items-center gap-1">
            <Sparkles className="h-3.5 w-3.5 text-primary" /> {quest.rewardXp} XP
          </span>
          <span className="flex items-center gap-1">
            <CalendarClock className="h-3.5 w-3.5" /> 〆{quest.deadline}
          </span>
          <span className="flex items-center gap-1">
            {quest.remoteOk ? <Wifi className="h-3.5 w-3.5 text-success" /> : <WifiOff className="h-3.5 w-3.5" />}
            {quest.remoteOk ? "リモート可" : "現地対応"}
          </span>
        </div>

        <div className="flex items-center justify-between pt-1">
          <SafetyLevelMeter level={quest.safetyLevel} />
          <Button asChild size="sm" variant={challengeable ? "default" : "outline"}>
            <Link href={`/quests/detail?id=${quest.id}`}>{challengeable ? "挑戦する" : "詳細を見る"}</Link>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
