import type { AutomationScript } from "./types";

export const weiboReport: AutomationScript = {
  platform: "weibo",
  goal: "在微博上举报内容侵犯个人隐私",
  startUrl: (targetUrl: string) => targetUrl,
  stepHints: [
    { action: "navigate", description: "打开目标微博页面" },
    { action: "find_and_click", target: "举报", description: "点击举报按钮" },
    {
      action: "find_and_click",
      target: "人身攻击",
      description: "选择人身攻击（比隐私泄露处理更快）",
    },
    {
      action: "fill",
      target: "举报说明",
      text: "该微博内容包含本人真实个人信息（姓名、联系方式等），未经本人同意公开发布，严重侵犯本人隐私权。请立即删除。",
      description: "填写举报说明",
    },
    { action: "find_and_click", target: "提交", description: "提交举报" },
    { action: "screenshot", description: "截图保存证据" },
  ],
  successIndicators: ["举报成功", "已提交", "我们将尽快处理"],
  formData: {
    reportReason: "人身攻击",
    description:
      "该微博内容包含本人真实个人信息，未经本人同意公开发布，严重侵犯隐私权。",
  },
};
