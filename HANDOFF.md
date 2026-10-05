# 易AI 官网移交清单

其他 AI 或开发者先读本文件，再读 `plan.md`（当前待办）和 `README.md`。
第 7–26 轮的逐轮记录原文保存在 `docs/history/handoff-rounds-07-26.md`，
第 3–26 轮计划与验收在 `docs/history/plan-rounds-03-26.md`；新轮次不再追加到这两个文件。

## 当前版本

- 品牌：易AI / Easy AI；线上：**https://ccg-cli.online/yi_ai/**（2026-09-30 站长授权，允许收录）
- 当前轮次：第二十八轮（UI：版面节奏、授权徽章、差异点与降噪，见 `docs/rounds/28-ui-rhythm-and-trust.md`）；上一轮：第二十七轮工程整理
- 线上版本：`https://ccg-cli.online/yi_ai/version.json` 给出发布目录、commit 与构建时间；
  每次发布另有 Git tag `release-<时间戳>`
- 工作目录：服务器 `/root/yi-ai-site`；远端 GitHub `dytklmf-sketch/yi-ai-site`（公开仓库）
- 构建页面数：28 个静态 HTML（26 个内容页 + 根入口 + 404）
- 站长授权（2026-10-02 起）：每轮测试通过后直接上线

## 第二十七轮：工程整理（2026-10-05）

- 发布可追溯：`scripts/deploy-ccg.sh` 要求工作区干净，写入 `version.json`，发布成功后打 tag。
- 发布更稳：脚本自带 node 路径；上线后逐个检查 sitemap 中 26 个页面，任一失败自动切回上一版；
  只保留最近 5 个发布目录。`--rollback` 回到当前版本的前一个版本。
- CSP：processed script 一律输出为文件（`vite.build.assetsInlineLimit: 0`），唯一内联脚本是布局里固定的
  `js` class 片段，nginx 用 sha256 放行，去掉 `script-src 'unsafe-inline'`；`test-build.mjs` 断言内联脚本 hash 不变。
  改动该片段时必须同步更新 `/etc/nginx/snippets/yi-ai-site-headers.conf`。
- CSS：删除从未匹配任何页面的规则（未用的 `StackVisual` 浅色版、`.section-intro`、`.section-flush`、
  `.split-head`、`.partners-band`、`.page-hero .slab`），`StackVisual` 去掉 `tone` 属性。
- 「一屏一章」改为布局目标（第二十八轮起站长决定取消，只保留首屏满屏）。
- 修复偶发失败：动效录屏时 IntersectionObserver 回调滞后，先等全部 reveal 完成再断言「不回退」。
- CI：`.github/workflows/ci.yml` 在推送和 PR 时跑 check、build、test、生产构建测试和 Chromium/WebKit 浏览器测试。
- 文档：长篇历史移入 `docs/history/`，本文件与 `plan.md` 只保留现状与待办。

## 目录与源码指向

- 路由 `src/pages/`；布局 `src/layouts/YiAiLayout.astro`；区块 `src/components/yi-ai/`
- 文案 `src/data/{home,zh,en,editorial,service-details}.ts`；品牌与联系 `src/data/yi-ai.ts`
- 文章 `src/content/guides/{zh,en}/`；路由清单 `src/data/routes.ts`
- 样式 `src/styles/site.css`；交互 `src/scripts/{interactions,contact}.ts`
- 静态素材与字体 `public/`；品牌源文件 `assets/`；测试与发布脚本 `scripts/`
- 线上 nginx：`/etc/nginx/snippets/yi-ai-site.conf`（路由）与 `yi-ai-site-headers.conf`（安全头/CSP）

## 每轮流程

1. 在 `plan.md` 写本轮目标与验收标准；每轮的详细记录另起 `docs/rounds/NN-主题.md`。
2. 改动后运行：

```sh
export PATH=/root/.local/node/bin:$PATH
pnpm check && pnpm build && pnpm test
pnpm preview --port 4322 --background
PREVIEW_URL=http://127.0.0.1:4322 pnpm test:browser   # UI、动效、响应式或交互改动必跑
```

3. 提交（Git 工作区必须干净才能发布），然后 `scripts/deploy-ccg.sh`；需要时 `scripts/deploy-ccg.sh --rollback`。
4. 更新本文件「当前版本」与 `plan.md` 待办；不要把旧报告当作新一轮证据。

## 审查提示

请独立审查并核对 `plan.md` 的完成声明。重点：三项业务入口与 `topic`；各页标题、正文在深浅背景上对比度 ≥ 4.5:1；
吸顶目录跳转不遮挡标题；微信复制、邮件主题、语言切换；320px 至 2560px 与 200% 缩放无横向溢出；
键盘、菜单 Escape、无 JS 阅读、减少动态效果；Easy AI 命名与 CCG API 边界；预览 noindex / 线上 canonical；
无追踪脚本、无虚构能力。先只审查、不改文件、不部署，问题按严重程度附路径、行号、复现与修复建议。

## 不可越过的边界

- CCG API 只是模型服务的产品入口，不是品牌主体；站内统一写「CCG API」。
- 不恢复模型广场截图，不伪造客户案例、授权文件、机房照片、二维码、价格、SLA 或售后承诺。
- 只有 `pnpm build:production` 去掉 noindex、生成 canonical 与 sitemap。
- 每轮提交到本地 Git；推送到 GitHub 需站长要求（仓库公开，推送即公开）。不购买域名或服务。
- 对 CCG nginx 的改动仅限 `/yi_ai` include 与两个 snippet；不动其他路由和根 `robots.txt`。
- 凭据只放环境变量；不运行付费生图脚本。
