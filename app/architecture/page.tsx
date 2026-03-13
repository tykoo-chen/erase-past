"use client";

import { ArchitectureTree } from "@/components/demo/architecture-tree";

export default function ArchitecturePage() {
  return (
    <div className="max-w-6xl mx-auto px-4 py-12">
      <div className="text-center mb-10">
        <h1 className="text-3xl font-bold mb-2">Privacy Eraser 架构</h1>
        <p className="text-muted-foreground">
          1 个 Orchestrator + 7 个专业 Skill，ACP 协议通信，MCP 工具调用
        </p>
      </div>

      <ArchitectureTree />

      {/* Execution Logic */}
      <div className="mt-16 grid md:grid-cols-2 gap-8">
        {/* Skill Execution Logic */}
        <div className="rounded-xl border bg-card p-6">
          <h2 className="font-bold text-lg mb-4">① Skill 之间的执行逻辑</h2>
          <div className="font-mono text-xs leading-relaxed space-y-0 whitespace-pre text-muted-foreground overflow-x-auto">
{`用户输入姓名
│
▼
┌──────────────────────────┐
│  🎯 Privacy Eraser       │
│     Orchestrator         │
└──────────┬───────────────┘
           │
     ┌─────▼─────┐
     │ 🔍 Scanner │ ← 第一个执行
     └─────┬─────┘
           │ 返回分类结果
     ┌─────▼─────────────────────┐
     │ 用户确认处理方向            │
     └─────┬─────────────────────┘
           │
     ┌─────▼─────────────────────────┐
     │ Orchestrator 策略决策树        │
     │                               │
     │  隐私泄露 ──→ 💬 Negotiator   │
     │  有发布者     (先礼后兵)       │
     │       │                       │
     │  匿名内容 ──→ 🚨 Reporter    │
     │  严重泄露     (直接举报)       │
     │       │                       │
     │  过时信息 ──→ 💬 Negotiator   │
     │               (请求更新)       │
     │       │                       │
     │  负面但真 ──→ 📈 SEO Diluter │
     │  无法删除     (信息稀释)       │
     │       │                       │
     │  数据买卖 ──→ 🗑️ Data Broker │
     │               (Opt-out)       │
     └──────┬────────────────────────┘
            │
      ┌─────▼──────────────────────┐
      │  ⏰ 时间升级引擎            │
      │                            │
      │  48h 无回复                │
      │  💬 Negotiator             │
      │     → 🚨 Reporter          │
      │                            │
      │  7 天无结果                 │
      │  🚨 Reporter               │
      │     → ⚖️ Legal Action      │
      │                            │
      │  始终无法删除               │
      │     → 📈 SEO Diluter       │
      └─────┬──────────────────────┘
            │
      ┌─────▼──────────────────────┐
      │  📊 Reputation Monitor     │
      │  每周扫描 + 效果追踪        │
      └────────────────────────────┘`}
          </div>
        </div>

        {/* Agent Execution Logic (without Skills) */}
        <div className="rounded-xl border bg-card p-6">
          <h2 className="font-bold text-lg mb-4">② Agent 之间的执行逻辑（无 Skill）</h2>
          <div className="font-mono text-xs leading-relaxed space-y-0 whitespace-pre text-muted-foreground overflow-x-auto">
{`用户消息（Telegram / Chat）
│
▼
┌──────────────────────────────┐
│  🤖 主 Agent (LLM)           │
│  理解意图 + 制定计划          │
│                              │
│  MCP Tools:                  │
│  ├─ web_search    搜索引擎   │
│  ├─ browser       浏览器     │
│  ├─ file_system   文件读写   │
│  └─ cron          定时任务   │
└──────────┬───────────────────┘
           │
           │  ACP 协议（未来）
           │
     ┌─────▼───────────────────┐
     │  🔍 搜索子 Agent         │
     │  执行多条搜索 query      │
     │  调用 web_search MCP    │
     │  返回结构化结果          │
     └─────┬───────────────────┘
           │
     ┌─────▼───────────────────┐
     │  🧠 分析子 Agent         │
     │  对结果进行分类          │
     │  判断风险等级            │
     │  推荐处理策略            │
     └─────┬───────────────────┘
           │
     ┌─────▼───────────────────┐
     │  🔧 执行子 Agent         │
     │                         │
     │  并行执行:              │
     │  ├─ 浏览器A → 私信平台1  │
     │  ├─ 浏览器B → 举报平台2  │
     │  └─ 浏览器C → 删快照    │
     │                         │
     │  调用 browser MCP       │
     │  navigate / click /     │
     │  fill / screenshot      │
     └─────┬───────────────────┘
           │
     ┌─────▼───────────────────┐
     │  📊 监控子 Agent         │
     │  cron MCP 注册定时任务   │
     │  定期重新搜索            │
     │  对比状态变化            │
     │  触发升级逻辑            │
     └────────────────────────┘

  ┌─────────────────────────────┐
  │  关键区别：                  │
  │                             │
  │  Skill 模式:                │
  │  Orchestrator 通过 ACP 调度 │
  │  每个 Skill 独立、可复用    │
  │  Skill 自带 SKILL.md 指令  │
  │                             │
  │  纯 Agent 模式:             │
  │  主 Agent 直接用 MCP 工具   │
  │  子 Agent 是 LLM 的内部分工│
  │  没有独立的 Skill 定义      │
  │  灵活但不可复用             │
  └─────────────────────────────┘`}
          </div>
        </div>
      </div>

      {/* Protocol comparison */}
      <div className="mt-8 rounded-xl border bg-card p-6">
        <h2 className="font-bold text-lg mb-4">协议对照</h2>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b">
                <th className="text-left py-2 pr-4 font-semibold">层级</th>
                <th className="text-left py-2 pr-4 font-semibold">协议</th>
                <th className="text-left py-2 pr-4 font-semibold">连接</th>
                <th className="text-left py-2 font-semibold">在本系统中</th>
              </tr>
            </thead>
            <tbody className="text-muted-foreground">
              <tr className="border-b">
                <td className="py-2 pr-4">用户层</td>
                <td className="py-2 pr-4 font-mono text-xs">Telegram Bot API</td>
                <td className="py-2 pr-4">用户 → Agent</td>
                <td className="py-2">用户通过 Telegram 发消息触发</td>
              </tr>
              <tr className="border-b">
                <td className="py-2 pr-4">工具层</td>
                <td className="py-2 pr-4 font-mono text-xs">MCP</td>
                <td className="py-2 pr-4">Agent → 工具</td>
                <td className="py-2">Agent 调用 browser、web_search、cron</td>
              </tr>
              <tr className="border-b">
                <td className="py-2 pr-4">Agent 层</td>
                <td className="py-2 pr-4 font-mono text-xs">ACP</td>
                <td className="py-2 pr-4">Agent → Agent</td>
                <td className="py-2">Orchestrator 调度 Scanner / Negotiator / Reporter...</td>
              </tr>
              <tr>
                <td className="py-2 pr-4">知识层</td>
                <td className="py-2 pr-4 font-mono text-xs">Skill (SKILL.md)</td>
                <td className="py-2 pr-4">指令 → Agent</td>
                <td className="py-2">每个 Skill 有独立 SKILL.md 定义行为</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
