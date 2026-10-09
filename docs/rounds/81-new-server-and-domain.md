# 第八十一轮：迁到新服务器与独立域名 www.yeeeai.com（2026-10-09）

## 站长要求

把易AI 官网相关的东西迁到新服务器 189.24.79.181；域名已买（yeeeai.com），最终用 www.yeeeai.com，尚未接入 Cloudflare，需要教接入。

## 新服务器

- 香港（RainYun，NetLab Global），Debian 12，2 核 / 1.9 GB / 30 GB；已装宝塔面板（8889）、nginx 1.26、MySQL。
- ufw 已放行 22 / 80 / 443。香港机房，域名无需 ICP 备案。
- 本机公钥已加入 root（站长给的密码只用于这一次 ssh-copy-id，未保存）。

## 迁移内容

- `/root/yi-ai-site`：从旧服务器打包整个仓库（含 `.git`、全部 release 标签），不含 node_modules / dist / test-results；
  `pnpm install --frozen-lockfile` 重装依赖。
- `/root/.local/node`（Node 22.22.3、pnpm 11.19.0）原样复制；`/root/font-source` 复制；
  `/root/.venvs/fonts` 重建（安装 `python3.11-venv`，pip 装 brotli 1.2.0、fonttools 4.60.2、zopfli 0.2.3.post1）。
- Playwright Chromium、WebKit、FFmpeg 及系统依赖（`playwright install --with-deps`）。

## 实际改动

- `package.json`：`build:production` / `test:production` 改为 `SITE_ORIGIN=https://www.yeeeai.com`（根路径，不再有 `SITE_BASE`）。
- 新增 `scripts/deploy.sh`（取代 `deploy-ccg.sh`）：发布到 `/www/wwwroot/yeeeai.com/releases/yi-ai-site-<时间戳>`，
  `current` 软链接切换；发布后检查用 `curl --resolve www.yeeeai.com:443:127.0.0.1` 直连本机，不受 DNS / Cloudflare 影响；失败自动回滚。
- nginx（不进仓库，在服务器上）：
  - `/www/server/panel/vhost/nginx/yeeeai.com.conf`：HTTP 与 `yeeeai.com` 一律 301 到 `https://www.yeeeai.com`；
    HTTP 保留 `/.well-known/acme-challenge/` 给证书验证；`/` → 302 `/zh/`；`/_astro/` 一年 immutable；其余 no-cache；
    仅 GET/HEAD；屏蔽备份与隐藏文件；404 页 `/404.html`。
  - `/www/server/nginx/conf/yi-ai-site-headers.conf`：从旧服务器复制，CSP sha256 不变；HSTS 改为 `max-age=31536000`
    （新域名不带 includeSubDomains 与 preload，避免以后子域名被强制 HTTPS、难以撤出预加载名单）。
  - `/www/server/nginx/conf/yi-ai-site-ssl.conf`：DNS 指向前用 30 天自签占位证书（`/etc/ssl/yeeeai/`）；
    接入 Cloudflare 并解析到本机后改用 Let's Encrypt。
- 文档：README、AGENTS、LAUNCH_CHECKLIST、HANDOFF 改为新服务器、新域名与新路径；`site-indexing.mjs`、`test-build.mjs` 注释同步。

## 上线（同日）

- 站长在 Cloudflare 添加 yeeeai.com，NS 改为 `newt.ns.cloudflare.com` / `reza.ns.cloudflare.com`，`@` 与 `www` 已代理（橙云）。
- 经 Cloudflare 的 HTTP 验证可达；`certbot certonly --webroot` 签发 Let's Encrypt 证书（`www.yeeeai.com`、`yeeeai.com`，
  `/etc/letsencrypt/live/yeeeai.com/`），`yi-ai-site-ssl.conf` 改指该证书，删除自签占位；`certbot renew --dry-run` 成功，
  续期后由 `/etc/letsencrypt/renewal-hooks/deploy/reload-nginx.sh` 重载宝塔 nginx。未登记邮箱，不会收到到期提醒（自动续期）。
- 经 Cloudflare 访问：`http://` 与 `yeeeai.com` 均 301 到 `https://www.yeeeai.com/`，`/` 302 到 `/zh/`，各页 200、404 正常，
  安全头与 CSP 正常。待站长把 Cloudflare SSL/TLS 模式设为 Full (strict)。
- 部署脚本最后打 tag 时新服务器缺 git 身份而失败（发布本身已切换且检查通过）：仓库内设置 `user.name dayday-api`、
  `user.email dayday@ccg.local`，补打 `release-20261009174222`。

## 新服务器上的完整浏览器测试

- 新服务器只有 2 核，完整测试里几处固定等待不够：手机菜单滑出（300ms）、首页滚动后顶栏变实色（200ms）、
  WebKit 录屏时逐屏滚动（160ms，录屏编码占满 CPU）。网站本身无问题，单独复现都正常。
- `test-browser.mjs`：菜单对齐检查前等待菜单动画结束。`test-enhancements.mjs`：CPU ≤ 2 核时 `settle` 与录屏滚动等待放大 3 倍，
  顶栏实色检查改为等待条件成立。

- 第五次重跑时 WebKit 录屏进程因内存不足被系统杀掉（OOM，服务器无 swap）；新增 2 GB `/swapfile`（写入 `/etc/fstab`）。
- 站长随后要求停止测试、不要压测服务器：已停止测试与预览进程。上面两处测试脚本的等待调整**未在新服务器上跑通验证**，
  以后需要完整浏览器测试时在其他机器上跑。

## 测试

- 新服务器上 `pnpm check`、`pnpm build`、`pnpm test` 通过；`pnpm build:production` + `pnpm test:production` 通过
  （42 页，indexable at https://www.yeeeai.com/，canonical / sitemap / robots 正确）。
- `nginx -t` 通过。

## 遗留（待站长）

- Cloudflare SSL/TLS 模式设为 Full (strict)，打开 Always Use HTTPS、最低 TLS 1.2（站长在面板操作）。
- 旧地址 https://ccg-cli.online/yi_ai/ 在新域名可用后 301 到 https://www.yeeeai.com/（待站长确认）。
- GitHub 推送仍需站长提供新 token（第 77–81 轮未推）。
- 安全提醒（未擅自处理）：新服务器 root 密码曾出现在对话里，建议站长修改并考虑只用密钥登录；宝塔面板 8889 对公网开放，建议限制来源 IP。
