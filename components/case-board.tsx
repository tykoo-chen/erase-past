"use client";

import { useEffect, useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CaseCard } from "./case-card";
import type { Case, CaseStatus } from "@/lib/types";

const TABS: { value: string; label: string }[] = [
  { value: "all", label: "全部" },
  { value: "pending", label: "待处理" },
  { value: "reported", label: "已举报" },
  { value: "following", label: "跟进中" },
  { value: "resolved", label: "已解决" },
  { value: "failed", label: "失败" },
];

export function CaseBoard() {
  const [cases, setCases] = useState<Case[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("all");

  useEffect(() => {
    fetchCases();
  }, []);

  async function fetchCases() {
    try {
      const res = await fetch("/api/cases");
      const data = await res.json();
      setCases(data.cases);
    } catch (err) {
      console.error("Failed to fetch cases:", err);
    } finally {
      setLoading(false);
    }
  }

  const filteredCases =
    activeTab === "all"
      ? cases
      : cases.filter((c) => c.status === (activeTab as CaseStatus));

  if (loading) {
    return <div className="text-center py-12 text-muted-foreground">加载中...</div>;
  }

  return (
    <Tabs value={activeTab} onValueChange={setActiveTab}>
      <TabsList className="flex-wrap">
        {TABS.map((tab) => {
          const count = tab.value === "all" ? cases.length : cases.filter((c) => c.status === tab.value).length;
          return (
            <TabsTrigger key={tab.value} value={tab.value}>
              {tab.label} ({count})
            </TabsTrigger>
          );
        })}
      </TabsList>
      {TABS.map((tab) => (
        <TabsContent key={tab.value} value={tab.value} className="mt-4">
          {filteredCases.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground">
              暂无案例
            </div>
          ) : (
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {filteredCases.map((c) => (
                <CaseCard key={c.id} case={c} />
              ))}
            </div>
          )}
        </TabsContent>
      ))}
    </Tabs>
  );
}
