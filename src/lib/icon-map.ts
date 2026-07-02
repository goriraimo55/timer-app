import {
  Box,
  Gauge,
  FileText,
  Wrench,
  Ruler,
  CircuitBoard,
  Cpu,
  Sparkles,
  NotebookPen,
  Users,
  Footprints,
  Flame,
  FlameKindling,
  ShieldCheck,
  Star,
  Gem,
  Crown,
  type LucideIcon,
} from "lucide-react";

export const iconMap: Record<string, LucideIcon> = {
  Box,
  Gauge,
  FileText,
  Wrench,
  Ruler,
  CircuitBoard,
  Cpu,
  Sparkles,
  NotebookPen,
  Users,
  Footprints,
  Flame,
  FlameKindling,
  ShieldCheck,
  Star,
  Gem,
  Crown,
};

export function getIcon(name: string): LucideIcon {
  return iconMap[name] ?? Sparkles;
}
