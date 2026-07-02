"use client";

import { useMemo, useState } from "react";
import { BookOpen } from "lucide-react";
import { useApp } from "@/lib/store";
import { materials } from "@/lib/data";
import { PageHeader } from "@/components/section-heading";
import { MaterialCard } from "@/components/materials/material-card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { AdSlot } from "@/components/ad-slot";
import type { MaterialCategory } from "@/lib/types";

const categories: MaterialCategory[] = [
  "材料力学",
  "機械要素",
  "ボルト・ナット",
  "軸・ベアリング",
  "公差・はめあい",
  "板金設計",
  "溶接設計",
  "加工方法",
  "図面の読み方",
  "設計レビュー",
];

export default function LearningPage() {
  const { state } = useApp();
  const [tab, setTab] = useState<string>("すべて");

  const filtered = useMemo(() => {
    if (tab === "すべて") return materials;
    return materials.filter((m) => m.category === tab);
  }, [tab]);

  const progress = `${state.completedMaterialIds.length}/${materials.length}`;

  return (
    <div>
      <PageHeader
        eyebrow="研究所"
        title="機械設計学習ページ"
        description="機械設計の基礎を、短時間で学べる教材ライブラリ。学習を完了すると経験値とスキルが伸びます。"
        action={
          <div className="flex items-center gap-1.5 rounded-full border border-primary/30 bg-primary/10 px-3 py-1.5 text-xs text-primary">
            <BookOpen className="h-3.5 w-3.5" /> 修了 {progress} 教材
          </div>
        }
      />

      <Tabs value={tab} onValueChange={setTab} className="mb-6">
        <TabsList>
          <TabsTrigger value="すべて">すべて</TabsTrigger>
          {categories.map((c) => (
            <TabsTrigger key={c} value={c}>
              {c}
            </TabsTrigger>
          ))}
        </TabsList>
        <TabsContent value={tab}>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {filtered.map((m, i) => (
              <div key={m.id} className="contents">
                <MaterialCard material={m} completed={state.completedMaterialIds.includes(m.id)} />
                {i === 5 && (
                  <div className="sm:col-span-2 lg:col-span-3">
                    <AdSlot seed={5} />
                  </div>
                )}
              </div>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
