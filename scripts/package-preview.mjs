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
const [build, browser, enhanced, routes] = await Promise.all([
  json('test-results/build-report.json'),
  json('test-results/browser-report.json'),
  json('test-results/enhancement-report.json'),
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
assert.deepEqual(
  enhanced.engines.map((engine) => engine.engine),
  ['chromium', 'webkit']
);
assert(enhanced.engines.every((engine) => engine.errors.length === 0 && engine.motion.hiddenAfterReturn === 0));
const newestHTML = Math.max(
  ...(await Promise.all(routes.map(async (route) => (await stat(`dist${route.path}index.html`)).mtimeMs)))
);
for (const report of [build, browser, enhanced]) {
  assert(new Date(report.testedAt).getTime() >= newestHTML, 'Re-run all checks after the latest build');
}
await mkdir(output, { recursive: true });
for (const directory of ['screenshots', 'motion', 'reports', 'docs']) {
  await mkdir(path.join(output, directory), { recursive: true });
}
for (const name of ['build-report', 'browser-report', 'enhancement-report']) {
  await cp(`test-results/${name}.json`, path.join(output, 'reports', `${name}.json`));
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
  for (const width of [390, 768, 1440]) {
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
const report = `# 易AI 官网第七轮视觉重设计交付

## 预览与项目

- 中文预览：http://127.0.0.1:4322/zh/
- 英文预览：http://127.0.0.1:4322/en/
- 项目目录：\`${root}\`
- 完整计划、使用说明与上线待办在 \`docs/\`。

## 本轮完成

以「应用层 · 模型层 · 算力层」三层结构重新设计全站：深色首屏配等距三层插图，
合作路径悬停或聚焦时点亮对应层；三项业务以分层卡片呈现，插图随阅读同步。
「易懂 · 易用 · 易落地」成为独立主张区；流程、精选指南、可筛选 FAQ 与首页咨询面板
使用统一的钴蓝设计系统。业务页、关于、资源中心、文章与联系页共享新的页首、
吸顶目录、阅读进度和移动端咨询栏。新增本地 JetBrains Mono 子集用于编号与标签。
移除旧的整屏翻页首页、Tailwind 依赖与过时测试，JS 保持在 20KB 预算内。

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
| 无 JS | 全部 26 个内容页面可读，入场与滚动呈现不隐藏内容；菜单、FAQ、文章目录可用 |
| 双浏览器 | ${enhanced.engines.map((engine) => `${engine.engine} ${engine.version}`).join('；')} |
| 交互 | 语言对应与章节配对、返回、菜单、Escape、Tab、FAQ 与筛选、三层插图联动、复制回退、主题邮件、TOC、阅读进度、404 |
| 动效 | 首屏入场一次、插图光束有限次数、滚动呈现不回退、减少动态效果时无动画与位移 |

## 测试条件与限制

记录时间：${browser.testedAt}（UTC）。系统 ${os.platform()} ${os.release()} ${os.arch()}，
Node ${process.versions.node}。本机静态预览、无网络或 CPU 限速。桌面样本 FCP 中位数
${median}ms；这不是 Lighthouse 分数，也不是生产环境真实用户 Core Web Vitals。
自动可访问性扫描不能取代人工或辅助技术测试。200% 缩放使用等效重排验证
（1440 物理像素 / 720 CSS 像素、DPR 2）。

页面引用官方资料不代表其为易AI授权、认证或背书。正式上线前需在部署网络复核外部来源链接。

## 文件说明

- \`easyai-static.tar.gz\`：最新静态构建；保留 noindex 和禁止抓取设置。
- \`easyai-source.tar.gz\`：源码、锁文件、公共素材、矢量母版和检查脚本。
- \`screenshots/\`：所有内容页的手机与桌面截图，首页平板视口、移动菜单及重排截图。
- \`motion/\`：两引擎各三张首屏阶段图与自然播放 WebM 录屏。
- \`reports/\`：原始构建、浏览器与增强流程 JSON 记录。
- \`SHA256SUMS.txt\`：两个压缩包的校验值。

本轮没有发布网站、修改线上 CCG、购买服务、调用付费生图或添加追踪脚本。
真实机房照片、授权资料、客户案例、二维码及正式域名不计入本轮完成条件；
详见 \`docs/LAUNCH_CHECKLIST.md\`。
`;
await writeFile(path.join(output, 'README.md'), report);
console.log(`Packaged verified preview at ${output}`);
