import { NextRequest, NextResponse } from "next/server";
import { getCases, createCase } from "@/lib/store";
import type { CaseStatus } from "@/lib/types";

export async function GET(req: NextRequest) {
  const status = req.nextUrl.searchParams.get("status") as CaseStatus | null;
  const platform = req.nextUrl.searchParams.get("platform");
  const cases = await getCases({
    status: status ?? undefined,
    platform: platform ?? undefined,
  });
  return NextResponse.json({ cases, total: cases.length });
}

export async function POST(req: NextRequest) {
  const body = await req.json();
  const { url, description, risk_level, scan_task_id } = body;

  if (!url) {
    return NextResponse.json({ error: "url is required" }, { status: 400 });
  }

  const newCase = await createCase({ url, description, risk_level, scan_task_id });
  return NextResponse.json({ case: newCase }, { status: 201 });
}
