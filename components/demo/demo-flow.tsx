"use client";

import { useState, useEffect, useCallback } from "react";
import { Button } from "@/components/ui/button";

// ============================================================
// Types
// ============================================================

interface ScanResult {
  id: number;
  level: "red" | "yellow" | "green" | "grey";
  platform: string;
  platformIcon: string;
  title: string;
  url: string;
  detail: string;
  assignedSkill?: string;
  skillIcon?: string;
  status?: string;
}

// ============================================================
// Mock Data Generator
// ============================================================

function generateMockResults(name: string): ScanResult[] {
  return [
    { id: 1, level: "red", platform: "百度文库", platformIcon: "📄", title: `${name}的个人简历`, url: "wenku.baidu.com/view/abc123", detail: `包含手机号 138****1234、家庭住址`, assignedSkill: "Negotiator", skillIcon: "💬" },
    { id: 2, level: "red", platform: "知乎", platformIcon: "💬", title: `${name}的微信号被泄露`, url: "zhihu.com/answer/987654", detail: "某回答中贴出了完整微信号", assignedSkill: "Reporter", skillIcon: "🚨" },
    { id: 3, level: "red", platform: "某论坛", platformIcon: "🌐", title: `${name}手机号曝光`, url: "forum.example.com/t/45678", detail: "帖子标题直接包含手机号", assignedSkill: "Reporter", skillIcon: "🚨" },
    { id: 4, level: "yellow", platform: "微博", platformIcon: "🔴", title: `关于${name}的负面评价`, url: "weibo.com/status/112233", detail: "用户发布了不实评价，172 条转发", assignedSkill: "Negotiator", skillIcon: "💬" },
    { id: 5, level: "yellow", platform: "脉脉", platformIcon: "👔", title: `${name}的旧职位信息`, url: "maimai.cn/profile/xxx", detail: "显示 3 年前的职位，已经过时", assignedSkill: "Negotiator", skillIcon: "💬" },
    { id: 6, level: "yellow", platform: "小红书", platformIcon: "📕", title: `有人转发了${name}的照片`, url: "xiaohongshu.com/note/aaa", detail: "未经授权使用个人照片", assignedSkill: "Reporter", skillIcon: "🚨" },
    { id: 7, level: "green", platform: "公司官网", platformIcon: "🏢", title: `${name} - 团队介绍`, url: "company.com/team", detail: "正面的职业介绍页面" },
    { id: 8, level: "green", platform: "GitHub", platformIcon: "🐙", title: `${name}的开源项目`, url: "github.com/username", detail: "技术贡献，正面内容" },
    { id: 9, level: "green", platform: "LinkedIn", platformIcon: "💼", title: `${name} | LinkedIn`, url: "linkedin.com/in/xxx", detail: "专业社交档案" },
    { id: 10, level: "grey", platform: "百度", platformIcon: "🔍", title: `同名${name}的新闻`, url: "baidu.com/s?q=...", detail: "确认为同名他人，无关" },
    { id: 11, level: "grey", platform: "微博", platformIcon: "🔴", title: `另一个${name}`, url: "weibo.com/u/other", detail: "非本人账号" },
  ];
}

// ============================================================
// Steps
// ============================================================

type Step = "scanning" | "results" | "strategy" | "executing" | "done";

const levelConfig = {
  red: { label: "🔴 立即处理", bg: "bg-red-50 border-red-200", text: "text-red-700", dot: "bg-red-500" },
  yellow: { label: "🟡 建议处理", bg: "bg-amber-50 border-amber-200", text: "text-amber-700", dot: "bg-amber-500" },
  green: { label: "🟢 正面保留", bg: "bg-emerald-50 border-emerald-200", text: "text-emerald-700", dot: "bg-emerald-500" },
  grey: { label: "⚪ 无关内容", bg: "bg-gray-50 border-gray-200", text: "text-gray-500", dot: "bg-gray-400" },
};

// ============================================================
// Component
// ============================================================

export function DemoFlow({ userName, onReset }: { userName: string; onReset: () => void }) {
  const [step, setStep] = useState<Step>("scanning");
  const [scanProgress, setScanProgress] = useState(0);
  const [scanLog, setScanLog] = useState<string[]>([]);
  const [results, setResults] = useState<ScanResult[]>([]);
  const [executionLog, setExecutionLog] = useState<{ time: string; icon: string; text: string; skill: string }[]>([]);
  const [executionIndex, setExecutionIndex] = useState(0);

  const allResults = generateMockResults(userName);

  // Scanning animation
  useEffect(() => {
    if (step !== "scanning") return;

    const queries = [
      `web_search "${userName}"`,
      `web_search "${userName}" 手机 OR 联系方式`,
      `web_search "${userName}" 简历 OR resume`,
      `web_search "${userName}" site:wenku.baidu.com`,
      `web_search "${userName}" site:zhihu.com`,
      `web_search "${userName}" site:weibo.com`,
      `web_search "${userName}" site:xiaohongshu.com`,
      `web_search "${userName}" site:maimai.cn`,
      `检查数据经纪人网站...`,
      `检查 AI 搜索引擎提及...`,
      `分析搜索结果...`,
      `分类标记风险等级...`,
    ];

    let i = 0;
    const timer = setInterval(() => {
      if (i < queries.length) {
        setScanLog((prev) => [...prev, queries[i]]);
        setScanProgress(Math.round(((i + 1) / queries.length) * 100));
        i++;
      } else {
        clearInterval(timer);
        setResults(allResults);
        setTimeout(() => setStep("results"), 500);
      }
    }, 400);

    return () => clearInterval(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [step, userName]);

  // Execution animation
  const executionSteps = [
    { time: "00:00", icon: "💬", text: `向百度文库简历上传者发送友好私信，请求删除`, skill: "Negotiator" },
    { time: "00:02", icon: "🚨", text: `向知乎提交隐私举报：微信号泄露`, skill: "Reporter" },
    { time: "00:03", icon: "🚨", text: `向论坛管理员举报：手机号曝光`, skill: "Reporter" },
    { time: "00:05", icon: "💬", text: `向微博博主发送私信：请求删除不实评价`, skill: "Negotiator" },
    { time: "00:06", icon: "💬", text: `向脉脉联系更新过时职位信息`, skill: "Negotiator" },
    { time: "00:08", icon: "🚨", text: `向小红书举报：未授权使用个人照片`, skill: "Reporter" },
    { time: "00:10", icon: "📈", text: `制定 SEO 稀释策略：准备在知乎、LinkedIn 发布正面内容`, skill: "SEO Diluter" },
    { time: "00:11", icon: "🗑️", text: `检查数据经纪人网站，发现 3 个需要 Opt-out`, skill: "Data Broker Cleanup" },
    { time: "00:12", icon: "🔍", text: `提交百度快照删除申请`, skill: "Reporter" },
    { time: "00:13", icon: "📊", text: `设置每周一 9:00 自动监控扫描`, skill: "Monitor" },
    { time: "00:15", icon: "✅", text: `第一轮处理完成。已联系 3 人，已举报 4 条，待跟进 7 项`, skill: "Orchestrator" },
  ];

  useEffect(() => {
    if (step !== "executing") return;

    const steps = [...executionSteps];
    let i = 0;
    let cancelled = false;
    const timer = setInterval(() => {
      if (cancelled) return;
      if (i < steps.length) {
        const currentStep = steps[i];
        setExecutionLog((prev) => [...prev, currentStep]);
        setExecutionIndex(i + 1);
        i++;
      } else {
        clearInterval(timer);
        if (!cancelled) setTimeout(() => setStep("done"), 800);
      }
    }, 600);

    return () => { cancelled = true; clearInterval(timer); };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [step]);

  const redCount = allResults.filter((r) => r.level === "red").length;
  const yellowCount = allResults.filter((r) => r.level === "yellow").length;
  const greenCount = allResults.filter((r) => r.level === "green").length;
  const greyCount = allResults.filter((r) => r.level === "grey").length;

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold">Privacy Eraser</h1>
          <p className="text-sm text-muted-foreground">正在为 <strong>{userName}</strong> 执行个人公关服务</p>
        </div>
        <Button variant="outline" size="sm" onClick={onReset}>← 返回</Button>
      </div>

      {/* Progress bar */}
      <div className="flex items-center gap-2 mb-8">
        {(["scanning", "results", "strategy", "executing", "done"] as Step[]).map((s, i) => {
          const labels = ["扫描", "结果", "策略", "执行", "完成"];
          const icons = ["🔍", "📋", "🎯", "⚡", "✅"];
          const stepOrder = ["scanning", "results", "strategy", "executing", "done"];
          const currentIndex = stepOrder.indexOf(step);
          const isActive = i <= currentIndex;
          const isCurrent = s === step;

          return (
            <div key={s} className="flex items-center gap-2 flex-1">
              <div className={`flex items-center gap-1.5 text-sm font-medium transition-colors ${
                isCurrent ? "text-foreground" : isActive ? "text-foreground/70" : "text-muted-foreground/40"
              }`}>
                <span>{icons[i]}</span>
                <span className="hidden sm:inline">{labels[i]}</span>
              </div>
              {i < 4 && (
                <div className="flex-1 h-0.5 rounded-full bg-muted overflow-hidden">
                  <div
                    className="h-full bg-primary transition-all duration-500"
                    style={{ width: isActive ? "100%" : "0%" }}
                  />
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* ============ SCANNING ============ */}
      {step === "scanning" && (
        <div className="space-y-4">
          <div className="rounded-xl border bg-card p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-semibold">🔍 Scanner Skill 执行中</h2>
              <span className="text-sm text-muted-foreground font-mono">{scanProgress}%</span>
            </div>
            <div className="w-full h-2 bg-muted rounded-full overflow-hidden mb-4">
              <div
                className="h-full bg-blue-500 rounded-full transition-all duration-300"
                style={{ width: `${scanProgress}%` }}
              />
            </div>
            <div className="bg-muted/50 rounded-lg p-4 font-mono text-xs space-y-1.5 max-h-64 overflow-y-auto">
              {scanLog.map((log, i) => (
                <div key={i} className="flex items-start gap-2">
                  <span className="text-emerald-500 shrink-0">❯</span>
                  <span className="text-muted-foreground">{log}</span>
                </div>
              ))}
              {scanProgress < 100 && (
                <div className="flex items-center gap-2">
                  <span className="text-blue-500 animate-pulse">▋</span>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* ============ RESULTS ============ */}
      {step === "results" && (
        <div className="space-y-4">
          <div className="rounded-xl border bg-card p-6">
            <h2 className="font-semibold mb-1">📋 扫描结果</h2>
            <p className="text-sm text-muted-foreground mb-4">
              找到 {allResults.length} 条关于 <strong>{userName}</strong> 的内容
            </p>

            {/* Summary */}
            <div className="grid grid-cols-4 gap-3 mb-6">
              {[
                { count: redCount, label: "需处理", color: "bg-red-500", bg: "bg-red-50" },
                { count: yellowCount, label: "建议处理", color: "bg-amber-500", bg: "bg-amber-50" },
                { count: greenCount, label: "正面保留", color: "bg-emerald-500", bg: "bg-emerald-50" },
                { count: greyCount, label: "无关", color: "bg-gray-400", bg: "bg-gray-50" },
              ].map((item) => (
                <div key={item.label} className={`${item.bg} rounded-lg p-3 text-center`}>
                  <div className="text-2xl font-bold">{item.count}</div>
                  <div className="text-xs text-muted-foreground flex items-center justify-center gap-1">
                    <span className={`w-1.5 h-1.5 rounded-full ${item.color}`} />
                    {item.label}
                  </div>
                </div>
              ))}
            </div>

            {/* Results list */}
            <div className="space-y-2">
              {(["red", "yellow", "green", "grey"] as const).map((level) => {
                const items = allResults.filter((r) => r.level === level);
                if (items.length === 0) return null;
                const config = levelConfig[level];
                return (
                  <div key={level}>
                    <div className="text-xs font-semibold text-muted-foreground mb-1.5 mt-3">{config.label}</div>
                    {items.map((item) => (
                      <div key={item.id} className={`${config.bg} border rounded-lg p-3 mb-2`}>
                        <div className="flex items-start justify-between gap-2">
                          <div className="flex items-start gap-2 min-w-0">
                            <span className="text-lg shrink-0">{item.platformIcon}</span>
                            <div className="min-w-0">
                              <div className="font-medium text-sm">{item.title}</div>
                              <div className="text-xs text-muted-foreground truncate">{item.url}</div>
                              <div className={`text-xs mt-0.5 ${config.text}`}>{item.detail}</div>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                );
              })}
            </div>
          </div>

          <div className="flex justify-center">
            <Button size="lg" className="px-8" onClick={() => setStep("strategy")}>
              确认处理 🔴 和 🟡 内容 →
            </Button>
          </div>
        </div>
      )}

      {/* ============ STRATEGY ============ */}
      {step === "strategy" && (
        <div className="space-y-4">
          <div className="rounded-xl border bg-card p-6">
            <h2 className="font-semibold mb-1">🎯 策略分配</h2>
            <p className="text-sm text-muted-foreground mb-4">
              Orchestrator 根据内容类型自动分配最优 Skill
            </p>

            <div className="space-y-3">
              {allResults.filter((r) => r.level === "red" || r.level === "yellow").map((item) => (
                <div key={item.id} className="flex items-center gap-3 p-3 rounded-lg border bg-muted/30">
                  <span className="text-lg">{item.platformIcon}</span>
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-medium truncate">{item.title}</div>
                    <div className="text-xs text-muted-foreground">{item.detail}</div>
                  </div>
                  <div className="flex items-center gap-1">
                    <span className="text-sm">→</span>
                  </div>
                  <div className="flex items-center gap-1.5 bg-background border rounded-full px-3 py-1.5 shrink-0">
                    <span>{item.skillIcon}</span>
                    <span className="text-xs font-medium">{item.assignedSkill}</span>
                  </div>
                </div>
              ))}
            </div>

            {/* Strategy summary */}
            <div className="mt-6 p-4 rounded-lg bg-blue-50 border border-blue-200">
              <div className="text-sm font-semibold text-blue-800 mb-2">📋 执行计划</div>
              <div className="text-xs text-blue-700 space-y-1">
                <p>• <strong>Negotiator</strong> 将私信 3 位内容发布者（百度文库、微博博主、脉脉）</p>
                <p>• <strong>Reporter</strong> 将提交 3 条举报（知乎、论坛、小红书）</p>
                <p>• <strong>SEO Diluter</strong> 将制定正面内容发布策略</p>
                <p>• <strong>Data Broker Cleanup</strong> 将检查并清理数据经纪人</p>
                <p>• 如果 48h 内协商无果 → 自动升级到 Reporter</p>
                <p>• 如果 7 天内举报无果 → 自动升级到 Legal Action</p>
              </div>
            </div>
          </div>

          <div className="flex justify-center">
            <Button size="lg" className="px-8" onClick={() => setStep("executing")}>
              ⚡ 开始执行
            </Button>
          </div>
        </div>
      )}

      {/* ============ EXECUTING ============ */}
      {step === "executing" && (
        <div className="space-y-4">
          <div className="rounded-xl border bg-card p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-semibold">⚡ 多 Skill 并行执行中</h2>
              <span className="text-sm text-muted-foreground font-mono">
                {executionIndex}/{executionSteps.length}
              </span>
            </div>
            <div className="w-full h-2 bg-muted rounded-full overflow-hidden mb-4">
              <div
                className="h-full bg-violet-500 rounded-full transition-all duration-300"
                style={{ width: `${(executionIndex / executionSteps.length) * 100}%` }}
              />
            </div>
            <div className="space-y-2 max-h-[500px] overflow-y-auto">
              {executionLog.map((log, i) => (
                <div key={i} className="flex items-start gap-3 p-2.5 rounded-lg bg-muted/30 animate-in fade-in slide-in-from-bottom-2">
                  <span className="text-lg shrink-0">{log.icon}</span>
                  <div className="flex-1 min-w-0">
                    <div className="text-sm">{log.text}</div>
                    <div className="text-xs text-muted-foreground mt-0.5 flex items-center gap-2">
                      <span className="font-mono">{log.time}</span>
                      <span className="bg-muted rounded px-1.5 py-0.5">{log.skill}</span>
                    </div>
                  </div>
                </div>
              ))}
              {step === "executing" && executionIndex < executionSteps.length && (
                <div className="flex items-center gap-2 p-2.5 text-muted-foreground">
                  <span className="animate-spin">⏳</span>
                  <span className="text-sm">执行中...</span>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* ============ DONE ============ */}
      {step === "done" && (
        <div className="space-y-4">
          <div className="rounded-xl border bg-card p-6">
            <div className="text-center py-4">
              <div className="text-5xl mb-4">🎉</div>
              <h2 className="text-xl font-bold mb-2">第一轮处理完成</h2>
              <p className="text-sm text-muted-foreground max-w-md mx-auto">
                已自动联系 3 位发布者，提交 4 条举报，制定 SEO 稀释策略。Agent 将持续跟进并自动升级。
              </p>
            </div>

            {/* Summary cards */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-6">
              <SummaryCard icon="💬" label="已联系" value="3" desc="等待回复中" />
              <SummaryCard icon="🚨" label="已举报" value="4" desc="平台处理中" />
              <SummaryCard icon="📈" label="SEO 策略" value="1" desc="已制定计划" />
              <SummaryCard icon="📊" label="监控" value="ON" desc="每周自动扫描" />
            </div>

            {/* Escalation timeline */}
            <div className="mt-6 p-4 rounded-lg bg-muted/50">
              <div className="text-sm font-semibold mb-3">📅 自动升级时间线</div>
              <div className="space-y-2 text-xs">
                <TimelineItem time="48h 后" text="检查协商结果 — 未回复自动转 Reporter 举报" active />
                <TimelineItem time="72h 后" text="微博负面帖 — 如协商失败，启动 SEO 稀释" active={false} />
                <TimelineItem time="7 天后" text="检查举报结果 — 未处理的提交 Legal Action" active={false} />
                <TimelineItem time="14 天后" text="向网信办/工信部提交正式投诉" active={false} />
                <TimelineItem time="30 天后" text="全面评估 — 生成处理效果报告" active={false} />
              </div>
            </div>
          </div>

          <div className="flex justify-center gap-3">
            <Button variant="outline" onClick={onReset}>← 返回首页</Button>
            <Button onClick={() => {
              setStep("scanning");
              setScanProgress(0);
              setScanLog([]);
              setResults([]);
              setExecutionLog([]);
              setExecutionIndex(0);
            }}>
              🔄 重新演示
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}

function SummaryCard({ icon, label, value, desc }: { icon: string; label: string; value: string; desc: string }) {
  return (
    <div className="rounded-lg border bg-background p-3 text-center">
      <div className="text-xl mb-1">{icon}</div>
      <div className="text-xl font-bold">{value}</div>
      <div className="text-xs font-medium">{label}</div>
      <div className="text-[10px] text-muted-foreground">{desc}</div>
    </div>
  );
}

function TimelineItem({ time, text, active }: { time: string; text: string; active: boolean }) {
  return (
    <div className="flex items-start gap-3">
      <div className={`w-1.5 h-1.5 rounded-full mt-1.5 shrink-0 ${active ? "bg-blue-500" : "bg-muted-foreground/30"}`} />
      <div>
        <span className="font-mono font-semibold text-muted-foreground">{time}</span>
        <span className="text-muted-foreground ml-2">{text}</span>
      </div>
    </div>
  );
}
