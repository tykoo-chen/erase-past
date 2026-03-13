---
name: seo-diluter
description: 通过 SEO 和 GEO 策略在高权重平台发布正面内容，压制负面搜索结果，优化 AI 搜索引擎中的形象。
version: 1.0.0
---

# SEO Diluter Skill — 信息稀释

通过正面内容发布 + SEO/GEO 优化，压制无法删除的负面信息。

## 输入

- `target_keywords`: 需要优化的搜索关键词
- `negative_urls`: 需要压制的 URL 列表
- `ideal_image`: 用户理想形象描述
- `existing_profiles`: 用户已有的平台账号

## 执行策略

### 1. SEO 压制（传统搜索）

在高权重平台发布 9+ 条正面内容，将负面结果推出搜索首页：

**推荐平台（按权重排序）：**
- LinkedIn 个人档案
- GitHub 项目/Profile
- 知乎专栏文章
- 微信公众号文章
- 个人博客/网站
- Medium 文章
- 技术社区（掘金、CSDN、SegmentFault）
- 行业媒体投稿

**内容原则：**
- 自然有价值，不堆砌关键词
- 与用户真实专业相关
- 标题包含用户姓名
- 高质量原创内容

### 2. GEO 优化（AI 搜索）

针对 ChatGPT、Perplexity、Google AI Overview 等：

- 发布结构化内容（FAQ、指南、列表）
- 获取第三方权威提及
- 在 AI 偏好的平台发布（学术、技术社区）
- 确保内容可被 AI 爬虫抓取

### 3. 效果追踪

```bash
# 定期检查搜索排名变化
web_search query='"用户姓名"'
# 对比负面 URL 的位置变化
# 目标：60-90 天内推出首页
```

## 输出

```json
{
  "published_content": [
    { "platform": "知乎", "url": "...", "title": "..." }
  ],
  "ranking_before": { "negative_url": 3 },
  "ranking_after": { "negative_url": 15 },
  "timeline": "预计 60-90 天见效"
}
```
