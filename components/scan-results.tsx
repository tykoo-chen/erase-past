"use client";

import { useState } from "react";
import { useSSE } from "@/hooks/use-sse";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { PlatformBadge } from "./platform-badge";
import type { ScanResult } from "@/lib/types";

export function ScanResults({ taskId }: { taskId: string }) {
  const { events, isDone } = useSSE(`/api/scan?taskId=${taskId}`);
  const [addedUrls, setAddedUrls] = useState<Set<string>>(new Set());

  const results: ScanResult[] = events
    .filter((e) => e.event === "result")
    .map((e) => e.data as ScanResult);

  const progress = events
    .filter((e) => e.event === "progress")
    .at(-1)?.data as { progress: number; total: number } | undefined;

  const complete = events
    .filter((e) => e.event === "complete")
    .at(-1)?.data as { totalFound: number; highRisk: number; mediumRisk: number } | undefined;

  async function addCase(result: ScanResult) {
    try {
      await fetch("/api/cases", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          url: result.url,
          description: `扫描发现: ${result.sensitive_keywords.join(", ")}`,
          risk_level: result.risk_level,
          scan_task_id: taskId,
        }),
      });
      setAddedUrls((prev) => new Set(prev).add(result.url));
    } catch (err) {
      console.error("Failed to add case:", err);
    }
  }

  async function addAllHighRisk() {
    const highRisk = results.filter((r) => r.risk_level === "high" && !addedUrls.has(r.url));
    for (const r of highRisk) {
      await addCase(r);
    }
  }

  return (
    <div className="w-full max-w-2xl space-y-6">
      {/* Progress bar */}
      {progress && !isDone && (
        <div className="space-y-2">
          <div className="flex justify-between text-sm text-muted-foreground">
            <span>正在扫描...</span>
            <span>{progress.progress}/{progress.total}</span>
          </div>
          <div className="w-full bg-secondary rounded-full h-2">
            <div
              className="bg-primary h-2 rounded-full transition-all duration-300"
              style={{ width: `${(progress.progress / progress.total) * 100}%` }}
            />
          </div>
        </div>
      )}

      {/* Summary */}
      {complete && (
        <Card className="border-green-200 bg-green-50">
          <CardContent className="pt-4">
            <p className="font-medium">
              扫描完成 — 发现 {complete.totalFound} 条结果
            </p>
            <p className="text-sm text-muted-foreground mt-1">
              高风险 {complete.highRisk} 条 · 中等风险 {complete.mediumRisk} 条
            </p>
            {complete.highRisk > 0 && (
              <Button onClick={addAllHighRisk} size="sm" variant="destructive" className="mt-3">
                批量添加所有高风险案例
              </Button>
            )}
          </CardContent>
        </Card>
      )}

      {/* Results */}
      <div className="space-y-3">
        {results.map((result, i) => (
          <Card key={i} className="overflow-hidden">
            <CardContent className="pt-4 space-y-2">
              <div className="flex items-center gap-2 flex-wrap">
                <PlatformBadge platform={result.platform} name={result.platform_name} />
                <Badge variant={result.risk_level === "high" ? "destructive" : "secondary"}>
                  {result.risk_level === "high" ? "高风险" : "中等风险"}
                </Badge>
              </div>
              <h3 className="font-medium text-sm line-clamp-1">{result.title}</h3>
              <p className="text-xs text-muted-foreground line-clamp-2">{result.snippet}</p>
              <div className="flex items-center gap-2 flex-wrap">
                {result.sensitive_keywords.map((kw) => (
                  <Badge key={kw} variant="outline" className="text-xs bg-red-50 text-red-700 border-red-200">
                    {kw}
                  </Badge>
                ))}
              </div>
              <div className="flex justify-between items-center pt-1">
                <a
                  href={result.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs text-blue-600 hover:underline truncate max-w-[60%]"
                >
                  {result.url}
                </a>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => addCase(result)}
                  disabled={addedUrls.has(result.url)}
                >
                  {addedUrls.has(result.url) ? "已添加" : "添加为案例"}
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {results.length === 0 && isDone && (
        <div className="text-center py-12 text-muted-foreground">
          未发现包含敏感信息的页面
        </div>
      )}
    </div>
  );
}
