# 第八十轮：选型参考用各家最新最强模型，加视频生成模型（2026-10-08）

## 站长要求

选型参考用每个厂家最强的模型（如 GLM-5.3、DeepSeek V4.1），再加上 MiniMax H3 这类视频模型。

## 核实结果（Hugging Face 官方模型卡与仓库文件）

- 智谱：GLM-5.3（753B，官方卡未写激活参数；FP8 权重约 756 GB）取代 GLM-5.2。
- DeepSeek：V4.1 只开源了 Flash（552B，解码激活 16B，FP4 + FP8 约 510 GB）；没有开源的 V4.1 Pro。最大最强的开源仍是
  V4-Pro，取其最新的 0813 版（1.6T / 49B，约 893 GB）。两行都列。
- MiniMax：大语言模型 MiniMax-M3（约 428B / 23B，官方 MXFP8 版约 444 GB，BF16 约 854 GB）；视频模型 MiniMax-H3
  （33B 稠密，BF16，文生视频 / 图生视频 / 参考生视频带音频，官方示例 4 卡 SGLang 部署）。H3 仓库共约 498 GB，含两种模式各一套；
  单一模式整套（主干约 66 GB + 文本编码器约 67 GB + 视频 VAE 约 10 GB + 音频 VAE）约 144 GB。
- Kimi K3、Qwen3.8-2.4T 仍是两家最新最大，保留。
- 权重大小改为按仓库 safetensors 文件求和；API 的 `usedStorage` 含历史版本，会偏大（如 M3 显示 1708 GB）。

## 实际改动

- `infra-detail.ts`：`rows` 改为 `groups`（大语言模型 6 行、视频生成模型 1 行、中小模型 1 行）；备注加视频模型一条，
  「档位只表示单卡显存量级」并入其中，共三条。
- `InfraSizing.astro`：每组一个 `tbody`，首行为组名（`tr.is-group`，`th colspan=4 scope=colgroup`）。
- `site.css`：组名行样式；桌面（≥721px）表格行内边距 0.875 → 0.625rem，卡片 1440×900 约 767px、1280×800 约 704px，
  在吸顶导航下仍一屏可见；手机保持原小卡样式。
- 重新生成中文字体子集并还原拉丁字体。

## 测试

- `pnpm check`、`pnpm build`、`pnpm test` 通过；`pnpm test:quick /zh/infrastructure/ /en/infrastructure/` 通过；无横向溢出。

## 遗留

- 视频模型只列 H3；万相等其他开源视频模型如需要可再加。
- 新模型发布时需要更新本表。
