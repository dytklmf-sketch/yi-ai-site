# 第九十三轮：首页合作伙伴图标统一大小，蚂蚁集团换成蚂蚁数字科技（2026-10-12）

## 站长要求

首页合作伙伴图标大小统一；合作方是蚂蚁数字科技（不是蚂蚁集团），找对应的标。

## 实际改动

- 蚂蚁数字科技：取自官网 antdigital.com 页首图标（`<img alt="蚂蚁数字科技">`，
  `gw.alipayobjects.com/mdn/rms_824a36/afts/img/A*5qS8RqhHYZsAAAAAAAAAAAAAARQnAQ`，612×104 透明 PNG），
  存为 `public/partners/ant-digital.png`；删除 `ant-group.png`。名称「蚂蚁数字科技 / Ant Digital Technologies」。
- 统一大小：geolix、大鱼出海 PNG 裁掉透明留白（453×134、1138×219），中国电信 SVG 去掉外边距（viewBox 0 0 5666.25 1554）；
  各图标高度改为按「等面积」计算（约 150×36 px，高度 = √(5400 / 宽高比)）：腾讯 27、蚂蚁数字科技 32（线条细，略加）、
  中国移动 41、中国电信 38、筷子 35、geolix 40、广大通 36（图标 + 字标）、大鱼出海 32。手机端仍按 0.82 缩放。

## 测试（轻量）

- 本机 `pnpm check`、`pnpm build`、`pnpm test` 通过；本机截图 1440 / 390 核对合作伙伴墙。

## 遗留

- 合作方商标展示授权（plan.md「待站长决定或提供」）仍待站长确认。
