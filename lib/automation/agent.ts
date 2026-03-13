/**
 * AI Agent for automated reporting.
 *
 * This module orchestrates the automated report process:
 * 1. Launches a headless browser session
 * 2. Navigates to the target platform
 * 3. Uses step hints from platform scripts as guidance
 * 4. Optionally uses Claude API to analyze page and decide actions
 * 5. Reports progress via callback
 *
 * Note: Full AI-driven automation requires ANTHROPIC_API_KEY.
 * Without it, the agent runs in "guided mode" using only the step hints.
 */

import { createSession, takeScreenshot } from "./playwright-runner";
import type { AutomationScript, StepHint } from "./scripts/types";
import { zhihuReport } from "./scripts/zhihu";
import { weiboReport } from "./scripts/weibo";
import { baiduWenkuReport } from "./scripts/baidu-wenku";
import path from "path";

const SCRIPTS: Record<string, AutomationScript> = {
  zhihu: zhihuReport,
  weibo: weiboReport,
  baidu_wenku: baiduWenkuReport,
};

export interface AgentProgress {
  step: number;
  action: string;
  status: "running" | "completed" | "failed";
  screenshotPath?: string;
}

export type ProgressCallback = (progress: AgentProgress) => void;

export async function runAutomatedReport(
  targetUrl: string,
  platform: string,
  caseId: string,
  onProgress: ProgressCallback
): Promise<{ success: boolean; error?: string }> {
  const script = SCRIPTS[platform];
  if (!script) {
    return {
      success: false,
      error: `不支持自动举报平台: ${platform}。请使用模板手动举报。`,
    };
  }

  const { page, close } = await createSession();
  const screenshotsDir = path.join(process.cwd(), "cases", "screenshots", caseId);

  try {
    // Navigate to target URL
    const startUrl =
      typeof script.startUrl === "function"
        ? script.startUrl(targetUrl)
        : script.startUrl;

    onProgress({ step: 1, action: `正在打开 ${startUrl}`, status: "running" });
    await page.goto(startUrl, { waitUntil: "domcontentloaded", timeout: 30000 });
    onProgress({ step: 1, action: `已打开目标页面`, status: "completed" });

    // Execute step hints
    for (let i = 0; i < script.stepHints.length; i++) {
      const hint = script.stepHints[i];
      const stepNum = i + 2;

      onProgress({
        step: stepNum,
        action: hint.description,
        status: "running",
      });

      try {
        await executeStep(page, hint);

        // Take screenshot after each step
        const ssPath = path.join(screenshotsDir, `step-${stepNum}.png`);
        try {
          await takeScreenshot(page, ssPath);
          onProgress({
            step: stepNum,
            action: hint.description,
            status: "completed",
            screenshotPath: ssPath,
          });
        } catch {
          onProgress({
            step: stepNum,
            action: hint.description,
            status: "completed",
          });
        }
      } catch (err) {
        onProgress({
          step: stepNum,
          action: `${hint.description} - 失败: ${err}`,
          status: "failed",
        });
      }

      // Small delay between steps
      await page.waitForTimeout(1000);
    }

    // Check for success indicators
    const pageContent = await page.textContent("body");
    const success = script.successIndicators.some(
      (indicator) => pageContent?.includes(indicator)
    );

    return { success };
  } catch (err) {
    return { success: false, error: String(err) };
  } finally {
    await close();
  }
}

async function executeStep(page: import("playwright").Page, hint: StepHint): Promise<void> {
  switch (hint.action) {
    case "navigate":
      // Already navigated in main flow
      break;

    case "find_and_click":
      if (hint.target) {
        // Try to find element by text content
        const element = page.getByText(hint.target, { exact: false }).first();
        await element.click({ timeout: 10000 });
      }
      break;

    case "fill":
      if (hint.target && hint.text) {
        const input = page.getByPlaceholder(hint.target).or(
          page.getByLabel(hint.target)
        ).first();
        await input.fill(hint.text, { timeout: 10000 });
      }
      break;

    case "screenshot":
      // Handled in main loop
      break;

    case "wait":
      await page.waitForTimeout(2000);
      break;
  }
}
