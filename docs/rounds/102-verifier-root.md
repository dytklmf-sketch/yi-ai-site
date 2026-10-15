# 第一百零二轮：首页对验证程序不跳转（2026-10-15）

## 问题

百度 HTML 标签验证失败，提示「无法连接到您网站的服务器」。源站日志显示 14:55:32 Baiduspider 经 Cloudflare 到达，`GET /` 得到 302 → `/zh/`。
百度的验证程序不跟随首页跳转，报错文字是笼统的「无法连接」。

## 实际改动（服务器配置，仓库里没有这两处的副本）

- nginx `/www/server/panel/vhost/nginx/yeeeai.com.conf` 的 `location = /`：User-Agent 含 `Baidu` 或 `Google-Site-Verification` 时
  内部改写到 `/index.html`（根入口页，200，含谷歌、百度验证标签，`noindex, follow` 与 meta refresh 到 `/zh/`）；其他访客照旧 302 到 `/zh/`。
  改前备份 `/root/yeeeai.com.conf.bak-r102`；`nginx -t` 通过后重载。
- Cloudflare 缓存规则条件加 `http.request.uri.path ne "/"`：首页因按 User-Agent 给不同响应，不在边缘缓存，避免两种结果混用；随后清缓存。

## 测试

- 线上 `curl -A Baiduspider` 与 `-A Google-Site-Verification` 访问 `/`：200、含百度标签、`cf-cache-status: DYNAMIC`；普通浏览器 UA：302 到 `/zh/`。
- `/zh/` 200；`yeeeai.com` 仍 301 到 www。

## 后续

- 站长重新点百度「完成验证」。若仍失败，改用百度文件验证（文件放 `public/`）。
