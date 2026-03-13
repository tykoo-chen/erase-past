import { NextRequest, NextResponse } from "next/server";
import { getCase, updateCase } from "@/lib/store";
import { getPlatformInfo } from "@/lib/platforms";

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const c = await getCase(id);
  if (!c) {
    return NextResponse.json({ error: "not found" }, { status: 404 });
  }
  const platformInfo = getPlatformInfo(c.platform);
  return NextResponse.json({ case: c, platformInfo });
}

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const body = await req.json();
  const updated = await updateCase(id, body);
  if (!updated) {
    return NextResponse.json({ error: "not found" }, { status: 404 });
  }
  return NextResponse.json({ case: updated });
}
