---
name: legal-action
description: 生成律师函、GDPR/个保法删除请求、DMCA 通知，向监管机构投诉。最后手段。
version: 1.0.0
---

# Legal Action Skill — 法律行动

当协商和举报都无效时，启用法律手段。

## 输入

- `target_url`: 侵权内容 URL
- `infringement_type`: privacy / defamation / copyright
- `evidence`: 证据材料
- `previous_attempts`: 已尝试的手段和结果

## 执行手段

### 1. 律师函

使用 `templates/legal_warning_cn.md`，包含：
- 侵权事实描述
- 法律依据（个保法/民法典/网安法）
- 限期删除要求（通常 7 个工作日）
- 法律后果警告

### 2. GDPR 删除请求（面向 EU）

使用 `templates/gdpr_request.md`，引用 GDPR Article 17。

### 3. 个保法投诉

依据《个人信息保护法》第四十七条，向相关部门投诉。

### 4. 监管投诉

```
网信办举报: 12377.cn
工信部投诉: dxss.miit.gov.cn
消费者投诉: 12315.cn
```

### 5. 建议用户咨询律师

对于需要诉讼的情况，提供建议但不替代法律咨询。

## 输出

```json
{
  "action_taken": "legal_letter|gdpr_request|regulatory_complaint",
  "sent_to": "目标方",
  "sent_at": "timestamp",
  "deadline": "限期日期",
  "response": "对方回应"
}
```

## ⚠️ 重要提示

- 法律文书仅供参考，不构成法律建议
- 建议用户在发送律师函前咨询专业律师
- 涉及诉讼的必须由用户自行决定
