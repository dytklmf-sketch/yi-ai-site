# 第六十二轮：调研同行后定稿中转站图标（2026-10-07）

## 站长要求

先在网上搜罗同行，再优化中转站图标。

## 同行调研

- 取 lobehub 图标库（@lobehub/icons-static-svg 1.95.1）中 36 家同行的官方标识排成对照表：OpenRouter、硅基流动、
  Together、Fireworks、Groq、Vercel、302.AI、AiHubMix、New API、Novita、DeepInfra、PPIO、ModelScope、Poe、
  Cloudflare、Higress、Cerebras、SambaNova、Hyperbolic、Nebius、Kluster、七牛、无问芯穹、Zeabur 等，浅色与深色底各一。
- 结论：
  1. 头部（OpenRouter、Vercel、Groq、Together、Fireworks、硅基流动、Nebius）都是无底座的单色几何符号，扁平、
     粗壮、一个形状一个意思；不用方块底、渐变和发光。
  2. 我们之前的「深色方块 + 渐变 + 光晕」是 App 图标做法，放在同行里偏重、偏旧，白底上像一块深色补丁。
  3. 国内中转站（302.AI、AiHubMix、New API）多为彩色渐变圆，偏消费。
  4. 紫色是赛道里最常见的颜色，差异要靠形状。
- 按「无底座单色、粗壮、对称、白底黑底都成立」画了四个符号放进同行行列对比：‹•›（像通用代码图标）、(◆)（像直播图标）、
  圆环四向辐条（像定位准星）、四象限星扁平版。第六十一轮的造型本身最出众，问题在包装。

## 实际改动

- 主标（中转站 `/var/www/html/logo.svg`，导航与浏览器标签共用）：无底座、单色 #6d4aff 的四象限星——
  四个以外角为圆心的四分之一圆，十字缝宽 8，外角圆角 18，中间负形是四角星。白底对比约 5.6:1，黑底约 3.4:1。
- 方块版（易AI `public/partners/ccg-api.svg`）：#6d4aff 圆角方块（rx 27）里放白色四象限星，适配易AI 里所有
  方块图标容器，与 WorkBuddy 等标识并排一致。
- 两个文件都只有约 0.6KB，无渐变、无滤镜。最早的原图标备份仍是 `/var/www/html/logo.svg.bak-before-redesign-20261007`。

## 测试

- 中转站线上 `logo.svg` 与新文件逐字节一致；模型广场导航栏截图核对。
- 易AI：`pnpm build`、`pnpm test`、`pnpm test:quick /zh/model-services/ /zh/ /zh/contact/` 通过（只换图片文件）。
