// レベル・経験値計算ロジック(1レベルあたり300XP固定)

export const XP_PER_LEVEL = 300;
export const SKILL_XP_PER_LEVEL = 100;
export const MAX_SKILL_LEVEL = 10;

export function levelFromXp(xp: number): number {
  return Math.floor(xp / XP_PER_LEVEL) + 1;
}

export function xpIntoLevel(xp: number): number {
  return xp % XP_PER_LEVEL;
}

export function xpProgressRatio(xp: number): number {
  return xpIntoLevel(xp) / XP_PER_LEVEL;
}

export function skillLevelFromXp(xp: number): number {
  return Math.min(MAX_SKILL_LEVEL, Math.floor(xp / SKILL_XP_PER_LEVEL) + 1);
}

export function skillProgressRatio(xp: number): number {
  const level = skillLevelFromXp(xp);
  if (level >= MAX_SKILL_LEVEL) return 1;
  return (xp % SKILL_XP_PER_LEVEL) / SKILL_XP_PER_LEVEL;
}

export function titleForLevel(level: number): string {
  if (level >= 20) return "ギルドの伝説";
  if (level >= 15) return "熟練エンジニア";
  if (level >= 10) return "一人前の技術者";
  if (level >= 5) return "見習いエンジニア";
  return "駆け出し冒険者";
}
