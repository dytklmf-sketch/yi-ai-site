import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';
import { execFile } from 'node:child_process';
import { cp, mkdir, readFile, stat, writeFile } from 'node:fs/promises';
import path from 'node:path';
import os from 'node:os';
import { promisify } from 'node:util';

const exec = promisify(execFile);
const createArchive = (args) => exec('tar', args, { env: { ...process.env, COPYFILE_DISABLE: '1' } });
const root = process.cwd();
const output = path.resolve(process.argv[2] || '../../outputs/easyai-site-upgrade');
const json = async (file) => JSON.parse(await readFile(file, 'utf8'));
const [build, browser, enhanced, roundFour, roundSix, routes] = await Promise.all([
  json('test-results/build-report.json'),
  json('test-results/browser-report.json'),
  json('test-results/enhancement-report.json'),
  json('test-results/round-four-report.json'),
  json('test-results/round6-report.json'),
  json('dist/site-manifest.json'),
]);
assert.equal(build.htmlPages, 28);
assert.equal(browser.checks.length, routes.length * 8);
for (const width of [320, 360, 390, 768, 1024, 1200, 1440, 1920]) {
  assert.equal(browser.checks.filter((check) => check.width === width).length, routes.length);
}
assert(browser.checks.every((check) => check.passed));
assert.equal(browser.accessibilityScans, 52);
assert.deepEqual(browser.errors, []);
assert.deepEqual(browser.externalRequests, []);
assert.equal(enhanced.engines.length, 2);
assert(enhanced.engines.every((engine) => engine.chapters?.screens.length === 42));
assert(enhanced.engines.every((engine) => engine.chapters?.transition?.checks.length === 3));
assert(enhanced.engines.every((engine) => engine.chapters?.paging?.checks.length === 4));
assert(
  enhanced.engines.every((engine) => engine.roundThree?.screens.length === 42 && engine.roundThree.flows.length === 4)
);
assert(
  enhanced.engines.every(
    (engine) => engine.errors.length === 0 && engine.motion.revealCounts.every((count) => count === 1)
  )
);
assert.deepEqual(roundFour.engines, ['chromium', 'webkit']);
assert.equal(roundFour.checks.length, 56);
assert.equal(roundFour.screenshots.length, 8);
assert.deepEqual(roundSix.engines, ['chromium', 'webkit']);
assert.equal(roundSix.checks.length, 2);
assert.equal(roundSix.screenshots.length, 6);
const newestHTML = Math.max(
  ...(await Promise.all(routes.map(async (route) => (await stat(`dist${route.path}index.html`)).mtimeMs)))
);
for (const report of [build, browser, enhanced, roundFour, roundSix]) {
  assert(new Date(report.testedAt).getTime() >= newestHTML, 'Re-run all checks after the latest build');
}
await mkdir(output, { recursive: true });
for (const directory of ['screenshots', 'motion', 'reports', 'docs', 'chapters', 'round3', 'round4', 'round6']) {
  await mkdir(path.join(output, directory), { recursive: true });
}
for (const engine of enhanced.engines) {
  for (const screen of engine.roundThree.screens) {
    if (screen.width === 1440 && !['intro', 'inquiry'].includes(screen.id)) continue;
    const name = `${engine.engine}-${screen.lang}-${screen.width}-${screen.id}.png`;
    await cp(`test-results/round3/${name}`, path.join(output, 'round3', name));
  }
  for (const screen of ['services', 'inquiry']) {
    const name = `${engine.engine}-paged-${screen}.png`;
    await cp(`test-results/chapters/${name}`, path.join(output, 'chapters', name));
  }
  for (const lang of ['zh', 'en']) {
    for (const id of ['intro', 'services', 'capabilities', 'process', 'guides', 'faq', 'inquiry']) {
      const name = `${engine.engine}-${lang}-${id}.png`;
      await cp(`test-results/chapters/${name}`, path.join(output, 'chapters', name));
    }
  }
  for (const width of [390, 375, 720]) {
    const name = `${engine.engine}-en-long-${width}.png`;
    await cp(`test-results/chapters/${name}`, path.join(output, 'chapters', name));
  }
}
for (const name of ['build-report', 'browser-report', 'enhancement-report', 'round-four-report', 'round6-report']) {
  await cp(`test-results/${name}.json`, path.join(output, 'reports', `${name}.json`));
}
for (const name of roundFour.screenshots) {
  await cp(`test-results/${name}`, path.join(output, 'round4', name));
}
for (const name of roundSix.screenshots) {
  await cp(`test-results/round6/${name}`, path.join(output, 'round6', name));
}
for (const name of [
  'README.md',
  'AGENTS.md',
  'BRAND.md',
  'HANDOFF.md',
  'IMPLEMENTATION_PLAN.md',
  'plan.md',
  'LAUNCH_CHECKLIST.md',
]) {
  await cp(name, path.join(output, 'docs', name));
}
for (const route of routes) {
  const name = `${route.lang}-${route.path.slice(4).replaceAll('/', '-').replace(/-$/, '') || 'home'}`;
  for (const width of [390, 1440]) {
    await cp(`test-results/${name}-${width}.png`, path.join(output, 'screenshots', `${name}-${width}.png`));
  }
}
for (const lang of ['zh', 'en']) {
  for (const width of [375, 390, 768, 1440]) {
    const name = `${lang}-home-${width}-viewport.png`;
    await cp(`test-results/${name}`, path.join(output, 'screenshots', name));
  }
}
for (const engine of enhanced.engines) {
  await cp(engine.motion.video, path.join(output, 'motion', `${engine.engine}.webm`));
  for (const phase of ['initial', 'middle', 'final']) {
    const name = `${engine.engine}-${phase}.png`;
    await cp(`test-results/motion/${name}`, path.join(output, 'motion', name));
  }
  const zoom = `${engine.engine}-200-percent-reflow.png`;
  await cp(`test-results/${zoom}`, path.join(output, 'screenshots', zoom));
}
await cp('test-results/mobile-menu.png', path.join(output, 'screenshots/mobile-menu.png'));
const archives = ['easyai-static.tar.gz', 'easyai-source.tar.gz'];
await createArchive(['-czf', path.join(output, archives[0]), '-C', path.join(root, 'dist'), '.']);
await createArchive([
  '-czf',
  path.join(output, archives[1]),
  '--exclude=node_modules',
  '--exclude=dist',
  '--exclude=.git',
  '--exclude=.astro',
  '--exclude=test-results',
  '--exclude=outputs',
  '--exclude=.env*',
  '--exclude=.DS_Store',
  '--exclude=assets/logo/generated',
  '--exclude=*.webm',
  '--exclude=*.mp4',
  '--exclude=*.log',
  '--exclude=*.pem',
  '--exclude=*.key',
  '-C',
  root,
  '.',
]);
const hashes = [];
for (const archive of archives) {
  hashes.push(
    `${createHash('sha256')
      .update(await readFile(path.join(output, archive)))
      .digest('hex')}  ${archive}`
  );
}
await writeFile(path.join(output, 'SHA256SUMS.txt'), `${hashes.join('\n')}\n`);
const stats = browser.performance;
const fcp = stats
  .map((item) => item.firstContentfulPaintMs)
  .filter((value) => value !== null)
  .sort((a, b) => a - b);
const median = fcp.length
  ? ((fcp[Math.floor((fcp.length - 1) / 2)] + fcp[Math.floor(fcp.length / 2)]) / 2).toFixed(1)
  : '未采集';
const maxJS = Math.max(...stats.map((item) => item.inlineExecutableJSBytes + item.externalJSBytes));
const report = `# 易AI 官网第六轮真实用户使用优化交付

## 预览与项目

- 中文预览：http://127.0.0.1:4322/zh/
- 英文预览：http://127.0.0.1:4322/en/
- 开发服务：http://127.0.0.1:4321/zh/
- 项目目录：\`${root}\`
- 完整计划、使用说明与上线待办在 \`docs/\`。
- 旧版备份：\`work/yi-ai-template-archive/before-site-upgrade-20260919-235417.tar.gz\`。
- 整屏改版前备份：\`work/yi-ai-template-archive/before-fullscreen-home-20260920.tar.gz\`。
- 流畅度调整前备份：\`work/yi-ai-template-archive/before-smooth-chapters-20260920.tar.gz\`。
- 逐屏翻页前备份：\`work/yi-ai-template-archive/before-page-by-page-20260920.tar.gz\`。
- 第三轮前备份：\`work/yi-ai-template-archive/before-round3-20260923-121227.tar.gz\`。

## 本轮完成

28 个静态 HTML 页面，包括 26 个中英文内容页面、入口和 404。
新增关于、资源中心、六篇完整双语指南；三项业务保持同等视觉权重。
业务页补齐流程、询价条件、准备材料与边界；联系页保留业务方向、
邮件主题、微信复制及失败回退。每个内容页有独立标题、描述和分享图。

保留易AI / Easy AI、蓝色主题及 A 版鲸形标识。调整排版、圆角和手机
咨询入口；加入一次性首屏与滚动入场、卡片和按钮反馈、菜单与 FAQ
过渡，以及原生页面切换。支持减少动态效果和无 JavaScript 阅读。
首页更新为七个整屏主题，页脚在最后咨询区之后自然跟随，增加侧边定位和下一主题提示。
桌面宽度至少 1200px、高度至少 800px 且使用精细指针时，一次垂直滚动手势翻一屏；
惯性尾段不会连翻，拖到两屏之间松手也会归位。普通章节不允许停在中间位置。
手机、短窗口、减少动态效果模式及超出一屏的长内容保留原生阅读。
业务与文章页维持连续阅读。章节翻页采用约 750ms 的平滑加减速，支持反向或重新选章节。
整组内容提前入场，已进入视野的文字不会再突然变透明。

第三轮调整首屏合作路径、服务卡片的详情/咨询双入口、能力与边界配对、
四步流程及讨论要点、三篇精选指南和六条分类 FAQ。末屏可直接选择业务方向、
复制微信并打开主题邮件，与联系页共用脚本；选择在刷新、语言切换及返回后恢复。
三个业务页增加锚点目录与其他业务入口，十二篇双语文章支持对应章节切换。
本轮保留六篇文章原有内容日期，不为界面调整伪造新的编辑日期。

第四轮重点修复了首次访问时的可读性、联系决策提示、复制反馈布局跳动、
移动固定咨询栏遮挡和英文窄屏首屏密度。首页三项业务入口在 320 / 360 / 390 /
412px 保持可见；联系页方向、邮件主题和复制成功/失败反馈在双浏览器中保持稳定。

## 验收结果

| 检查 | 结果 |
| --- | --- |
| Astro / ESLint / Prettier | 通过，零诊断 |
| 静态构建与断言 | ${build.htmlPages} 页面、${build.sharingImages} 分享图 |
| 响应式 | ${browser.checks.length} 检查；320 / 360 / 390 / 768 / 1024 / 1200 / 1440 / 1920px |
| axe WCAG A/AA 自动扫描 | ${browser.accessibilityScans} 次，零违规 |
| 内部链接 | ${browser.links.length} 个含业务参数的唯一入口均返回 200 |
| 控制台与外部请求 | 无脚本错误；页面未主动请求外部资源 |
| 每页可执行 JS | 最高 ${maxJS} 字节，低于 20KB 预算 |
| 无 JS | 全部 26 个内容页面可读，菜单、FAQ、文章目录可用 |
| 双浏览器 | ${enhanced.engines.map((engine) => `${engine.engine} ${engine.version}`).join('；')} |
| 交互 | 语言对应、返回、菜单、Escape、Tab、FAQ、复制回退、主题邮件、TOC、404 |
| 动效 | 正常播放、单次滚动呈现、阶段截图、录屏、减少动态效果 |
| 首页整屏 | 双浏览器 84 个主题位置检查；1440 / 1920 / 2560px，中英文、锚点与键盘 |
| 切换流畅度 | 两引擎逐帧位置、无闪灭、输入打断、历史返回及连续小幅滚动回归通过 |
| 逐屏翻页 | 小幅/大幅手势、惯性、六个中间位置、拖动释放、键盘、咨询区末尾与页脚自然流、移动端回退 |
| 第三轮专项 | 两引擎共 84 个章节几何检查；1200×800 / 1440×960 / 1524×1227；主题恢复与文章章节对应 |
| 第四轮专项 | ${roundFour.checks.length} 个 Chromium / WebKit 视口与任务检查；短高窗口、固定栏、联系反馈与主题邮件 |
| 第六轮专项 | ${roundSix.checks.length} 个 Chromium / WebKit 专项检查；指南元信息对齐、页脚完整可达、FAQ 阅读、编号可见、移动业务选择器与主题邮件 |
| 字体 | 按新增中文文案更新本地 Noto Sans SC 子集，保留原字形与品牌轮廓 |

## 测试条件与限制

记录时间：${browser.testedAt}（UTC）。系统 ${os.platform()} ${os.release()} ${os.arch()}，
Node ${process.versions.node}。本机静态预览、无网络或 CPU 限速，同一浏览器上下文
复用缓存。本轮桌面样本 FCP 中位数 ${median}ms；这不是 Lighthouse 分数，
也不是生产环境真实用户 Core Web Vitals。自动可访问性扫描不能取代所有人工或辅助技术测试。
小幅滚动使用浏览器模拟输入，不代替实体触控板硬件或生产帧率测试。
浏览器主矩阵与增强流程在同一静态构建上分开完成，详见各自报告的记录时间。
第四轮专项报告记录了 ${roundFour.checks.length} 个视口与任务检查；本地自动化结果不代表真实用户研究样本。

200% 缩放使用等效重排验证：1440 物理像素 / 720 CSS 像素、DPR 2，
不是自动点击浏览器设置中的缩放菜单。两种引擎均检查了全部内容路由的该布局。
原始录屏未经裁剪；早期 WebKit 录屏出现过引擎生成的灰色边缘填充。
PNG 阶段截图用于核对实际页面尺寸，未发现页面裁切。录屏包含测试主动回到首屏、
再次导航和展开 FAQ 的操作，以及进入页面前的短暂空白帧。

WorkBuddy 官方产品入口已核对为 \`https://www.codebuddy.cn/work/\`。
本机直连部分 Google 参考文档超时；文章仅引用通用计量和责任概念，
未承诺具体版本权益、价格、配额或 SLA。正式上线前需在部署网络复核外部来源链接。
页面引用官方资料不代表其为易AI授权、认证或背书。

## 文件说明

- \`easyai-static.tar.gz\`：最新静态构建；保留 noindex 和禁止抓取设置。
- \`easyai-source.tar.gz\`：源码、锁文件、公共素材、矢量母版和检查脚本。
- \`screenshots/\`：所有内容页的手机与桌面截图，首页平板、短屏及重排截图。
- \`motion/\`：两引擎各三张首屏阶段图与自然播放 WebM 录屏。
- \`chapters/\`：整屏首页逐主题截图、阅读回退及逐屏停靠，共 38 张。
- \`round3/\`：双浏览器第三轮临界窗口、高屏和首屏/咨询截图，共 64 张。
- \`round4/\`：双浏览器第四轮首页与联系页可用性截图，共 ${roundFour.screenshots.length} 张。
- \`round6/\`：双浏览器第六轮指南、页脚和联系页专项截图，共 ${roundSix.screenshots.length} 张。
- \`reports/\`：原始构建、浏览器、动效、第四轮和第六轮专项 JSON 记录。
- \`SHA256SUMS.txt\`：两个压缩包的校验值。

源码包排除依赖、缓存、Git 元数据、环境文件、历史生图原稿和录屏。
两个压缩包均禁用 macOS 的附加文件元数据，不包含 AppleDouble 隐藏副本。
历史探索素材仍保留在原工作区，不是网页运行依赖。恢复备份时先解压到新目录比较，
不直接覆盖当前项目。Git 已独立初始化，未提交、未推送、未配置远程。

本轮没有发布网站、修改线上 CCG、购买服务、调用付费生图或添加追踪脚本。
真实机房照片、授权资料、客户案例、二维码及正式域名不计入本轮完成条件；
详见 \`docs/LAUNCH_CHECKLIST.md\`。
`;
await writeFile(path.join(output, 'README.md'), report);
console.log(`Packaged verified preview at ${output}`);
