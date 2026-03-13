export interface AutomationScript {
  platform: string;
  goal: string;
  startUrl: string | ((targetUrl: string) => string);
  stepHints: StepHint[];
  successIndicators: string[];
  formData: Record<string, string>;
}

export interface StepHint {
  action: "navigate" | "find_and_click" | "fill" | "screenshot" | "wait";
  target?: string;
  text?: string;
  description: string;
}
