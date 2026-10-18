# 第一百零八轮：面包屑结构化数据，联系页去掉「所属」（2026-10-18）

## 站长要求

1. 加上面包屑结构化数据（第 106 轮对照 Google 入门指南时提出的可选项）。
2. 联系页「公司信息」去掉「所属」那一行。

## 改动

- `src/layouts/YiAiLayout.astro`：在 `@graph` 里加 `BreadcrumbList`，层级和页面上看得见的面包屑一致。
  - 普通页面是「易AI / 页面名」。业务页用业务名（例如「企业 AI 应用」），其他页用导航名。
  - 文章页是「易AI / 资源与指南 / 文章标题」。
  - 首页和 404 不加。
- `src/pages/[lang]/[slug].astro`：删掉联系页「所属」一行。页脚、关于页注解、证书文字和结构化数据里的大鱼出海关系不变。
- `scripts/test-build.mjs`：断言首页和 404 以外的每页都有 `BreadcrumbList`。

## 验证

`pnpm check`、`pnpm build`、`pnpm test` 通过。检查了 WorkBuddy 页、文章页和常见问题页的 JSON-LD，都能正常解析。本地截图检查了联系页的公司信息。
