# 第九十四轮：「打开 CCG API」跳转首页（2026-10-12）

## 站长要求

模型服务的「打开 CCG API」应跳转首页，而不是模型广场。

## 实际改动

- `src/data/yi-ai.ts` `modelProduct.url`：`https://ccg-cli.online/models/` → `https://ccg-cli.online/`。
  影响模型服务页页首主按钮与关于页「打开 CCG API」链接（中英文）。
- 模型目录里「模型广场实时价格」等链接（`model-catalog.ts` 的 `catalog`）仍指向模型广场，不变。
- `test-browser.mjs` 的按钮地址断言同步。

## 测试（轻量）

- 本机 `pnpm check`、`pnpm build`、`pnpm test` 通过；检查构建产物中三处「打开 CCG API」均为 `https://ccg-cli.online/`，模型目录两处仍为 `/models/`。
