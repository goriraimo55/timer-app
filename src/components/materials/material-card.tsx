import Link from "next/link";
import { Clock, Sparkles, CheckCircle2 } from "lucide-react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { DifficultyBadge } from "@/components/quests/quest-badges";
import type { Material } from "@/lib/types";

export function MaterialCard({ material, completed = false }: { material: Material; completed?: boolean }) {
  return (
    <Card className="flex flex-col transition-transform hover:-translate-y-0.5 hover:border-primary/40">
      <CardHeader className="pb-2">
        <div className="flex flex-wrap items-center gap-1.5">
          <Badge variant="outline">{material.category}</Badge>
          <DifficultyBadge difficulty={material.difficulty} />
          {completed && (
            <Badge variant="success" className="gap-1">
              <CheckCircle2 className="h-3 w-3" /> 修了済み
            </Badge>
          )}
        </div>
        <Link href={`/learning/detail?id=${material.id}`} className="mt-1 block">
          <h3 className="text-base font-bold leading-snug text-foreground hover:text-primary">
            {material.title}
          </h3>
        </Link>
      </CardHeader>
      <CardContent className="flex flex-1 flex-col gap-3 pt-0">
        <p className="line-clamp-3 text-xs text-muted">{material.summary}</p>
        <div className="flex items-center justify-between text-xs text-muted">
          <span className="flex items-center gap-1">
            <Clock className="h-3.5 w-3.5" /> 約{material.studyMinutes}分
          </span>
          <span className="flex items-center gap-1 text-primary">
            <Sparkles className="h-3.5 w-3.5" /> +{material.rewardXp} XP
          </span>
        </div>
        <Button asChild size="sm" variant={completed ? "outline" : "default"} className="mt-auto">
          <Link href={`/learning/detail?id=${material.id}`}>{completed ? "復習する" : "学習を始める"}</Link>
        </Button>
      </CardContent>
    </Card>
  );
}
