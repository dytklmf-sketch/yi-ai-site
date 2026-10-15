# 第一百零一轮：百度验证标签与 IndexNow（2026-10-15）

## 站长要求

站长给了百度搜索资源平台的 HTML 标签验证代码；必应已由站长从 Google Search Console 导入完成。

## 实际改动

- `YiAiLayout.astro` 与根入口 `src/pages/index.astro` 在谷歌标签旁加 `<meta name="baidu-site-verification" content="codeva-cwvyUOdBES">`。
  与谷歌标签一样，**撤掉会让百度验证失效**，不要删。
- IndexNow：新增公开密钥文件 `public/332ed0063dfd17d95dc440e1c43097c2.txt`（内容即密钥，按协议必须公开）；
  `scripts/deploy.sh` 发布成功、清完 Cloudflare 缓存后，把 sitemap 里的全部网址提交到 `api.indexnow.org`（必应等共享）。
  失败只报警告。**密钥文件不要删或改名**，否则提交会被拒。

## 后续

- 站长在百度点「完成验证」，再在「普通收录」提交 sitemap；如愿意，提供「API 提交」推送密钥后可在发布时自动推送百度。

## 测试（轻量）

- `bash -n scripts/deploy.sh`；本机 `pnpm format`、`pnpm check`、`pnpm build`、`pnpm test` 通过；构建产物含百度标签与密钥文件。
- 本轮发布时核对 IndexNow 返回成功。
