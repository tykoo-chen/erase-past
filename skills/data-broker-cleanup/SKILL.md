---
name: data-broker-cleanup
description: 在数据经纪人网站提交 Opt-out 请求，阻止个人信息被交易和转卖。支持中美主流经纪人。
version: 1.0.0
---

# Data Broker Cleanup Skill — 数据经纪人清理

识别并清理数据经纪人网站上的个人信息。

## 输入

- `user_name`: 用户姓名
- `user_phone`: 手机号（可选）
- `user_email`: 邮箱（可选）

## 执行流程

### 1. 识别

检查主流数据经纪人是否有用户信息：

**中国：**
- 企查查、天眼查（企业关联信息）
- 百度信用
- 各类人肉搜索聚合站

**国际：**
- Spokeo, BeenVerified, WhitePages
- Intelius, PeopleFinder
- MyLife, Radaris

### 2. Opt-out 提交

```
browser navigate → 经纪人 opt-out 页面
browser fill → 填写删除请求
browser screenshot → 存证
```

### 3. 验证

60-90 天后验证数据是否已删除。数据经纪人会重新收集信息，需要定期复查。

## 输出

```json
{
  "brokers_found": 5,
  "optout_submitted": 4,
  "optout_confirmed": 2,
  "needs_reverify": ["broker1", "broker2"]
}
```
