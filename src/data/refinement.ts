import type { Lang, Service } from './yi-ai';

type Refinement = {
  audiences: Record<Service, string>;
  relationship: string;
  serviceContents: Record<string, string>;
};

export const refinement: Record<Lang, Refinement> = {
  zh: {
    audiences: { workbuddy: '企业采购', 'model-services': '开发者与供应伙伴', infrastructure: '技术与资源团队' },
    relationship: '查看品牌与产品关系',
    serviceContents: {
      fit: '适用场景',
      process: '合作流程',
      guides: '相关指南',
    },
  },
  en: {
    audiences: {
      workbuddy: 'Enterprise buyers',
      'model-services': 'Developers & suppliers',
      infrastructure: 'Technical & resource teams',
    },
    relationship: 'Our brand and product roles',
    serviceContents: {
      fit: 'Use cases',
      process: 'How we work',
      guides: 'Guides',
    },
  },
};

export const featuredGuides: Record<Service, string> = {
  workbuddy: 'workbuddy-procurement-checklist',
  'model-services': 'model-api-procurement',
  infrastructure: 'infrastructure-requirements',
};
