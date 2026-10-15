# 第一百轮：谷歌 Search Console 验证标签（2026-10-15）

## 站长要求

不做备案，向谷歌、必应、百度提交收录。站长先给了 Google Search Console 的 HTML 标签验证代码（网址前缀资源 `https://www.yeeeai.com/`）。

## 实际改动

- `YiAiLayout.astro` 的 `<head>` 加 `<meta name="google-site-verification" content="2xrN_…">`（所有页面）；根入口 `src/pages/index.astro` 也加一份。
  验证码是公开值，可以进仓库；**撤掉会让谷歌验证失效**，不要删。
- nginx 的 `/` 仍 302 到 `/zh/`。如果谷歌因为跳转验证失败，改用「HTML 文件」方式（文件放 `public/`，直接 200）。

## 后续

- 站长在 Search Console 点验证，再提交 `sitemap.xml`；必应从 Search Console 导入（无需改站）；百度给 HTML 标签后照此加在同一位置。

## 测试（轻量）

- 本机 `pnpm format`、`pnpm check`、`pnpm build`、`pnpm test` 通过；构建产物的首页、英文首页、根入口都含该标签。
