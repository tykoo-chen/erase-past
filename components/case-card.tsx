"use client";

import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { PlatformBadge } from "./platform-badge";
import type { Case } from "@/lib/types";

const STATUS_CONFIG: Record<string, { label: string; color: string }> = {
  pending: { label: "待处理", color: "bg-yellow-100 text-yellow-800" },
  reported: { label: "已举报", color: "bg-blue-100 text-blue-800" },
  following: { label: "跟进中", color: "bg-purple-100 text-purple-800" },
  resolved: { label: "已解决", color: "bg-green-100 text-green-800" },
  failed: { label: "失败", color: "bg-red-100 text-red-800" },
};

export function CaseCard({ case: c }: { case: Case }) {
  const statusInfo = STATUS_CONFIG[c.status] ?? { label: c.status, color: "bg-gray-100 text-gray-800" };

  return (
    <Link href={`/cases/${c.id}`}>
      <Card className="hover:shadow-md transition-shadow cursor-pointer">
        <CardContent className="pt-4 space-y-2">
          <div className="flex items-center justify-between">
            <PlatformBadge platform={c.platform} name={c.platform_name} />
            <Badge variant="outline" className={`${statusInfo.color} border-0`}>
              {statusInfo.label}
            </Badge>
          </div>
          <p className="text-sm truncate text-muted-foreground">{c.url}</p>
          {c.description && (
            <p className="text-xs text-muted-foreground line-clamp-1">{c.description}</p>
          )}
          <p className="text-xs text-muted-foreground">
            {new Date(c.created_at).toLocaleDateString("zh-CN")}
          </p>
        </CardContent>
      </Card>
    </Link>
  );
}
