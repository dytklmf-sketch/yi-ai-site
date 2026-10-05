import type { Lang, Service } from './yi-ai';

/**
 * WorkBuddy's fourth chapter: WorkBuddy Enterprise's official list prices (round 35; personal plans dropped in round
 * 36 at the owner's request), in WorkBuddy's green on a light panel. Prices are copied from the official page; update them when it changes. Easy AI's own quotes stay with the formal quote.
 */
type Tier = { name: string; price: string; unit: string; lines: string[] };
type Editions = {
  label: string;
  title: [string, string];
  lead: string;
  tiers: Tier[];
  rules: string[];
  note: string;
  sources: { label: string; url: string }[];
};

// Prices were last compared with the official page on 2026-10-05 (round 35); the site shows no dates (round 38).

export const workbuddyEditions: Record<Lang, Editions> = {
  zh: {
    label: '企业版价格',
    title: ['WorkBuddy 企业版', '按人数订阅，部署方式可选'],
    lead: '腾讯出品的全场景 AI 工作台。企业版按人数按月或按年订阅，含管理后台与单点登录；以下为官方公开价。',
    tiers: [
      {
        name: '旗舰版',
        price: '198',
        unit: '元/人/月',
        lines: ['或 2,376 元/人/年', '1 人起购', '腾讯云共享 VPC', '每人每月 2,000 Credits，团队共享'],
      },
      {
        name: '专享版',
        price: '316',
        unit: '元/人/月',
        lines: ['或 3,792 元/人/年', '100 人起购', '腾讯云专享 VPC', '每人每月 2,000 Credits，团队共享'],
      },
      {
        name: '私有化企业版',
        price: '售前咨询',
        unit: '',
        lines: ['企业私有化部署', '无用量限制'],
      },
    ],
    rules: ['Credits 团队内共享、每月刷新', '到期即停用，需提前续费', '按月或按年订阅'],
    note: '以上为官方公开价，以官方页面为准；通过易AI采购以正式报价为准。',
    sources: [{ label: 'Enterprise 版本说明', url: 'https://cloud.tencent.com/document/product/1831/134332' }],
  },
  en: {
    label: 'Enterprise pricing',
    title: ['WorkBuddy Enterprise', 'Per seat, deployed your way'],
    lead: 'Tencent’s all-scenario AI workspace. Enterprise is per seat, monthly or annual, with an admin console and SSO; official list prices below.',
    tiers: [
      {
        name: 'Flagship',
        price: '¥198',
        unit: '/seat/month',
        lines: [
          'or ¥2,376/seat/year',
          'From 1 seat',
          'Tencent Cloud shared VPC',
          '2,000 credits per seat a month, shared',
        ],
      },
      {
        name: 'Exclusive',
        price: '¥316',
        unit: '/seat/month',
        lines: [
          'or ¥3,792/seat/year',
          'From 100 seats',
          'Tencent Cloud dedicated VPC',
          '2,000 credits per seat a month, shared',
        ],
      },
      {
        name: 'Private Enterprise',
        price: 'By consultation',
        unit: '',
        lines: ['On-premises deployment', 'No usage limit'],
      },
    ],
    rules: [
      'Credits don’t roll over',
      'Personal plans only upgrade',
      'Enterprise stops at expiry',
      'Add-on: ¥50 for 1,000 credits',
    ],
    note: 'Official list prices; the official page governs, and purchases through Easy AI follow the formal quote.',
    sources: [
      { label: 'Enterprise editions (Chinese)', url: 'https://cloud.tencent.com/document/product/1831/134332' },
    ],
  },
};

/** The downloadable brief for each service, in public/templates/<lang>/ (quote card, contact panel). */
export const serviceBriefs: Record<Lang, Record<Service, { label: string; file: string }>> = {
  zh: {
    workbuddy: { label: '采购需求单', file: 'workbuddy-purchase-brief.txt' },
    'model-services': { label: '模型用量需求单', file: 'model-usage-brief.txt' },
    infrastructure: { label: '工作负载需求表', file: 'workload-brief.txt' },
  },
  en: {
    workbuddy: { label: 'Purchase brief', file: 'workbuddy-purchase-brief.txt' },
    'model-services': { label: 'Usage brief', file: 'model-usage-brief.txt' },
    infrastructure: { label: 'Workload brief', file: 'workload-brief.txt' },
  },
};

/**
 * Enterprise against personal plans, shown like an online shop's model comparison (rounds 39 and 43): two cards side by
 * side, each row aligned, the Enterprise card larger. Without a label column every cell must read on its own. Every
 * cell comes from the official pricing page or Tencent Cloud's editions page; Enterprise describes Flagship.
 */
type Model = { name: string; tiers: string; price?: string };
export const workbuddyCompare: Record<
  Lang,
  { title: string; personal: Model; enterprise: Model; rows: [string, string][]; note: string }
> = {
  zh: {
    title: '企业版 vs 个人版',
    personal: { name: '个人版', tiers: '标准版 · 高级版 · 旗舰版' },
    enterprise: {
      name: '企业版',
      tiers: '旗舰版 · 专享版 · 私有化企业版',
      price: '198 元/人/月起',
    },
    rows: [
      ['每人各自按账号订阅', '公司按人数统一订阅'],
      ['无管理后台', '授权管理、成员统计、研效看板'],
      ['个人账号登录', '企业单点登录（SSO）'],
      ['积分按账号发放，当月有效', '每人每月 2,000 Credits，团队共享'],
      ['仅官方公有云', '共享 VPC、专享 VPC 或企业本地'],
      ['使用平台提供的模型', '可配置企业模型与智能体'],
      ['不含协作套件', '内置腾讯文档、乐享知识库、腾讯网盘'],
      ['个人中心开票', '腾讯云控制台按企业开票'],
    ],
    note: '企业版一栏以旗舰版为准，专享版另有专属网络访问与企业插件。内容来自 WorkBuddy 官方定价页与腾讯云版本说明。',
  },
  en: {
    title: 'Enterprise vs Personal',
    personal: { name: 'Personal', tiers: 'Standard · Premium · Flagship' },
    enterprise: {
      name: 'Enterprise',
      tiers: 'Flagship · Exclusive · Private',
      price: 'From ¥198/seat/month',
    },
    rows: [
      ['Each person subscribes on their own account', 'The company subscribes per seat'],
      ['No admin console', 'Authorization, member statistics, productivity dashboard'],
      ['Personal account sign-in', 'Enterprise single sign-on (SSO)'],
      ['Credits per account, valid for the month', '2,000 credits per seat a month, shared'],
      ['Official public cloud only', 'Shared VPC, dedicated VPC or on-premises'],
      ['The platform’s models', 'Configurable enterprise models and agents'],
      ['No collaboration suite', 'Tencent Docs, Lexiang and Tencent Drive included'],
      ['Invoices from the personal center', 'Company invoices in the Tencent Cloud console'],
    ],
    note: 'The Enterprise card describes Flagship; Exclusive adds dedicated network access and enterprise plugins. From the WorkBuddy pricing page and Tencent Cloud’s editions page.',
  },
};
