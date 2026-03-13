"use client";

import { useState } from "react";

const skills = [
  {
    id: "scanner",
    icon: "🔍",
    name: "Scanner",
    nameCn: "网络扫描",
    color: "from-blue-500/20 to-blue-600/20 border-blue-500/30",
    textColor: "text-blue-600",
    desc: "全网搜索用户信息，分类标记风险等级",
    capabilities: ["搜索引擎扫描", "平台定向扫描", "数据经纪人检查", "LLM 提及检测"],
    inputs: "用户姓名、别名、关联信息",
    outputs: "分类结果列表（🔴🟡🟢⚪）",
  },
  {
    id: "negotiator",
    icon: "💬",
    name: "Negotiator",
    nameCn: "友好协商",
    color: "from-emerald-500/20 to-emerald-600/20 border-emerald-500/30",
    textColor: "text-emerald-600",
    desc: "通过私信与内容发布者友好沟通，请求删除/修改",
    capabilities: ["友好私信", "正式跟进", "法律提醒", "响应追踪"],
    inputs: "目标 URL、发布者信息、模板选择",
    outputs: "联系状态、对方响应、协商结果",
  },
  {
    id: "reporter",
    icon: "🚨",
    name: "Reporter",
    nameCn: "跨平台举报",
    color: "from-red-500/20 to-red-600/20 border-red-500/30",
    textColor: "text-red-600",
    desc: "在各平台提交正式举报，包括隐私投诉和搜索引擎快照删除",
    capabilities: ["平台举报", "快照删除", "监管投诉（网信办/工信部）", "DMCA Takedown"],
    inputs: "目标 URL、举报类型、证据材料",
    outputs: "举报编号、处理状态、结果通知",
  },
  {
    id: "seo-diluter",
    icon: "📈",
    name: "SEO Diluter",
    nameCn: "信息稀释",
    color: "from-violet-500/20 to-violet-600/20 border-violet-500/30",
    textColor: "text-violet-600",
    desc: "在高权重平台发布正面内容，SEO/GEO 双重优化压制负面信息",
    capabilities: ["正面内容策略", "SEO 优化", "GEO 优化（AI搜索）", "多平台分发"],
    inputs: "用户理想形象、目标关键词",
    outputs: "内容发布清单、排名变化追踪",
  },
  {
    id: "data-broker",
    icon: "🗑️",
    name: "Data Broker Cleanup",
    nameCn: "数据经纪人清理",
    color: "from-orange-500/20 to-orange-600/20 border-orange-500/30",
    textColor: "text-orange-600",
    desc: "在数据经纪商网站提交 Opt-out 请求，阻止个人信息被交易",
    capabilities: ["经纪人识别", "Opt-out 提交", "删除验证", "定期复查"],
    inputs: "用户个人信息",
    outputs: "提交状态、删除确认、复查报告",
  },
  {
    id: "legal",
    icon: "⚖️",
    name: "Legal Action",
    nameCn: "法律行动",
    color: "from-amber-500/20 to-amber-600/20 border-amber-500/30",
    textColor: "text-amber-600",
    desc: "生成律师函、GDPR/个保法请求，向监管机构投诉",
    capabilities: ["律师函生成", "GDPR 删除请求", "个保法投诉", "网信办举报"],
    inputs: "侵权证据、法律依据、目标方信息",
    outputs: "法律文书、投诉编号、处理进度",
  },
  {
    id: "monitor",
    icon: "📊",
    name: "Reputation Monitor",
    nameCn: "舆情监控",
    color: "from-cyan-500/20 to-cyan-600/20 border-cyan-500/30",
    textColor: "text-cyan-600",
    desc: "定期扫描互联网，追踪已处理内容状态，发现新内容及时预警",
    capabilities: ["定期扫描", "状态追踪", "新内容预警", "效果评估"],
    inputs: "监控关键词、已处理 URL 列表",
    outputs: "周报、预警通知、效果评分",
  },
];

export function ArchitectureTree() {
  const [expanded, setExpanded] = useState<string | null>(null);

  return (
    <div className="relative">
      {/* Orchestrator */}
      <div className="flex justify-center mb-6">
        <div className="bg-gradient-to-r from-primary/10 to-primary/5 border border-primary/20 rounded-xl px-6 py-4 text-center max-w-sm">
          <div className="text-2xl mb-1">🎯</div>
          <div className="font-bold text-lg">Privacy Eraser</div>
          <div className="text-sm text-muted-foreground">Orchestrator Skill</div>
          <div className="text-xs text-muted-foreground mt-1">调度所有子 Skill，管理执行流程和升级逻辑</div>
        </div>
      </div>

      {/* Connection line */}
      <div className="flex justify-center mb-6">
        <div className="w-px h-8 bg-border" />
      </div>

      {/* Skills grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
        {skills.map((skill) => (
          <button
            key={skill.id}
            onClick={() => setExpanded(expanded === skill.id ? null : skill.id)}
            className={`text-left bg-gradient-to-br ${skill.color} border rounded-xl p-4 transition-all hover:scale-[1.02] active:scale-[0.98] cursor-pointer`}
          >
            <div className="flex items-center gap-2 mb-1">
              <span className="text-xl">{skill.icon}</span>
              <div>
                <div className="font-semibold text-sm">{skill.name}</div>
                <div className="text-xs text-muted-foreground">{skill.nameCn}</div>
              </div>
            </div>
            <div className="text-xs text-muted-foreground mt-2 line-clamp-2">{skill.desc}</div>

            {expanded === skill.id && (
              <div className="mt-3 pt-3 border-t border-current/10 space-y-2 animate-in fade-in slide-in-from-top-1">
                <div>
                  <div className="text-[10px] uppercase tracking-wider text-muted-foreground font-semibold">能力</div>
                  <div className="flex flex-wrap gap-1 mt-1">
                    {skill.capabilities.map((cap) => (
                      <span key={cap} className="text-[11px] bg-background/50 rounded px-1.5 py-0.5">{cap}</span>
                    ))}
                  </div>
                </div>
                <div>
                  <div className="text-[10px] uppercase tracking-wider text-muted-foreground font-semibold">输入</div>
                  <div className="text-[11px] mt-0.5">{skill.inputs}</div>
                </div>
                <div>
                  <div className="text-[10px] uppercase tracking-wider text-muted-foreground font-semibold">输出</div>
                  <div className="text-[11px] mt-0.5">{skill.outputs}</div>
                </div>
              </div>
            )}
          </button>
        ))}
      </div>

      {/* Protocol labels */}
      <div className="flex justify-center gap-6 mt-6 text-xs text-muted-foreground">
        <div className="flex items-center gap-1.5">
          <div className="w-2 h-2 rounded-full bg-blue-500" />
          MCP 工具调用
        </div>
        <div className="flex items-center gap-1.5">
          <div className="w-2 h-2 rounded-full bg-violet-500" />
          ACP Agent 通信
        </div>
        <div className="flex items-center gap-1.5">
          <div className="w-2 h-2 rounded-full bg-emerald-500" />
          浏览器自动化
        </div>
      </div>
    </div>
  );
}
