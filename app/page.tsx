"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { DemoFlow } from "@/components/demo/demo-flow";
import { ArchitectureTree } from "@/components/demo/architecture-tree";

export default function HomePage() {
  const [name, setName] = useState("");
  const [started, setStarted] = useState(false);

  if (started) {
    return <DemoFlow userName={name} onReset={() => setStarted(false)} />;
  }

  return (
    <div className="min-h-[calc(100vh-3.5rem)]">
      {/* Hero */}
      <section className="flex flex-col items-center justify-center px-4 pt-20 pb-16">
        <div className="inline-flex items-center gap-2 rounded-full border px-4 py-1.5 text-sm text-muted-foreground mb-6">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
          </span>
          Powered by AI Agent Skills
        </div>
        <h1 className="text-5xl sm:text-6xl font-bold tracking-tight text-center max-w-3xl leading-tight">
          你的<span className="bg-gradient-to-r from-blue-600 to-violet-600 bg-clip-text text-transparent">个人公关</span> Agent
        </h1>
        <p className="mt-4 text-lg text-muted-foreground text-center max-w-xl">
          像明星经纪人一样管理你的数字身份。扫描、协商、举报、稀释 — 全自动执行。
        </p>

        <form
          onSubmit={(e) => { e.preventDefault(); if (name.trim()) setStarted(true); }}
          className="mt-10 flex gap-3 w-full max-w-md"
        >
          <Input
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="输入你的姓名，开始体验"
            className="h-12 text-base"
            required
          />
          <Button type="submit" size="lg" className="h-12 px-6 text-base shrink-0" disabled={!name.trim()}>
            开始 Demo
          </Button>
        </form>

        <p className="mt-3 text-xs text-muted-foreground">
          这是一个模拟演示 — 不会进行真实搜索
        </p>
      </section>

      {/* Skills Overview */}
      <section className="px-4 pb-16">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-2xl font-bold text-center mb-2">Skill 架构</h2>
          <p className="text-center text-muted-foreground mb-8">
            一个 Orchestrator 调度 7 个专业 Skill，像经纪团队一样协作
          </p>
          <ArchitectureTree />
        </div>
      </section>

      {/* How it works */}
      <section className="px-4 pb-20 border-t pt-16">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-2xl font-bold text-center mb-10">执行逻辑：先礼后兵</h2>
          <div className="space-y-0">
            {[
              { day: "Day 0", icon: "🔍", title: "扫描发现", desc: "Scanner Skill 全网搜索，分类标记所有相关内容" },
              { day: "Day 0", icon: "💬", title: "友好协商", desc: "Negotiator Skill 以礼貌方式私信内容发布者，请求删除/修改" },
              { day: "Day 2", icon: "⏰", title: "等待响应", desc: "追踪已联系对象的响应状态，自动判断是否需要升级" },
              { day: "Day 3", icon: "🚨", title: "平台举报", desc: "Reporter Skill 对未回应的内容发起平台举报" },
              { day: "Day 3", icon: "📈", title: "信息稀释", desc: "SEO Diluter Skill 在高权重平台发布正面内容，压制负面结果" },
              { day: "Day 7+", icon: "⚖️", title: "法律手段", desc: "Legal Skill 发送律师函、提交监管投诉，最后手段" },
              { day: "持续", icon: "📊", title: "舆情监控", desc: "Monitor Skill 每周扫描，确认效果，发现新内容" },
            ].map((step, i) => (
              <div key={i} className="flex gap-4 group">
                <div className="flex flex-col items-center">
                  <div className="text-xs text-muted-foreground font-mono w-12 text-right shrink-0 pt-1">{step.day}</div>
                </div>
                <div className="flex flex-col items-center">
                  <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center text-lg shrink-0">
                    {step.icon}
                  </div>
                  {i < 6 && <div className="w-px h-8 bg-border" />}
                </div>
                <div className="pb-8">
                  <div className="font-semibold">{step.title}</div>
                  <div className="text-sm text-muted-foreground">{step.desc}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
