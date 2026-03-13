"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export function ScanForm() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [aliases, setAliases] = useState("");
  const [extras, setExtras] = useState("");
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!name.trim()) return;

    setLoading(true);
    try {
      const res = await fetch("/api/scan", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: name.trim(),
          aliases: aliases ? aliases.split(",").map((s) => s.trim()).filter(Boolean) : undefined,
          extras: extras ? extras.split(",").map((s) => s.trim()).filter(Boolean) : undefined,
        }),
      });
      const data = await res.json();
      if (data.taskId) {
        // Save to localStorage
        localStorage.setItem("pe_name", name.trim());
        if (aliases) localStorage.setItem("pe_aliases", aliases);
        if (extras) localStorage.setItem("pe_extras", extras);
        router.push(`/scan?taskId=${data.taskId}`);
      }
    } catch (err) {
      console.error("Scan failed:", err);
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="w-full max-w-md space-y-4">
      <div>
        <Input
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="输入你的真实姓名"
          className="text-lg h-12"
          required
        />
      </div>

      {showAdvanced && (
        <div className="space-y-3 animate-in fade-in slide-in-from-top-2">
          <Input
            value={aliases}
            onChange={(e) => setAliases(e.target.value)}
            placeholder="别名/网名（逗号分隔）"
          />
          <Input
            value={extras}
            onChange={(e) => setExtras(e.target.value)}
            placeholder="公司/学校（逗号分隔）"
          />
        </div>
      )}

      <button
        type="button"
        onClick={() => setShowAdvanced(!showAdvanced)}
        className="text-sm text-muted-foreground hover:text-foreground transition-colors"
      >
        {showAdvanced ? "- 收起高级选项" : "+ 添加别名、公司等信息提高搜索精度"}
      </button>

      <Button type="submit" size="lg" className="w-full h-12 text-lg" disabled={loading || !name.trim()}>
        {loading ? "正在启动扫描..." : "开始扫描"}
      </Button>
    </form>
  );
}
