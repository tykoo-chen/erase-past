import { NextRequest, NextResponse } from "next/server";
import { listTemplates, getTemplate } from "@/lib/templates";

export async function GET(req: NextRequest) {
  const slug = req.nextUrl.searchParams.get("slug");

  if (slug) {
    // Get single template with variable substitution
    const variables: Record<string, string> = {};
    req.nextUrl.searchParams.forEach((val, key) => {
      if (key !== "slug") variables[key] = val;
    });
    const result = await getTemplate(slug, variables);
    if (!result) {
      return NextResponse.json({ error: "template not found" }, { status: 404 });
    }
    return NextResponse.json(result);
  }

  const templates = await listTemplates();
  return NextResponse.json({ templates });
}
