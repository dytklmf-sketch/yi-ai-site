import type { Lang, Service } from './yi-ai';

/**
 * WorkBuddy's fourth chapter (rounds 32 and 34): which edition track to buy, set in WorkBuddy's own dark panel and
 * green. Facts come from the official documentation and carry the date they were checked; no prices.
 */
type Editions = {
  label: string;
  title: [string, string];
  lead: string;
  plans: { name: string; fit: string; points: string[] }[];
  rules: string[];
  note: string;
  sources: { label: string; url: string }[];
  guides: string[];
};

const checked = '2026-10-05';

export const workbuddyEditions: Record<Lang, Editions> = {
  zh: {
    label: '版本与积分',
    title: ['个人版还是企业版', '两条购买线，一次选对'],
    lead: '腾讯出品的全场景 AI 工作台：一句话描述工作，由它规划并交付文档、表格、演示稿。',
    plans: [
      {
        name: '个人版套餐',
        fit: '个人或小团队，各自管理账号',
        points: ['体验版、标准版、高级版、旗舰版', '按账号订阅，按月或连续包月、包年', '每月发放积分，当月有效'],
      },
      {
        name: 'WorkBuddy Enterprise',
        fit: '需要统一管理、权限与合规的企业',
        points: ['旗舰版、专享版、私有化企业版', '按人数订阅，积分团队内共享', '管理后台、单点登录；云上或本地部署'],
      },
    ],
    rules: ['积分不结转', '个人版只升不降', '企业版到期即停用'],
    note: `据官方文档整理，核对于 ${checked}，以官方页面和正式报价为准。`,
    sources: [
      { label: '定价详情', url: 'https://www.codebuddy.cn/docs/workbuddy/Pricing' },
      { label: 'Enterprise 版本说明', url: 'https://cloud.tencent.com/document/product/1831/134332' },
    ],
    guides: ['workbuddy-procurement-checklist', 'workbuddy-renewal-and-seats'],
  },
  en: {
    label: 'Editions & credits',
    title: ['Personal or Enterprise?', 'Choose the right track'],
    lead: 'Tencent’s all-scenario AI workspace: describe the work in a sentence and it plans and delivers documents, spreadsheets and slides.',
    plans: [
      {
        name: 'Personal plans',
        fit: 'Individuals or small teams managing their own accounts',
        points: [
          'Trial, Standard, Premium, Flagship',
          'Per account, monthly or continuous',
          'Credits granted monthly, valid that month',
        ],
      },
      {
        name: 'WorkBuddy Enterprise',
        fit: 'Companies that need central administration and compliance',
        points: [
          'Flagship, Exclusive, Private Enterprise',
          'Per seat, credits shared in the team',
          'Admin console and SSO; cloud or on-premises',
        ],
      },
    ],
    rules: ['Credits don’t roll over', 'Personal plans only upgrade', 'Enterprise stops at expiry'],
    note: `From the official documentation, checked ${checked}; official pages and a formal quote govern.`,
    sources: [
      { label: 'Pricing', url: 'https://www.codebuddy.cn/docs/workbuddy/Pricing' },
      { label: 'Enterprise editions', url: 'https://cloud.tencent.com/document/product/1831/134332' },
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
