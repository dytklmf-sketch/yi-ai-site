import type { Lang } from './yi-ai';

/**
 * Round 53: the infrastructure page in the model page's level of detail; round 54 keeps the site's wording, the
 * self-built data center (owner's call). Nothing here names equipment, quantities, regions or SLAs; those are
 * confirmed per request. The sizing figures follow the
 * self-hosted-llm-sizing guide (weights = parameters × bytes per parameter, plus 10–20% runtime headroom).
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

export const infraSizing: Record<Lang, Sizing> = {
  zh: {
    title: '选型参考',
    lead: '开源模型推理的显存粗估，用来提需求时定一个起点；实际配置以实测为准。',
    head: ['模型规模', 'BF16 权重', 'INT4 权重', '低并发推理参考'],
    rows: [
      ['7B–8B', '约 16 GB', '约 5 GB', '单卡 24 GB 级'],
      ['14B', '约 28 GB', '约 8 GB', '单卡 48 GB 级；INT4 可用 24 GB 级'],
      ['32B', '约 64 GB', '约 16 GB', '单卡 80 GB 级；INT4 可用 24–48 GB 级'],
      ['70B', '约 140 GB', '约 35 GB', '2 张 80 GB 级；INT4 可用单卡 48–80 GB 级'],
    ],
    notes: [
      '另需 KV 缓存与 10%–20% 运行余量，并发和上下文越长，需要越多。',
      '全量微调通常是推理的数倍；LoRA 等轻量微调介于两者之间。',
      '档位只表示显存量级，不代表现货型号。',
    ],
    guide: { label: '私有化部署开源模型：显存怎么估', slug: 'self-hosted-llm-sizing' },
  },
  en: {
    title: 'Sizing guide',
    lead: 'Rough GPU memory for open-source model inference, a starting point for a request; measure on the target hardware.',
    head: ['Model size', 'BF16 weights', 'INT4 weights', 'Low-concurrency inference'],
    rows: [
      ['7B–8B', '~16 GB', '~5 GB', 'One 24 GB-class GPU'],
      ['14B', '~28 GB', '~8 GB', 'One 48 GB-class GPU; INT4 fits 24 GB'],
      ['32B', '~64 GB', '~16 GB', 'One 80 GB-class GPU; INT4 fits 24–48 GB'],
      ['70B', '~140 GB', '~35 GB', 'Two 80 GB-class GPUs; INT4 fits one 48–80 GB'],
    ],
    notes: [
      'Add KV cache and 10–20% headroom; more concurrency and longer context need more.',
      'Full fine-tuning usually needs several times inference; LoRA-style tuning sits in between.',
      'Classes describe memory size only, not specific models in stock.',
    ],
    guide: { label: 'Sizing GPU memory for a self-hosted model', slug: 'self-hosted-llm-sizing' },
  },
};
