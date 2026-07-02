// ドメイン型定義

export type Difficulty = "初級" | "中級" | "上級" | "最上級";

export type SafetyLabel =
  | "リモートのみ"
  | "学校設備使用"
  | "現場訪問あり"
  | "工具使用あり"
  | "回転体あり"
  | "高温部品あり"
  | "高電圧注意"
  | "薬品使用あり"
  | "重量物あり"
  | "教員立会い推奨";

export type ApprovalStatus = "承認待ち" | "承認済み" | "差し戻し" | "却下";

export type QuestCategory =
  | "CAD"
  | "図面"
  | "測定・実験"
  | "3Dプリンタ"
  | "作業手順"
  | "機械設計"
  | "部品選定"
  | "改善提案"
  | "電気・制御"
  | "安全レビュー";

export interface Quest {
  id: string;
  title: string;
  companyName: string;
  industry: string;
  difficulty: Difficulty;
  recommendedGrade: string; // 例: "3年以上"
  requiredSkills: string[]; // SkillId[]
  rewardYen: number;
  rewardXp: number;
  deadline: string; // ISO date string
  remoteOk: boolean;
  safetyLevel: 1 | 2 | 3 | 4 | 5;
  safetyLabels: SafetyLabel[];
  teacherApprovalRequired: boolean;
  approvalStatus: ApprovalStatus;
  teacherComment?: string;
  isTeamQuest: boolean;
  category: QuestCategory;
  isRare?: boolean;
  isDaily?: boolean;
  // 詳細画面用
  background: string;
  requestDetails: string;
  deliverables: string[];
  requiredKnowledge: string[];
  equipment: string[];
  cautions: string[];
  evaluationCriteria: string[];
  referenceMaterials: string[]; // MaterialId[]
  submissionTemplateId?: string;
  learningOutcomes?: string; // 学生にとって学べること
  confidentialityNote?: string; // 秘密保持の必要性
  companyRatingAvg: number; // 学生から見た企業評価 (5点満点)
  companyRatingCount: number;
  createdAt: string;
  createdByCompany: boolean; // 企業フォームから投稿されたか(ダミーではないか)
}

export type MaterialCategory =
  | "材料力学"
  | "機械要素"
  | "ボルト・ナット"
  | "軸・ベアリング"
  | "公差・はめあい"
  | "板金設計"
  | "溶接設計"
  | "加工方法"
  | "図面の読み方"
  | "設計レビュー";

export interface QuizQuestion {
  question: string;
  choices: string[];
  answerIndex: number;
}

export interface Material {
  id: string;
  title: string;
  category: MaterialCategory;
  difficulty: Difficulty;
  studyMinutes: number;
  rewardXp: number;
  summary: string;
  quiz: QuizQuestion[];
  relatedQuestIds: string[];
  relatedSkillIds: string[];
}

export type SkillId =
  | "cad"
  | "mechanics"
  | "drawing"
  | "manufacturing"
  | "measurement"
  | "electronics"
  | "control"
  | "ai-dx"
  | "reporting"
  | "teamwork";

export interface Skill {
  id: SkillId;
  name: string;
  icon: string; // lucide icon name
  description: string;
}

export interface Badge {
  id: string;
  name: string;
  description: string;
  icon: string;
  condition: string;
  rarity: "common" | "rare" | "epic" | "legendary";
}

export interface Ad {
  id: string;
  title: string;
  advertiser: string;
  description: string;
  category: string;
  ctaLabel: string;
  colorFrom: string;
  colorTo: string;
}

export interface RankingEntry {
  rank: number;
  name: string;
  level: number;
  weeklyXp: number;
  title: string; // 称号
  department: string;
}

export type TeamRole =
  | "機械設計担当"
  | "電気回路担当"
  | "制御担当"
  | "ソフトウェア担当"
  | "実験・計測担当"
  | "レポート担当"
  | "プレゼン担当";

export interface TeamMember {
  name: string;
  role: TeamRole;
  department: string;
}

export interface TeamQuest {
  id: string;
  title: string;
  companyName: string;
  description: string;
  difficulty: Difficulty;
  recruitingRoles: TeamRole[];
  requiredSkills: string[];
  currentMembers: TeamMember[];
  recruitCount: number;
  rewardYen: number;
  rewardXp: number;
  deadline: string;
  safetyLabels: SafetyLabel[];
}

export interface SubmissionTemplate {
  id: string;
  title: string;
  purpose: string;
  fields: string[];
  fileFormat: string;
  evaluationPoints: string[];
  sampleText: string;
}

export interface CompanyReview {
  id: string;
  questTitle: string;
  companyName: string;
  studentName: string;
  // 企業 -> 学生
  toStudent: {
    technicalUnderstanding: number;
    deadlineAdherence: number;
    reportClarity: number;
    deliverableQuality: number;
    wantToRehire: number;
    comment: string;
  };
  // 学生 -> 企業
  toCompany: {
    clarityOfRequest: number;
    responseSpeed: number;
    rewardFairness: number;
    learningValue: number;
    safetyConsideration: number;
    recommendation: number;
    comment: string;
  };
}

export interface PortfolioItem {
  questId: string;
  title: string;
  companyName: string;
  completedAt: string;
  rewardXp: number;
  skillIds: SkillId[];
}
