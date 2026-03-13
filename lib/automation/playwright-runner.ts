import { chromium, type Browser, type BrowserContext, type Page } from "playwright";

let browser: Browser | null = null;

async function getBrowser(): Promise<Browser> {
  if (!browser || !browser.isConnected()) {
    browser = await chromium.launch({
      headless: process.env.PLAYWRIGHT_HEADLESS !== "false",
    });
  }
  return browser;
}

export async function createSession(): Promise<{
  context: BrowserContext;
  page: Page;
  close: () => Promise<void>;
}> {
  const b = await getBrowser();
  const context = await b.newContext({
    locale: "zh-CN",
    viewport: { width: 1280, height: 800 },
  });
  const page = await context.newPage();

  return {
    context,
    page,
    close: async () => {
      await context.close();
    },
  };
}

export async function takeScreenshot(
  page: Page,
  path: string
): Promise<string> {
  await page.screenshot({ path, fullPage: false });
  return path;
}

export async function closeBrowser(): Promise<void> {
  if (browser) {
    await browser.close();
    browser = null;
  }
}
