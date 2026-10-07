# 第五十八轮：中转站（CCG API）图标重绘（2026-10-07）

## 站长要求

去服务器上找现在中转站的图标，改得好看一些。

## 实际改动

- 中转站全站图标是 `/var/www/html/logo.svg`（nginx `location = /logo.svg`），首页、模型广场、文档、账户、余额查询与
  `ccg-nav.js` 都引用它；易AI 的 `public/partners/ccg-api.svg` 是同一个文件。
- 旧图标：深色方块上三道细弧加模糊滤镜发光；放在深色背景上与背景融在一起，24px 以下弧线看不清。
- 做了三个方案（同心「C」、加粗信号弧、聚合节点）并在 120 / 48 / 32 / 24 / 16px、浅色与深色底上对比，选用
  **加粗信号弧**：保留原来深色底 + 信号弧 + 中心点的造型，去掉全部滤镜，两道弧加粗为 9 并用青 → 蓝 → 紫渐变，
  中心改为实心白点，背景加一层紫色微光。16px 仍可辨认，老用户认得出是同一个标。
- 中转站：原文件备份为 `/var/www/html/logo.svg.bak-before-redesign-20261007`（nginx 已阻断 `.bak` 外网访问，
  返回 404），新文件替换 `/var/www/html/logo.svg`；还原只需把备份拷回。易AI：替换 `public/partners/ccg-api.svg`。

## 测试

- 中转站首页、模型广场截图核对新图标；`https://ccg-cli.online/logo.svg` 返回 200。
- 易AI：`pnpm build`、`pnpm test` 通过；`pnpm test:quick /zh/model-services/ /zh/ /zh/contact/` 通过。只换图片文件，
  按两档测试约定只跑快速检查。
