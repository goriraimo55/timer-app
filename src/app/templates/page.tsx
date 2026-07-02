"use client";

import { FileStack } from "lucide-react";
import { templates } from "@/lib/data";
import { PageHeader } from "@/components/section-heading";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

export default function TemplatesPage() {
  return (
    <div>
      <PageHeader
        eyebrow="提出物ガイド"
        title="成果物提出テンプレート"
        description="どのクエストで何を提出すればいいか迷わないよう、目的別のテンプレートを用意しています。"
      />

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {templates.map((t) => (
          <Card key={t.id} className="flex flex-col">
            <CardHeader>
              <div className="mb-1">
                <FileStack className="h-5 w-5 text-primary" />
              </div>
              <CardTitle>{t.title}</CardTitle>
              <p className="text-xs text-muted">{t.purpose}</p>
            </CardHeader>
            <CardContent className="flex flex-1 flex-col gap-3 pt-0">
              <div>
                <p className="mb-1 text-[11px] font-semibold text-foreground/80">記入項目</p>
                <ul className="list-inside list-disc space-y-0.5 text-xs text-muted">
                  {t.fields.slice(0, 3).map((f) => (
                    <li key={f}>{f}</li>
                  ))}
                  {t.fields.length > 3 && <li>他 {t.fields.length - 3}項目</li>}
                </ul>
              </div>
              <Badge variant="outline" className="w-fit">
                {t.fileFormat}
              </Badge>
              <Dialog>
                <DialogTrigger asChild>
                  <Button variant="outline" size="sm" className="mt-auto">
                    詳細・サンプルを見る
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>{t.title}</DialogTitle>
                  </DialogHeader>
                  <div className="flex flex-col gap-3 text-sm">
                    <p className="text-muted">{t.purpose}</p>
                    <div>
                      <p className="mb-1 text-xs font-semibold text-foreground/80">使用目的</p>
                      <p className="text-foreground/90">{t.purpose}</p>
                    </div>
                    <div>
                      <p className="mb-1 text-xs font-semibold text-foreground/80">記入項目</p>
                      <ul className="list-inside list-disc space-y-0.5 text-foreground/90">
                        {t.fields.map((f) => (
                          <li key={f}>{f}</li>
                        ))}
                      </ul>
                    </div>
                    <div>
                      <p className="mb-1 text-xs font-semibold text-foreground/80">提出ファイル形式</p>
                      <p className="text-foreground/90">{t.fileFormat}</p>
                    </div>
                    <div>
                      <p className="mb-1 text-xs font-semibold text-foreground/80">評価ポイント</p>
                      <ul className="list-inside list-disc space-y-0.5 text-foreground/90">
                        {t.evaluationPoints.map((e) => (
                          <li key={e}>{e}</li>
                        ))}
                      </ul>
                    </div>
                    <div>
                      <p className="mb-1 text-xs font-semibold text-foreground/80">サンプル記入例</p>
                      <pre className="whitespace-pre-wrap rounded-lg border border-border bg-surface-2 p-3 text-xs text-foreground/90 font-sans">
                        {t.sampleText}
                      </pre>
                    </div>
                  </div>
                </DialogContent>
              </Dialog>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
