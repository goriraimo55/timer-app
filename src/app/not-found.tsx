import Link from "next/link";
import { Compass } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <div className="mx-auto flex max-w-md flex-col items-center gap-4 py-20 text-center">
      <Compass className="h-12 w-12 text-primary" />
      <h1 className="text-xl font-bold text-foreground">ページが見つかりません</h1>
      <p className="text-sm text-muted">
        お探しのクエスト・教材・ページは存在しないか、移動した可能性があります。
      </p>
      <Button asChild>
        <Link href="/">ホームに戻る</Link>
      </Button>
    </div>
  );
}
