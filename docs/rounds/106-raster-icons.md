# 第一百零六轮：搜索结果用的方形图标（2026-10-18）

## 站长要求

站长反映必应搜索结果里网站没有图标（「微软不提供头像」），让补上。

## 原因

- 网站只有 `/brand/favicon.svg`，而且是 304×192 的长方形。
- 根目录没有 `/favicon.ico`，日志里 Google 和必应请求它都返回 404。
- 必应主要读 `/favicon.ico`；Google 要求图标是方形，边长是 48 的倍数。

## 改动

- 用 `favicon.svg` 原图居中放进方形画布，在本机用 Playwright 渲染：
  - `public/favicon.ico`：16、32、48 三种尺寸，透明底。
  - `public/brand/icon-192.png`：透明底。
  - `public/apple-touch-icon.png`：180，白底。
- `YiAiLayout.astro` 的 `<head>` 在原 SVG 图标后加上这三个链接。
- `scripts/test-build.mjs` 断言每页都带 `favicon.ico` 和 `icon-192.png`。

搜索结果里的图标要等搜索引擎下次抓取后才会更新。

## 验证

`pnpm check`、`pnpm build`、`pnpm test` 通过；放大检查了图标的拼合图。
