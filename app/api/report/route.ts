import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";
import { getCase, updateCase, setTaskState, getTaskState } from "@/lib/store";
import type { ReportTaskState, ReportStep } from "@/lib/types";

export async function POST(req: NextRequest) {
  const body = await req.json();
  const { caseId } = body;

  if (!caseId) {
    return NextResponse.json({ error: "caseId is required" }, { status: 400 });
  }

  const c = await getCase(caseId);
  if (!c) {
    return NextResponse.json({ error: "case not found" }, { status: 404 });
  }

  const taskId = crypto.randomUUID().slice(0, 8);

  const state: ReportTaskState = {
    id: taskId,
    case_id: caseId,
    status: "running",
    steps: [],
  };
  setTaskState(taskId, state);

  // Update case with report task
  await updateCase(caseId, { report_task_id: taskId });

  // Run report in background (placeholder - will be replaced by AI agent)
  runReport(taskId, c.url, c.platform).catch((err) => {
    setTaskState(taskId, { ...state, status: "failed", error: String(err) });
  });

  return NextResponse.json({ taskId, status: "started" });
}

async function runReport(taskId: string, url: string, platform: string) {
  const steps: ReportStep[] = [];

  const addStep = (action: string, status: "running" | "completed" | "failed") => {
    const step: ReportStep = {
      step: steps.length + 1,
      action,
      status,
      timestamp: new Date().toISOString(),
    };
    steps.push(step);
    setTaskState<ReportTaskState>(taskId, {
      id: taskId,
      case_id: "",
      status: "running",
      steps: [...steps],
    });
  };

  // Placeholder automated steps (will be replaced by Playwright + AI agent)
  addStep(`正在打开 ${platform} 举报页面...`, "running");
  await delay(2000);
  steps[steps.length - 1].status = "completed";

  addStep("正在查找举报按钮...", "running");
  await delay(1500);
  steps[steps.length - 1].status = "completed";

  addStep("正在填写举报表单...", "running");
  await delay(2000);
  steps[steps.length - 1].status = "completed";

  addStep("正在提交举报...", "running");
  await delay(1000);
  steps[steps.length - 1].status = "completed";

  // Mark complete
  setTaskState<ReportTaskState>(taskId, {
    id: taskId,
    case_id: "",
    status: "completed",
    steps: [...steps],
  });
}

function delay(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

// SSE endpoint for report progress
export async function GET(req: NextRequest) {
  const taskId = req.nextUrl.searchParams.get("taskId");
  if (!taskId) {
    return NextResponse.json({ error: "taskId required" }, { status: 400 });
  }

  const encoder = new TextEncoder();
  const stream = new ReadableStream({
    async start(controller) {
      let lastStepCount = 0;

      const send = (event: string, data: unknown) => {
        controller.enqueue(
          encoder.encode(`event: ${event}\ndata: ${JSON.stringify(data)}\n\n`)
        );
      };

      const poll = setInterval(() => {
        const state = getTaskState<ReportTaskState>(taskId);
        if (!state) return;

        if (state.steps.length > lastStepCount) {
          for (let i = lastStepCount; i < state.steps.length; i++) {
            send("step", state.steps[i]);
          }
          lastStepCount = state.steps.length;
        }

        if (state.status === "completed") {
          send("complete", { success: true, taskId });
          clearInterval(poll);
          controller.close();
        } else if (state.status === "failed") {
          send("error", { error: state.error });
          clearInterval(poll);
          controller.close();
        }
      }, 500);

      setTimeout(() => {
        clearInterval(poll);
        try { controller.close(); } catch { /* already closed */ }
      }, 120000);
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
