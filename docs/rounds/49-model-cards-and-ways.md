# 第四十九轮：模型卡美化、Responses 协议、合作方式并入流程（2026-10-06）

## 站长要求

模型卡思路很好，但还不够美观，继续迭代；接入与计费加 OpenAI 原生 Responses 协议；新加的「合作方式」想办法和「合作流程」合并。

## 实际改动

- 模型卡重做：白卡 + 顶部品牌紫渐变细条（同 WorkBuddy 企业版卡）、柔和阴影、悬停上浮（仅在未开启减少动态效果时）；
  卡头为系列名 + 厂商 + 右侧「国际 / 国产 / 多模态」小标签；型号改成等宽字小标签，第一个（主力型号）用浅紫底高亮；
  能力标签改为圆点 + 文字，虚线分隔。
- 面板压缩：「打开模型广场」按钮移到标题右侧，导语缩为一行，去掉底栏；图片与视频卡去掉厂商行和
  `gemini-3.1-flash-image-preview`（名字太长撑高整行）。1280×800 下面板约 676px（吸顶栏下可视 681px），1440×900 下约 762px（可视 771px），一屏可见。
- 接入与计费：新增 `OpenAI Responses  POST /v1/responses`（GPT 系列，Codex 默认使用；线上该路径未带 Key 时返回 401
  而非 404，开发者文档的 Codex 配置为 `wire_api = "responses"`）；原「OpenAI 兼容」改名「OpenAI Chat」；
  每条路径前加 POST 小标签；章节标题与卡片之间补上间距。
- 合作方式并入合作流程：删除 `ModelPartners.astro` 与 `#partners` 章节，新组件 `ModelWays.astro` 放在 `#process` 里，
  章节名「合作方式与流程」。三张卡（自助接入、企业用量、分销合作）各带三步流程，数字圆点由细线串起；企业用量沿用
  `service-details.ts` 的三步；下方保留询价准备卡与需求单下载。目录回到 5 项。
- 测试：`test-build.mjs` 模型页断言改为 9 个流程步骤、5 个目录项、含 `/v1/responses`、不出现 `#partners`；
  `test-enhancements.mjs` 模型页目录 5 项。

## 测试

- `pnpm check`、`pnpm build`、`pnpm test` 通过；`pnpm test:quick` 覆盖模型页中英、WorkBuddy、基础设施页，通过。
- 完整 `pnpm test:browser`：通过：320 项响应式页面检查、80 次 axe 扫描、59 个内链、交互与无 JS 路由；Chromium 与 WebKit 增强流程、
  动效录屏、减少动态效果与重排。

## 遗留

- 型号随上游变化，需要时对照模型广场更新 `model-catalog.ts`。
