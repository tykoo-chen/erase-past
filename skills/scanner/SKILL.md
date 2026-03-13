---
name: scanner
description: 全网扫描用户个人信息，在搜索引擎、社交平台、数据经纪人、AI 搜索引擎中搜索并分类标记风险等级。
version: 1.0.0
---

# Scanner Skill — 网络扫描

全网搜索用户信息，返回分类标记的结果。

## 输入

- `name`: 用户真名
- `aliases`: 网名列表（可选）
- `extras`: 公司/学校等关联信息（可选）

## 执行流程

### 1. 搜索引擎扫描

```bash
web_search query='"姓名"'
web_search query='"姓名" 手机 OR 联系方式 OR 电话'
web_search query='"姓名" 简历 OR resume'
web_search query='"姓名" 身份证 OR 住址'
```

### 2. 平台定向扫描

```bash
web_search query='"姓名" site:wenku.baidu.com'
web_search query='"姓名" site:zhihu.com'
web_search query='"姓名" site:weibo.com'
web_search query='"姓名" site:xiaohongshu.com'
web_search query='"姓名" site:douyin.com'
web_search query='"姓名" site:maimai.cn'
web_search query='"姓名" site:tieba.baidu.com'
```

### 3. 数据经纪人检查

检查常见数据经纪人网站是否有用户信息。

### 4. AI 搜索提及

检查 ChatGPT / Perplexity / Google AI Overview 等是否在回答中提及用户。

## 输出格式

```json
{
  "results": [
    {
      "level": "red|yellow|green|grey",
      "platform": "平台名",
      "url": "URL",
      "title": "标题",
      "detail": "具体发现",
      "has_publisher": true,
      "content_type": "privacy_leak|negative|outdated|positive|irrelevant"
    }
  ],
  "summary": {
    "red": 3,
    "yellow": 2,
    "green": 5,
    "grey": 2
  }
}
```

### 分类规则

- 🔴 **立即处理**: 手机号、身份证、住址、银行卡、微信号泄露
- 🟡 **建议处理**: 负面评价、不实信息、过时资料
- 🟢 **正面保留**: 正面报道、正常社交
- ⚪ **无关**: 同名他人、无关内容
