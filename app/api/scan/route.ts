import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";
import { generateSearchQueries, analyzeResult } from "@/lib/scanner";
import { searchWeb } from "@/lib/search-api";
import { saveScanResults, setTaskState, getTaskState } from "@/lib/store";
import type { ScanResult, ScanTaskState } from "@/lib/types";

export async function POST(req: NextRequest) {
  const body = await req.json();
  const { name, aliases, extras } = body;

  if (!name) {
    return NextResponse.json({ error: "name is required" }, { status: 400 });
  }

  const taskId = crypto.randomUUID().slice(0, 8);
  const allNames = [name, ...(aliases ?? [])];
  const allQueries: string[] = [];
  for (const n of allNames) {
    allQueries.push(...generateSearchQueries(n, extras));
  }

  // Initialize task state
  const state: ScanTaskState = {
    id: taskId,
    status: "running",
    progress: 0,
    total: allQueries.length,
    results: [],
  };
  setTaskState(taskId, state);

  // Run scan in background (non-blocking)
  runScan(taskId, allQueries, name).catch((err) => {
    const s = { ...state, status: "failed" as const, error: String(err) };
    setTaskState(taskId, s);
  });

  return NextResponse.json({ taskId, status: "started", total: allQueries.length });
}

async function runScan(taskId: string, queries: string[], name: string) {
  const results: ScanResult[] = [];

  for (let i = 0; i < queries.length; i++) {
    const state: ScanTaskState = {
      id: taskId,
      status: "running",
      progress: i + 1,
      total: queries.length,
      results: [...results],
    };
    setTaskState(taskId, state);

    const searchResults = await searchWeb(queries[i]);
    for (const sr of searchResults) {
      const analyzed = analyzeResult(sr, name);
      if (analyzed && !results.some((r) => r.url === analyzed.url)) {
        results.push(analyzed);
      }
    }
  }

  const finalState: ScanTaskState = {
    id: taskId,
    status: "completed",
    progress: queries.length,
    total: queries.length,
    results,
  };
  setTaskState(taskId, finalState);
  await saveScanResults(taskId, results);
}

// SSE endpoint for streaming scan progress
export async function GET(req: NextRequest) {
  const taskId = req.nextUrl.searchParams.get("taskId");
  if (!taskId) {
    return NextResponse.json({ error: "taskId required" }, { status: 400 });
  }

  const encoder = new TextEncoder();
  const stream = new ReadableStream({
    async start(controller) {
      let lastProgress = -1;
      let lastResultCount = 0;

      const send = (event: string, data: unknown) => {
        controller.enqueue(
          encoder.encode(`event: ${event}\ndata: ${JSON.stringify(data)}\n\n`)
        );
      };

      const poll = setInterval(() => {
        const state = getTaskStateHelper(taskId);
        if (!state) return;

        if (state.progress !== lastProgress) {
          send("progress", {
            progress: state.progress,
            total: state.total,
            status: state.status,
          });
          lastProgress = state.progress;
        }

        // Send new results
        if (state.results.length > lastResultCount) {
          for (let i = lastResultCount; i < state.results.length; i++) {
            send("result", state.results[i]);
          }
          lastResultCount = state.results.length;
        }

        if (state.status === "completed") {
          send("complete", {
            totalFound: state.results.length,
            highRisk: state.results.filter((r) => r.risk_level === "high").length,
            mediumRisk: state.results.filter((r) => r.risk_level === "medium").length,
          });
          clearInterval(poll);
          controller.close();
        } else if (state.status === "failed") {
          send("error", { error: state.error });
          clearInterval(poll);
          controller.close();
        }
      }, 500);

      // Timeout after 5 minutes
      setTimeout(() => {
        clearInterval(poll);
        try { controller.close(); } catch { /* already closed */ }
      }, 300000);
    },
  });

  return new Response(stream, {
    headers: {
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache",
      Connection: "keep-alive",
    },
  });
}

function getTaskStateHelper(taskId: string): ScanTaskState | undefined {
  return getTaskState<ScanTaskState>(taskId);
}
