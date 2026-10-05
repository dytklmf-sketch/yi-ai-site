import type { Lang, Service } from './yi-ai';

/**
 * The fourth chapter on each service page (round 32): what the buyer needs to know before asking, taken from official
 * documentation or from what the site already states. No prices, capacities or commitments: those stay with quotes.
 */
type Explainer = {
  /** Section id and subnav label. */
  id: 'editions' | 'access' | 'forms';
  label: string;
  lead: string;
  table: { caption: string; head: string[]; rows: string[][] };
  facts: string[];
  /** Where the facts come from and when they were checked. */
  note: string;
  sources: { label: string; url: string }[];
  /** Guides that go deeper, by pairKey. */
  guides: string[];
  /** Downloadable briefs in public/templates/<lang>/. */
  downloads: { label: string; file: string }[];
};

const checked = '2026-10-05';

export const serviceExplainers: Record<Lang, Record<Service, Explainer>> = {
  zh: {
    workbuddy: {
      id: 'editions',
      label: '版本与积分',
      lead: 'WorkBuddy 是腾讯出品的全场景 AI 工作台：用自然语言描述工作，由它规划并执行任务，交付文档、表格、演示稿等结果。可在桌面端（Windows / Mac）、网页、移动端和微信等入口使用。购买分个人版与企业版两条线，先确认走哪一条。',
      table: {
        caption: '个人版与企业版对比',
        head: ['', '个人版套餐', '企业版（WorkBuddy Enterprise）'],
        rows: [
          ['版本', '体验版、标准版、高级版、旗舰版', '旗舰版、专享版、私有化企业版'],
          ['计费', '按账号订阅，按月或连续包月、包年', '按人数订阅；私有化企业版需咨询'],
          ['用量', '每月发放积分', '旗舰版、专享版按人赠送积分，团队内共享'],
          ['管理', '个人账号自行管理', '管理后台：授权管理、单点登录、成员统计等'],
          ['部署', '官方云端服务', '共享 VPC、独享 VPC 或企业本地部署'],
        ],
      },
      facts: [
        '个人版积分按月发放、当月有效，不结转到下个月。',
        '个人版支持升级、不支持降级；连续包月、包年默认自动续费。',
        '企业版专享版官方说明为 100 人起购。',
        '企业版到期后无法继续使用，续费需提前安排。',
        '官方定价说明：WorkBuddy 与 CodeBuddy 在同一账号下共享积分。',
      ],
      note: `据 WorkBuddy 官方文档与腾讯云版本说明整理，核对日期 ${checked}。版本名称、价格与规则可能调整，以官方页面和正式报价为准。`,
      sources: [
        { label: 'WorkBuddy 定价详情', url: 'https://www.codebuddy.cn/docs/workbuddy/Pricing' },
        { label: 'WorkBuddy Enterprise 版本说明', url: 'https://cloud.tencent.com/document/product/1831/134332' },
      ],
      guides: ['workbuddy-procurement-checklist', 'workbuddy-renewal-and-seats'],
      downloads: [{ label: '采购需求单', file: 'workbuddy-purchase-brief.txt' }],
    },
    'model-services': {
      id: 'access',
      label: '接入与计费',
      lead: '个人开发者可以直接在 CCG API 查看模型与价格、获取密钥并接入。接口采用 OpenAI 兼容格式，现有代码通常只需改接口地址、密钥和模型名；企业用量、月结和供应合作单独洽谈。',
      table: {
        caption: '洽谈企业用量前要对齐的口径',
        head: ['口径', '要准备什么'],
        rows: [
          ['模型与版本', '接口里实际使用的模型标识'],
          ['用量', '每月请求数、平均输入与输出 Token，以接口返回的用量为准'],
          ['峰值', '高峰并发、持续时间与延迟要求'],
          ['结算', '预付或月结、发票类型、对账周期'],
        ],
      },
      facts: [
        '兼容 OpenAI 格式不等于所有参数都支持；上线前按实际用到的功能逐项测试。',
        '模型价格以 CCG API 页面为准，本站不列价格。',
        '供应合作方先发不含凭据的资源说明：模型标识、容量、供应依据与结算方式。',
      ],
      note: `接口地址为 CCG API 的公开地址；可用模型以 CCG API 的模型列表为准（${checked}）。`,
      sources: [{ label: 'CCG API 模型列表', url: 'https://ccg-cli.online/models/' }],
      guides: ['openai-compatible-migration', 'token-cost-estimation', 'model-supply-cooperation'],
      downloads: [
        { label: '模型用量需求单', file: 'model-usage-brief.txt' },
        { label: '比价表（CSV）', file: 'model-price-comparison.csv' },
      ],
    },
    infrastructure: {
      id: 'forms',
      label: '部署与分工',
      lead: '同一个工作负载可以用不同形态承载，责任边界也随之不同。形态确定之后，才能核对资源是否匹配；能否提供某种形态，需要按实际资源确认。',
      table: {
        caption: '部署形态与使用方的责任',
        head: ['形态', '适合', '使用方负责'],
        rows: [
          ['整机（裸金属）', '长期运行，对性能和隔离要求高', '操作系统、驱动、运行环境与应用'],
          ['虚拟机或容器', '资源需求中等，希望灵活调整', '运行环境与应用'],
          ['托管推理服务', '只调用接口，不管理机器', '调用方式、数据与结果核验'],
        ],
      },
      facts: [
        '合作前逐项确认分工：硬件故障、网络变更、系统补丁、应用发布、备份恢复、到期数据删除。',
        '机房的一部分资源承载易AI 自己的业务，不是全部可以对外。',
        '有机房，不代表第三方模型运行在自有设施内。',
        '位置、设备型号、可用容量、认证与 SLA 需单独确认。',
      ],
      note: '本表说明各形态下常见的责任划分，用于准备需求，不代表易AI均可提供。',
      sources: [],
      guides: [
        'infrastructure-requirements',
        'self-hosted-llm-sizing',
        'training-vs-inference',
        'infrastructure-responsibilities',
      ],
      downloads: [{ label: '工作负载需求表', file: 'workload-brief.txt' }],
    },
  },
  en: {
    workbuddy: {
      id: 'editions',
      label: 'Editions & credits',
      lead: 'WorkBuddy is Tencent’s all-scenario AI workspace: describe the work in plain language and it plans and carries out the task, delivering documents, spreadsheets, slides and more. It runs on desktop (Windows / Mac), the web, mobile and WeChat. Purchases follow two tracks, personal plans and Enterprise; decide which first.',
      table: {
        caption: 'Personal plans and Enterprise compared',
        head: ['', 'Personal plans', 'WorkBuddy Enterprise'],
        rows: [
          ['Editions', 'Trial, Standard, Premium, Flagship', 'Flagship, Exclusive, Private Enterprise'],
          ['Billing', 'Per account, monthly or continuous', 'Per seat; Private Enterprise by consultation'],
          ['Usage', 'Credits granted monthly', 'Credits per seat on Flagship and Exclusive, shared in the team'],
          ['Administration', 'Each account manages itself', 'Admin console: authorization, SSO, member statistics'],
          ['Where it runs', 'Official cloud service', 'Shared VPC, dedicated VPC or on-premises'],
        ],
      },
      facts: [
        'Personal-plan credits are granted monthly, valid that month and do not roll over.',
        'Personal plans can be upgraded but not downgraded; continuous plans renew automatically by default.',
        'The official page lists a 100-seat minimum for Enterprise Exclusive.',
        'Enterprise stops working at expiry, so plan renewals ahead.',
        'Official pricing notes that WorkBuddy and CodeBuddy share credits under one account.',
      ],
      note: `Compiled from WorkBuddy documentation and Tencent Cloud’s editions page, checked ${checked}. Names, prices and rules can change; the official pages and a formal quote govern.`,
      sources: [
        { label: 'WorkBuddy pricing (Chinese)', url: 'https://www.codebuddy.cn/docs/workbuddy/Pricing' },
        {
          label: 'WorkBuddy Enterprise editions (Chinese)',
          url: 'https://cloud.tencent.com/document/product/1831/134332',
        },
      ],
      guides: ['workbuddy-procurement-checklist', 'workbuddy-renewal-and-seats'],
      downloads: [{ label: 'Purchase brief', file: 'workbuddy-purchase-brief.txt' }],
    },
    'model-services': {
      id: 'access',
      label: 'Access & billing',
      lead: 'Individual developers can view models and prices on CCG API, get a key and integrate directly. The API uses the OpenAI-compatible format, so existing code usually changes only the base URL, key and model name. Enterprise volume, monthly billing and supply cooperation are discussed separately.',
      table: {
        caption: 'What to align before discussing enterprise volume',
        head: ['Item', 'What to prepare'],
        rows: [
          ['Model and version', 'The model ID you actually send'],
          ['Volume', 'Requests per month and average input/output tokens, from returned usage'],
          ['Peaks', 'Peak concurrency, how long it lasts and latency needs'],
          ['Settlement', 'Prepaid or monthly, invoice type, reconciliation cycle'],
        ],
      },
      facts: [
        'OpenAI-compatible does not mean every parameter is supported; test each feature you use before going live.',
        'Model prices are on CCG API; this site lists none.',
        'Supply partners start with a credential-free resource description: model IDs, capacity, supply basis and settlement.',
      ],
      note: `The base URL is CCG API’s public address; available models follow the CCG API model list (${checked}).`,
      sources: [{ label: 'CCG API model list', url: 'https://ccg-cli.online/models/' }],
      guides: ['openai-compatible-migration', 'token-cost-estimation', 'model-supply-cooperation'],
      downloads: [
        { label: 'Usage brief', file: 'model-usage-brief.txt' },
        { label: 'Comparison sheet (CSV)', file: 'model-price-comparison.csv' },
      ],
    },
    infrastructure: {
      id: 'forms',
      label: 'Forms & roles',
      lead: 'The same workload can run in different forms, and each draws the responsibility line differently. Decide which form you need, then check resources; whether a form is available depends on actual resources.',
      table: {
        caption: 'Deployment forms and what the user owns',
        head: ['Form', 'Suits', 'User owns'],
        rows: [
          [
            'Whole machine (bare metal)',
            'Long-running, high performance or isolation',
            'OS, drivers, runtime and application',
          ],
          ['Virtual machine or container', 'Moderate needs, flexible sizing', 'Runtime and application'],
          ['Managed inference', 'Calling an API without managing machines', 'Integration, data and checking results'],
        ],
      },
      facts: [
        'Agree each duty before starting: hardware faults, network changes, OS patches, releases, backup and restore, data deletion at the end.',
        'Part of the data center runs Easy AI’s own business; not all of it is available externally.',
        'Owning a data center does not mean third-party models run in it.',
        'Location, hardware models, available capacity, certifications and SLAs are confirmed separately.',
      ],
      note: 'The table shows the usual split for each form to help prepare a request; it does not mean Easy AI offers all of them.',
      sources: [],
      guides: [
        'infrastructure-requirements',
        'self-hosted-llm-sizing',
        'training-vs-inference',
        'infrastructure-responsibilities',
      ],
      downloads: [{ label: 'Workload brief', file: 'workload-brief.txt' }],
    },
  },
};
