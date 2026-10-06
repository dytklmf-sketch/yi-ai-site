# 第四十八轮：模型服务页详解（2026-10-06）

## 站长要求

模型服务页对应的是 ccg-cli.online 上运行的 CCG API（API 聚合），现在的介绍太泛，至少要做到和 WorkBuddy 页一样详细。
站长答复：价格只讲计费方式、实时价格链到模型广场；分销合作写一段，不写具体返佣比例。

## 实际改动

- 新数据 `src/data/model-catalog.ts`：模型目录、接入与计费、合作方式三块中英文案。模型取自模型广场公开接口
  `/api/shop/models/pricing`，每家只列主力型号，不出现渠道变体与分组名。
- 新组件：
  - `ModelCatalog.astro`（`#models`）：仿 WorkBuddy 价格面板的紫色浅色面板，12 张卡（Claude、GPT、Gemini、Grok、
    DeepSeek、通义千问、GLM、Kimi、MiniMax、豆包 Seed、MiMo、图片与视频），每张列型号与三个能力标签，底部「打开模型广场」。
    1280×800 下面板约 730px，一屏可见。
  - `ModelAccess.astro`（`#access`）：接入地址 `https://ccg-cli.online/v1`，OpenAI 兼容 / Anthropic / Gemini / 图片生成
    四种请求路径及适用范围；常用工具 Codex、Claude Code、OpenClaw、Hermes 链到开发者文档；计费方式（按百万 tokens、
    输入输出缓存分开计、图片按次、余额与日志、企业月结）。
  - `ModelPartners.astro`（`#partners`）：自助接入、企业用量、分销合作三张卡；分销链到 `/account/agent/`。
- 页面顺序：页首 → 模型目录 → 接入与计费 → 适用场景 → 合作方式 → 合作流程 → 相关指南（目录 6 项）。
- 页首导语改为列出主要模型（导语也用在指南页，所以不写「CCG」）。
- 测试：`test-build.mjs` 断言模型页 6 个目录项、三个新章节只在模型页、12 张模型卡、模型广场与分销链接、不出现渠道名；
  第三十四轮「`#access` 不再出现」的断言对模型页放开。

## 测试

- `pnpm check`、`pnpm build`、`pnpm test` 通过；`pnpm test:quick /zh/model-services/ /en/model-services/` 通过。
- 完整 `pnpm test:browser` 通过：320 项响应式页面检查、80 次 axe 扫描、59 个内链、交互与无 JS 路由；Chromium 与 WebKit
  增强流程、动效录屏、减少动态效果与重排。首次运行发现 `test-enhancements.mjs` 仍按 3 个目录项检查模型页，已改为 6。

## 遗留

- 型号随上游变化，需要时对照模型广场更新 `model-catalog.ts`。
- 模型广场里有几项倍率像占位值（如 deepseek-v4-flash 输入 $75/M），不影响本站，站长可在 CCG 后台核对。
