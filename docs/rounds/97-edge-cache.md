# 第九十七轮：Cloudflare 边缘缓存网页，发布后自动清缓存（2026-10-15）

## 站长要求

手机页优化完后做 Cloudflare 缓存（对接文档「等站长点名再做」第 1 条）。站长提供了 Cloudflare API Token（缓存规则编辑、缓存清除、区域读取，
限 `yeeeai.com`），并同意把 token 存在服务器上供发布脚本自动清缓存。

## 原因

源站对网页发 `Cache-Control: no-cache`，Cloudflare 默认也不缓存 HTML（`cf-cache-status: DYNAMIC`），每次打开都回香港源站取，首字节 0.5–2.4 秒。
`/_astro/` 资源本来就是一年 immutable 缓存。

## 实际改动

- Cloudflare 区域 `yeeeai.com` 新建缓存规则（`http_request_cache_settings` 阶段，规则集 `308772fe035a44d2956c2c433d0469be`）：
  - 条件：`http.host eq "www.yeeeai.com"`，排除 `/.well-known/`（证书续期验证）；第 102 轮起首页 `/` 也排除（按 User-Agent 给验证程序不同响应）。
  - 边缘缓存：覆盖源站，默认 1 天；404 缓存 5 分钟；5xx 不缓存。
  - 浏览器缓存：遵循源站（网页仍是 `no-cache`，浏览器每次回来确认；`/_astro/` 仍一年）。
- `scripts/deploy.sh`：新增 `purge_cdn`，发布成功、`--rollback` 后调用 Cloudflare `purge_everything`；`--purge` 单独清缓存。
  区域 ID 与 token 从 `/root/.config/cloudflare/yeeeai.env` 读取（目录 700、文件 600，不进仓库），token 经标准输入交给 curl，不出现在进程列表。
  文件不存在时跳过并提示；清缓存失败只报警告、不回滚（边缘副本最多一天过期，可手动 `--purge` 重试）。
- nginx 未改。

## 注意

- 改 nginx 头或 CSP（`yi-ai-site-headers.conf`）后要手动 `scripts/deploy.sh --purge`，否则边缘继续给旧响应。
- 站长原本同意的是「只能清缓存」的 token；现存的这个还带缓存规则编辑与区域读取权限（只限本区域）。站长另建一个只含「缓存清除」的 token 后，
  替换 `yeeeai.env` 里的 `CF_API_TOKEN` 即可。

## 测试

- 规则生效后 `/zh/` 依次 `MISS` → `HIT`（`age` 递增）。
- 本轮发布时验证脚本清缓存成功、新版本 `version.json` 经 Cloudflare 立即可见。
- `bash -n scripts/deploy.sh`；本机 `pnpm check`、`pnpm build`、`pnpm test` 通过。
