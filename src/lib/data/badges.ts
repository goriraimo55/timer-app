import { Badge } from "@/lib/types";

export const badges: Badge[] = [
  { id: "b01", name: "はじめの一歩", description: "はじめてクエストに挑戦した", icon: "Footprints", condition: "クエストを1件完了", rarity: "common" },
  { id: "b02", name: "見習い設計士", description: "CADクエストを3件完了した", icon: "Box", condition: "CAD関連クエスト3件完了", rarity: "common" },
  { id: "b03", name: "図面マスター見習い", description: "図面の読み方教材をすべて修了", icon: "FileText", condition: "図面カテゴリ教材を全修了", rarity: "rare" },
  { id: "b04", name: "7日連続ログイン", description: "7日間連続で学習・挑戦した", icon: "Flame", condition: "連続学習日数7日達成", rarity: "common" },
  { id: "b05", name: "30日連続の探究者", description: "30日間連続で学習・挑戦した", icon: "FlameKindling", condition: "連続学習日数30日達成", rarity: "epic" },
  { id: "b06", name: "教員承認済みギルド員", description: "教員承認済みクエストを5件完了", icon: "ShieldCheck", condition: "承認済みクエスト5件完了", rarity: "rare" },
  { id: "b07", name: "高評価エンジニア", description: "企業評価平均4.5以上を獲得", icon: "Star", condition: "企業評価平均4.5以上", rarity: "epic" },
  { id: "b08", name: "チームクエスト戦士", description: "チームクエストに初参加", icon: "Users", condition: "チームクエスト参加1件", rarity: "common" },
  { id: "b09", name: "レアクエストハンター", description: "レアクエストを完了した", icon: "Gem", condition: "レアクエスト1件完了", rarity: "legendary" },
  { id: "b10", name: "ギルドの伝説", description: "レベル20に到達した", icon: "Crown", condition: "レベル20到達", rarity: "legendary" },
];
