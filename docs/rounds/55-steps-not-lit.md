# 第五十五轮：合作流程第 1 步不再常亮（2026-10-06）

## 站长要求

合作流程里，每页的 1 都是常亮的。

## 实际改动

- 删除早期规则 `.step-cards li:first-child .step-card-index`（第一步实心高亮，表示「当前步骤」）。第五十二轮起每步
  入场时依次点亮、悬停时点亮，这条常亮规则不再需要；现在三步平时样式一致。影响 WorkBuddy 与基础设施页；
  模型页的「合作方式与流程」本来就没有常亮。

## 测试

- `pnpm build`、`pnpm test` 通过；`pnpm test:quick /zh/workbuddy/ /zh/infrastructure/ /en/workbuddy/` 通过；
  截图核对静止与悬停状态。单条 CSS 改动，按两档测试约定只跑快速检查。
