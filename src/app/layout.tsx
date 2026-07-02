import type { Metadata } from "next";
import "./globals.css";
import { AppProvider } from "@/lib/store";
import { AppShell } from "@/components/layout/app-shell";

export const metadata: Metadata = {
  title: "技術者ギルド | 高専生の技術クエストプラットフォーム",
  description:
    "高専生が技術クエストに挑戦しながら経験値・スキルを積み、実績をポートフォリオにできる学習・仕事マッチングプロトタイプ",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ja" className="h-full antialiased">
      <body className="min-h-full flex flex-col">
        <AppProvider>
          <AppShell>{children}</AppShell>
        </AppProvider>
      </body>
    </html>
  );
}
