# 第九十二轮：大圆环版加持续动效（2026-10-11）

## 站长要求

现在缺少动效。

## 实际改动（构图不变，只加动效）

- 三层叠板轻浮：各自上下 8 单位、6 秒一周期，错开 2 秒；与入场 `slab-in`（transform）并用，浮动用 `translate`，互不冲突；标签随层移动。
- 光台波纹：两道椭圆从光台内圈向外扩散并淡出，4.4 秒一周期，错开半拍。
- 光柱光点：6 颗光点从光台沿中轴上升、淡出，4.8 秒一周期依次出发（在叠板后方穿过各层）。
- 外圈刻度慢转：120 秒一圈；中轴光束脉冲由播 2 次改为持续。
- 全部在 `prefers-reduced-motion: no-preference` 且 `.js` 下运行；减少动态效果时没有任何动画。
- `test-enhancements.mjs` 光束断言改为 `infinite`；`AGENTS.md`、`BRAND.md` 记下首页持续慢速动效为站长要求的例外。

## 测试（轻量）

- 本机 `pnpm check`、`pnpm build`、`pnpm test` 通过；本机两帧截图对比与动画计数（slab-float ×3、stage-ripple ×2、stage-rise ×6、
  orbit-spin、beam）；减少动态效果下运行中的动画为 0；无脚本错误。
