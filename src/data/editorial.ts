import type { Lang } from './yi-ai';

export const editorial = {
  zh: {
    resources: '资源与指南',
    about: '关于易AI',
    allGuides: '全部指南',
    readGuide: '阅读指南',
    guidesTitle: '做决定之前，\n先把问题问清楚。',
    guidesIntro: '围绕工具采购、模型合作和基础设施，把关键问题、准备材料与合作边界整理成可直接使用的清单。',
    featuredTitle: '把下一步，想得更具体。',
    featuredIntro: '从一份采购清单、一组对比问题或一张责任分工表开始。',
    aboutTitle: '让技术走进业务，\n让合作有据可依。',
    aboutIntro:
      '易AI 面向企业采购、AI 应用团队、开发者与资源合作伙伴，提供 WorkBuddy 代理采购咨询、模型服务与供应合作，并拥有自建机房资源。',
    aboutLead: '三项能力，一个合作入口。',
    aboutBody: '不同需求可以分别沟通，不要求捆绑采购。我们从客户的目标、约束与现有条件出发，确认合适的合作范围。',
    relationshipTitle: '品牌与产品，各有角色。',
    relationshipBody:
      '易AI 是业务与合作品牌；Easy AI 是对应英文名。CCG 是模型服务中的一个产品入口，不代表全部业务，也不是本站的账号或计费系统。',
    principlesTitle: '把合作建立在确认的信息上。',
    principles: [
      { title: '先明确问题', text: '先了解场景、用量和时间安排，再讨论产品、接口或资源。' },
      { title: '分别确认边界', text: '采购、接入、资源及额外服务分别确认，不将未确认能力写成承诺。' },
      { title: '保留清楚的依据', text: '产品版本与服务条件以实际方案确认；指南标注来源与更新时间。' },
    ],
    updated: '更新于',
    contents: '本文目录',
    sources: '参考资料',
    sourceNote: '官方资料用于核对产品或通用概念，不构成对易AI的授权、认证或背书。具体合作以双方确认的方案为准。',
    related: '继续了解',
    relatedService: '对应业务',
    process: '合作如何推进',
    pricing: '报价前需要确认',
    pricingNote: '这些是询价条件，不是固定报价或服务承诺。',
    scope: '先明确服务边界',
    included: '可以先讨论',
    excluded: '需要另行确认',
  },
  en: {
    resources: 'Guides',
    about: 'About',
    allGuides: 'All guides',
    readGuide: 'Read guide',
    guidesTitle: 'Better questions.\nClearer decisions.',
    guidesIntro:
      'Practical checklists for tool procurement, model partnerships and infrastructure. Know what to prepare, compare and confirm before moving forward.',
    featuredTitle: 'Make the next step more concrete.',
    featuredIntro: 'Start with a procurement checklist, a set of comparison questions or a responsibility map.',
    aboutTitle: 'Technology for business.\nClarity for cooperation.',
    aboutIntro:
      'Easy AI works with enterprise buyers, AI application teams, developers and resource partners. Our capabilities include WorkBuddy reseller procurement consulting, model services and supply cooperation, and self-built data-center resources.',
    aboutLead: 'Three capabilities. One place to start.',
    aboutBody:
      'Discuss each service independently, without bundled purchasing. We start with your goals, constraints and existing setup to define the scope of cooperation.',
    relationshipTitle: 'One brand. Distinct product roles.',
    relationshipBody:
      'Easy AI is the English name of 易AI, our business and cooperation brand. CCG is a product entry within model services, not the whole business or this website’s account and billing system.',
    principlesTitle: 'Cooperate on confirmed information.',
    principles: [
      {
        title: 'Understand the problem',
        text: 'Discuss the use case, volume and timeline before choosing a product, interface or resource.',
      },
      {
        title: 'Clarify each boundary',
        text: 'Confirm procurement, integration, resources and additional services separately. Unconfirmed capabilities are not promises.',
      },
      {
        title: 'Keep the basis clear',
        text: 'Confirm product versions and service terms in the actual proposal. Guides include sources and update dates.',
      },
    ],
    updated: 'Updated',
    contents: 'On this page',
    sources: 'References',
    sourceNote:
      'Official references explain products or general concepts. They do not imply endorsement, certification or authorization of Easy AI. The agreed proposal governs any cooperation.',
    related: 'Keep exploring',
    relatedService: 'Related service',
    process: 'How cooperation works',
    pricing: 'Before requesting a quote',
    pricingNote: 'These are inputs for a quotation, not fixed prices or service commitments.',
    scope: 'Define the service boundary',
    included: 'Start by discussing',
    excluded: 'Confirm separately',
  },
} satisfies Record<Lang, object>;
