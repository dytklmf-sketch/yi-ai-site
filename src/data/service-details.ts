import type { Lang, Service } from './yi-ai';

type Details = {
  steps: { title: string; text: string }[];
  /** What a quote or a resource match actually depends on, as short labels. */
  brief: string[];
  /** A filled-in request shown in the page hero. The company and figures are placeholders, not a customer. */
  sample?: { title: string; fields: [string, string][] };
  /** One-line quote example beside the checklist, for pages whose hero shows something else. Placeholder figures. */
  briefExample?: string;
  discuss: string[];
  confirm: string[];
};

export const serviceDetails: Record<Lang, Record<Service, Details>> = {
  zh: {
    workbuddy: {
      steps: [
        { title: '提交需求', text: '人数、部门、开通时间与现有账号。' },
        { title: '核对条件', text: '版本、授权范围与报价，额外服务单独列出。' },
        { title: '确认下单', text: '确认订单与开通时间后安排采购。' },
      ],
      brief: ['使用人数', '开通日期', '授权期限', '现有账号', '发票要求'],
      sample: {
        title: '采购需求',
        fields: [
          ['部门', '×× 公司市场部'],
          ['使用人数', '约 20 人'],
          ['希望开通', '下月初'],
          ['现有账号', '5 人在用个人账号'],
          ['咨询内容', '可选版本与报价'],
        ],
      },
      discuss: ['版本差别与适合的团队规模', '按人数和期限的报价', '个人账号转为团队采购', '续费与人数调整'],
      confirm: ['具体版本权益与授权条款', '折扣与付款方式', '企业部署、培训和技术支持', '交付时间与售后责任'],
    },
    'model-services': {
      steps: [
        { title: '说明需求', text: '角色、模型与预估调用量。' },
        { title: '统一口径比价', text: '对齐 token 构成、并发和计费单位。' },
        { title: '约定结算', text: '结算周期、异常联络人与模型变更通知。' },
      ],
      brief: ['模型与版本', '月调用量', '输入输出比例', '并发与延迟', '结算方式'],
      briefExample: '客服应用，OpenAI 兼容接口，每月约 2000 万 token，输入约占七成，希望洽谈企业用量价格与月结。',
      discuss: ['接口兼容与迁移', '企业用量价格与结算', '测试与效果验证', '供应渠道合作'],
      confirm: ['具体可用模型与接口差异', '限额、稳定性与响应约定', '数据处理方式', '计费异常与退出安排'],
    },
    infrastructure: {
      steps: [
        { title: '描述工作负载', text: '推理或训练、模型规模与使用周期。' },
        { title: '核对资源', text: '确认计算、存储与网络能否匹配。' },
        { title: '划分责任', text: '权限、运维、备份与到期退出。' },
      ],
      brief: ['工作负载类型', '模型规模', '计算与存储', '网络要求', '使用周期'],
      sample: {
        title: '工作负载需求',
        fields: [
          ['工作负载', '推理服务'],
          ['用途', '内部知识库问答'],
          ['模型', '开源大模型，私有化部署'],
          ['使用周期', '约一年'],
          ['希望上线', '下季度'],
          ['咨询内容', '机房资源能否匹配'],
        ],
      },
      discuss: ['资源能否匹配工作负载', '部署环境与网络', '使用周期与合作方式', '资源供应合作'],
      confirm: ['位置、设备与可用容量', '对外租用与运维范围', '认证、备份与 SLA', '到期迁移与退出'],
    },
  },
  en: {
    workbuddy: {
      steps: [
        { title: 'Send the need', text: 'Seats, team, start date, existing accounts.' },
        { title: 'We check terms', text: 'Editions, authorization and pricing; extras listed apart.' },
        { title: 'Order', text: 'Procurement starts once you confirm the order and date.' },
      ],
      brief: ['Seats', 'Start date', 'Authorization period', 'Existing accounts', 'Invoicing'],
      sample: {
        title: 'Purchase request',
        fields: [
          ['Team', 'Marketing, [Company]'],
          ['Users', 'About 20'],
          ['Start', 'Early next month'],
          ['Accounts', '5 on personal accounts'],
          ['Asking for', 'Editions and a quote'],
        ],
      },
      discuss: [
        'Edition differences and team fit',
        'Pricing by seats and period',
        'Personal accounts to a team purchase',
        'Renewals and seat changes',
      ],
      confirm: [
        'Edition entitlements and authorization terms',
        'Discounts and payment terms',
        'Enterprise deployment, training and technical support',
        'Delivery timing and after-sales responsibilities',
      ],
    },
    'model-services': {
      steps: [
        { title: 'State the need', text: 'Your role, models and rough volume.' },
        { title: 'Compare like for like', text: 'Same token mix, concurrency and billing units.' },
        { title: 'Agree settlement', text: 'Billing cycle, anomaly contacts, model-change notices.' },
      ],
      brief: ['Models and versions', 'Monthly volume', 'Input/output ratio', 'Concurrency and latency', 'Settlement'],
      briefExample: 'Support app, OpenAI-compatible API, ~20M tokens a month, 70% input, wants monthly billing.',
      discuss: [
        'Interface compatibility and migration',
        'Enterprise pricing and settlement',
        'Testing and quality checks',
        'Supply-channel cooperation',
      ],
      confirm: [
        'Available models and interface differences',
        'Limits, reliability and response terms',
        'Data handling',
        'Billing disputes and exit arrangements',
      ],
    },
    infrastructure: {
      steps: [
        { title: 'Describe the workload', text: 'Inference or training, model size, duration.' },
        { title: 'Check resources', text: 'Whether compute, storage and network fit.' },
        { title: 'Split responsibilities', text: 'Access, operations, backups and exit.' },
      ],
      brief: ['Workload type', 'Model size', 'Compute and storage', 'Network needs', 'Duration'],
      sample: {
        title: 'Workload request',
        fields: [
          ['Workload', 'Inference service'],
          ['Use', 'Internal knowledge-base Q&A'],
          ['Model', 'Open-source LLM, self-hosted'],
          ['Duration', 'About a year'],
          ['Start', 'Next quarter'],
          ['Asking', 'Whether your resources fit'],
        ],
      },
      discuss: [
        'Whether resources fit the workload',
        'Deployment environment and networking',
        'Duration and cooperation model',
        'Resource supply cooperation',
      ],
      confirm: [
        'Location, equipment and available capacity',
        'External rental and operations scope',
        'Certifications, backups and SLA terms',
        'Migration and exit at the end of the term',
      ],
    },
  },
};
