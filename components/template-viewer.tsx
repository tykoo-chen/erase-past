"use client";

import { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import type { TemplateMetadata } from "@/lib/types";

const CATEGORY_LABELS: Record<string, string> = {
  platform: "平台投诉",
  legal: "法律文书",
  generic: "通用模板",
};

export function TemplateLibrary() {
  const [templates, setTemplates] = useState<TemplateMetadata[]>([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState<TemplateMetadata | null>(null);
  const [content, setContent] = useState("");
  const [variables, setVariables] = useState<Record<string, string>>({
    "姓名": "",
    URL: "",
    email: "",
  });
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    fetch("/api/templates")
      .then((res) => res.json())
      .then((data) => setTemplates(data.templates))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  async function loadTemplate(slug: string) {
    const params = new URLSearchParams({ slug });
    for (const [key, val] of Object.entries(variables)) {
      if (val) params.set(key, val);
    }
    const res = await fetch(`/api/templates?${params}`);
    const data = await res.json();
    setContent(data.content);
  }

  async function handleSelect(t: TemplateMetadata) {
    setSelected(t);
    await loadTemplate(t.slug);
  }

  async function copyToClipboard() {
    await navigator.clipboard.writeText(content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  if (loading) {
    return <div className="text-center py-12 text-muted-foreground">加载中...</div>;
  }

  const grouped = {
    platform: templates.filter((t) => t.category === "platform"),
    legal: templates.filter((t) => t.category === "legal"),
    generic: templates.filter((t) => t.category === "generic"),
  };

  return (
    <div className="space-y-8">
      {Object.entries(grouped).map(
        ([category, items]) =>
          items.length > 0 && (
            <div key={category}>
              <h2 className="text-lg font-semibold mb-3">
                {CATEGORY_LABELS[category]}
              </h2>
              <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                {items.map((t) => (
                  <Card
                    key={t.slug}
                    className={`cursor-pointer hover:shadow-md transition-shadow ${
                      selected?.slug === t.slug ? "ring-2 ring-primary" : ""
                    }`}
                    onClick={() => handleSelect(t)}
                  >
                    <CardContent className="pt-4 space-y-2">
                      <h3 className="font-medium text-sm">{t.name}</h3>
                      <Badge variant="outline" className="text-xs">
                        {CATEGORY_LABELS[t.category]}
                      </Badge>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          )
      )}

      {/* Template detail panel */}
      {selected && content && (
        <div className="border rounded-lg p-6 space-y-4">
          <h2 className="text-lg font-semibold">{selected.name}</h2>
          <div className="grid gap-2 sm:grid-cols-4">
            {Object.keys(variables).map((key) => (
              <Input
                key={key}
                placeholder={key}
                value={variables[key]}
                onChange={(e) =>
                  setVariables((prev) => ({ ...prev, [key]: e.target.value }))
                }
              />
            ))}
            <Button variant="outline" size="sm" onClick={() => loadTemplate(selected.slug)}>
              填充变量
            </Button>
          </div>
          <pre className="bg-muted p-4 rounded text-sm whitespace-pre-wrap overflow-x-auto max-h-96 overflow-y-auto">
            {content}
          </pre>
          <Button onClick={copyToClipboard}>
            {copied ? "已复制" : "复制到剪贴板"}
          </Button>
        </div>
      )}
    </div>
  );
}
