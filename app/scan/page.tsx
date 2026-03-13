"use client";

import { useSearchParams } from "next/navigation";
import { Suspense } from "react";
import { ScanResults } from "@/components/scan-results";
import Link from "next/link";
import { Button } from "@/components/ui/button";

function ScanContent() {
  const searchParams = useSearchParams();
  const taskId = searchParams.get("taskId");

  if (!taskId) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground mb-4">缺少扫描任务 ID</p>
        <Link href="/">
          <Button>返回首页开始扫描</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center">
      <h1 className="text-2xl font-bold mb-6">扫描结果</h1>
      <ScanResults taskId={taskId} />
      <div className="mt-6">
        <Link href="/cases">
          <Button variant="outline">查看案例管理</Button>
        </Link>
      </div>
    </div>
  );
}

export default function ScanPage() {
  return (
    <div className="container max-w-2xl mx-auto py-8 px-4">
      <Suspense fallback={<div className="text-center py-12 text-muted-foreground">加载中...</div>}>
        <ScanContent />
      </Suspense>
    </div>
  );
}
