---
name: reputation-monitor
description: 定期扫描互联网，追踪已处理内容状态，发现新内容及时预警，评估处理效果。
version: 1.0.0
---

# Reputation Monitor Skill — 舆情监控

持续监控用户网络形象，追踪处理效果，发现新内容。

## 输入

- `user_name`: 用户姓名
- `keywords`: 监控关键词列表
- `tracked_urls`: 已处理的 URL 列表及其期望状态

## 执行流程

### 1. 定期扫描

```bash
cron schedule="每周一 9:00"
→ 调用 Scanner Skill 重新搜索
→ 对比上次结果，发现变化
```

### 2. 状态追踪

检查已处理内容的当前状态：
- 已删除？→ 提交快照删除
- 仍存在？→ 触发升级
- 被恢复？→ 重新处理

### 3. 新内容预警

发现新增的关于用户的内容时立即通知。

### 4. 效果评估

```json
{
  "resolved_count": 5,
  "pending_count": 2,
  "new_findings": 1,
  "search_ranking_change": "+3 positions average",
  "overall_score": 78
}
```

## 输出

每周生成简报，通过 Telegram 发送给用户：

```
📊 本周隐私监控报告

✅ 已解决: 百度文库简历已删除
⏳ 跟进中: 知乎举报处理中（Day 5）
🆕 新发现: 小红书有 1 条新内容提及你

整体评分: 78/100 (上周 65/100 ↑13)
```
