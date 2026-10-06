# 易AI 官网移交清单

接手的 AI 或开发者先读本文件，再读 `plan.md`（当前待办）、`AGENTS.md`（构建与测试规则）和 `README.md`。
每轮的详细记录在 `docs/rounds/NN-主题.md`（最新第 57 轮）；第 7–26 轮历史在 `docs/history/`，新轮次不再追加到那里。

## 当前版本（第五十七轮）

- 品牌：易AI / Easy AI；线上：**https://ccg-cli.online/yi_ai/**（站长授权允许收录）
- 当前轮次：第五十七轮（三个业务页页首都带产品图标；卡片动效减弱、去掉扫光，见 `docs/rounds/57-calmer-motion.md`）
- 线上发布：`release-20261006154813`，commit `c3faa01`；`https://ccg-cli.online/yi_ai/version.json` 给出发布目录、commit 与构建时间
- 第五十七轮完整浏览器测试：见 `docs/rounds/57-calmer-motion.md`
- 构建页面数：42 个静态 HTML（每语言 8 个基础页含常见问题 + 12 篇指南，再加根入口与 404）
- 站长授权：每轮测试通过后直接上线，并推送 GitHub

## 接手须知（新 agent 先看）

### 访问与仓库

- 服务器 `root@38.22.92.196`，本机已配置免密 SSH（密钥登录）。工作目录 `/root/yi-ai-site`，Node 在 `/root/.local/node/bin`
  （命令前 `export PATH=/root/.local/node/bin:$PATH`），包管理 pnpm。
- GitHub：`dytklmf-sketch/yi-ai-site`（公开，网站源码）；`dytklmf-sketch/yi-ai-billing`（私有，账单系统，与本站无关）。
- 推送 GitHub 需要站长提供的 token。**token 不写进服务器 git config、remote URL、文件或文档**；做法是临时 askpass 脚本从
  stdin 读入、推送完立即删除。之前会话里出现过的 classic token 已建议站长到 https://github.com/settings/tokens 删除，
  新 agent 不要再使用旧 token，需要推送时向站长要新的（最好是只授权本仓库的 fine-grained token）。
- 习惯做法：在本地克隆（remote 指向 `root@38.22.92.196:/root/yi-ai-site`）里编辑，推到临时分支，服务器上
  `git merge --ff-only`，再在服务器上 format、构建、测试、提交、发布。也可以直接在服务器上改。
- 提交身份 `dayday-api <dayday@ccg.local>`；提交信息用文件传（`git commit -F`），避免 ssh 引号问题。

### 每轮流程

1. 新建 `docs/rounds/NN-主题.md`（站长要求、实际改动、测试、遗留）；`plan.md` 加「已完成」一条；本文件「当前版本」改轮次与发布号。
2. 改文案（任何中文字）后重跑字体子集，否则新字会回退成系统字体：

```sh
/root/.venvs/fonts/bin/python scripts/prepare-brand.py --font-source /root/font-source
git checkout public/fonts/manrope-latin.woff2 public/fonts/jetbrains-mono-latin.woff2   # 只要中文子集，拉丁字体还原
```

3. 构建与测试：

```sh
pnpm format && pnpm check && pnpm build && pnpm test
pnpm preview --port 4322 --background
PREVIEW_URL=http://127.0.0.1:4322 pnpm test:quick /zh/workbuddy/ /en/workbuddy/   # 小改动：约 1 分钟，看 test-results/quick/ 截图
PREVIEW_URL=http://127.0.0.1:4322 pnpm test:browser                               # 一批改动、公共组件或交接前：约 12 分钟
```

**完整测试运行期间不要重新构建 `dist`**：资源 hash 变化会让正在跑的测试失败（第四十五轮踩过）。
后台跑时用日志末尾的 `exit=` 判断结束，不要用 `pgrep -f`（会匹配到自己的 ssh 命令）。4. 工作区干净后 `scripts/deploy-ccg.sh`（生产构建、打 tag `release-<时间戳>`、逐页检查 sitemap、失败自动回滚）；
需要时 `scripts/deploy-ccg.sh --rollback`。5. 推送 GitHub（见上方 token 规则），回复站长线上链接与测试结果。

### 站长的偏好（多轮反馈总结，测试会拦截其中一部分）

- **不出现任何日期**：核对于、更新于、有效期至、`YYYY-MM-DD` 都不行（`test-build.mjs` 拦截）。指南 frontmatter 的 `updatedAt` 只用于数据，不显示。
- **不要 AI 腔和模板句**：禁用「先…再…」「先给结论」「逐条」「写不全」「适用条件」「本文帮助」「下文是」及英文
  「The short answer」「When this applies」（测试拦截）。口语化表达也要去掉。
- **不要小号 01/02 编号**；合作流程步骤居中显示纯数字。
- **WorkBuddy 只卖企业版**：个人版只在「企业版 vs 个人版」对比里出现，价格、需求单、指南都只讲企业版。
  价格来自腾讯云官方页（旗舰版 198 元/人/月起等，数据在 `src/data/workbuddy-editions.ts`），资质证书紧跟价格下方。
- **业务页主题色**：WorkBuddy 绿 `#097a64`、模型服务（CCG API）紫 `#5b3fd6`、基础设施（机房）蓝 `#0a76b5`，通过
  `body[data-theme]` 覆盖 `--cobalt*`、`--pale*`、`--accent-rgb`。新样式用这些变量，不要写死品牌蓝。
- **面板要紧凑、一屏看完**：价格面板和「企业版 vs 个人版」在 1440×900、1280×800 下都在一屏内（目前对比约 650 / 600px）。
- **浅色而不是黑色面板**；企业版卡是浅色细边 + 顶部品牌绿渐变条，对勾用 WorkBuddy 品牌绿 `#01a870` 薄荷底，不要深绿描边。
- **用官方 WorkBuddy 标志**：图标 + 官方字标 `public/partners/workbuddy-wordmark.svg`（深色）/ `workbuddy-wordmark-white.svg`
  （白色，页首示例窗口用），不要用打字拼出来的「WorkBuddy」字样代替。
- 业务流程里不写具体用量示例（如「2000 万 tokens」）；联系入口是每页右下角常驻「联系我们」按钮（联系页除外）。
- 站长要求（第五十七轮）：动效要克制——不要扫光、闪亮或明显的位移与旋转；卡片只做轻微淡入与很淡的指针光。
- 站长要求（第五十四轮）：机房一律写「自建机房」（第五十三轮曾改为「一手机房资源」，站长要求改回）；不写设备、数量、地区或 SLA。
- 站长要求（第五十一轮）：模型服务相关页面不写「是否厂商官方授权 / 是否直供」之类的说明；WorkBuddy 的授权证书照旧展示。
- 「CCG」只允许出现在模型服务页和关于页，且写作「CCG API」；指南里用通用说法（如 `api.example.com`）。
- 每次改动后都要上线并推 GitHub，回复里给线上链接。站长看了效果会继续提细节修改，按轮推进。

### 移交时的测试状态

- 第四十七轮完整 `pnpm test:browser` 在发布版 `07b59ae` 上**通过**：320 项响应式页面检查、80 次 axe 扫描、59 个内链、
  交互与无 JS 路由；Chromium 与 WebKit 增强流程、动效录屏、减少动态效果与重排全部通过。`pnpm check`、`pnpm test`（构建断言）同样通过。
- 没有进行中的改动；服务器工作区干净，GitHub 与服务器 `main` 一致。

## WorkBuddy 页现状（第三十四至四十七轮）

章节顺序：页首示例 → 企业版价格 `#editions`（`WorkBuddyEditions.astro`：官方字标、三档价格、资质证书、规则标签、需求单下载、官方来源）
→ 企业版 vs 个人版 `#compare`（`WorkBuddyCompare.astro`：手机型号式双卡，左个人版减号、右企业版对勾，各 8 行，中间 VS 细线胶囊，
`data-row` 行联动高亮，入场动效只在 `prefers-reduced-motion: no-preference` 下运行）→ 适用场景 → 合作流程 → 资源与指南（紧凑列表 `GuideList.astro`）。
数据都在 `src/data/workbuddy-editions.ts`（`workbuddyEditions`、`workbuddyCompare`、`serviceBriefs`）。
模型服务页（第四十八至五十一轮）：页首 → 模型目录 `#models`（`ModelCatalog.astro`，12 张模型卡，按钮在标题右侧，一屏可见）
→ 接入与计费 `#access`（`ModelAccess.astro`：Chat、Responses、Anthropic、Gemini、图片五条路径与计费方式）→ 适用场景
→ 合作方式与流程 `#process`（`ModelWays.astro`：自助接入、企业用量、分销合作各三步，下接询价准备卡）→ 资源与指南。
卡片光效用 `.glow-card` + `data-glow`（指针位置由 `interactions.ts` 写入 `--gx/--gy`），入场与扫光只在未开启减少动态效果时播放一次。
数据在 `src/data/model-catalog.ts`（每个系列含厂商图标 `icon`、后备字母 `mark` 与颜色 `color`；图标在 `public/models/`，来自 lobehub MIT 图标库），型号取自模型广场公开接口 `/api/shop/models/pricing`，只列主力型号、不列渠道变体，价格只链到模型广场。
基础设施页（第五十三轮）：页首 → 部署方式对比 `#options`（`InfraOptions.astro`）→ 选型参考 `#sizing`（`InfraSizing.astro`）→ 适用场景 → 合作流程 → 资源与指南；数据在 `src/data/infra-detail.ts`。

## 其他仍有效的约定

- 发布：`scripts/deploy-ccg.sh` 要求工作区干净，写 `version.json`、打 tag，只保留最近 5 个发布目录。
- CSP：唯一内联脚本是布局里的 `js` class 片段，nginx 用 sha256 放行；改它必须同步 `/etc/nginx/snippets/yi-ai-site-headers.conf`
  （`test-build.mjs` 断言 hash 不变）。`style-src` 允许内联。
- CI：`.github/workflows/ci.yml` 在推送和 PR 时跑 check、build、test 与浏览器测试。
- 指南 12 对（中英同 `pairKey`），每篇需要 2–4 条 `keyPoints`；需求单在 `public/templates/{zh,en}/`（UTF-8 BOM + CRLF）。
  指南内链接写相对路径（如 `../../../templates/zh/x.txt`）。Astro 7 的 markdown 处理器不支持 rehype 插件，表格样式用纯 CSS。
- 中文字体拆成 `noto-sans-sc-site`（界面 + 指南标题摘要）与 `noto-sans-sc-guides`（指南正文专用字，`src/styles/font-guides.css` 生成）。
- 常见问题：`/zh/faq/`、`/en/faq/` 18 条可筛选；首页只取每项业务第一条。数据在 `zh.ts` / `en.ts` 的 `faq`。
- 首页「资源与指南」用紧凑列表（4 篇）；首页底部保留联系面板与标语，内页没有底部联系卡片。
- 证书 2026-12-31 到期（站上不显示日期），到期时证书区与首页徽章 `workbuddyCredential` 一并处理。
- 站长的规划文档《易AI 官网整体优化规划》：Claude Doc https://claude.ai/code/artifact/735a172e-bac0-4633-a171-a63dfabe640d ，
  站长的回答写在本机 `/home/ubuntu/易AI官网整体优化规划.md`；第 39–42 轮已全部实现。

## 目录与源码指向

- 路由 `src/pages/`；布局 `src/layouts/YiAiLayout.astro`（主题、常驻联系按钮、页脚）；区块 `src/components/yi-ai/`
- 文案 `src/data/{home,zh,en,editorial,service-details,workbuddy-editions}.ts`；品牌与联系 `src/data/yi-ai.ts`
- 文章 `src/content/guides/{zh,en}/`；路由清单 `src/data/routes.ts`
- 样式 `src/styles/site.css`；交互 `src/scripts/{interactions,contact}.ts`
- 静态素材与字体 `public/`；品牌源文件 `assets/`；测试与发布脚本 `scripts/`（`test-build`、`test-browser`、`test-enhancements`、`quick-check`、`deploy-ccg.sh`）
- 线上 nginx：`/etc/nginx/snippets/yi-ai-site.conf`（路由）与 `yi-ai-site-headers.conf`（安全头/CSP）

## 审查提示

请独立审查并核对 `plan.md` 的完成声明。重点：三项业务入口与 `topic`；各页标题、正文在深浅背景上对比度 ≥ 4.5:1；
吸顶目录跳转不遮挡标题；微信复制、邮件主题、语言切换；320px 至 2560px 与 200% 缩放无横向溢出；
键盘、菜单 Escape、无 JS 阅读、减少动态效果；Easy AI 命名与 CCG API 边界；预览 noindex / 线上 canonical；
无追踪脚本、无虚构能力。

## 不可越过的边界

- CCG API 只是模型服务的产品入口，不是品牌主体；站内统一写「CCG API」。
- 不恢复模型广场截图，不伪造客户案例、授权文件、机房照片、二维码、价格、SLA 或售后承诺。
- 只有 `pnpm build:production` 去掉 noindex、生成 canonical 与 sitemap。
- 不购买域名或服务；不删除服务器上未确认的文件（第三十轮清理只删了确认过的旧副本，归档在 `/root/backups/cleanup-20261005.tar.gz`）。
- 对 CCG nginx 的改动仅限 `/yi_ai` include 与两个 snippet；不动其他路由和根 `robots.txt`。
- 凭据只放环境变量，不进源码、文档或提交；不运行付费生图脚本。
- 站长明确不做「安全与收尾」类任务（改 root 密码等）——可以提醒，不要擅自做。
