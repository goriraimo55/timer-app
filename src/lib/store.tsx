"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import {
  ApprovalStatus,
  CompanyReview,
  Quest,
  SkillId,
  TeamRole,
} from "@/lib/types";
import { badges as badgeDefs, initialQuests, companyReviews as seedReviews } from "@/lib/data";
import { levelFromXp } from "@/lib/level";

const STORAGE_KEY = "kosen-quest-state-v1";

export interface TeamApplication {
  teamQuestId: string;
  name: string;
  role: TeamRole;
  appliedAt: string;
}

export interface QuestOverride {
  approvalStatus?: ApprovalStatus;
  teacherComment?: string;
}

interface PersistedState {
  profileName: string;
  department: string;
  grade: string;
  xp: number;
  streak: number;
  lastActiveDate: string | null;
  completedQuestIds: string[];
  completedMaterialIds: string[];
  skillXp: Record<SkillId, number>;
  addedQuests: Quest[];
  questOverrides: Record<string, QuestOverride>;
  teamApplications: TeamApplication[];
  customReviews: CompanyReview[];
  celebration: { type: "quest" | "material"; label: string; xp: number } | null;
}

const today = () => new Date().toISOString().slice(0, 10);

const seedState: PersistedState = {
  profileName: "後藤 陸",
  department: "機械工学科",
  grade: "4年",
  xp: 1450,
  streak: 8,
  lastActiveDate: "2026-07-02",
  completedQuestIds: ["q01", "q03", "q05"],
  completedMaterialIds: ["m01", "m03", "m13", "m14"],
  skillXp: {
    cad: 340,
    mechanics: 260,
    drawing: 300,
    manufacturing: 220,
    measurement: 180,
    electronics: 60,
    control: 40,
    "ai-dx": 90,
    reporting: 250,
    teamwork: 30,
  },
  addedQuests: [],
  questOverrides: {},
  teamApplications: [],
  customReviews: [],
  celebration: null,
};

function loadState(): PersistedState {
  if (typeof window === "undefined") return seedState;
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return seedState;
    const parsed = JSON.parse(raw);
    return {
      ...seedState,
      ...parsed,
      skillXp: { ...seedState.skillXp, ...(parsed.skillXp ?? {}) },
    };
  } catch {
    return seedState;
  }
}

function computeStreakUpdate(prev: PersistedState): Pick<PersistedState, "streak" | "lastActiveDate"> {
  const now = today();
  if (prev.lastActiveDate === now) {
    return { streak: prev.streak, lastActiveDate: prev.lastActiveDate };
  }
  if (!prev.lastActiveDate) {
    return { streak: 1, lastActiveDate: now };
  }
  const last = new Date(prev.lastActiveDate);
  const diffDays = Math.round((new Date(now).getTime() - last.getTime()) / 86400000);
  if (diffDays === 1) {
    return { streak: prev.streak + 1, lastActiveDate: now };
  }
  if (diffDays > 1) {
    return { streak: 1, lastActiveDate: now };
  }
  return { streak: prev.streak, lastActiveDate: prev.lastActiveDate };
}

export interface AppContextValue {
  state: PersistedState;
  level: number;
  allQuests: Quest[];
  earnedBadgeIds: string[];
  completeMaterial: (materialId: string, rewardXp: number, skillIds: SkillId[], label: string) => void;
  completeQuest: (quest: Quest) => void;
  addCompanyQuest: (quest: Quest) => void;
  setQuestApproval: (questId: string, status: ApprovalStatus, comment?: string) => void;
  applyToTeamQuest: (teamQuestId: string, name: string, role: TeamRole) => void;
  addReview: (review: CompanyReview) => void;
  updateProfile: (fields: Partial<Pick<PersistedState, "profileName" | "department" | "grade">>) => void;
  clearCelebration: () => void;
  allReviews: CompanyReview[];
}

const AppContext = createContext<AppContextValue | null>(null);

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<PersistedState>(seedState);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    // 初回マウント後にlocalStorageから復元する(SSRとのハイドレーション不一致を避けるため意図的にエフェクト内で実行)
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setState(loadState());
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  }, [state, hydrated]);

  const recordActivity = useCallback((prev: PersistedState) => {
    return computeStreakUpdate(prev);
  }, []);

  const completeMaterial = useCallback(
    (materialId: string, rewardXp: number, skillIds: SkillId[], label: string) => {
      setState((prev) => {
        if (prev.completedMaterialIds.includes(materialId)) return prev;
        const skillXp = { ...prev.skillXp };
        const per = Math.round(rewardXp / Math.max(1, skillIds.length));
        skillIds.forEach((id) => {
          skillXp[id] = (skillXp[id] ?? 0) + per;
        });
        const streakUpdate = recordActivity(prev);
        return {
          ...prev,
          xp: prev.xp + rewardXp,
          skillXp,
          completedMaterialIds: [...prev.completedMaterialIds, materialId],
          ...streakUpdate,
          celebration: { type: "material", label, xp: rewardXp },
        };
      });
    },
    [recordActivity]
  );

  const completeQuest = useCallback(
    (quest: Quest) => {
      setState((prev) => {
        if (prev.completedQuestIds.includes(quest.id)) return prev;
        const skillXp = { ...prev.skillXp };
        const skillIds = quest.requiredSkills as SkillId[];
        const per = Math.round(quest.rewardXp / Math.max(1, skillIds.length));
        skillIds.forEach((id) => {
          skillXp[id] = (skillXp[id] ?? 0) + per;
        });
        const streakUpdate = recordActivity(prev);
        return {
          ...prev,
          xp: prev.xp + quest.rewardXp,
          skillXp,
          completedQuestIds: [...prev.completedQuestIds, quest.id],
          ...streakUpdate,
          celebration: { type: "quest", label: quest.title, xp: quest.rewardXp },
        };
      });
    },
    [recordActivity]
  );

  const addCompanyQuest = useCallback((quest: Quest) => {
    setState((prev) => ({ ...prev, addedQuests: [quest, ...prev.addedQuests] }));
  }, []);

  const setQuestApproval = useCallback(
    (questId: string, status: ApprovalStatus, comment?: string) => {
      setState((prev) => ({
        ...prev,
        questOverrides: {
          ...prev.questOverrides,
          [questId]: { approvalStatus: status, teacherComment: comment },
        },
      }));
    },
    []
  );

  const applyToTeamQuest = useCallback((teamQuestId: string, name: string, role: TeamRole) => {
    setState((prev) => {
      const already = prev.teamApplications.some(
        (a) => a.teamQuestId === teamQuestId && a.name === name
      );
      if (already) return prev;
      return {
        ...prev,
        teamApplications: [
          ...prev.teamApplications,
          { teamQuestId, name, role, appliedAt: today() },
        ],
      };
    });
  }, []);

  const addReview = useCallback((review: CompanyReview) => {
    setState((prev) => ({ ...prev, customReviews: [review, ...prev.customReviews] }));
  }, []);

  const updateProfile = useCallback(
    (fields: Partial<Pick<PersistedState, "profileName" | "department" | "grade">>) => {
      setState((prev) => ({ ...prev, ...fields }));
    },
    []
  );

  const clearCelebration = useCallback(() => {
    setState((prev) => ({ ...prev, celebration: null }));
  }, []);

  const allQuests = useMemo<Quest[]>(() => {
    const merged = [...initialQuests, ...state.addedQuests];
    return merged.map((q) => {
      const override = state.questOverrides[q.id];
      if (!override) return q;
      return {
        ...q,
        approvalStatus: override.approvalStatus ?? q.approvalStatus,
        teacherComment: override.teacherComment ?? q.teacherComment,
      };
    });
  }, [state.addedQuests, state.questOverrides]);

  const allReviews = useMemo(() => [...state.customReviews, ...seedReviews], [state.customReviews]);

  const level = levelFromXp(state.xp);

  const earnedBadgeIds = useMemo(() => {
    const completedQuestObjs = allQuests.filter((q) => state.completedQuestIds.includes(q.id));
    const cadCount = completedQuestObjs.filter((q) => q.category === "CAD").length;
    const drawingMaterialsDone = ["m13", "m14"].every((id) =>
      state.completedMaterialIds.includes(id)
    );
    const approvalRequiredCompleted = completedQuestObjs.filter(
      (q) => q.teacherApprovalRequired
    ).length;
    const myReviews = allReviews.filter((r) => r.studentName === state.profileName);
    const avgRating =
      myReviews.length > 0
        ? myReviews.reduce((sum, r) => {
            const vals = Object.values(r.toStudent).filter(
              (v): v is number => typeof v === "number"
            );
            return sum + vals.reduce((a, b) => a + b, 0) / vals.length;
          }, 0) / myReviews.length
        : 0;
    const rareCompleted = completedQuestObjs.some((q) => q.isRare);

    const earned: string[] = [];
    if (state.completedQuestIds.length >= 1) earned.push("b01");
    if (cadCount >= 3) earned.push("b02");
    if (drawingMaterialsDone) earned.push("b03");
    if (state.streak >= 7) earned.push("b04");
    if (state.streak >= 30) earned.push("b05");
    if (approvalRequiredCompleted >= 5) earned.push("b06");
    if (avgRating >= 4.5) earned.push("b07");
    if (state.teamApplications.length >= 1) earned.push("b08");
    if (rareCompleted) earned.push("b09");
    if (level >= 20) earned.push("b10");
    return earned;
  }, [allQuests, allReviews, state.completedQuestIds, state.completedMaterialIds, state.streak, state.teamApplications, state.profileName, level]);

  const value: AppContextValue = {
    state,
    level,
    allQuests,
    earnedBadgeIds,
    completeMaterial,
    completeQuest,
    addCompanyQuest,
    setQuestApproval,
    applyToTeamQuest,
    addReview,
    updateProfile,
    clearCelebration,
    allReviews,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useApp(): AppContextValue {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error("useApp must be used within AppProvider");
  return ctx;
}

export function badgeIsEarned(id: string, earnedIds: string[]): boolean {
  return earnedIds.includes(id);
}

export { badgeDefs };
