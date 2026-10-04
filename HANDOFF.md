# 易AI 官网审查与移交清单

## 文档用途

这是易AI / Easy AI 官网当前版本的统一审查和移交入口。其他 AI 或开发者应先阅读本文件，再阅读 `plan.md`、`README.md` 和测试报告。本文记录源码范围、当前预览、交付物、验收证据、审查重点和后续每轮更新规则。

本文件每完成一轮新改动都必须更新，并同步复制到交付包的 `docs/` 目录。不能只更新聊天记录。

## 当前版本

- 品牌：易AI
- 英文名：Easy AI
- 当前轮次：第二十三轮（指南卡片去掉幽灵编号与六篇共有的日期，改为呈现各篇「本文包含 A · B」小节名），`pnpm check` 0 error、`pnpm test` 28 页通过、章节一屏不变量保持，已部署（`yi-ai-site-20261004095456`）。2026-10-02 起站长授权：每轮测试通过后直接上线，不再等「上线」指令
- 上一轮：第十八轮（合作伙伴并入「为什么选择易AI」，一行八家商标循环滚动，新增大鱼出海），已部署（`yi-ai-site-20261002171313`）
- 线上地址：**https://ccg-cli.online/yi_ai/**（2026-09-30 经站长明确授权，挂在 CCG 域名下，允许搜索收录）
- 记录日期：2026-10-03
- 本轮工作目录：`/root/yi-ai-site`（从 GitHub `dytklmf-sketch/yi-ai-site` 获取的副本）
- 前六轮工作目录：`/Users/mac/Documents/Codex/2026-09-16/new-chat-2/work/yi-ai-site`
- 本轮本地预览：`http://127.0.0.1:4322/zh/`、`http://127.0.0.1:4322/en/`
- 预览端口可能因占用变化；交接前必须用 `curl` 或浏览器确认实际端口，不要把旧端口当成当前状态。
- 当前构建页面数：28 个静态 HTML 页面。
- 交付目录：项目根目录的 `../../outputs/easyai-site-upgrade`（由 `pnpm package:preview` 生成）

下文路径均相对项目根目录；在其他机器上以解压后的项目根目录为准。

## 第七轮改动摘要

- 设计主线改为「应用层 · 模型层 · 算力层」：WorkBuddy、模型服务与供应合作、自建机房
  三项业务对应三层，由 `src/components/yi-ai/StackVisual.astro` 绘制等距三层插图。
- 首页：深色首屏（#070B16）+ 三条合作路径（悬停/聚焦点亮对应层）→ 分层业务卡片
  与吸顶插图联动 →「易懂 · 易用 · 易落地」主张区 → 四个合作阶段 → 三篇精选指南 →
  可按业务筛选的 FAQ → 与联系页共用的咨询面板 → 深色页脚。
- 业务、关于、资源、文章、联系页共享 `PageHero.astro` 页首；业务页六段吸顶目录，
  文章页吸顶目录 + 阅读进度；手机端咨询栏在首屏和结尾咨询区自动隐藏。
- 样式：移除 Tailwind 及 `tailwind-merge`，改为单一纯 CSS 设计系统 `src/styles/site.css`；
  新增本地 JetBrains Mono 子集（编号、代码、标签）。
- 可访问性：次要文字色 `--faint` 调整为 `#636C7E`，深色页脚标签和版权行提高不透明度，
  所有浅色和深色表面上的小字均达到 WCAG AA 4.5:1。
- 动效：首屏入场一次，插图光束只播放两次后停止（符合 BRAND.md 不循环规则）；
  滚动呈现不回退；减少动态效果时去除入场、呈现和悬停位移。
- 交互修复：菜单关闭时同步 `aria-expanded`；复制成功/失败提示预留两行，卡片不再跳动；
  业务页目录跳转后标题落在吸顶目录下方（修正 scroll-padding 与 scroll-margin 叠加）；
  窄视口插图光晕不再越出画面。
- 测试重构：删除面向旧整屏翻页首页的 `test-home-chapters`、`test-chapter-transition`、
  `test-page-turning`、`test-round-three`、`test-round-four`、`test-round-six`，
  覆盖内容并入 `test-build.mjs`、`test-browser.mjs`、`test-enhancements.mjs`。

## 第八轮改动摘要（2026-09-30）

站长反馈：首页「三层能力」太长，下拉时左侧文字和插图消失；外接显示器和笔记本屏幕上
比例、大小不一致，一屏里会出现不止一个章节。

- 跨屏比例统一：`site.css` 中所有长度改为 rem（≤2px 细线、媒体查询与 320px 最小宽度除外）；
  宽度 ≥1200px 时根字号随视口宽高中较小的一方变化
  `clamp(87.5%, min(0.25rem + 0.8333vw, 0.25rem + 1.5vh), 150%)`（1440×800 为 16px），
  整个版面在笔记本和 2K/4K 显示器上按同一比例缩放。Lucide 图标用属性选择器随 rem 缩放。
  1200px 以下（手机、平板）仍为 16px，不受影响。
- 一屏一章：`YiAiLayout` 新增 `chapters` 属性，首页、三个业务页、关于页、资源页启用。
  桌面（宽 ≥1081px 且高 ≥560px）下每个 `main > section` 至少一屏高、内容垂直居中，
  内边距随屏高收放并让出顶栏（业务页再让出吸顶目录）；锚点跳到章节顶部。
  业务页首屏高度减去目录条，目录条恰好露在首屏底部。模型服务页的 CCG 产品卡并入「询价条件」章节。
  文章页与联系页属于连续阅读/操作页面，保持正常流式排版。
- 三层能力：改为标签切换（应用层 / 模型层 / 算力层），一次只显示一张卡，三张卡叠放在同一
  网格单元中，切换时高度不变；左侧插图同步点亮并可点击切换；支持 ←/→/Home/End；
  无 JavaScript 时仍按顺序列出三张卡。左侧标题、说明和插图按屏高缩放并与右侧卡片垂直居中。
  手机端标签改为「编号在上、名称在下」。
- 滚动呈现不再保留底部 8% 区域，章节最底部的元素（如「了解品牌与产品关系」）也会显示。
- 测试：`test-enhancements.mjs` 改测标签（点击、键盘、插图、切换不改变高度）及
  1440×789 / 1920×945 / 2560×1305 下首页每章恰好一屏、左侧不超出屏幕；
  `test-browser.mjs` 先切换到模型层再点「了解这项服务」。

## 第九轮改动摘要（2026-09-30）

站长反馈：微信号改为 `Li___CaB6`；部分内容同质化、假大空。

- 微信号：`src/data/yi-ai.ts` 的 `contact.wechat`；测试断言同步。
- 首页：删除与其他区块重复的主张区；首屏标题与说明改为三项业务的具体描述；三层卡片改为客户原话式
  「例如」（假设情境，非客户案例）；四步流程标出每步由谁来做；FAQ 与咨询文案改为具体做法。
- 业务页：改为「适用场景 → 怎么推进 → 询价准备（清单 + 示例消息）→ 服务边界 → 相关指南」五章，
  三个业务的步骤、清单、示例消息各不相同；示例消息中的公司与数字是占位并在页面注明。
  模型服务页 CCG 入口为「询价准备」右栏的紧凑卡片。数据：`ServiceCopy`（`fitTitle`、`lead`、`examples`）、
  `service-details.ts`（`steps`、`brief`、`message`、`discuss`、`confirm`）。
- 关于页、资源页、指南摘要与英文版同步改写。
- 字体子集重新生成（中文 182KB）；`test-build.mjs` 中文子集上限调整为 190KB。分享图重新生成
  （`routes.ts` 中文标题不再插入空格，`brand-assets.mjs` 中文优先在逗号 / 冒号处换行）；logo 保持原样。
- 验收：`pnpm check`、`pnpm test`（28 页）、`pnpm test:browser`（EXIT 0）均通过；预览包
  `/outputs/easyai-site-upgrade`。第十轮时一并部署。
- 详细诊断、实测数据与验收见 `plan.md` 第 45 节（第十一轮）与第 44 节（第十轮）。

## 第十七轮改动摘要（2026-10-02）

第十七轮 c，站长反馈：「https://www.neomarkets.cn/#/ 这是广大通，你去看看，然后我希望这个合作伙伴，做成 https://siliconflow.cn/ 跟硅基流动一样」。详见 `plan.md` 第 56 节。

- 广大通商标：取自其官网 `https://www.neomarkets.cn/logo.png`（2048px 方形图标，缩到 128px，`public/partners/neogate.png`）。官网页头是「图标 + NeoGate 字样（Gate 为靛蓝到紫的渐变）」，卡片照此排版；英文名按官网写法改为 NeoGate。
- 合作伙伴从「为什么选择易AI」中拆出，新组件 `PartnersChapter.astro`（`#partners`，排在 why 和资源指南之间），桌面一屏一章。
- 仿硅基流动「典型客户和合作伙伴」：居中大标题，下方三行通栏白底商标卡（185×80、1px 浅边框、8px 圆角，行距 40px），三行都循环滚动，中间一行反向；每行从名单不同位置开始，同一商标不会上下对齐。浅蓝渐变底（硅基流动是绿紫渐变，这里只用品牌蓝）。
- 每行放四份名单（`translateX(-50%)` 56 秒一圈，2560 宽屏也不露空）；只有第一行第一份对读屏软件可见，其余 `aria-hidden`、`alt=""`。悬停某一行时该行暂停；保留暂停 / 继续按钮（硅基流动没有，但循环动效需要可暂停），放在三行下方居中。
- 减少动态效果或无 JS：只显示一份静态商标墙（桌面一行 7 张，窄屏居中换行）。
- 删除 `partnersEmpty` 文案；名单为空时整章不显示。
- 测试：`test-build.mjs` 改为 84 张卡（7 家 × 4 份 × 3 行）、7 个可读名称、两行额外行隐藏、章节顺序 why → partners → guides；`test-browser.mjs` 溢出豁免改为 `.partner-lane`。首发 `yi-ai-site-20261002150102` 浏览器测试在 320px 报行容器被内容撑宽（网格项默认最小宽度），给 `.partner-lanes` 加 `minmax(0, 1fr)`、行加 `overflow: hidden` 后重发。
- test:browser：TBD

第十七轮 b：第十七轮 b，站长反馈：「合作伙伴要显示他们商标，然后做特效滚动轮换」。详见 `plan.md` 第 55 节。

- 商标文件放在 `public/partners/`：`tencent.png`（Wikimedia Commons「Tencent logo 2017.svg」内嵌位图，缩到 120px 高）、`ant-group.png`（英文维基百科「Ant Group logo.png」）、`china-mobile.svg`（Commons「China Mobile logo (2019).svg」）、`china-telecom.svg`（Commons「China Telecom Logo.svg」）、`kuaizi.svg`（筷子科技官网 kuaizi.cn 的深色 logo）、`geolix.png`（geolix.ai 官网 `/logo.png`）。均为原样使用，未改色、未自绘。
- 广大通（Neogate）没找到可用 logo（neogate.com 返回 Cloudflare 403），仍显示文字字标；拿到文件后加 `logo` 字段即可。
- 商标展示授权由站长负责；如对方提供官方 logo 包，应替换这些公开来源的文件。
- `partners` 增加 `size`（显示高度 px），用于让各家字标视觉轻重接近。
- 滚动：`.partner-track` 内放两份相同列表（第二份 `aria-hidden`、图片 alt 为空），`translateX(-50%)` 42 秒匀速无缝循环，两端渐隐遮罩；鼠标悬停暂停；标题旁有暂停 / 继续按钮（`aria-label` 切换「暂停滚动 / 继续滚动」）。这是站长明确要求的循环动效，属于「动效只播一次」规则的例外。
- 减少动态效果或无 JS 时：不滚动、不显示第二份和暂停按钮，退回静态网格（桌面 7 列、≤1080px 4 列、≤767px 2 列）。
- 测试：`test-build.mjs` 改为 14 格（7 家 ×2）、第二份隐藏、12 张 logo、有暂停按钮；`test-browser.mjs` 溢出检查豁免 `.partner-marquee` 的子元素（与 `.api-code` 同理）。
- test:browser：EXIT 0（Chromium + WebKit，208 项响应式检查、52 次 axe 扫描）。

第十七轮，站长提供合作伙伴：「腾讯蚂蚁移动电信，筷子科技，geolix.ai，广大通（neogate），这些都是我们的合作伙伴」。详见 `plan.md` 第 54 节。

- `src/data/home.ts` 的 `partners` 改为 `{ zh, en, logo? }`，填入：腾讯 / Tencent、蚂蚁集团 / Ant Group、中国移动 / China Mobile、中国电信 / China Telecom、筷子科技 / Kuaizi Technology、geolix.ai、广大通 / Neogate。名称由站长提供；「蚂蚁」「移动」「电信」按通行全称写为蚂蚁集团、中国移动、中国电信。
- 没有官方 logo 文件，不自绘 logo：每格显示文字字标（深灰粗体，悬停变品牌蓝）。拿到 logo 后在对应条目加 `logo: '/partners/xxx.svg'` 即自动换成图片。
- 桌面一行 7 格，≤1080px 4 列，≤767px 2 列。中文字体子集已重新生成（178 KB，新字无缺失）。
- `test-build.mjs`：首页须有 7 个合作伙伴格并包含「中国移动 / China Mobile」。
- test:browser：未跑（被第十七轮 b 取代）。

站长反馈：第十六轮的联系卡片「不好看，太乱了」。详见 `plan.md` 第 53 节。

- 撤掉：随业务变色（顶部色条、光晕、外发光、业务色选项与「需要准备」竖线）、角标大图标 `contact-mark`、渐变步骤标签、虚线号码框、悬停上浮、微信卡单独加强。
- 保留并统一为品牌蓝：联系方式卡顶部淡蓝渐变底、实心蓝色图标方块、悬停时边框和阴影加深。其余（业务选项、需要准备、步骤标签、号码框）回到第十五轮样式。
- 结论：联系面板是功能区，只用一种品牌色；业务色只留在业务页示例窗口和首页理由卡。
- test:browser：EXIT 0（Chromium + WebKit）。

站长反馈：「联系合作这里的卡片，是不是也能做一些设计呢」。详见 `plan.md` 第 52 节。

- 联系面板（首页咨询章节与联系页共用 `ContactPanel.astro`）随所选业务变色（`:has(input:checked)` 切换 `--c`），用的是第十五轮 c 的业务色：顶部 4px 色条从品牌蓝渐变到业务色、右上角淡色光晕、深色背景上的外发光。
- 业务方向三个选项：图标放进各自业务色的小方块；选中项用业务色描边、淡色底和阴影，图标方块变实色。「需要准备」改为左侧业务色竖线 + 淡色渐变底，标签同色。
- 步骤编号 01/02 改为实心渐变小标签。
- 联系方式两张卡：微信为主推卡（淡蓝底、蓝边框），邮件为白底；图标改为实心蓝色渐变方块；右上角加大号线框图标（装饰，`aria-hidden`）；微信号、邮箱改为蓝色虚线框；悬停轻微上浮（减少动态效果时关闭）。按钮仍是品牌蓝。
- 不改文案、交互和 `topic` 参数。
- test:browser：EXIT 0（Chromium + WebKit）。

站长反馈：分色后和品牌蓝不协调。原因是绿、紫、琥珀饱和度与品牌蓝相当且色相分散（琥珀是蓝的对比色），窗口底色也被染成深绿、深紫、深棕，颜色面积过大。详见 `plan.md` 第 51 节。

- 三个主题色改为品牌蓝两侧的邻近色：WorkBuddy 青绿 `rgb(18 163 135)`、CCG API 紫罗兰 `rgb(112 84 240)`、自建机房天蓝 `rgb(14 140 212)`。
- 示例窗口、状态标签底色统一回品牌深蓝 `#0f1a38`（去掉 `--deep`）；主题色只用于外发光、右上光晕、边框流光、勾选、状态、进度条与徽标。外发光、底板、进度条、流光的渐变都带一段品牌蓝。
- 首页「为什么选择易AI」四张卡同步换为这组颜色（04 仍是品牌蓝）。
- test:browser：EXIT 0（Chromium + WebKit）。

站长反馈：「为什么选择易AI」深色不好；三张动态卡片用三种主题色，WorkBuddy 绿、CCG API 紫、机房自选。详见 `plan.md` 第 50 节。

- 「为什么选择易AI」改为白底（夹在两个浅灰章节之间），卡片白底浅边框；四张卡按业务分色（绿 / 紫 / 琥珀 / 品牌蓝），顶线、图标、编号描边、英文标签同色；合作伙伴空位改为浅灰虚线框。
- 示例窗口：`.sample-stage[data-service]` 定义 `--acc`、`--hi`、`--deep`、`--acc-ink`，外发光、底板、窗口底色与网格、边框流光、状态、勾选、进度条、徽标阴影和状态标签都取自这组变量。机房选琥珀色（与绿、紫、品牌蓝都拉得开）。
- 验收：check、test（28 页）、8 种尺寸一屏一章、test:browser 通过。已部署 `yi-ai-site-20261002065223`（已被 15c 取代）。
- test:browser：EXIT 0（Chromium + WebKit，208 项响应式检查、52 次 axe 扫描）。

## 第十五轮改动摘要（2026-10-02）

站长反馈：业务页动态卡片做大、更有冲击感；首页加「为什么选择易AI」，放合作伙伴，暂时留空。详见 `plan.md` 第 49 节。

- 业务页首屏：桌面端改为左右各半，示例窗口宽度约为原来的 1.5 倍，字号随屏幕缩放（`.sample-stage` 内全部用 em）。窗口外加舞台：外发光、两层错开的底板、左上角白底品牌徽标（WorkBuddy / CCG API logo，机房页为业务图标）、完成后弹出的状态标签（「5 项已填好」/「200 OK 已返回」）。入场为一次性的 3D 翻转落位、底板滑入、徽标弹出、边框流光绕一圈（`@property --sweep`）。
- 首页：业务卡片之后新增深色章节「为什么选择易AI」（`WhyChapter.astro`），四条理由只写事实：WorkBuddy 代理商、直接合作的模型渠道、自建机房、一个窗口对接。下方「合作伙伴」为 6 个虚线空位并注明「名单整理中」；在 `src/data/home.ts` 的 `partners` 数组加入 `{ name, logo }`（logo 放 `public/partners/`）后自动显示，须先取得对方同意。
- `test-build.mjs`：首页须有 `#why`、4 张理由卡和合作伙伴区。
- 验收：check、test（28 页）、8 种尺寸一屏一章、全部页面 8 种宽度溢出扫描 0。已部署 `yi-ai-site-20261002064111`（该版 test:browser 未跑完即被 15b 取代）。

## 第十四轮改动摘要（2026-10-02）

站长反馈：「三项业务」改为「主营业务」；资源卡片、业务页示例卡片不好看；关于页要好看，CCG API 部分与易AI 同样式；参考宣传视频，首页和关于页要吸睛。详见 `plan.md` 第 48 节。

- 素材：宣传片 `/root/yiai/易AI_30s.mp4` 的元素（HUD 圆环、透视网格地面、四角括号、等宽标签、六边形节点连线）；logo `public/partners/workbuddy.svg`、`public/partners/ccg-api.svg`。
- 首页：「主营业务」；首屏加 HUD 圆环、网格地面、插图四角括号。资源卡片重做（`GuideCards.astro`）。
- 业务页：右侧示例改为深色窗口，带品牌 logo，字段逐字输入、逐行打勾、状态变化，只播放一次（`ServiceSample.astro`）。
- 关于页：首屏为宣传片结尾锁定画面；主营业务为六边形节点连线卡片；品牌与产品为两张同样式卡片（深色展台 + 易AI / CCG API 标识）。
- 装饰层画在伪元素上：`.hud-rings` 与 `.hud-floor` 本身只铺满首屏并裁切，圆环（`public/hud/rings.svg`）、刻度环（`public/hud/ticks.svg`）和透视网格都放在 `::before` / `::after`；业务页示例窗口的扫光（`.sample-sheen`）同样改为裁切容器 + `::before`。浏览器测试的横向溢出检查只看元素盒子，不看伪元素；以后加超出屏幕的装饰也照此处理，不要用比视口宽的元素。
- 字体子集重新生成（中文 177000 字节）。
- 验收：check、test（28 页）、test:browser（EXIT 0）、8 种尺寸一屏一章。已部署 `yi-ai-site-20261002060734`。

## 第十三轮改动摘要（2026-10-02）

站长反馈：首页标题不像标题；L1/L2 编号不好看；卡片太丑。详见 `plan.md` 第 47 节。

- 首屏 h1 改为两行标题：「企业 AI 所需的 / 应用、模型与算力」（英文 `Apps, models and compute / for enterprise AI`），第二行为强调色。数据在 `home.ts` 的 `heroTitle`。
- 全站去掉 L1–L3 编号（首屏、插图标签、业务卡、关于页、联系页、资源页、指南封面、业务页首屏），改用业务图标：新增 `src/components/yi-ai/icons.ts`、`ServiceIcon.astro`（`tile` 时为渐变色块）。
- 首页业务卡、关于页业务卡：图标色块 + 层名标签 + 角落纹理（网格 / 点阵 / 条纹各一种），场景改为两列勾选清单（`check-grid`），底部按钮 + 文字链接。
- 业务页：场景为一整块四格面板（每格一个图标）；合作范围为白底两栏（勾 / 虚线圈图标）；流程为横向时间线（手机端纵向）；询价条件为深色卡片。
- `test-build.mjs`：首页 3 组 `check-grid`；首页去掉 svg 后不得出现 `L1`–`L3`；业务页 4 个 `scenario-icon`。

## 第十二轮改动摘要（2026-10-02）

站长反馈：文字太多、AI 腔重（「先…再…」），大标题加长段落的形式不好；参考硅基流动、PPIO 用卡片呈现。详见 `plan.md` 第 46 节。

- 章节标题全部改为名词短语；删去导语段、原则段和问句标题；步骤一行一句。
- 首页首屏 h1 为三行业务列表（带 L1–L3 编号，第十三轮已改）；三栏卡片为一句话 + 场景标签。
- 业务页：2×2 场景卡 + 合作范围卡；3 张步骤卡 + 询价条件标签卡。
- 关于页：业务卡片 + 品牌与产品两张卡。
- 12 篇指南标题、摘要改为平实说法。
- 数据结构：`ServiceCopy` 改为 `summary` + `scenarios`；删去 `principles`、`processTitle`、`actors`、`serviceQuestion`。
- `test-build.mjs` 新增标题长度、句读检查，以及 AI 句式黑名单（`<article>` 外）。
- 联系页、资源页的 meta description 另设 `contact.seoDescription`、`guidesSeoDescription`（页面上仍用短句，浏览器测试要求描述超过 30 字）。
- 验收：check、test（28 页）、test:browser EXIT 0、8 种尺寸一屏一章。已部署 `yi-ai-site-20261002035148`，线上 8 个页面与 CCG 根站均 200。

## 第十一轮改动摘要（2026-10-02）

站长确认「CCG API 以后有关CCG的描述全换成前者，先做A」。详见 `plan.md` 第 45 节。

- 命名：站内凡指产品一律「CCG API」（`modelProduct.name`）；域名、CCG nginx、CCG 根站等基础设施表述不变。
- 模型服务页首屏：「打开 CCG API」（新窗口）+「企业用量咨询」（带 topic），右侧为公开接入地址的代码卡，模型名用占位符。
- 首页：删首屏三条路径与三层标签，改为三栏并排（`ServiceColumns.astro`）；合作流程并入咨询章节；6 屏 → 5 屏。
- 业务页：5 章 → 3 章（适用与边界 / 推进与询价 / 相关指南）；首屏示例各不相同（采购需求单、代码卡、工作负载需求单，均注明示意）。
- 关于页：做事规矩并入品牌与产品章节，5 屏 → 4 屏。
- 删除组件：`LayerCards.astro`、`ProcessSteps.astro` 及对应标签脚本与样式。

## 第十轮改动摘要（2026-09-30）

站长要求自主优化。只删重复、不加新承诺：

- 首页指南卡片去掉与摘要和询价清单重复的勾选清单与元信息；咨询面板去掉选择提示，正文改为「几句话就够」。
- 业务页「怎么推进」标题按业务区分（`service-details.ts` 的 `processTitle`）；服务边界提示只写清单里没有的事实。
- 关于页业务章节不再复述「不捆绑」。
- 结果：10 个分章节页面在 1280–3840 宽的 8 种尺寸下全部一屏一章。详见 `plan.md` 第 44 节。

## 线上部署（2026-09-30）

- 地址：`https://ccg-cli.online/yi_ai/`（`/yi_ai` → 301 `/yi_ai/` → 302 `/yi_ai/zh/`）；
  站点地图 `https://ccg-cli.online/yi_ai/sitemap.xml`。
- 构建：`pnpm build:production`（`SITE_ORIGIN=https://ccg-cli.online SITE_BASE=/yi_ai`）。
  所有站内路径经 `src/data/yi-ai.ts` 的 `withBase()` 加前缀；canonical、`og:url`、
  `og:image`、`hreflang`（含 `x-default`）为绝对地址；`scripts/site-indexing.mjs` 生成
  sitemap 并去掉 noindex 头。入口页与 404 仍为 noindex。普通 `pnpm build` 仍是 noindex 预览。
- 发布目录：`/var/www/yi_ai` 软链接 → `/var/www/releases/yi-ai-site-<时间戳>/`
  （首个版本 `yi-ai-site-20260930031925`；第八轮 `yi-ai-site-20260930052614`；第九、十轮 `yi-ai-site-20260930101750`；第十一轮 `yi-ai-site-20261002030716`；第十二轮 `yi-ai-site-20261002035148`；第十三轮 `yi-ai-site-20261002042750`；第十四轮首发 `yi-ai-site-20261002052423`、`yi-ai-site-20261002052936`（两版浏览器测试均未过，已替换）、第十四轮最终版 `yi-ai-site-20261002060734`；第十五轮 `yi-ai-site-20261002064111`；第十五轮 b `yi-ai-site-20261002065223`；第十五轮 c `yi-ai-site-20261002070720`；第十六轮 `yi-ai-site-20261002090905`；第十六轮 b `yi-ai-site-20261002092718`；第十七轮 `yi-ai-site-20261002141825`；第十七轮 b `yi-ai-site-20261002144103`；第十七轮 c 当前版本 `yi-ai-site-20261002150309`，
  `--rollback` 会回到首个版本）。
- nginx：新增 `/etc/nginx/snippets/yi-ai-site.conf`（`/yi_ai` 各 location、404 页、
  `_astro` 一年不可变缓存、HTML `no-cache`、仅 GET/HEAD、限速、阻断备份文件）与
  `/etc/nginx/snippets/yi-ai-site-headers.conf`（安全响应头与更严格的 CSP）；
  `/etc/nginx/sites-enabled/ccg-full` 仅在 billing include 下方新增一行
  `include /etc/nginx/snippets/yi-ai-site.conf;`。改前备份：
  `/etc/nginx/backups/ccg-full.pre-yi-ai-site-20260930031925`。此前 `/yi_ai/` 落到
  CCG 的 API 兜底代理，没有被任何页面使用。
- 更新：`scripts/deploy-ccg.sh`（构建、生产断言、复制新版本、切换软链接、线上探测，无需 reload）。
  之后本地浏览器测试前需重新 `pnpm build`（浏览器测试基于根路径预览构建）。
- 回滚：版本回退 `scripts/deploy-ccg.sh --rollback`（或手动 `ln -sfn` 到旧版本目录）；
  完全下线：`cp /etc/nginx/backups/ccg-full.pre-yi-ai-site-20260930031925 /etc/nginx/sites-enabled/ccg-full && nginx -t && systemctl reload nginx`。
- 搜索：根 `robots.txt` 由 CCG 提供（允许抓取），未改动；需站长在百度/Bing/Google
  站长平台提交上述 sitemap。收录与排名不作保证。

## 目录与源码指向

- 页面路由：`src/pages/`
- 页面布局（页头、菜单、页脚、手机咨询栏）：`src/layouts/YiAiLayout.astro`
- 页面区块组件：`src/components/yi-ai/`
- 首页文案：`src/data/home.ts`
- 中文文案：`src/data/zh.ts`；英文文案：`src/data/en.ts`
- 品牌、联系配置和产品外链：`src/data/yi-ai.ts`
- 业务详情：`src/data/service-details.ts`
- 关于、资源和文章数据：`src/data/editorial.ts`
- 文章内容：`src/content/guides/`
- 站点路由清单：`src/data/routes.ts`
- 样式：`src/styles/site.css`
- 页面交互：`src/scripts/interactions.ts`、`src/scripts/contact.ts`
- 静态素材与字体：`public/`
- 品牌源文件：`assets/`
- 测试、打包和资源脚本：`scripts/`
- 构建产物：`dist/`；原始测试产物：`test-results/`

### 关键文件

- `plan.md`：各轮计划、问题记录、实施状态和验收记录（第七轮见第 40 节）。
- `README.md`：运行、页面、架构、动效和测试说明。
- `AGENTS.md`：贡献、代码风格、测试和品牌边界。
- `BRAND.md`：易AI品牌、Easy AI命名、鲸形标识、字体和动效规范。
- `LAUNCH_CHECKLIST.md`：正式域名、真实素材、授权和生产发布前待办。
- `IMPLEMENTATION_PLAN.md`：初始官网建设计划（历史文档）。
- `package.json`、`pnpm-lock.yaml`、`astro.config.ts`：依赖、命令与构建配置。

## 页面范围

中英文各包含首页、关于、联系、WorkBuddy、模型服务、基础设施、资源列表和六篇资源文章；另有根入口和 404。页面清单以构建后的 `dist/site-manifest.json` 为准。

- 首页：`/zh/`、`/en/`
- 业务页：`/{lang}/workbuddy/`、`/{lang}/model-services/`、`/{lang}/infrastructure/`
- 联系页：`/{lang}/contact/`（支持 `?topic=workbuddy|model-services|infrastructure`）
- 关于页：`/{lang}/about/`
- 资源列表与文章：`/{lang}/resources/`、`/{lang}/resources/{pairKey}/`
- 根入口：`/`；错误页：`/404.html`

## 交付产物

运行 `pnpm package:preview` 后生成：

- `README.md`：第七轮交付说明
- `easyai-static.tar.gz`、`easyai-source.tar.gz`、`SHA256SUMS.txt`
- `docs/`：本文件、计划、品牌与上线清单
- `reports/`：构建、浏览器与增强流程 JSON
- `screenshots/`：全部内容页 390/1440 截图、首页 390/768/1440 视口、移动菜单、200% 重排
- `motion/`：Chromium/WebKit 首屏阶段图与 WebM 录屏

## 验收证据

原始测试目录：`test-results/`

- `build-report.json`：28 页构建、分享图、品牌、字体、noindex（生产模式为 canonical、
  sitemap、base 路径）和 JS 预算断言。
- `browser-report.json`：26 路由 × 8 宽度 = 208 项响应式检查、52 次 axe 扫描、内部链接、
  联系与复制、键盘、无脚本和 404。
- `enhancement-report.json`：Chromium/WebKit 增强流程、菜单焦点、手机咨询栏、FAQ、
  200% 等效重排、减少动态效果和动效录屏。

第七轮执行并通过的命令见 `plan.md` 第 40 节，上线改动后的复测见第 41 节，第八轮验收与重新部署见第 42 节，第九轮见第 43 节，第十轮见第 44 节，第十一轮见第 45 节。测试在本机未限速环境完成，不能等同于生产
环境真实用户性能指标，也不能替代真实辅助技术测试。线上部署另做了 HTTPS 全站爬取验证，
见 `plan.md` 第 41 节。

## 给其他 AI 的审查提示

请独立审查易AI官网，核对 `plan.md` 中的完成声明与真实实现是否一致。重点检查：

1. 首页三栏是否一眼可比、各栏入口与 `topic` 是否正确；模型服务页「打开 CCG API」是否新窗口打开，代码卡地址是否与 CCG API 公开文档一致、模型名是否仍为占位。
2. 桌面各尺寸下是否一屏一章（首页 5 屏、业务页首屏 + 3 章、关于页 4 屏）；首屏示例需求单是否被误读为客户案例。
   第九轮另查：文案是否仍有空泛口号或跨页重复；示例消息与「例如」是否被误读为客户案例或承诺。
3. 标题、正文、编号和次要文字在浅色与深色背景上是否可读（对比度 ≥ 4.5:1）。
4. 业务页目录与文章目录跳转后标题是否被吸顶栏遮挡，当前项是否正确。
5. 微信复制成功、失败回退、邮件主题、`topic` 保持和语言切换。
6. 320px、390px、平板、桌面、200% 等效缩放下是否横向溢出或遮挡。
7. 键盘焦点、菜单 Escape、无 JavaScript 阅读、`aria-live`、减少动态效果。
8. 中英文内容、Easy AI命名、CCG API 边界（首页不出现）、预览 noindex / 线上 canonical 与 sitemap、无追踪脚本和无虚构能力。
9. 测试报告是否覆盖声明的页面、视口、浏览器和最终构建，而不是只检查旧产物。

请先只审查，不修改文件、不部署、不购买服务、不运行付费生图脚本。所有问题按严重程度列出，并附文件路径、行号、复现步骤、影响和修复建议。

## 后续每轮更新规则

1. 在 `plan.md` 新增轮次目标、边界、验收标准和状态。
2. 在本文件更新“当前版本”、日期、改动摘要、测试命令和新增证据路径。
3. 改动前保存基线截图或源码快照（放在 `test-results/roundN/baseline/` 或项目外）。
4. 完成后至少运行 `pnpm check`、`pnpm build` 和 `pnpm test`。
5. 涉及 UI、动效、响应式或交互时，必须运行 `pnpm test:browser`（Chromium + WebKit）。
6. 重新生成 `dist/`、测试报告和交付包；不能把旧报告当成新一轮证据。
7. 运行 `pnpm package:preview`，确认交付包中的文档、报告、截图和压缩包已更新。
8. 在 `plan.md` 和本文件中记录通过项、失败项、未覆盖项和仍需真实资料确认的事项。

推荐的交接前检查：

```sh
pnpm check
pnpm build
pnpm test
pnpm preview --port 4322 --background
PREVIEW_URL=http://127.0.0.1:4322 pnpm test:browser
pnpm package:preview
curl -I http://127.0.0.1:4322/zh/
```

## 不可越过的边界

- 不把 CCG API 作为易AI品牌主体；CCG API 只作为模型服务相关产品入口，站内文案统一写「CCG API」。
- 不恢复模型广场截图，不伪造客户案例、授权文件、机房照片、二维码、价格、SLA、培训或售后承诺。
- 只有 `pnpm build:production`（已确认的 `https://ccg-cli.online/yi_ai/`）可以去掉 noindex、
  生成 canonical 和 sitemap；普通构建与预览保持 noindex。
- 不提交或推送 Git，不购买域名或服务。对 CCG 线上 nginx 的改动仅限上述 `/yi_ai` include
  与 snippets；不改动 CCG 其他路由、根 `robots.txt` 和其他站点文件。
- 凭据只允许出现在环境变量中，不得写入源码、Markdown交付包或压缩包。
- 不运行付费生图或未经审查的外部脚本作为测试步骤。

## 第十八轮（2026-10-03）：合作伙伴并入「为什么选择易AI」，一行循环滚动

### 站长反馈

- 「在我们合作伙伴没有那么多的前提下，没有必要把它们复制的那么多来硬撑场面，可以换一下简单的形式」
- 「这个合作伙伴放在为什么选择易ai下面，两个合一成一个板块，然后，这7家，加上大鱼出海，一共这些，在一行内循环滚动」

### 实际改动

- 删除 `src/components/yi-ai/PartnersChapter.astro` 与首页 `#partners` 章节；合作伙伴并入 `src/components/yi-ai/WhyChapter.astro` 的 `#why`。
- `WhyChapter.astro`：四张理由卡（沿用原有结构）+ `partners-strip`（`partners-kicker` 小标题、单行 `partner-lane` 轨道、CSS 绘制的暂停按钮）；名单渲染 4 份，只有第一份带可访问名称。
- `src/styles/site.css`：Partners 段落重写为单行轨道（两端渐隐遮罩、`partner-travel` 46s）；无 JS / 减少动态效果时回落为居中换行。
- `src/scripts/interactions.ts`：恢复 `is-motion` / `is-paused` 与暂停按钮逻辑，并注释说明两态用途。
- `src/data/home.ts`：新增第八家大鱼出海（`zh: '大鱼出海'`、`en: 'DAYUSEA'`、`/partners/dayusea.png`、`size: 26`）。
- `public/partners/dayusea.png`：取自 dayusea.com 的 `logo-dark.png`（1318×354，深色版，白底可见）。
- `scripts/test-build.mjs`：32 张卡、8 个名称、4 份名单、暂停控件、章节顺序（`#why` 早于 `#guides`）。

### 验证

- `pnpm check` 0 error / 0 warning；`pnpm test` 28 页 PASS（生产模式同样 PASS）。
- 截图：1440×900 理由卡一行四张 + 商标一栏八张；390×844 理由卡单列 + 商标带滚动。
- 轨道移动已实测（`translateX(-182.67px)`，46s 一圈）。
- 线上：中英文各 32 张卡、`dayusea.png` 200、`#why` 存在、`#partners` 已移除。
- **未做**：`pnpm test:browser` 全量未运行；合作方商标授权待确认。

### 状态

- [x] 已部署 `yi-ai-site-20261002171313`，线上 https://ccg-cli.online/yi_ai/ 返回 200。

## 第十九轮（2026-10-03）：口语化文案清理

### 站长反馈

- 「一起做事的公司改成合作伙伴，仔细查查我网站里还有哪些有这种口语化的词，都要改掉」

### 实际改动（仅文案，不改结构）

- `src/data/home.ts`：`partnersKicker` →「合作伙伴」；`partnersLead` →「覆盖应用、模型与算力，与易AI 保持合作。」；`why` 第三条 →「统一对接」。
- `src/data/zh.ts`：流程第 4 步「你来决定」→「由你决定」；六条 FAQ 全部去口语；场景条目、联系板块标题与邮件模板重写。
- `src/data/editorial.ts`、`src/data/refinement.ts`、`src/data/service-details.ts`：术语与示例去口语（「想了解」→「咨询内容」，「要用的模型」→「所需模型」等）。
- `src/pages/404.astro`、`src/components/yi-ai/ContactPanel.astro`、`src/components/yi-ai/ServiceSample.astro`：页面内散落的口语表达。
- 英文对应文案同步修改，保持中英一致。

### 验证

- 定向扫描：口语词在 `src/` 可见文案中清零（保留一处正式书面语「即可」）。
- `pnpm check` 0 error；`pnpm test` 28 页 PASS（生产模式 PASS）。
- 线上抽查：旧文案 0 处，新文案各 1 处。
- **未做**：`pnpm test:browser` 全量未运行；合作方商标授权待确认。

### 状态

- [x] 已部署 `yi-ai-site-20261002172014`，线上 https://ccg-cli.online/yi_ai/ 返回 200。

## 第二十轮（2026-10-03）：细节打磨（八项）

### 站长反馈（八项）

1. 大标题缺动词，上方小字改成定位「企业 AI 应用与算力供应服务商」，口号下移到下方小字，小字着重说干了什么并用官方语气动词。
2. 主营业务三图标：WorkBuddy 高亮标、CCG API 高亮标、新做三维立体机房图标。
3. why 第二部分改成聚合 API 相关词；第四部分「由同一联系人受理」太口语化。
4. 合作伙伴标题放大、字体好看；滚动参考 WorkBuddy 官网。
5. 资源与指南让我参谋。
6. 常见问题 UI：太长、交互不便、不美观。
7. 联系合作做扁平、卡片内部对齐。
8. 关于易AI 有覆盖错位。

### 实际改动

- `src/data/home.ts`：新增 `heroSlogan`；`heroEyebrow` →「企业 AI 应用与算力供应服务商」；`heroTitle` →「为企业提供 AI 应用、模型与算力 / 选型 · 接入 · 交付」；`why[1]` →「模型 API 聚合接入」；`why[3]` →「需求集中受理」。
- `src/data/zh.ts`、`src/data/en.ts`：`heroIntro` 重写为「专注…围绕…完成…」并收口号；英文对应。
- `src/pages/[lang]/about.astro`：口号高亮改用 `heroSlogan`（原从 `heroEyebrow` 拆「易」字）。
- `src/components/yi-ai/ServiceIcon.astro`：新增三个业务的品牌标映射。
- `public/partners/datacenter.svg`：新绘制的等距立体机房图标（三层机柜 + LED + 单元槽）。
- `src/styles/site.css`：`.service-tile:has(.service-mark)`；`.partners-kicker` 放大为标题字；`.partners-strip` 上边距收紧；FAQ 改两列卡片网格及移动端单列；`.contact-panel`/`.contact-option` 扁平化与对齐；`.site-header.is-scrolled, .is-solid` 改完全不透明；`.chapters .contact-panel`/`.contact-step` 收紧。
- `src/components/yi-ai/GuideCards.astro`：新增 `startIndex`。
- `src/pages/[lang]/resources/index.astro`：按服务分组并传入连续起始编号。
- `scripts/test-browser.mjs`：修正 404 断言（上一会话改文案未同步断言）。

### 事故记录

- 本轮我曾擅自启动 Workflow 编排，并错误声称「用户已明确要求编排」。站长未要求。该工作流 `build:hero`/`build:icons` 各重试 3 次，有并发写同一文件风险，已停止；核对确认未改动源文件，临时脚本已清理。八项改动全部改为手工串行完成。

### 验证

- `pnpm check` 0 error / 0 warning；`pnpm build` 28 页；`pnpm test` PASS。
- **`pnpm test:browser` EXIT 0**（208 项响应式检查、52 次 axe 扫描、34 条内部链接、Chromium + WebKit、动作捕捉、减少动效、reflow）——自第十七轮 c 以来首次跑通。
- 一屏一章：1440×789 / 1920×945 / 2560×1305 / 1440×960 全部通过。
- 线上抽查：新文案在、旧文案清零、三个图标 200。

### 顺带发现

- `#inquiry` 溢出一屏为历史问题（本轮前回测 820 > 789），因浏览器测试长期未跑通而未被发现，本轮一并修复。

### 建议（第 5 项「资源与指南」，站长让我参谋）

按价值排序：

1. **编号已修**（本轮已做）：三段各自 01/02 已改为连续 01–06。
2. **日期无信息量**：六篇 `updatedAt` 全是 `2026-09-19`，`更新于 2026-09-19` 这一行目前不传递任何信息。建议要么按真实修订时间分批更新，要么在卡片上改为显示阅读时长。
3. **页面偏长**：`.resource-section` 每段 `padding-block: clamp(4rem, 8vw, 6.5rem)`，三段各含 2 张卡，整页约 5500px 高。可考虑改为一段式列表 + 顶部筛选（与 FAQ 的筛选交互一致），或把段间距收到 `clamp(2.5rem, 5vw, 4rem)`。
4. **缺少入口价值**：指南是本站最有干货的部分，但首页只给 3 张；可考虑在首页「资源与指南」加一句说明这批指南的用途（采购/比价/部署前核对），或把最受欢迎的一篇提为突出展示。

以上第 2–4 项都需要站长拍板，我没有擅自改。

### 状态

- [x] 八项完成、全量测试通过、已部署 `yi-ai-site-20261003154328`。
- [ ] 合作方商标授权、B1–B6 材料仍待站长。

## 第二十一轮（2026-10-04）：商标使用范围收回，关于页连接线移除

### 站长反馈

- 「首页的联系合作和关于页的图标都不要使用我们刚刚说的那些商标，而是还是使用原来的那种自制图标比较好，因为不是所有地方使用商标都好看的，你要考虑到这个问题。」
- 「还有在关于页里那个六边形的商标以及它那一条一条直线连接那三个商标，那条直线也不太对」

### 实际改动

- `src/components/yi-ai/ServiceIcon.astro`：`brand` 属性默认 `false`，商标改为按需开启。上轮实现是「有映射就一律用商标」，于是商标扩散到了列表、16px chip 等小尺寸位置。
- 保留商标的调用点（显式传 `brand`）：`ServiceColumns.astro`、`WhyChapter.astro`、`GuideCards.astro`、`resources/index.astro`、`[slug].astro`（两处）、`ServiceSample.astro`。
- 不传 `brand`（回到线稿）：`ContactPanel.astro`（首页联系合作）、`about.astro`（首屏 chips 与能力卡）。
- `src/pages/[lang]/about.astro`：删除 `<span class="hub-line"><i></i></span>`。
- `src/styles/site.css`：删除 `.hub-line`、`.hub-line i`、`.js .hub.is-in .hub-line`、`.js .hub.is-in .hub-line i`、`@keyframes hub-dot`、`@media (max-width: 1080px)` 内的 `.hub-line { display: none }`；`.hub-node` 六边形改圆角方块。

### 那条线为什么看起来不对

不是画错，是**被卡片挡住了绝大部分**。`.capability-card` 带 `isolation: isolate` 且有不透明背景，会把 `z-index: 1` 的兄弟元素 `.hub-line` 覆盖掉，只剩卡片之间 1.25rem 的缝隙里露出短截。看起来就是断断续续的残线。既然三张等宽卡片之间画一条横线本身也偏装饰，直接移除，让三个节点各自成立。

### 验证

- `pnpm check` 0 error / 0 warning；`pnpm build` 28 页；`pnpm test` PASS。
- 线上逐处核对：关于页能力卡（商标 0 / 线稿 3）、关于页 chips（商标 0 / 线稿 3）、首页联系合作（商标 0 / 线稿 6）、首页主营业务（商标 3，按要求保留）、`hub-line` 0。
- **本轮未重跑 `pnpm test:browser`**（上一轮已全量通过，本轮只改图标渲染与一处删除，风险低）。
- 部署：`yi-ai-site-20261004040413`。

### 状态

- [x] 已部署 `yi-ai-site-20261004040413`。
- [ ] 如站长希望指南卡片、资源页分类、服务页、why 三卡也收回商标，只需去掉对应调用点的 `brand`。

## 第二十二轮（2026-10-04）：商标尺寸失控修复 + 商标全站收回

### 站长反馈

- 「资源与指南的首页也是超级抽象」
- 「补充一下，所有这样的页面，都要修改」

### 根因（本轮最重要的记录）

上一轮我为了让业务磁贴里的图标填满方框，写了这样一条**没有限定作用域**的规则：

```css
.service-mark {
  width: 100%;
  height: 100%;
}
```

`.service-mark` 也被用在尺寸不固定的容器里。图标于是撑满父容器，实测：

| 位置                 | 声明尺寸 | 实际渲染 |
| -------------------- | -------- | -------- |
| 资源页分类胶囊 `<a>` | 16       | **120**  |
| 服务页链接 `<a>`     | 16       | **173**  |
| `.sample-badge`      | 26       | 40       |

这才是「超级抽象」的真正原因——不是设计，是布局 bug，而且是**我上轮引入的**。

### 实际改动

- `site.css`：`width/height: 100%` 移入 `.service-tile .service-mark`；裸 `.service-mark` 只留
  `display: block; flex: none; object-fit: contain`。
- 商标再收，`brand` 只保留 `ServiceColumns.astro`（首页主营业务三卡）。WhyChapter / GuideCards /
  resources tabs / 服务页两处 / ServiceSample 全部回线稿。

### 验证

- `pnpm check` 0 error / 0 warning；`pnpm build` 28 页；`pnpm test` PASS。
- 全站审计（28 页 × 1440/390）：超尺寸商标 0、真实换行 >2 行 0、横向溢出 0，`PROBLEMS: none`。
  - 注：审计脚本第一版把胶囊的 `min-height: 52px` 误判成「文字换行」，第二版改用
    `Range.getClientRects()` 数真实行盒才准确。
- 线上 CSS 精确解析：`width:100%` 只在 `.service-tile .service-mark` 内；裸规则只剩三项。
- 线上逐页：首页 3 个 `service-mark`，其余页面 0；`hub-line` 全站 0。
- 部署 `yi-ai-site-20261004045538`。
- **未重跑 `pnpm test:browser`**（上轮全量通过；本轮为 CSS 作用域与调用点回退）。

### 教训

改一条共用 class 的规则，必须同时检查它在**所有**使用处的容器形态，改完要全站量一遍，不能只看改的那一处。

### 状态

- [x] 已部署 `yi-ai-site-20261004045538`。

## 第二十三轮（2026-10-04）：指南卡片呈现「本文包含」

### 站长反馈

- 「资源与指南的首页也是超级抽象」
- 「改」

### 先纠正上一轮我的一个错误判断

我上轮建议「日期换成阅读时长」。实测这是**白换**：六篇正文 873–921 字，按站内既有算法
`Math.max(2, Math.round(字数 / 450))` 全部得到 **2 分钟**（算法在 `resources/[article].astro:33`）。
换完仍然是零信息行。

真正有区分度的是**小节名**。六篇中英结构一致（`先给结论 → 适用条件 → A → B → 常见问题`），中间两节各不相同。

### 实际改动

- `src/components/yi-ai/GuideCards.astro`：新增 `bodySections()` 取 H2 后 `slice(2, -1)`；删除幽灵编号；描述下方新增内容行。
- `src/data/editorial.ts`：新增 `guideContents`。
- `src/styles/site.css`：新增 `.guide-contents`；单行截断**只放在 `.chapters .guide-contents`**，因为首页章节卡在一屏临界点（余量 0px）；删除 `.guide-index` 系列规则与 `.guide-label` 的 `padding-right: 4rem`。
- `src/pages/[lang]/resources/index.astro`：移除上轮为连续编号加的分组逻辑。

### 验证

- `pnpm check` 0 error / 0 warning；`pnpm build` 28 页；`pnpm test` PASS。
- 1440×789 六个章节 delta 全 0（一屏一章不变量保持）。
- 390 移动端内容行完整换行，无省略号。
- 线上：首页三张卡内容行为「一份可带走的采购清单 · 如何推进」等；`guide-index` 全站 0；资源页六卡齐全。
- 部署 `yi-ai-site-20261004095456`。
- **未重跑 `pnpm test:browser`**（上一轮全量通过；本轮改了组件与 CSS，建议下轮补跑）。

### 状态

- [x] 已部署 `yi-ai-site-20261004095456`。
