import type { Lang, Service } from './yi-ai';

type Refinement = {
  audiences: Record<Service, string>;
  serviceQuestion: Record<Service, string>;
  boundaries: Record<Service, string>;
  discuss: string;
  confirm: string;
  relationship: string;
  guideType: string;
  guideAudience: string;
  guideChecks: Record<Service, string[]>;
  processPrompts: string[][];
  promptsLabel: string;
  serviceContents: Record<string, string>;
};

export const refinement: Record<Lang, Refinement> = {
  zh: {
    audiences: { workbuddy: '企业采购', 'model-services': '开发者与供应伙伴', infrastructure: '技术与资源团队' },
    serviceQuestion: {
      workbuddy: '给团队选工具，把采购条件问清楚。',
      'model-services': '为应用接模型，为用量找合作路径。',
      infrastructure: '从工作负载出发，核对资源与责任。',
    },
    boundaries: {
      workbuddy: '版本权益、授权范围，以及部署、培训和售后需分别确认。',
      'model-services': '可用模型、计费、数据处理和响应约定需分别确认。',
      infrastructure: '设备、容量、对外范围、运维与 SLA 需分别确认。',
    },
    discuss: '可以先讨论',
    confirm: '需要确认',
    relationship: '了解品牌与产品关系',
    guideType: '决策清单',
    guideAudience: '适合',
    guideChecks: {
      workbuddy: ['版本与使用人数', '授权期限与采购安排', '产品权益与额外服务'],
      'model-services': ['计费单位与输入输出', '延迟口径与调用限制', '数据边界与结算方式'],
      infrastructure: ['工作负载与运行环境', '计算、存储与网络', '访问、备份与责任分工'],
    },
    processPrompts: [
      ['谁来使用？', '希望解决什么问题？'],
      ['采购、接入还是资源？', '现有条件有哪些？'],
      ['哪些条件已经确定？', '哪些仍需进一步核对？'],
      ['合作包含什么？', '由谁负责下一步？'],
    ],
    promptsLabel: '讨论要点',
    serviceContents: {
      overview: '适用需求',
      process: '合作流程',
      pricing: '询价条件',
      preparation: '准备材料',
      scope: '服务边界',
      guides: '相关指南',
    },
  },
  en: {
    audiences: {
      workbuddy: 'Enterprise buyers',
      'model-services': 'Developers & suppliers',
      infrastructure: 'Technical & resource teams',
    },
    serviceQuestion: {
      workbuddy: 'Choose a team tool. Clarify purchasing terms.',
      'model-services': 'Connect models. Find a route for your usage.',
      infrastructure: 'Match the workload. Define responsibilities.',
    },
    boundaries: {
      workbuddy: 'Confirm entitlements, authorization, deployment, training and support separately.',
      'model-services': 'Confirm models, billing, data handling and response terms separately.',
      infrastructure: 'Confirm equipment, capacity, external availability, operations and SLA terms.',
    },
    discuss: 'Start by discussing',
    confirm: 'Confirm separately',
    relationship: 'Our brand and product roles',
    guideType: 'Decision checklist',
    guideAudience: 'For',
    guideChecks: {
      workbuddy: ['Edition and intended users', 'Authorization period and timing', 'Entitlements and extra services'],
      'model-services': [
        'Billing units and input/output',
        'Latency measures and limits',
        'Data boundaries and settlement',
      ],
      infrastructure: ['Workload and runtime', 'Compute, storage and network', 'Access, backups and responsibilities'],
    },
    processPrompts: [
      ['Who will use it?', 'What needs to change?'],
      ['Tools, models or resources?', 'What is already in place?'],
      ['What has been confirmed?', 'What still needs checking?'],
      ['What does the scope include?', 'Who handles the next step?'],
    ],
    promptsLabel: 'Questions to align',
    serviceContents: {
      overview: 'Your needs',
      process: 'Process',
      pricing: 'Quote inputs',
      preparation: 'Preparation',
      scope: 'Scope',
      guides: 'Guides',
    },
  },
};

export const featuredGuides: Record<Service, string> = {
  workbuddy: 'workbuddy-procurement-checklist',
  'model-services': 'model-api-procurement',
  infrastructure: 'infrastructure-requirements',
};
