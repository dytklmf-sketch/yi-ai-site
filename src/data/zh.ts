import type { SiteCopy } from './yi-ai';

export const zh: SiteCopy = {
  nav: { home: '首页', workbuddy: '企业 AI 应用', models: '模型服务', infrastructure: '基础设施', contact: '联系合作' },
  otherLanguage: 'EN',
  promise: ['让 AI 易懂，', '易用，易落地。'],
  heroHeadline: ['让 AI 真正用起来，', '在业务中落地。'],
  heroIntro: '为企业选工具，为应用接模型，为合作连接资源。\nWorkBuddy 代理采购、模型供应合作与自建机房，按需对接。',
  primary: '咨询合作',
  secondary: '了解服务',
  servicesTitle: '采购工具、接入模型，\n对接基础设施。',
  servicesIntro: '企业采购、开发者接入和资源合作，各有明确的咨询入口。三类业务可单独沟通，无需捆绑采购。',
  explore: '了解这项服务',
  scenariosTitle: '你的 AI 计划，\n从哪里开始？',
  scenarios: [
    { title: '给团队选一款 AI 工具', text: '希望采购 WorkBuddy，先了解版本、授权与合作条件。', service: 'workbuddy' },
    {
      title: '为应用接入模型能力',
      text: '已有业务场景，想讨论模型接口、调用规模与结算方式。',
      service: 'model-services',
    },
    {
      title: '寻找资源与合作伙伴',
      text: '围绕部署依赖、机房资源与业务承载，明确合作范围。',
      service: 'infrastructure',
    },
  ],
  manifestTitle: '应用、模型、基础设施，\n在同一处对接。',
  manifestBody:
    '易AI 是 WorkBuddy 代理商，具备模型服务与直接合作供应渠道，并拥有自建机房资源。你可以只咨询一项业务，也可以围绕同一个项目沟通多项需求。',
  principles: [
    { title: 'WorkBuddy 代理', text: '围绕企业工具需求，沟通采购与授权条件。' },
    { title: '模型服务与供应合作', text: '对接模型 API、企业用量与供应渠道合作需求。' },
    { title: '自建机房资源', text: '按工作负载核对资源条件，单独确认可合作范围。' },
  ],
  processTitle: '先了解需求，\n再确认合作。',
  steps: [
    { title: '说明目标', text: '从团队、业务场景和时间安排开始，不必先准备完整方案。' },
    { title: '梳理路径', text: '区分工具采购、模型接入和资源需求，确定具体沟通方向。' },
    { title: '核对条件', text: '逐项讨论版本、用量或资源条件，列清需要确认的问题。' },
    { title: '确认范围', text: '对齐费用、责任和合作窗口，再推进双方确认的下一步。' },
  ],
  faqTitle: '你可能也在关心',
  faq: [
    {
      service: 'workbuddy',
      question: '没有完整采购方案，可以先聊吗？',
      answer:
        '可以。先提供团队角色、计划使用人数和大致时间安排，就可以讨论 WorkBuddy 采购需求，不必先准备完整技术方案。',
    },
    {
      service: 'workbuddy',
      question: 'WorkBuddy 的版本和授权如何确认？',
      answer:
        '请提供团队规模、计划采购数量和使用时间。我们据此沟通产品版本、授权范围及价格；部署、培训和售后安排需另行确认。',
    },
    {
      service: 'model-services',
      question: '模型服务如何报价？',
      answer:
        '报价需要结合模型类型、调用规模与合作方式。可以先通过产品入口了解现有模型，企业用量和供应合作请直接联系。',
    },
    {
      service: 'model-services',
      question: '供应合作等于模型厂商直供吗？',
      answer:
        '不等于。我们对接直接合作供应渠道，不将渠道合作表述为模型厂商直供或官方授权。可用模型、结算和责任范围需单独确认。',
    },
    {
      service: 'infrastructure',
      question: '自建机房的资源都可以对外使用吗？',
      answer:
        '不是。自有业务承载与对外合作是不同范围，需要结合实际资源和工作负载逐项确认。拥有机房也不代表第三方模型都运行在自有设施内。',
    },
    {
      service: 'infrastructure',
      question: '讨论基础设施合作要准备什么？',
      answer:
        '准备项目用途、计算与存储需求、网络和运行环境、预计周期即可。位置、设备、容量、运维、备份和 SLA 不默认包含，需另行约定。',
    },
  ],
  ctaTitle: '把你的 AI 需求，\n交给一次具体的沟通。',
  ctaBody: '告诉我们业务场景、预计规模和时间安排。\n通过微信或邮件，开始讨论合作。',
  services: {
    workbuddy: {
      label: '企业 AI 应用',
      seoTitle: 'WorkBuddy 代理采购咨询与企业 AI 应用',
      short: 'WorkBuddy 代理 · 采购咨询',
      title: 'WorkBuddy\n代理采购咨询。',
      intro: '易AI 是 WorkBuddy 代理商。面向企业采购和团队负责人，沟通产品版本、采购数量、授权范围与合作条件。',
      audience: '企业采购 · 团队负责人 · AI 应用合作伙伴',
      audienceTitle: '采购前，把关键条件问清楚。',
      lead: '从团队实际使用需求出发，确认要采购什么、供多少人使用、何时开始。版本、授权和服务范围分别核对，避免把产品采购与额外服务混为一谈。',
      points: [
        { title: 'WorkBuddy 采购咨询', text: '围绕计划采购的产品、团队情况和使用需求，讨论代理采购路径。' },
        { title: '需求与条件梳理', text: '把版本、授权、价格和服务范围列清楚，让采购决策建立在确认的信息上。' },
        { title: '采购安排', text: '沟通采购时间、联系窗口与订单条件，按双方确认的范围推进。' },
      ],
      preparation: ['你的团队或组织类型', '计划采购的产品与规模', '希望开始使用的时间'],
      boundary: '产品版本、授权范围、折扣、部署方式、培训和售后，以具体合作方案与供应方确认结果为准。',
    },
    'model-services': {
      label: '模型服务与供应合作',
      seoTitle: '模型 API 接入与供应合作',
      short: '模型 API · 直接合作供应渠道',
      title: '模型 API 接入，\n用量与供应合作。',
      intro:
        '面向开发者、企业用量客户与供应合作伙伴，提供模型 API 接入咨询和供应合作对接。按模型类型、调用规模、接口要求与结算方式沟通。',
      audience: '开发者 · 企业用量客户 · 供应合作伙伴',
      audienceTitle: '接入、用量、供应，分别对接。',
      lead: '开发者可以了解现有产品的模型与接口；企业客户可以咨询用量和结算；供应伙伴可以讨论资源类型、供应范围与交付条件。',
      points: [
        { title: '开发者接入', text: '从模型类型、接口兼容和调用规模出发，梳理接入需求。' },
        { title: '企业用量方案', text: '围绕业务场景、团队使用量和结算需求，沟通合作方式。' },
        { title: '供应伙伴合作', text: '通过直接合作供应渠道，讨论供应范围、资源与交付边界。' },
      ],
      preparation: ['模型类型与应用场景', '预估调用量或用量范围', '接口与结算方面的要求'],
      boundary: '易AI 提供供应合作渠道，不将渠道合作表述为模型厂商直供。价格、可用模型和服务条件以实际确认结果为准。',
    },
    infrastructure: {
      label: '基础设施能力',
      seoTitle: '自建机房与 AI 基础设施能力',
      short: '自建机房 · 业务承载',
      title: '自建机房资源，\n按业务需求对接。',
      intro:
        '易AI 拥有自建机房资源。面向企业技术团队与基础设施合作伙伴，根据工作负载、运行环境及资源需求，确认可合作的具体范围。',
      audience: '企业技术团队 · 基础设施合作伙伴',
      audienceTitle: '先确认承载需求，再讨论资源。',
      lead: '请先说明项目用途、资源需求与预计周期。我们据此沟通可匹配的资源条件；具体设备、容量及可对外提供的服务需逐项确认。',
      points: [
        { title: '自建机房资源', text: '以自建机房作为业务基础资源，按实际需求沟通匹配条件。' },
        { title: '部署依赖讨论', text: '梳理项目涉及的资源、网络和运行环境需求，评估可行路径。' },
        { title: '合作范围确认', text: '明确资源与责任边界，区分自有业务承载和可对外提供的服务。' },
      ],
      preparation: ['项目与工作负载说明', '部署环境和资源需求', '预计周期与合作范围'],
      boundary:
        '机房位置、设备、容量、认证、SLA 和对外租用范围需单独确认。拥有机房不代表第三方模型均部署在自有设施内。',
    },
  },
  contact: {
    seoTitle: '联系合作：企业 AI、模型服务与基础设施',
    title: '聊聊你的下一个\nAI 计划。',
    intro: '不必先写好完整方案。告诉我们你的场景和目标，\n我们一起把下一步理清楚。',
    topic: '先选择业务方向',
    topicHint: '不确定也可以先选最接近的方向，之后还可以切换。',
    wechatTitle: '微信聊聊',
    wechatText: '适合快速介绍需求、沟通采购与合作方向。',
    emailTitle: '发一封邮件',
    emailText: '适合附上更完整的业务背景、需求说明与时间安排。',
    emailAction: '撰写合作邮件',
    copy: '复制微信号',
    copied: '微信号已复制',
    fallback: '暂时无法自动复制，请选择上方微信号手动复制。',
    note: '联系方式由易AI 业务团队沿用。本站不收集表单信息；通过微信或邮件发送的内容由对应平台处理。',
    prepare: '可以提前想想',
    subject: '易AI 合作咨询',
    emailBody: '您好，易AI：\n\n我想咨询：{topic}\n团队或公司：\n业务场景：\n预计规模：\n希望推进的时间：\n\n谢谢！',
  },
};
