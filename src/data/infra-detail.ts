import type { Lang } from './yi-ai';

/**
 * Round 53: the infrastructure page in the model page's level of detail; round 54 keeps the site's wording, the
 * self-built data center (owner's call). Nothing here names equipment, quantities, regions or SLAs; those are
 * confirmed per request.
 */
type Option = { name: string; who: string; rows: [string, string][] };
// Round 78: the three ways are shown as equals; no badge or highlight on the data-center option.
type Options = { title: string; options: Option[]; note: string };

export const infraOptions: Record<Lang, Options> = {
  zh: {
    title: '部署方式对比',
    options: [
      {
        name: '公有云 GPU',
        who: '按需开通的云上算力',
        rows: [
          ['适合', '短期试验、负载波动大的业务'],
          ['起步', '开通即用'],
          ['计费', '按小时或按量，长期运行成本偏高'],
          ['数据', '存放在云厂商环境'],
        ],
      },
      {
        name: '自建机房资源',
        who: '按工作负载匹配机房资源',
        rows: [
          ['适合', '长期运行的推理服务、按周期的训练与微调'],
          ['起步', '按配置与周期确认资源'],
          ['计费', '按配置与使用周期报价'],
          ['数据', '可约定所在机房与网络隔离方式'],
        ],
      },
      {
        name: '企业本地私有化',
        who: '设备放在企业自己的环境',
        rows: [
          ['适合', '数据不能离开企业环境'],
          ['起步', '采购、上架与部署周期较长'],
          ['计费', '一次性投入设备，另计运维'],
          ['数据', '完全留在企业内部'],
        ],
      },
    ],
    note: '三种方式可以组合，例如试验期用公有云，稳定后迁到自建机房。',
  },
  en: {
    title: 'Ways to deploy',
    options: [
      {
        name: 'Public cloud GPUs',
        who: 'On-demand compute in the cloud',
        rows: [
          ['Suits', 'Short trials and spiky workloads'],
          ['Start', 'Available as soon as you sign up'],
          ['Billing', 'Hourly or metered; costly when it runs for long'],
          ['Data', 'Stays in the cloud provider’s environment'],
        ],
      },
      {
        name: 'Self-built data center',
        who: 'Data-center resources matched to the workload',
        rows: [
          ['Suits', 'Long-running inference and periodic training or fine-tuning'],
          ['Start', 'Resources confirmed by configuration and duration'],
          ['Billing', 'Quoted by configuration and term'],
          ['Data', 'Data-center location and network isolation can be agreed'],
        ],
      },
      {
        name: 'On-premises',
        who: 'Hardware in your own environment',
        rows: [
          ['Suits', 'Data that must not leave the company'],
          ['Start', 'Longer purchasing, racking and deployment'],
          ['Billing', 'Up-front hardware, operations on top'],
          ['Data', 'Stays entirely in-house'],
        ],
      },
    ],
    note: 'The three can be combined, for example a cloud trial that moves to our data center once it is stable.',
  },
};

type Sizing = {
  title: string;
  lead: string;
  head: [string, string, string, string];
  rows: [string, string, string, string][];
  notes: string[];
  guide: { label: string; slug: string };
};

// Round 79: customers mostly deploy the large open MoE models, so the table lists those (largest first) and folds
// everything up to 70B into one row. Parameters and weight formats are from each model's official Hugging Face card;
// weight sizes are the published checkpoint files. The fit column is weights plus about 20% for KV cache and headroom,
// against 8-GPU machines by memory class (80 / 141 / 192 / 288 GB per GPU); classes name no product or stock.
export const infraSizing: Record<Lang, Sizing> = {
  zh: {
    title: '选型参考',
    lead: '主流开源大模型私有化推理的显存粗估，按官方发布的权重计算，用来提需求时定一个起点；实际配置以实测为准。',
    head: ['模型', '总参数 / 激活参数', '官方权重', '推理部署参考'],
    rows: [
      ['Kimi K3', '2.8T / 104B', 'MXFP4，约 1.56 TB', '单机 8 张 288 GB 级；或 2 台 8 张 141 GB 级'],
      ['Qwen3.8-2.4T', '2.45T / 95B', 'FP8，约 2.5 TB', '2 台 8 张 192 GB 级起；长上下文建议 288 GB 级'],
      ['DeepSeek-V4-Pro', '1.6T / 49B', 'FP4 + FP8，约 865 GB', '单机 8 张 141 GB 级起；长上下文建议 192 GB 级'],
      ['GLM-5.2', '753B（MoE）', 'FP8，约 761 GB', '单机 8 张 141 GB 级；或 2 台 8 张 80 GB 级'],
      ['Qwen3.5-397B', '397B / 17B', 'FP8，约 406 GB', '单机 8 张 80 GB 级'],
      ['DeepSeek-V4-Flash', '284B / 13B', 'FP4 + FP8，约 160 GB', '4 张 80 GB 级；或 2 张 141 GB 级'],
      ['70B 及以下', '稠密模型', 'BF16 每 10 亿参数约 2 GB', '1–2 张 80 GB 级；INT4 量化后可单卡'],
    ],
    notes: [
      'MoE 模型按总参数占显存：激活参数只决定每个 token 的计算量，全部专家都要放进显存。',
      '另需 KV 缓存与 10%–20% 运行余量；这些模型支持百万级上下文，并发和上下文越长，需要越多，可能要多一台。',
      '档位只表示单卡显存量级，不代表现货型号。',
    ],
    guide: { label: '私有化部署开源模型：显存怎么估', slug: 'self-hosted-llm-sizing' },
  },
  en: {
    title: 'Sizing guide',
    lead: 'Rough GPU memory for serving the leading open models in-house, from their official weights. A starting point for a request; measure on the target hardware.',
    head: ['Model', 'Total / active parameters', 'Official weights', 'Inference deployment'],
    rows: [
      ['Kimi K3', '2.8T / 104B', 'MXFP4, ~1.56 TB', 'One server of 8 × 288 GB-class; or two of 8 × 141 GB-class'],
      [
        'Qwen3.8-2.4T',
        '2.45T / 95B',
        'FP8, ~2.5 TB',
        'From two servers of 8 × 192 GB-class; 288 GB-class for long context',
      ],
      [
        'DeepSeek-V4-Pro',
        '1.6T / 49B',
        'FP4 + FP8, ~865 GB',
        'From one server of 8 × 141 GB-class; 192 GB-class for long context',
      ],
      ['GLM-5.2', '753B (MoE)', 'FP8, ~761 GB', 'One server of 8 × 141 GB-class; or two of 8 × 80 GB-class'],
      ['Qwen3.5-397B', '397B / 17B', 'FP8, ~406 GB', 'One server of 8 × 80 GB-class'],
      ['DeepSeek-V4-Flash', '284B / 13B', 'FP4 + FP8, ~160 GB', 'Four 80 GB-class GPUs; or two 141 GB-class'],
      [
        '70B and smaller',
        'Dense models',
        'BF16, ~2 GB per billion parameters',
        'One or two 80 GB-class GPUs; one with INT4',
      ],
    ],
    notes: [
      'MoE models need memory for all parameters: the active count sets compute per token, but every expert must be loaded.',
      'Add KV cache and 10–20% headroom. These models take million-token context; more concurrency and longer context need more, possibly another server.',
      'Classes describe memory per GPU only, not specific models in stock.',
    ],
    guide: { label: 'Sizing GPU memory for a self-hosted model', slug: 'self-hosted-llm-sizing' },
  },
};
