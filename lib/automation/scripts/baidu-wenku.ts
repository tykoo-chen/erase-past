import type { AutomationScript } from "./types";

export const baiduWenkuReport: AutomationScript = {
  platform: "baidu_wenku",
  goal: "在百度文库上举报文档侵犯个人隐私",
  startUrl: (targetUrl: string) => targetUrl,
  stepHints: [
    { action: "navigate", description: "打开目标文库页面" },
    {
      action: "find_and_click",
      target: "...",
      description: '点击右上角"..."菜单',
    },
    { action: "find_and_click", target: "举报", description: "点击举报" },
    {
      action: "find_and_click",
      target: "侵犯隐私",
      description: "选择侵犯隐私",
    },
    {
      action: "fill",
      target: "举报说明",
      text: "该文档包含本人个人信息（姓名、联系方式等），未经本人授权上传和公开，请立即删除。",
      description: "填写举报说明",
    },
    { action: "find_and_click", target: "提交", description: "提交举报" },
    { action: "screenshot", description: "截图保存证据" },
  ],
  successIndicators: ["举报成功", "已提交", "感谢反馈"],
  formData: {
    reportReason: "侵犯隐私",
    description:
      "该文档包含本人个人信息，未经本人授权上传和公开，请立即删除。",
  },
};
