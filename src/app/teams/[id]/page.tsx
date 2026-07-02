"use client";

import { useMemo, useState } from "react";
import { useParams } from "next/navigation";
import {
  Building2,
  CalendarClock,
  CheckCircle2,
  Coins,
  Sparkles,
  UserPlus,
  Users,
} from "lucide-react";
import { useApp } from "@/lib/store";
import { teamQuests } from "@/lib/data";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { DifficultyBadge, SafetyLabelBadge } from "@/components/quests/quest-badges";
import type { TeamRole } from "@/lib/types";

export default function TeamQuestDetailPage() {
  const params = useParams<{ id: string }>();
  const { state, applyToTeamQuest } = useApp();
  const [role, setRole] = useState<TeamRole | "">("");
  const [applied, setApplied] = useState(false);

  const team = useMemo(() => teamQuests.find((t) => t.id === params.id), [params.id]);

  const myApplications = useMemo(
    () => state.teamApplications.filter((a) => a.teamQuestId === params.id),
    [state.teamApplications, params.id]
  );

  if (!team) {
    return (
      <div className="rounded-2xl border border-dashed border-border p-10 text-center text-sm text-muted">
        チームクエストが見つかりませんでした。
      </div>
    );
  }

  const allMembers = [
    ...team.currentMembers,
    ...myApplications.map((a) => ({ name: a.name, role: a.role, department: state.department })),
  ];

  function handleApply() {
    if (!role || !team) return;
    applyToTeamQuest(team.id, state.profileName, role);
    setApplied(true);
  }

  return (
    <div className="mx-auto flex max-w-4xl flex-col gap-6">
      <div>
        <div className="mb-2 flex flex-wrap items-center gap-1.5">
          <DifficultyBadge difficulty={team.difficulty} />
          <Badge variant="accent" className="gap-1">
            <Users className="h-3 w-3" /> チームクエスト
          </Badge>
        </div>
        <h1 className="text-2xl font-extrabold text-foreground sm:text-3xl">{team.title}</h1>
        <p className="mt-1 flex items-center gap-1 text-sm text-muted">
          <Building2 className="h-4 w-4" /> {team.companyName}
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="flex flex-col gap-6 lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>依頼内容</CardTitle>
            </CardHeader>
            <CardContent className="pt-0 text-sm leading-relaxed text-foreground/90">{team.description}</CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>募集中の役割・必要スキル</CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col gap-3 pt-0">
              <div className="flex flex-wrap gap-1.5">
                {team.recruitingRoles.map((r) => (
                  <Badge key={r} variant="default">
                    {r}
                  </Badge>
                ))}
              </div>
              <div className="flex flex-wrap gap-1.5">
                {team.requiredSkills.map((s) => (
                  <Badge key={s} variant="outline">
                    {s}
                  </Badge>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>現在の参加メンバー({allMembers.length}/{team.recruitCount}人)</CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col gap-2 pt-0">
              {allMembers.map((m, i) => (
                <div key={i} className="flex items-center justify-between rounded-lg border border-border px-3 py-2 text-sm">
                  <span className="text-foreground">{m.name}</span>
                  <div className="flex items-center gap-2 text-xs text-muted">
                    <span>{m.department}</span>
                    <Badge variant="outline">{m.role}</Badge>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          <Card className="border-warning/40">
            <CardHeader>
              <CardTitle className="text-warning">安全面</CardTitle>
            </CardHeader>
            <CardContent className="flex flex-wrap gap-1.5 pt-0">
              {team.safetyLabels.map((l) => (
                <SafetyLabelBadge key={l} label={l} />
              ))}
            </CardContent>
          </Card>
        </div>

        <div className="flex flex-col gap-6">
          <Card className="glow-accent border-accent/40">
            <CardContent className="flex flex-col gap-3 p-5">
              <div className="flex items-center justify-between">
                <span className="flex items-center gap-1 text-sm text-muted">
                  <Coins className="h-4 w-4 text-warning" /> チーム報酬
                </span>
                <span className="font-bold text-foreground">{team.rewardYen.toLocaleString()}円</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="flex items-center gap-1 text-sm text-muted">
                  <Sparkles className="h-4 w-4 text-primary" /> チーム経験値
                </span>
                <span className="font-bold text-primary">+{team.rewardXp} XP</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="flex items-center gap-1 text-muted">
                  <CalendarClock className="h-4 w-4" /> 締切
                </span>
                <span className="text-foreground">{team.deadline}</span>
              </div>

              {applied ? (
                <div className="mt-2 flex items-center gap-2 rounded-lg border border-success/40 bg-success/10 p-3 text-sm text-success">
                  <CheckCircle2 className="h-4 w-4" /> 参加申請を送信しました
                </div>
              ) : (
                <div className="mt-2 flex flex-col gap-2 border-t border-border pt-3">
                  <Label>参加する役割</Label>
                  <Select value={role} onValueChange={(v) => setRole(v as TeamRole)}>
                    <SelectTrigger>
                      <SelectValue placeholder="役割を選択" />
                    </SelectTrigger>
                    <SelectContent>
                      {team.recruitingRoles.map((r) => (
                        <SelectItem key={r} value={r}>
                          {r}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <Label>参加者名</Label>
                  <Input value={state.profileName} disabled />
                  <Button className="mt-1" disabled={!role} onClick={handleApply}>
                    <UserPlus className="mr-1.5 h-4 w-4" /> このチームに参加申請する
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
