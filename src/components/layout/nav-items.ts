import type { LucideIcon } from "lucide-react";
import {
  LayoutDashboard,
  Swords,
  BookOpen,
  Network,
  UserRound,
  ShieldCheck,
  FileStack,
  Star,
  Award,
  Users,
  Briefcase,
} from "lucide-react";

export interface NavItem {
  href: string;
  label: string;
  icon: LucideIcon;
  description: string;
  group: "student" | "guild" | "staff";
}

export const navItems: NavItem[] = [
  { href: "/", label: "ホーム", icon: LayoutDashboard, description: "ギルド拠点", group: "student" },
  { href: "/quests", label: "クエスト", icon: Swords, description: "企業案件に挑戦", group: "student" },
  { href: "/learning", label: "学習", icon: BookOpen, description: "機械設計を学ぶ", group: "student" },
  { href: "/skills", label: "スキルツリー", icon: Network, description: "能力の成長", group: "student" },
  { href: "/teams", label: "チームクエスト", icon: Users, description: "多学科で挑む", group: "student" },
  { href: "/profile", label: "プロフィール", icon: UserRound, description: "実績ポートフォリオ", group: "guild" },
  { href: "/templates", label: "提出テンプレート", icon: FileStack, description: "成果物のひな形", group: "guild" },
  { href: "/reviews", label: "相互評価", icon: Star, description: "企業⇄学生の評価", group: "guild" },
  { href: "/certificate", label: "スキル証明書", icon: Award, description: "就活・インターン用", group: "guild" },
  { href: "/quests/new", label: "案件を投稿する", icon: Briefcase, description: "企業向けフォーム", group: "staff" },
  { href: "/teacher", label: "教員承認", icon: ShieldCheck, description: "安全性・妥当性の確認", group: "staff" },
];
