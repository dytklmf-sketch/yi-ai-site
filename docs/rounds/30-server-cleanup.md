# 第三十轮：服务器清理（2026-10-05）

只动服务器上的旧副本与缓存，不改站点代码、nginx 或账单服务。

## 删除前的核对

- 旧副本 `/tmp/yi-ai-site`、`/home/cloudcli/projects/yi-ai-site` 都停在初始提交 `dc4f847`，该提交已在 GitHub。
- nginx、systemd 与两个仓库的部署脚本均不引用待删路径（账单服务只引用 `/opt/yi-ai-billing/app.py`）。
- 删除前打包：`/root/backups/cleanup-20261005.tar.gz`（1.3 MB，165 项），包含 `/root` 下误操作产生的怪名文件
  （其中 `\` 目录里的 `new-before.tar.gz` 与 `hashes-before.txt`）、账单目录的 `.backup-*`/`.staging-*`/`.stage-*`
  与根目录过期的 `app.css`、`app.js`、`index.html`。未打包的两项是空文件与空目录。

## 删除内容

- `/tmp/yi-ai-site`、`/tmp/bak-0406`、`/tmp/dist2`、`/tmp/yi_ai_ts`、`/tmp/yiai-scratch`、
  `/home/cloudcli/projects/yi-ai-site`
- `/opt/yi-ai-billing` 下 13 个备份/暂存目录与 3 个过期根文件
- `/root` 下 9 个怪名文件或目录
- Docker 构建缓存：`docker builder prune -f`，回收 4.1 GB（镜像、容器、数据卷未动；`/data` 未动）

## 结果

- 根分区 86%（42G/49G）→ 78%（38G/49G）。
- 验证：`yi-ai-billing` 与 nginx `active`；`/billing/` 303 跳转至登录页 200；`/yi_ai/zh/` 200；账单仓库工作区干净。
