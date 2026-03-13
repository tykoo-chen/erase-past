---
name: reporter
description: 跨平台提交内容举报、搜索引擎快照删除、监管机构投诉。支持 12+ 平台。
version: 1.0.0
---

# Reporter Skill — 跨平台举报

在各平台提交正式举报和快照删除申请。

## 输入

- `target_url`: 目标内容 URL
- `report_type`: privacy_leak / defamation / harassment / copyright / outdated
- `evidence`: 证据材料路径
- `platform`: 自动检测或指定

## 执行流程

### 1. 平台举报

```
browser navigate → 平台举报页面
browser fill → 填写举报表单
  - 举报类型选择（隐私 > 人身攻击 > 其他）
  - 填写详细描述
  - 上传证据截图
browser click → 提交
browser screenshot → 存证
```

详细平台入口见 `references/platforms.md`。

**技巧：**
- 微博：同时走举报 + 客服私信
- 知乎：选「侵犯隐私」比「其他」处理快
- 百度文库：同时提交快照删除

### 2. 搜索引擎快照删除

```
百度: help.baidu.com/webmaster/add
Google: google.com/webmasters/tools/legal-removal-request
Bing: bing.com/webmaster/tools/contentremoval
```

前提：原内容已删除或已修改。

### 3. DMCA Takedown（版权内容）

使用 `templates/dmca_takedown.md` 向平台发送正式通知。

### 4. 监管投诉（最后手段）

```
网信办: 12377.cn
工信部: https://dxss.miit.gov.cn
```

使用 `templates/cyberspace_report.md`。

## 输出

```json
{
  "status": "reported|processing|resolved|rejected",
  "report_id": "举报编号",
  "reported_at": "timestamp",
  "platform_response": "平台反馈",
  "evidence_screenshot": "path"
}
```
