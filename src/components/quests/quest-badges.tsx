import { AlertTriangle, CheckCircle2, Clock, RotateCcw, XCircle } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import type { ApprovalStatus, Difficulty } from "@/lib/types";

export function DifficultyBadge({ difficulty }: { difficulty: Difficulty }) {
  const variant =
    difficulty === "初級"
      ? "success"
      : difficulty === "中級"
      ? "default"
      : difficulty === "上級"
      ? "warning"
      : "danger";
  return <Badge variant={variant}>難易度: {difficulty}</Badge>;
}

export function SafetyLabelBadge({ label }: { label: string }) {
  return (
    <Badge variant="outline" className="gap-1">
      <AlertTriangle className="h-3 w-3" />
      {label}
    </Badge>
  );
}

export function ApprovalStatusBadge({ status }: { status: ApprovalStatus }) {
  switch (status) {
    case "承認済み":
      return (
        <Badge variant="success" className="gap-1">
          <CheckCircle2 className="h-3 w-3" /> 教員承認済み
        </Badge>
      );
    case "承認待ち":
      return (
        <Badge variant="warning" className="gap-1">
          <Clock className="h-3 w-3" /> 教員承認待ち
        </Badge>
      );
    case "差し戻し":
      return (
        <Badge variant="accent" className="gap-1">
          <RotateCcw className="h-3 w-3" /> 差し戻し
        </Badge>
      );
    case "却下":
      return (
        <Badge variant="danger" className="gap-1">
          <XCircle className="h-3 w-3" /> 却下
        </Badge>
      );
  }
}

export function SafetyLevelMeter({ level }: { level: 1 | 2 | 3 | 4 | 5 }) {
  return (
    <div className="flex items-center gap-1" title={`安全注意レベル ${level}/5`}>
      {Array.from({ length: 5 }).map((_, i) => (
        <span
          key={i}
          className={`h-1.5 w-4 rounded-full ${
            i < level ? (level >= 4 ? "bg-danger" : level >= 3 ? "bg-warning" : "bg-success") : "bg-surface-2"
          }`}
        />
      ))}
    </div>
  );
}
