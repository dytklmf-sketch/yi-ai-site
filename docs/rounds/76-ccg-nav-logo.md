# 第七十六轮：中转站导航栏图标与文字比例（2026-10-07）

## 站长要求

「就按这个图标，但是 ccgapi 官网上看不好看，跟导航栏字体和图标比例有关，你可以看着改一改。」

## 诊断

中转站导航由 `/var/www/html/assets/ccg-nav.css` 与 `ccg-nav.js` 统一渲染（`.ccg-global-nav .nav-logo`）：
图标只有 28px，卡通图标细节挤在一起；样式再给 7px 圆角裁切，与图标自带圆角不符；深色方块在纯黑导航栏上轮廓消失；
文字 16px，「AI」的紫色与图标不搭。

## 实际改动（只动中转站静态文件，不动易AI 源码）

- `ccg-nav.css` 末尾追加覆盖规则（原规则不动）：图标 28 → 32px，圆角改为 7.2px（与图标 27/120 一致），
  加一圈 22% 淡紫描边与紫色微光；文字 16 → 17px、字距 -0.01em，间距 9px，品牌区宽 132 → 142px；
  「AI」改为图标内圈淡紫 #c4b8ff；悬停改为轻微上浮，不再旋转。手机端保持自适应宽度。
- `/assets/` 设置了一年 `immutable` 缓存，所以把 11 个线上页面引用的 `ccg-nav.css?v=20260910-brand-face1` 改为
  `?v=20261007-logo-nav`：`/var/www/html`、`models`（含 monitoring）、`chat`、`paint`、`quota`、`ecom`、`account`、
  `account/admin`、`ccg-console`、`console-test` 的 `index.html`。`pay-bridge` 原本引用旧版本号，未动。
- 备份：`ccg-nav.css.bak-20261007-logo-nav` 及上述每个页面的 `*.bak-20261007-logo-nav`（nginx 阻断 `.bak` 外网访问）。
  回退：把备份拷回即可。

## 测试

- 上线前用浏览器请求拦截预览桌面与手机；上线后真实访问首页、模型广场、对话、余额查询，图标均为 32px，无脚本错误。
