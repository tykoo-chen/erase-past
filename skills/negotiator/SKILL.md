---
name: negotiator
description: 通过平台私信与内容发布者友好协商，请求删除或修改个人信息。先礼后兵，自动升级。
version: 1.0.0
---

# Negotiator Skill — 友好协商

通过私信与内容发布者沟通，请求删除/修改。

## 输入

- `target_url`: 目标内容 URL
- `publisher_info`: 发布者信息（如有）
- `content_type`: 内容类型（privacy_leak / negative / outdated）
- `user_name`: 用户姓名
- `user_email`: 用户邮箱（可选）

## 执行流程

### Round 1: 友好私信（Day 0）

使用 `templates/negotiate_friendly.md` 模板：

```
浏览器操作:
1. browser navigate → 发布者主页
2. 找到私信/联系入口
3. browser fill → 填写友好协商消息
4. browser click → 发送
5. browser screenshot → 存证
```

记录状态: `pending → contacted`

### Round 2: 正式跟进（Day 2-3，如无回复）

使用 `templates/negotiate_formal.md` 模板，引用法律条文。

### Round 3: 升级（Day 3+，如仍无回复）

返回 Orchestrator，建议升级到 Reporter Skill。

## 输出

```json
{
  "status": "contacted|responded|agreed|refused|no_response",
  "contacted_at": "timestamp",
  "response": "对方回复内容（如有）",
  "evidence_screenshot": "path",
  "recommend_escalation": true
}
```

## 语气策略

| 场景 | 语气 | 模板 |
|------|------|------|
| 首次联系 | 友好、诚恳 | negotiate_friendly.md |
| 二次跟进 | 正式、提及法律 | negotiate_formal.md |
| 大V/粉丝多 | 特别谨慎 | 避免公开对抗 |
