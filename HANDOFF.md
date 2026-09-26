# 易AI 官网审查与移交清单

## 文档用途

这是易AI / Easy AI 官网当前版本的统一审查和移交入口。其他 AI 或开发者应先阅读本文件，再阅读 `plan.md`、`README.md` 和测试报告。本文记录项目实际路径、当前预览、源码范围、交付物、验收证据、审查重点和后续每轮更新规则。

本文件每完成一轮新改动都必须更新，并同步复制到交付包的 `docs/` 目录。不能只更新聊天记录。

## 当前版本

- 品牌：易AI
- 英文名：Easy AI
- 当前轮次：第六轮，已完成本地实施与验收
- 记录日期：2026-09-25
- 项目根目录：`/Users/mac/Documents/Codex/2026-09-16/new-chat-2/work/yi-ai-site`
- 工作区根目录：`/Users/mac/Documents/Codex/2026-09-16/new-chat-2`
- 当前本地预览：`http://127.0.0.1:4323/zh/`
- 英文预览：`http://127.0.0.1:4323/en/`
- 预览端口可能因占用变化；交接前必须用 `curl` 或浏览器确认实际端口，不要把旧端口当成当前状态。
- 当前构建页面数：28 个静态 HTML 页面。
- 当前交付目录：`/Users/mac/Documents/Codex/2026-09-16/new-chat-2/outputs/easyai-site-upgrade`

## 目录与源码指向

### 项目源码

- 页面路由：`/Users/mac/Documents/Codex/2026-09-16/new-chat-2/work/yi-ai-site/src/pages/`
- 页面布局：`/Users/mac/Documents/Codex/2026-09-16/new-chat-2/work/yi-ai-site/src/layouts/`
- 公共组件：`/Users/mac/Documents/Codex/2026-09-16/new-chat-2/work/yi-ai-site/src/components/`
- 中文文案：`/Users/mac/Documents/Codex/2026-09-16/new-chat-2/work/yi-ai-site/src/data/zh.ts`
- 英文文案：`/Users/mac/Documents/Codex/2026-09-16/new-chat-2/work/yi-ai-site/src/data/en.ts`
- 品牌、联系配置和产品外链：`/Users/mac/Documents/Codex/2026-09-16/new-chat-2/work/yi-ai-site/src/data/yi-ai.ts`
- 业务详情：`/Users/mac/Documents/Codex/2026-09-16/new-chat-2/work/yi-ai-site/src/data/service-details.ts`
- 关于、资源和文章数据：`/Users/mac/Documents/Codex/2026-09-16/new-chat-2/work/yi-ai-site/src/data/editorial.ts`
- 文章内容：`/Users/mac/Documents/Codex/2026-09-16/new-chat-2/work/yi-ai-site/src/content/guides/`
- 站点路由清单：`/Users/mac/Documents/Codex/2026-09-16/new-chat-2/work/yi-ai-site/src/data/routes.ts`
- 样式：`/Users/mac/Documents/Codex/2026-09-16/new-chat-2/work/yi-ai-site/src/styles/`
- 页面交互：`/Users/mac/Documents/Codex/2026-09-16/new-chat-2/work/yi-ai-site/src/scripts/`
- 静态素材：`/Users/mac/Documents/Codex/2026-09-16/new-chat-2/work/yi-ai-site/public/`
- 品牌源文件和设计素材：`/Users/mac/Documents/Codex/2026-09-16/new-chat-2/work/yi-ai-site/assets/`
- 构建产物：`/Users/mac/Documents/Codex/2026-09-16/new-chat-2/work/yi-ai-site/dist/`
- 原始测试产物：`/Users/mac/Documents/Codex/2026-09-16/new-chat-2/work/yi-ai-site/test-results/`
- 测试、打包和资源脚本：`/Users/mac/Documents/Codex/2026-09-16/new-chat-2/work/yi-ai-site/scripts/`

### 关键文件

- [plan.md](/Users/mac/Documents/Codex/2026-09-16/new-chat-2/work/yi-ai-site/plan.md)：六轮计划、问题记录、实施状态和验收记录。
- [README.md](/Users/mac/Documents/Codex/2026-09-16/new-chat-2/work/yi-ai-site/README.md)：运行、页面、架构、动效和测试说明。
- [AGENTS.md](/Users/mac/Documents/Codex/2026-09-16/new-chat-2/work/yi-ai-site/AGENTS.md)：贡献、代码风格、测试和品牌边界。
- [BRAND.md](/Users/mac/Documents/Codex/2026-09-16/new-chat-2/work/yi-ai-site/BRAND.md)：易AI品牌、Easy AI命名、鲸形标识和素材规范。
- [IMPLEMENTATION_PLAN.md](/Users/mac/Documents/Codex/2026-09-16/new-chat-2/work/yi-ai-site/IMPLEMENTATION_PLAN.md)：初始官网建设计划。
- [LAUNCH_CHECKLIST.md](/Users/mac/Documents/Codex/2026-09-16/new-chat-2/work/yi-ai-site/LAUNCH_CHECKLIST.md)：正式域名、真实素材、授权和生产发布前待办。
- [HANDOFF.md](/Users/mac/Documents/Codex/2026-09-16/new-chat-2/work/yi-ai-site/HANDOFF.md)：本文件，作为今后的统一移交入口。
- [package.json](/Users/mac/Documents/Codex/2026-09-16/new-chat-2/work/yi-ai-site/package.json)：依赖版本和开发、构建、测试命令。
- [astro.config.ts](/Users/mac/Documents/Codex/2026-09-16/new-chat-2/work/yi-ai-site/astro.config.ts)：Astro静态构建配置。
- [pnpm-lock.yaml](/Users/mac/Documents/Codex/2026-09-16/new-chat-2/work/yi-ai-site/pnpm-lock.yaml)：锁定依赖。

## 页面范围

中英文各包含首页、关于、联系、WorkBuddy、模型服务、基础设施、资源列表和六篇资源文章；另有根入口和 404。页面清单以构建后的 [site-manifest.json](/Users/mac/Documents/Codex/2026-09-16/new-chat-2/work/yi-ai-site/dist/site-manifest.json) 为准。

- 中文首页：`/zh/`
- 英文首页：`/en/`
- 中文业务页：`/zh/workbuddy/`、`/zh/model-services/`、`/zh/infrastructure/`
- 英文业务页：`/en/workbuddy/`、`/en/model-services/`、`/en/infrastructure/`
- 中英文联系页：`/{lang}/contact/`
- 中英文关于页：`/{lang}/about/`
- 中英文资源列表：`/{lang}/resources/`
- 中英文文章：`/{lang}/resources/{pairKey}/`
- 根入口：`/`
- 错误页：`/404.html`

## 完整交付产物

交付根目录：
`/Users/mac/Documents/Codex/2026-09-16/new-chat-2/outputs/easyai-site-upgrade`

- [交付说明](/Users/mac/Documents/Codex/2026-09-16/new-chat-2/outputs/easyai-site-upgrade/README.md)
- [静态构建包](/Users/mac/Documents/Codex/2026-09-16/new-chat-2/outputs/easyai-site-upgrade/easyai-static.tar.gz)
- [源码包](/Users/mac/Documents/Codex/2026-09-16/new-chat-2/outputs/easyai-site-upgrade/easyai-source.tar.gz)
- [校验和](/Users/mac/Documents/Codex/2026-09-16/new-chat-2/outputs/easyai-site-upgrade/SHA256SUMS.txt)
- [交付文档](/Users/mac/Documents/Codex/2026-09-16/new-chat-2/outputs/easyai-site-upgrade/docs/)
- [测试报告](/Users/mac/Documents/Codex/2026-09-16/new-chat-2/outputs/easyai-site-upgrade/reports/)
- [全站截图](/Users/mac/Documents/Codex/2026-09-16/new-chat-2/outputs/easyai-site-upgrade/screenshots/)
- [章节和翻页截图](/Users/mac/Documents/Codex/2026-09-16/new-chat-2/outputs/easyai-site-upgrade/chapters/)
- [第三轮截图](/Users/mac/Documents/Codex/2026-09-16/new-chat-2/outputs/easyai-site-upgrade/round3/)
- [第四轮截图](/Users/mac/Documents/Codex/2026-09-16/new-chat-2/outputs/easyai-site-upgrade/round4/)
- [第六轮截图](/Users/mac/Documents/Codex/2026-09-16/new-chat-2/outputs/easyai-site-upgrade/round6/)
- [动效截图与录屏](/Users/mac/Documents/Codex/2026-09-16/new-chat-2/outputs/easyai-site-upgrade/motion/)

交付包之外的历史备份：
`/Users/mac/Documents/Codex/2026-09-16/new-chat-2/work/yi-ai-template-archive/`

## 验收证据

原始测试目录：
`/Users/mac/Documents/Codex/2026-09-16/new-chat-2/work/yi-ai-site/test-results`

核心报告：

- `build-report.json`：28 页构建、分享图、品牌和 noindex 断言。
- `browser-report.json`：208 个响应式页面检查、52 次 axe 扫描、内部链接、无脚本、键盘和联系流程。
- `enhancement-report.json`：Chromium/WebKit 增强流程、动效、减少动态效果、200% 等效重排和章节检查。
- `round-four-report.json`：第四轮 56 个视口与任务检查。
- `round6-report.json`：第六轮指南对齐、页脚可达、FAQ、编号、移动联系选择器和主题邮件检查。
- `round6/`：第六轮六张 Chromium/WebKit 专项截图。
- `round6/baseline/`：第六轮首批修改后的源码快照和问题截图，不是未修改的第五轮源码。

第六轮已通过：

- `pnpm check`
- `pnpm build`
- `pnpm test`
- `PREVIEW_URL=http://127.0.0.1:4323 pnpm test:browser`
- `PREVIEW_URL=http://127.0.0.1:4323 pnpm test:round-four`
- `PREVIEW_URL=http://127.0.0.1:4323 pnpm test:round-six`
- `pnpm package:preview`

测试是在本机未限速环境完成的，不能等同于生产环境真实用户性能指标，也不能替代真实辅助技术测试。预览没有发布到生产环境。

本次移交补充只修改文档及打包清单，不修改网站代码。第六轮的浏览器报告是上一轮
验收证据，不代表此次重新执行了完整浏览器测试。绝对路径适用于当前 Mac；
在其他机器上请解压源码包，并以解压后的项目根目录替换路径前缀。

## 给其他 AI 的审查提示

请独立审查易AI官网，核对 `plan.md` 中的完成声明与真实实现是否一致。重点检查：

1. 卡片是否仍然空白过多、编号是否清楚、标题和正文是否可读。
2. 桌面章节切换是否流畅，惯性尾巴是否连跳，是否能停在两个章节之间。
3. FAQ 展开后能否完整阅读，倒数第三页是否会被切走。
4. 咨询区能否自然滚到完整页脚，页脚是否遮挡或产生独立大空白页。
5. 微信复制成功、失败回退、邮件主题、`topic` 保持和语言切换。
6. 320px、390px、平板、桌面、200% 等效缩放下是否横向溢出或遮挡。
7. 键盘焦点、菜单 Escape、无 JavaScript 阅读、`aria-live` 和颜色对比度。
8. 中英文内容、Easy AI命名、CCG边界、noindex、无追踪脚本和无虚构能力。
9. 测试报告是否真的覆盖声明的页面、视口、浏览器和最终构建，而不是只检查旧产物。

请先只审查，不修改文件、不部署、不购买服务、不运行付费生图脚本。所有问题按严重程度列出，并附绝对文件路径、行号、复现步骤、影响和修复建议。特别核对预览端口是否仍然有效，以及文档是否存在旧端口或旧页脚描述。

## 后续每轮更新规则

每开始一轮新的界面或功能改动，都必须执行以下流程：

1. 在项目根目录更新 `plan.md`，新增轮次目标、边界、验收标准和状态。
2. 在本文件更新“当前版本”、轮次日期、改动摘要、测试命令和新增证据路径。
3. 改动前把基线截图、关键报告或源码快照放入 `test-results/roundN/baseline/`。
4. 完成后运行与改动范围匹配的检查，至少包括 `pnpm check`、`pnpm build` 和 `pnpm test`。
5. 涉及 UI、动效、响应式或交互时，必须运行 Chromium 和 WebKit，并保存截图或录屏。
6. 重新生成 `dist/`、测试报告和交付包；不能把旧报告当成新一轮证据。
7. 运行 `pnpm package:preview`，确认交付包的 `docs/HANDOFF.md`、报告、截图和压缩包已更新。
8. 在 `plan.md` 和本文件中记录通过项、失败项、未覆盖项和仍需真实资料确认的事项。
9. 最终回复必须给出本文件绝对路径、交付包绝对路径、预览地址和实际运行过的命令。

推荐的交接前检查：

```sh
cd /Users/mac/Documents/Codex/2026-09-16/new-chat-2/work/yi-ai-site
pnpm check
pnpm build
pnpm test
PREVIEW_URL=http://127.0.0.1:4323 pnpm test:browser
PREVIEW_URL=http://127.0.0.1:4323 pnpm test:round-four
PREVIEW_URL=http://127.0.0.1:4323 pnpm test:round-six
pnpm package:preview
curl -I http://127.0.0.1:4323/zh/
```

## 不可越过的边界

- 不把 CCG 作为易AI品牌主体；CCG只作为模型服务相关产品入口。
- 不恢复模型广场截图，不伪造客户案例、授权文件、机房照片、二维码、价格、SLA、培训或售后承诺。
- 不把本地预览当成正式上线，不删除 `noindex`，不生成未确认域名的 canonical 或 sitemap。
- 不提交或推送 Git，不修改线上 CCG，不购买域名或服务。
- 凭据只允许出现在环境变量中，不得写入源码、Markdown交付包或压缩包。
- 不运行付费生图或未经审查的外部脚本作为测试步骤。
