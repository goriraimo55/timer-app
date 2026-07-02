import { Skill } from "@/lib/types";

export const skills: Skill[] = [
  { id: "cad", name: "CAD", icon: "Box", description: "2D/3D CADによる設計・モデリング能力" },
  { id: "mechanics", name: "材料力学", icon: "Gauge", description: "応力・ひずみ・強度計算の理解" },
  { id: "drawing", name: "図面読解", icon: "FileText", description: "図面を正確に読み取り、意図を理解する力" },
  { id: "manufacturing", name: "加工知識", icon: "Wrench", description: "切削・溶接・板金など加工法の知識" },
  { id: "measurement", name: "実験・計測", icon: "Ruler", description: "測定機器を使った計測・実験遂行力" },
  { id: "electronics", name: "電子工作", icon: "CircuitBoard", description: "回路設計・電子部品の取り扱い" },
  { id: "control", name: "制御", icon: "Cpu", description: "PLC・シーケンス制御・組込み制御の知識" },
  { id: "ai-dx", name: "AI/DX", icon: "Sparkles", description: "AI活用・データ分析・業務DXスキル" },
  { id: "reporting", name: "レポート作成", icon: "NotebookPen", description: "分かりやすい技術文書・報告書作成力" },
  { id: "teamwork", name: "チーム開発", icon: "Users", description: "複数人・多学科での共同作業遂行力" },
];
