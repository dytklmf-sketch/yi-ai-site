import type { SiteCopy } from './yi-ai';

export const zh: SiteCopy = {
  nav: { home: '首页', workbuddy: '企业 AI 应用', models: '模型服务', infrastructure: '基础设施', contact: '联系合作' },
  otherLanguage: 'EN',
  heroHeadline: '为企业提供 AI 应用与算力：选型、接入与交付',
  heroIntro:
    '易AI 专注 WorkBuddy 代理采购、模型 API 接入与自建机房资源，围绕企业的用量与合规要求，完成选型、接入与交付，让 AI 易懂、易用、易落地。',
  primary: '咨询合作',
  secondary: '了解服务',
  explore: '了解这项服务',
  steps: [
    { title: '提交需求', text: '用途、规模与时间。' },
    { title: '补充信息', text: '仅确认与报价、资源匹配相关的内容。' },
    { title: '列出条件', text: '报价、可用范围与待确认事项。' },
    { title: '由你决定', text: '条件合适后再推进。' },
  ],
  faqTitle: '常见问题',
  faq: [
    {
      service: 'workbuddy',
      question: '还没有采购方案，可以先咨询吗？',
      answer: '可以。提供预计使用人数与希望开通时间，即可开始讨论版本与报价。',
    },
    {
      service: 'workbuddy',
      question: 'WorkBuddy 的版本与授权如何确定？',
      answer: '按使用人数、授权期限和所需功能选择版本，报价随之确定。部署、培训与售后不包含在产品内，需另行商定。',
    },
    {
      service: 'model-services',
      question: '模型服务如何报价？',
      answer:
        '个人开发者可以通过模型服务页的产品入口查看现有模型和价格。企业用量的价格取决于模型、每月调用量和结算方式，请直接联系我们。',
    },
    {
      service: 'model-services',
      question: '供应合作等于模型厂商直供吗？',
      answer: '不等于。我们对接的是直接合作的供应渠道，并非模型厂商直供或官方授权。可用模型、结算与责任范围逐项确认。',
    },
    {
      service: 'infrastructure',
      question: '自建机房资源是否全部对外开放？',
      answer:
        '不是。部分资源承载易AI 自有业务，可对外合作的部分需按实际资源与工作量确认。此外，拥有机房不代表第三方模型均运行于自有设施。',
    },
    {
      service: 'infrastructure',
      question: '洽谈基础设施合作需要准备哪些信息？',
      answer:
        '工作负载类型（推理或训练）、模型规模、计算与存储需求、网络要求及预计周期。位置、设备、运维与 SLA 另行约定。',
    },
    {
      service: 'workbuddy',
      question: '个人版和企业版有什么区别？',
      answer:
        '个人版按账号订阅、每月发放积分；企业版按人数订阅，有管理后台，可选共享 VPC、独享 VPC 或本地部署。企业版官方价格见 WorkBuddy 页的「企业版价格」。',
    },
    {
      service: 'workbuddy',
      question: '积分用不完可以留到下个月吗？',
      answer:
        '据官方积分说明，个人版积分按月发放、当月有效，不结转到下个月。选版本前建议统计几位典型用户一到两周的实际用量。',
    },
    {
      service: 'workbuddy',
      question: '授权到期后会怎样？',
      answer: '官方说明企业版到期后无法继续使用。建议到期前一个月核对用量与人数，留出内部审批时间。',
    },
    {
      service: 'workbuddy',
      question: '可以开发票吗？',
      answer:
        '官方渠道中，个人用户在 WorkBuddy 个人中心申请，企业用户通过腾讯云控制台处理。通过易AI采购时，发票的开具方与方式以订单约定为准。',
    },
    {
      service: 'model-services',
      question: '现有代码用的是 OpenAI SDK，切换要改什么？',
      answer: '通常只需改接口地址、密钥和模型名。上线前按实际用到的功能逐项测试，例如流式输出、函数调用和结构化输出。',
    },
    {
      service: 'model-services',
      question: '怎么估算每月费用？',
      answer:
        '用接口返回的用量字段统计平均输入与输出 Token，乘以每月请求数和单价。算法与示例见资源与指南中的《Token 用量与月度成本怎么估》，单价以产品页面或正式报价为准。',
    },
    {
      service: 'model-services',
      question: '签约前可以做接入测试吗？',
      answer:
        '接入测试可以洽谈，测试范围、费用与调用频率需要事先约定。测试使用独立凭据和允许使用的样本，不在聊天或文档里传生产密钥。',
    },
    {
      service: 'model-services',
      question: '作为供应方合作，需要准备什么？',
      answer:
        '一份不含凭据的资源说明：模型标识、接口形式、容量与限额、可提供周期、供应依据和结算方式。首次沟通不发账号或密钥。',
    },
    {
      service: 'infrastructure',
      question: '可以直接问某个显卡型号吗？',
      answer: '可以，同时请说明工作负载、数量、使用周期和可替代条件。型号是否可用需要实际确认。',
    },
    {
      service: 'infrastructure',
      question: '不知道需要多少显存怎么办？',
      answer:
        '权重可按「参数量 × 每参数字节数」估算，再加上 KV 缓存和运行余量；资源与指南里有完整算例。最终配置以实际压测为准。',
    },
    {
      service: 'infrastructure',
      question: '训练和推理可以一起谈吗？',
      answer: '可以一起提交，建议分开描述。两者对显存、存储和使用周期的要求差别很大。',
    },
    {
      service: 'infrastructure',
      question: '合作结束时数据怎么处理？',
      answer: '数据导出、删除范围与账号撤销应在合作开始前约定，并保留删除记录。具体安排逐项确认。',
    },
  ],
  ctaTitle: '联系合作',
  ctaBody: '通过微信或邮件说明用途与规模。',
  services: {
    workbuddy: {
      label: '企业 AI 应用',
      seoTitle: 'WorkBuddy 代理采购咨询与企业 AI 应用',
      short: 'WorkBuddy 代理 · 采购咨询',
      title: 'WorkBuddy 代理采购',
      intro: '易AI 是 WorkBuddy 代理商，团队统一采购可联系我们确认版本、报价、授权期限与开通时间。',
      audience: '企业采购 · 团队负责人 · IT 管理员',
      summary: '团队统一采购 WorkBuddy，按人数和期限报价。',
      scenarios: [
        { title: '首次采购', text: '部门统一采购，尚未确定版本' },
        { title: '个人转团队', text: '成员在用个人账号，改由公司统一购买' },
        { title: '内部审批', text: '人数与预算已定，需要正式报价' },
        { title: '续费调整', text: '授权到期，续费并调整人数' },
      ],
      preparation: ['使用人数', '希望开通的时间', '是否已有账号'],
      boundary: '易AI 是 WorkBuddy 的代理商，不是开发方。产品功能、版本权益和授权条款以官方说明为准。',
    },
    'model-services': {
      label: '模型服务与供应合作',
      seoTitle: '模型 API 接入与供应合作',
      short: '模型 API · 直接合作供应渠道',
      title: '模型 API 与供应合作',
      intro: '个人开发者可直接查看模型和价格并接入；企业用量、月结和供应合作单独洽谈。',
      audience: '开发者 · 企业用量客户 · 供应合作伙伴',
      summary: '模型 API 接入、企业用量结算与供应渠道合作。',
      scenarios: [
        { title: '接口迁移', text: '应用用 OpenAI 兼容接口，评估切换成本' },
        { title: '企业用量', text: '调用量增长，洽谈企业价格与月结' },
        { title: '接入测试', text: '正式接入前验证效果与延迟' },
        { title: '供应合作', text: '持有模型资源或额度，以供应方身份合作' },
      ],
      preparation: ['所需模型', '每月预估调用量', '结算方式'],
      boundary: '我们对接的是直接合作的供应渠道，不等于模型厂商直供或官方授权。',
    },
    infrastructure: {
      label: '基础设施能力',
      seoTitle: '自建机房与 AI 基础设施能力',
      short: '自建机房 · 业务承载',
      title: '自建机房资源',
      intro: '易AI 拥有自建机房，将按工作负载与周期确认资源匹配情况及双方分工。',
      audience: '企业技术团队 · 基础设施合作伙伴',
      summary: '按工作负载匹配计算、存储和网络资源。',
      scenarios: [
        { title: '私有化部署', text: '开源模型需要长期运行推理服务' },
        { title: '训练与微调', text: '按几周到几个月的周期使用资源' },
        { title: '数据要求', text: '对数据存放位置与网络隔离有要求' },
        { title: '资源合作', text: '持有算力或机房资源，寻求合作' },
      ],
      preparation: ['工作负载类型', '所需资源和周期', '网络与数据要求'],
      boundary: '机房的一部分资源承载易AI 自己的业务，不是全部可以对外。有机房，也不代表第三方模型运行在自有设施内。',
    },
  },
  contact: {
    seoTitle: '联系合作：企业 AI、模型服务与基础设施',
    seoDescription: '联系易AI：WorkBuddy 代理采购、模型 API 与供应合作、自建机房资源，微信或邮件均可。',
    title: '联系合作',
    intro: '选择业务方向，查看需要准备的信息。',
    topic: '业务方向',
    wechatTitle: '微信咨询',
    wechatText: '适合简要说明需求。',
    emailTitle: '邮件咨询',
    emailText: '适合发送需求文档或用量数据。',
    emailAction: '撰写合作邮件',
    copy: '复制微信号',
    copied: '微信号已复制',
    fallback: '无法自动复制，请手动复制上方微信号。',
    note: '本站不收集表单信息；通过微信或邮件发送的内容由对应平台处理。',
    prepare: '需要准备',
    subject: '易AI 合作咨询',
    emailBody:
      '您好，易AI：\n\n咨询方向：{topic}\n公司或团队：\n需求内容：\n规模（人数或调用量）：\n期望开始时间：\n\n谢谢！',
  },
};
