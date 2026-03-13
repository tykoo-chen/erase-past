import type { AutomationScript } from "./types";

export const zhihuReport: AutomationScript = {
  platform: "zhihu",
  goal: "在知乎上举报内容侵犯个人隐私",
  startUrl: (targetUrl: string) => targetUrl,
  stepHints: [
    { action: "navigate", description: "打开目标页面" },
    { action: "find_and_click", target: "举报", description: "点击举报按钮" },
    {
      action: "find_and_click",
      target: "侵犯个人隐私",
      description: "选择隐私侵权类型",
    },
    {
      action: "fill",
      target: "举报说明",
      text: "该内容包含本人真实姓名/联系方式等个人信息，未经本人授权公开，请予删除。根据《个人信息保护法》，本人有权要求删除。",
      description: "填写举报说明",
    },
    { action: "find_and_click", target: "提交", description: "提交举报" },
    { action: "screenshot", description: "截图保存证据" },
  ],
  successIndicators: ["举报成功", "已提交", "感谢您的反馈"],
  formData: {
    reportReason: "侵犯个人隐私",
    description:
      "该内容包含本人真实姓名/联系方式等个人信息，未经本人授权公开，请予删除。",
  },
};
