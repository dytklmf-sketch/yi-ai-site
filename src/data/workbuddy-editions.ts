import type { Lang, Service } from './yi-ai';

/**
 * WorkBuddy's fourth chapter: editions and the official list prices (round 35, at the owner's request), set in
 * WorkBuddy's own dark panel and green. Prices are copied from the official pages on the date in `checked`; update
 * them together when the official pages change. Easy AI's own quotes stay with the formal quote.
 */
type Tier = { name: string; price: string; unit: string; lines: string[]; fit?: string };
type Editions = {
  label: string;
  title: [string, string];
  lead: string;
  personal: { title: string; note: string; tiers: Tier[] };
  enterprise: { title: string; note: string; tiers: Tier[] };
  rules: string[];
  note: string;
  sources: { label: string; url: string }[];
  guides: string[];
};

/** When the prices below were last compared with the official pages. */
export const workbuddyPricesChecked = '2026-10-05';

export const workbuddyEditions: Record<Lang, Editions> = {
  zh: {
    label: '版本与价格',
    title: ['个人版还是企业版', '两条购买线，一次选对'],
    lead: '腾讯出品的全场景 AI 工作台：一句话描述工作，由它规划并交付文档、表格、演示稿。以下为官方公开价。',
    personal: {
      title: '个人版',
      note: '按账号订阅；积分按月发放、当月有效。',
      tiers: [
        { name: '体验版', price: '免费', unit: '', lines: ['每月 500 积分'], fit: '入门零成本体验' },
        {
          name: '标准版',
          price: '99',
          unit: '元/月',
          lines: ['连续包月 70 元/月', '连续包年 672 元/年', '每月 4,000 积分（含限时加赠 2,000）'],
          fit: '日常轻量辅助',
        },
        {
          name: '高级版',
          price: '199',
          unit: '元/月',
          lines: ['连续包月 140 元/月', '连续包年 1,344 元/年', '每月 9,000 积分（含限时加赠 5,000）'],
          fit: '高频 / 多项目办公创作',
        },
        {
          name: '旗舰版',
          price: '999',
          unit: '元/月',
          lines: ['连续包月 700 元/月', '连续包年 6,720 元/年', '每月 50,000 积分（含限时加赠 30,000）'],
          fit: '复杂项目高强度调用',
        },
      ],
    },
    enterprise: {
      title: 'WorkBuddy Enterprise',
      note: '按人数按月或按年订阅，含管理后台与单点登录。',
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
    },
    rules: ['积分不结转', '个人版只升不降', '企业版到期即停用', '加量包 50 元 / 1,000 积分'],
    note: `以上为官方公开价，核对于 ${workbuddyPricesChecked}；限时加赠与价格以官方页面为准，通过易AI采购以正式报价为准。`,
    sources: [
      { label: '个人版定价详情', url: 'https://www.codebuddy.cn/docs/workbuddy/Pricing' },
      { label: 'Enterprise 版本说明', url: 'https://cloud.tencent.com/document/product/1831/134332' },
    ],
    guides: ['workbuddy-procurement-checklist', 'workbuddy-renewal-and-seats'],
  },
  en: {
    label: 'Editions & pricing',
    title: ['Personal or Enterprise?', 'Choose the right track'],
    lead: 'Tencent’s all-scenario AI workspace: describe the work in a sentence and it plans and delivers documents, spreadsheets and slides. Official list prices below.',
    personal: {
      title: 'Personal plans',
      note: 'Per account; credits are granted monthly and valid that month.',
      tiers: [
        { name: 'Trial', price: 'Free', unit: '', lines: ['500 credits a month'], fit: 'Try it at no cost' },
        {
          name: 'Standard',
          price: '¥99',
          unit: '/month',
          lines: [
            'Continuous monthly ¥70/month',
            'Continuous annual ¥672/year',
            '4,000 credits a month (incl. 2,000 limited-time bonus)',
          ],
          fit: 'Light daily help',
        },
        {
          name: 'Premium',
          price: '¥199',
          unit: '/month',
          lines: [
            'Continuous monthly ¥140/month',
            'Continuous annual ¥1,344/year',
            '9,000 credits a month (incl. 5,000 limited-time bonus)',
          ],
          fit: 'Frequent, multi-project work',
        },
        {
          name: 'Flagship',
          price: '¥999',
          unit: '/month',
          lines: [
            'Continuous monthly ¥700/month',
            'Continuous annual ¥6,720/year',
            '50,000 credits a month (incl. 30,000 limited-time bonus)',
          ],
          fit: 'Heavy use on complex projects',
        },
      ],
    },
    enterprise: {
      title: 'WorkBuddy Enterprise',
      note: 'Per seat, monthly or annual, with the admin console and SSO.',
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
    },
    rules: [
      'Credits don’t roll over',
      'Personal plans only upgrade',
      'Enterprise stops at expiry',
      'Add-on: ¥50 for 1,000 credits',
    ],
    note: `Official list prices, checked ${workbuddyPricesChecked}; limited-time bonuses and prices follow the official pages, and purchases through Easy AI follow the formal quote.`,
    sources: [
      { label: 'Personal pricing (Chinese)', url: 'https://www.codebuddy.cn/docs/workbuddy/Pricing' },
      { label: 'Enterprise editions (Chinese)', url: 'https://cloud.tencent.com/document/product/1831/134332' },
    ],
    guides: ['workbuddy-procurement-checklist', 'workbuddy-renewal-and-seats'],
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
