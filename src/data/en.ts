import type { SiteCopy } from './yi-ai';

export const en: SiteCopy = {
  nav: {
    home: 'Home',
    workbuddy: 'Enterprise AI',
    models: 'Model services',
    infrastructure: 'Infrastructure',
    contact: 'Let’s talk',
  },
  otherLanguage: '中文',
  promise: ['Understand AI.', 'Use it. Put it to work.'],
  heroHeadline: ['Understand AI.', 'Use it. Put it to work.'],
  heroIntro:
    'WorkBuddy for teams. Model APIs for apps.\nProcurement, supply and self-built infrastructure, matched to your needs.',
  primary: 'Talk to us',
  secondary: 'Explore our services',
  servicesTitle: 'Procure tools. Connect models.\nDiscuss infrastructure.',
  servicesIntro:
    'Dedicated inquiries for procurement, developer access and resource partnerships. Discuss each service independently, without a bundled purchase.',
  explore: 'Explore this service',
  scenariosTitle: 'Where does your\nAI project begin?',
  scenarios: [
    {
      title: 'Find an AI tool for your team',
      text: 'Explore WorkBuddy procurement, product versions and authorization terms.',
      service: 'workbuddy',
    },
    {
      title: 'Connect models to your app',
      text: 'Discuss model interfaces, expected usage and settlement needs.',
      service: 'model-services',
    },
    {
      title: 'Find resources and partners',
      text: 'Clarify deployment dependencies, data-center resources and cooperation scope.',
      service: 'infrastructure',
    },
  ],
  manifestTitle: 'Applications, models, infrastructure.\nOne place to connect.',
  manifestBody:
    'Easy AI is a WorkBuddy reseller, works with direct model supply partners and owns self-built data-center resources. Discuss one service or several needs within the same project.',
  principles: [
    { title: 'WorkBuddy reseller', text: 'Discuss procurement and authorization around your team’s needs.' },
    {
      title: 'Model services and supply',
      text: 'Discuss model APIs, enterprise usage and supply-channel cooperation.',
    },
    {
      title: 'Self-built data center',
      text: 'Match resource requirements to workloads and confirm the available scope.',
    },
  ],
  processTitle: 'Understand the need.\nAgree on the scope.',
  steps: [
    {
      title: 'Share the goal',
      text: 'Start with your team, use case and timeline. A complete technical brief is not required.',
    },
    {
      title: 'Explore the route',
      text: 'Separate tool procurement, model access and resource needs to find the right discussion.',
    },
    {
      title: 'Check the terms',
      text: 'Review editions, usage or resource conditions. Identify what still needs confirmation.',
    },
    {
      title: 'Confirm the scope',
      text: 'Align costs, responsibilities and contact points before agreeing on the next step.',
    },
  ],
  faqTitle: 'A few useful answers',
  faq: [
    {
      service: 'workbuddy',
      question: 'Can we talk before we have a purchase plan?',
      answer:
        'Yes. Share team roles, intended users and an approximate timeline to discuss WorkBuddy procurement. You do not need a complete technical brief.',
    },
    {
      service: 'workbuddy',
      question: 'How are WorkBuddy versions and authorization confirmed?',
      answer:
        'Share your team size, intended quantity and start date. We discuss versions, authorization and pricing on that basis. Deployment, training and support require separate confirmation.',
    },
    {
      service: 'model-services',
      question: 'How are model services priced?',
      answer:
        'Pricing depends on model type, usage and the cooperation model. Explore the product entry for available models; contact us for enterprise usage and supply discussions.',
    },
    {
      service: 'model-services',
      question: 'Does supply cooperation mean direct developer supply?',
      answer:
        'No. We work with direct supply-channel partners, which does not imply direct supply or official authorization from model developers. Available models, settlement and responsibilities require confirmation.',
    },
    {
      service: 'infrastructure',
      question: 'Are all data-center resources available to partners?',
      answer:
        'No. Resources supporting our business and those available to partners are distinct. Scope depends on actual resources and workloads. Third-party models are not necessarily hosted in our facilities.',
    },
    {
      service: 'infrastructure',
      question: 'What should we prepare for an infrastructure inquiry?',
      answer:
        'Share the project, compute and storage needs, network, runtime and duration. Location, equipment, capacity, operations, backups and SLA terms must be agreed separately.',
    },
  ],
  ctaTitle: 'Let’s make your\nAI requirements clear.',
  ctaBody: 'Share your use case, expected scale and timeline.\nStart a conversation by WeChat or email.',
  services: {
    workbuddy: {
      label: 'Enterprise AI applications',
      seoTitle: 'WorkBuddy Reseller Procurement and Enterprise AI',
      short: 'WorkBuddy reseller · Procurement',
      title: 'WorkBuddy reseller\nprocurement consulting.',
      intro:
        'Easy AI is a WorkBuddy reseller. We help procurement teams and team leaders discuss versions, quantities, authorization scope and purchasing terms.',
      audience: 'Procurement teams · Team leaders · AI application partners',
      audienceTitle: 'Clarify the terms before you buy.',
      lead: 'Start with what your team needs, how many people will use it and when. Confirm versions, authorization and service scope separately; product procurement does not automatically include additional services.',
      points: [
        {
          title: 'WorkBuddy procurement',
          text: 'Discuss reseller procurement routes around the product, team and use case you have in mind.',
        },
        {
          title: 'Requirements and terms',
          text: 'Clarify versions, authorization, pricing and service scope so decisions rest on confirmed information.',
        },
        {
          title: 'Purchasing arrangements',
          text: 'Discuss timing, contact points and order terms, then proceed within the agreed scope.',
        },
      ],
      preparation: ['Your team or organization', 'Product and procurement scale', 'Your intended start date'],
      boundary:
        'Versions, authorization, discounts, deployment, training and support follow the confirmed cooperation proposal and supplier scope.',
    },
    'model-services': {
      label: 'Model services and supply',
      seoTitle: 'Model API Access and Supply Partnerships',
      short: 'Model APIs · Direct supply channels',
      title: 'Model APIs, usage\nand supply partnerships.',
      intro:
        'We work with developers, enterprise customers and supply partners on model API access and supply cooperation. Discuss model types, expected usage, interface requirements and billing.',
      audience: 'Developers · Enterprise customers · Supply partners',
      audienceTitle: 'Access, usage and supply: distinct needs.',
      lead: 'Developers can explore available models and interfaces. Enterprise customers can discuss usage and billing. Supply partners can outline resources, availability and delivery terms.',
      points: [
        {
          title: 'Developer access',
          text: 'Frame access needs around model type, interface compatibility and expected usage.',
        },
        {
          title: 'Enterprise usage',
          text: 'Discuss cooperation models around your business, team usage and settlement needs.',
        },
        {
          title: 'Supply partnerships',
          text: 'Work through direct supply channels to discuss scope, resources and delivery boundaries.',
        },
      ],
      preparation: ['Model type and application', 'Expected usage or range', 'Interface and settlement needs'],
      boundary:
        'Supply-channel cooperation does not imply direct supply from model developers. Pricing, available models and service terms are confirmed individually.',
    },
    infrastructure: {
      label: 'Infrastructure capability',
      seoTitle: 'Self-Built Data Center and AI Infrastructure',
      short: 'Self-built data center · Business foundations',
      title: 'Self-built data-center\nresources for discussion.',
      intro:
        'Easy AI owns self-built data-center resources. We discuss workloads, runtime conditions and resource requirements with technical teams and infrastructure partners to establish the available cooperation scope.',
      audience: 'Enterprise technical teams · Infrastructure partners',
      audienceTitle: 'Understand the workload before choosing resources.',
      lead: 'Describe the project, required resources and timeline first. We can then discuss matching conditions. Equipment, capacity and services available to external customers must be confirmed individually.',
      points: [
        {
          title: 'Self-built resources',
          text: 'Discuss matching conditions for your needs using our self-built data-center resources.',
        },
        {
          title: 'Deployment dependencies',
          text: 'Clarify the resources, network and runtime conditions involved in a project.',
        },
        {
          title: 'Cooperation scope',
          text: 'Distinguish resources supporting our own business from services available to external partners.',
        },
      ],
      preparation: ['Project and workload', 'Deployment and resource needs', 'Timeline and scope'],
      boundary:
        'Location, equipment, capacity, certifications, SLA and rental scope require separate confirmation. Third-party models are not necessarily hosted in our facilities.',
    },
  },
  contact: {
    seoTitle: 'Contact: Enterprise AI, Model Services and Infrastructure',
    title: 'Let’s talk about\nyour next AI project.',
    intro:
      'You don’t need a complete plan.\nBring the context and the goal. We’ll work through the next step together.',
    topic: 'Choose a service direction',
    topicHint: 'Not sure yet? Start with the closest fit and change it anytime.',
    wechatTitle: 'Talk on WeChat',
    wechatText: 'For a quick introduction to your needs, procurement or partnership idea.',
    emailTitle: 'Send us an email',
    emailText: 'For a fuller business background, requirements and timeline.',
    emailAction: 'Write an inquiry',
    copy: 'Copy WeChat ID',
    copied: 'WeChat ID copied',
    fallback: 'Automatic copy is unavailable. Select the ID above to copy it manually.',
    note: 'These are the business contact details for Easy AI. This site collects no form data. Messages are handled by your chosen email or WeChat platform.',
    prepare: 'Useful details to bring',
    subject: 'Easy AI cooperation inquiry',
    emailBody:
      'Hello Easy AI,\n\nI would like to discuss: {topic}\nTeam or company:\nUse case:\nExpected scale:\nTimeline:\n\nThank you.',
  },
};
