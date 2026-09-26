import type { Lang, Service } from './yi-ai';

type Details = {
  steps: { title: string; text: string }[];
  pricing: string[];
  discuss: string[];
  confirm: string[];
};

export const serviceDetails: Record<Lang, Record<Service, Details>> = {
  zh: {
    workbuddy: {
      steps: [
        { title: '明确采购对象', text: '说明团队角色、计划使用人数、现有账号和目标时间。' },
        { title: '核对产品条件', text: '逐项确认版本、数量、授权期限与报价口径，区分产品权益与额外服务。' },
        { title: '确认再推进', text: '确认订单内容、交付方式与双方联系窗口，再安排后续采购。' },
      ],
      pricing: ['产品版本与计划采购数量', '使用期限、开始时间与续费安排', '订单与结算要求，以及另行约定的服务'],
      discuss: ['代理采购路径与条件咨询', '团队需求、版本和数量梳理', '采购时间与合作窗口对接'],
      confirm: ['具体版本权益、授权及折扣', '企业部署、培训和技术支持', '交付时间、续费和售后责任'],
    },
    'model-services': {
      steps: [
        { title: '说明场景与角色', text: '区分应用接入、企业用量采购和供应合作，列出模型与接口要求。' },
        { title: '对齐比较口径', text: '核对用量、限额、计费单位和验证条件，避免只比较单个价格。' },
        { title: '约定合作边界', text: '明确结算、异常联络与变更方式，按确认的范围安排下一步。' },
      ],
      pricing: ['模型类型、版本与输入输出构成', '预估用量、峰值并发和调用节奏', '计费单位、结算周期与供应合作方式'],
      discuss: ['模型 API 接入需求', '企业用量及结算方案沟通', '直接合作供应渠道对接'],
      confirm: ['具体模型可用范围及接口差异', '测试额度、稳定性与响应约定', '数据处理、计费异常与退出安排'],
    },
    infrastructure: {
      steps: [
        { title: '描述工作负载', text: '说明项目用途、运行环境、资源需求和预计周期，不先预设设备型号。' },
        { title: '核对实际资源', text: '逐项讨论计算、存储、网络与环境条件，确认是否存在可合作范围。' },
        { title: '划清责任再安排', text: '明确访问权限、运维、备份及退出责任，再确认具体方案。' },
      ],
      pricing: ['所需资源类型、数量及占用周期', '网络、存储与运行环境要求', '实际可提供范围及双方责任分工'],
      discuss: ['自建机房资源匹配条件', '部署环境与资源依赖讨论', '基础设施合作范围梳理'],
      confirm: ['位置、设备、容量及可用资源', '对外租用、部署和运维范围', '认证、备份、网络与 SLA 条款'],
    },
  },
  en: {
    workbuddy: {
      steps: [
        {
          title: 'Define the purchase',
          text: 'Describe team roles, intended users, existing accounts and the target start date.',
        },
        {
          title: 'Check product terms',
          text: 'Confirm the edition, quantity, authorization period and quotation basis. Separate product entitlements from extra services.',
        },
        {
          title: 'Agree before proceeding',
          text: 'Confirm the order, delivery method and contact points before arranging procurement.',
        },
      ],
      pricing: [
        'Product edition and intended quantity',
        'Subscription period, start date and renewal arrangements',
        'Order and settlement requirements, plus any separately agreed services',
      ],
      discuss: [
        'Reseller procurement routes and conditions',
        'Team requirements, editions and quantities',
        'Purchasing timelines and contact points',
      ],
      confirm: [
        'Edition entitlements, authorization and discounts',
        'Enterprise deployment, training and technical support',
        'Delivery timing, renewal and after-sales responsibilities',
      ],
    },
    'model-services': {
      steps: [
        {
          title: 'Describe your role and use case',
          text: 'Distinguish application access, enterprise procurement and supply cooperation. List models and interface requirements.',
        },
        {
          title: 'Compare on equal terms',
          text: 'Align usage, limits, billing units and validation conditions instead of comparing one headline price.',
        },
        {
          title: 'Agree on the boundary',
          text: 'Confirm settlement, incident contacts and change handling before the next step.',
        },
      ],
      pricing: [
        'Model type, version and input/output mix',
        'Expected volume, peak concurrency and request patterns',
        'Billing units, settlement period and supply arrangement',
      ],
      discuss: [
        'Model API access requirements',
        'Enterprise usage and settlement discussions',
        'Direct supply-channel cooperation',
      ],
      confirm: [
        'Available models and interface differences',
        'Test allowances, reliability and response terms',
        'Data handling, billing disputes and exit arrangements',
      ],
    },
    infrastructure: {
      steps: [
        {
          title: 'Describe the workload',
          text: 'Share the project, runtime, resource needs and duration before assuming a hardware model.',
        },
        {
          title: 'Check actual resources',
          text: 'Discuss compute, storage, networking and environment conditions to establish whether cooperation is possible.',
        },
        {
          title: 'Assign responsibilities',
          text: 'Clarify access, operations, backups and exit responsibilities before agreeing on a proposal.',
        },
      ],
      pricing: [
        'Resource types, quantities and duration',
        'Network, storage and runtime requirements',
        'Confirmed available scope and division of responsibilities',
      ],
      discuss: [
        'Matching conditions for self-built resources',
        'Runtime and deployment dependencies',
        'Infrastructure cooperation scope',
      ],
      confirm: [
        'Location, equipment, capacity and availability',
        'External rental, deployment and operations scope',
        'Certifications, backups, networking and SLA terms',
      ],
    },
  },
};
