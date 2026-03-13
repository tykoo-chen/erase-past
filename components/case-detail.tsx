"use client";

import { useEffect, useState } from "react";
import { useSSE } from "@/hooks/use-sse";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { PlatformBadge } from "./platform-badge";
import type { Case, CaseStatus, PlatformInfo } from "@/lib/types";

const STATUS_OPTIONS: { value: CaseStatus; label: string }[] = [
  { value: "pending", label: "待处理" },
  { value: "reported", label: "已举报" },
  { value: "following", label: "跟进中" },
  { value: "resolved", label: "已解决" },
  { value: "failed", label: "失败" },
];

export function CaseDetail({ id }: { id: string }) {
  const [caseData, setCaseData] = useState<Case | null>(null);
  const [platformInfo, setPlatformInfo] = useState<PlatformInfo | null>(null);
  const [loading, setLoading] = useState(true);
  const [note, setNote] = useState("");
  const [reportTaskId, setReportTaskId] = useState<string | null>(null);

  const { events: reportEvents, isDone: reportDone } = useSSE(
    reportTaskId ? `/api/report?taskId=${reportTaskId}` : null
  );

  useEffect(() => {
    fetchCase();
  }, [id]);

  async function fetchCase() {
    try {
      const res = await fetch(`/api/cases/${id}`);
      const data = await res.json();
      setCaseData(data.case);
      setPlatformInfo(data.platformInfo);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  async function updateStatus(status: CaseStatus) {
    const res = await fetch(`/api/cases/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status }),
    });
    const data = await res.json();
    setCaseData(data.case);
  }

  async function addNote() {
    if (!note.trim()) return;
    const res = await fetch(`/api/cases/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ note: note.trim() }),
    });
    const data = await res.json();
    setCaseData(data.case);
    setNote("");
  }

  async function startReport() {
    const res = await fetch("/api/report", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ caseId: id }),
    });
    const data = await res.json();
    setReportTaskId(data.taskId);
  }

  if (loading) {
    return <div className="text-center py-12 text-muted-foreground">加载中...</div>;
  }

  if (!caseData) {
    return <div className="text-center py-12 text-muted-foreground">案例不存在</div>;
  }

  const reportSteps = reportEvents.filter((e) => e.event === "step").map((e) => e.data as { step: number; action: string; status: string });

  return (
    <div className="max-w-2xl space-y-6">
      {/* Header */}
      <div className="space-y-2">
        <div className="flex items-center gap-3">
          <PlatformBadge platform={caseData.platform} name={caseData.platform_name} />
          <Badge variant="outline" className="text-xs">ID: {caseData.id}</Badge>
        </div>
        <a
          href={caseData.url}
          target="_blank"
          rel="noopener noreferrer"
          className="text-sm text-blue-600 hover:underline break-all"
        >
          {caseData.url}
        </a>
        {caseData.description && (
          <p className="text-sm text-muted-foreground">{caseData.description}</p>
        )}
      </div>

      {/* Status + Actions */}
      <Card>
        <CardContent className="pt-4 flex items-center gap-4 flex-wrap">
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium">状态：</span>
            <Select value={caseData.status} onValueChange={(v) => updateStatus(v as CaseStatus)}>
              <SelectTrigger className="w-32">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {STATUS_OPTIONS.map((opt) => (
                  <SelectItem key={opt.value} value={opt.value}>
                    {opt.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <Button onClick={startReport} disabled={!!reportTaskId && !reportDone}>
            {reportTaskId && !reportDone ? "举报进行中..." : "自动举报"}
          </Button>
        </CardContent>
      </Card>

      {/* Report Progress */}
      {reportSteps.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-sm">举报进度</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {reportSteps.map((step) => (
              <div key={step.step} className="flex items-center gap-2 text-sm">
                <span>
                  {step.status === "completed" ? "✓" : step.status === "running" ? "..." : "✗"}
                </span>
                <span>{step.action}</span>
              </div>
            ))}
            {reportDone && (
              <p className="text-sm text-green-600 font-medium mt-2">举报已完成</p>
            )}
          </CardContent>
        </Card>
      )}

      {/* Platform Guide */}
      {platformInfo && (
        <Card>
          <CardHeader>
            <CardTitle className="text-sm">处理指南</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 text-sm">
            <p><strong>方法：</strong>{platformInfo.method}</p>
            <p><strong>预计时间：</strong>{platformInfo.time}</p>
            <p><strong>提示：</strong>{platformInfo.tip}</p>
          </CardContent>
        </Card>
      )}

      {/* Timeline */}
      <Card>
        <CardHeader>
          <CardTitle className="text-sm">时间线</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="text-sm text-muted-foreground">
            <span className="font-medium">创建于：</span>{" "}
            {new Date(caseData.created_at).toLocaleString("zh-CN")}
          </div>
          {caseData.notes.map((n, i) => (
            <div key={i} className="text-sm border-l-2 border-primary/30 pl-3">
              <span className="text-muted-foreground text-xs">
                {new Date(n.time).toLocaleString("zh-CN")}
              </span>
              <p>{n.text}</p>
            </div>
          ))}
          <div className="flex gap-2 pt-2">
            <Textarea
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder="添加备注..."
              rows={2}
              className="flex-1"
            />
            <Button onClick={addNote} size="sm" disabled={!note.trim()}>
              添加
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
