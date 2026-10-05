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
  heroHeadline: 'Enterprise AI applications and compute, delivered end to end',
  heroIntro:
    'Easy AI works on WorkBuddy procurement, model API access and self-built data-center resources, handling selection, integration and delivery, so AI is easy to understand, use and put to work.',
  primary: 'Talk to us',
  secondary: 'Explore our services',
  explore: 'Explore this service',
  steps: [
    { title: 'Send the need', text: 'Use case, scale and timing.' },
    { title: 'We follow up', text: 'Only on what affects the quote or match.' },
    { title: 'Terms listed', text: 'Pricing, available scope and open items.' },
    { title: 'You decide', text: 'Go ahead if the terms work.' },
  ],
  faqTitle: 'Common questions',
  faq: [
    {
      service: 'workbuddy',
      question: 'Can we talk before we have a purchase plan?',
      answer:
        'Yes. Tell us roughly how many people will use it and when you want to start. That is enough to discuss editions and pricing.',
    },
    {
      service: 'workbuddy',
      question: 'How are the WorkBuddy edition and authorization decided?',
      answer:
        'By the number of users, the authorization period and the features you need; the quote follows. Deployment, training and support are not part of the product and are discussed separately.',
    },
    {
      service: 'model-services',
      question: 'How are model services priced?',
      answer:
        'Individual developers can see available models and prices through the product entry on the model services page. Enterprise pricing depends on the model, monthly volume and settlement method, so contact us directly.',
    },
    {
      service: 'model-services',
      question: 'Does supply cooperation mean direct developer supply?',
      answer:
        'No. We work with direct supply-channel partners, not direct supply or official authorization from model developers. Available models, settlement and responsibilities are confirmed item by item.',
    },
    {
      service: 'infrastructure',
      question: 'Are all data-center resources available to partners?',
      answer:
        'No. Part of the capacity runs Easy AI’s own business; what is available to partners depends on actual resources and your workload. Owning a data center also does not mean third-party models run in it.',
    },
    {
      service: 'infrastructure',
      question: 'What should we prepare for an infrastructure inquiry?',
      answer:
        'Workload type (inference or training), model size, compute and storage needs, network requirements and duration. Location, equipment, operations and SLA terms are agreed separately.',
    },
    {
      service: 'workbuddy',
      question: 'Flagship or Exclusive?',
      answer:
        'The features are the same; deployment and minimum seats differ. Flagship runs in a Tencent Cloud shared VPC from 1 seat; Exclusive runs in a dedicated VPC with dedicated network access and enterprise plugins, from 100 seats.',
    },
    {
      service: 'workbuddy',
      question: 'Who is Private Enterprise for?',
      answer:
        'Companies that need the service inside their own environment with strict data and network requirements. Private Enterprise has no usage limit and is priced by consultation.',
    },
    {
      service: 'workbuddy',
      question: 'What happens when the authorization expires?',
      answer:
        'The official documentation says Enterprise cannot be used after expiry. Review usage and seats a month ahead and allow time for internal approval.',
    },
    {
      service: 'workbuddy',
      question: 'Can we get an invoice?',
      answer:
        'Enterprise invoices are issued through the Tencent Cloud console. When buying through Easy AI, who issues the invoice and how follows the order agreement.',
    },
    {
      service: 'model-services',
      question: 'Our code uses the OpenAI SDK. What changes when we switch?',
      answer:
        'Usually only the base URL, key and model name. Before going live, test each feature you use, such as streaming, tool calls and structured output.',
    },
    {
      service: 'model-services',
      question: 'How do we estimate the monthly cost?',
      answer:
        'Take average input and output tokens from the usage fields in responses and multiply by monthly requests and prices. The guide on estimating tokens and monthly cost has a worked example; prices come from the product page or a formal quote.',
    },
    {
      service: 'model-services',
      question: 'Can we run an integration test before signing?',
      answer:
        'An integration test can be discussed; scope, cost and call rate are agreed in advance. Use separate test credentials and permitted samples, and never pass production keys in chats or documents.',
    },
    {
      service: 'model-services',
      question: 'What does a supply partner need to prepare?',
      answer:
        'A credential-free resource description: model IDs, interface, capacity and limits, supply period, supply basis and settlement. Do not send accounts or keys in the first conversation.',
    },
    {
      service: 'infrastructure',
      question: 'Can we ask for a specific GPU model?',
      answer:
        'Yes, along with the workload, quantity, duration and acceptable alternatives. Availability has to be confirmed.',
    },
    {
      service: 'infrastructure',
      question: 'We don’t know how much GPU memory we need.',
      answer:
        'Estimate weights as parameters × bytes per parameter, then add KV cache and headroom; the guides include a worked example. The final configuration comes from a real load test.',
    },
    {
      service: 'infrastructure',
      question: 'Can training and inference be discussed together?',
      answer:
        'Submit them together if you like, but describe them separately. They differ greatly in memory, storage and duration.',
    },
    {
      service: 'infrastructure',
      question: 'What happens to data at the end of cooperation?',
      answer:
        'Agree data export, deletion scope and account revocation before starting, and keep a deletion record. Arrangements are confirmed item by item.',
    },
  ],
  ctaTitle: 'Let’s talk',
  ctaBody: 'WeChat or email. Tell us the use case and scale.',
  services: {
    workbuddy: {
      label: 'Enterprise AI applications',
      seoTitle: 'WorkBuddy Reseller Procurement and Enterprise AI',
      short: 'WorkBuddy reseller · Procurement',
      title: 'WorkBuddy reseller procurement',
      intro:
        'Easy AI is a WorkBuddy reseller. For team purchases, we confirm editions, pricing, authorization periods and start dates.',
      audience: 'Procurement teams · Team leaders · IT administrators',
      summary: 'Team purchases of WorkBuddy, priced by seats and period.',
      scenarios: [
        { title: 'First purchase', text: 'A department is unsure which edition fits' },
        { title: 'Personal to Enterprise', text: 'Staff use personal accounts; the company moves them to Enterprise' },
        { title: 'Internal approval', text: 'Seats and budget are set; a formal quote is needed' },
        { title: 'Renewal', text: 'Authorization is expiring; renew and change seats' },
      ],
      preparation: ['Number of users', 'Target start date', 'Existing accounts'],
      boundary:
        'Easy AI resells WorkBuddy; we did not build it. Features, edition entitlements and license terms follow the official documentation.',
    },
    'model-services': {
      label: 'Model services and supply',
      seoTitle: 'Model API Access and Supply Partnerships',
      short: 'Model APIs · Direct supply channels',
      title: 'Model APIs and supply',
      intro:
        'Developers can see models and prices and connect directly. Enterprise volume, monthly billing and supply partnerships are handled separately.',
      audience: 'Developers · Enterprise customers · Supply partners',
      summary: 'Model API access, enterprise billing and supply-channel cooperation.',
      scenarios: [
        { title: 'Migration', text: 'An app on an OpenAI-compatible API weighs the switch' },
        { title: 'Enterprise volume', text: 'Usage is growing; enterprise pricing and monthly billing' },
        { title: 'Testing', text: 'Check quality and latency before committing' },
        { title: 'Supply', text: 'Model resources or credits to supply' },
      ],
      preparation: ['Models you need', 'Monthly volume', 'Settlement method'],
      boundary:
        'We work through direct supply channels. That is not the same as direct supply or official authorization from model developers.',
    },
    infrastructure: {
      label: 'Infrastructure capability',
      seoTitle: 'Self-Built Data Center and AI Infrastructure',
      short: 'Self-built data center · Hosting',
      title: 'Self-built data center',
      intro:
        'Easy AI owns a self-built data center. We check your workload and duration against available resources and agree who does what.',
      audience: 'Enterprise technical teams · Infrastructure partners',
      summary: 'Compute, storage and network matched to your workload.',
      scenarios: [
        { title: 'Self-hosting', text: 'An open-source model needs long-running inference' },
        { title: 'Training', text: 'Resources for a few weeks or months' },
        { title: 'Data rules', text: 'Data location and network isolation requirements' },
        { title: 'Resource partners', text: 'Compute or data-center resources to cooperate on' },
      ],
      preparation: ['Workload type', 'Resources and duration', 'Network and data needs'],
      boundary:
        'Part of the data center runs Easy AI’s own business, so not all of it is available. Owning a data center does not mean third-party models run in it.',
    },
  },
  contact: {
    seoTitle: 'Contact: Enterprise AI, Model Services and Infrastructure',
    seoDescription:
      'Contact Easy AI about WorkBuddy procurement, model APIs and supply, or data-center resources, by WeChat or email.',
    title: 'Let’s talk',
    intro: 'Pick a service to see what to prepare.',
    topic: 'Service',
    wechatTitle: 'Talk on WeChat',
    wechatText: 'For a short description of the need.',
    emailTitle: 'Send us an email',
    emailText: 'For documents or usage data.',
    emailAction: 'Write an inquiry',
    copy: 'Copy WeChat ID',
    copied: 'WeChat ID copied',
    fallback: 'Copying is unavailable. Select the ID above to copy it manually.',
    note: 'This site collects no form data. Messages are handled by your chosen email or WeChat platform.',
    prepare: 'What to prepare',
    subject: 'Easy AI cooperation inquiry',
    emailBody:
      'Hello Easy AI,\n\nI would like to discuss: {topic}\nTeam or company:\nWhat we are building:\nScale (users or volume):\nWhen we want to start:\n\nThank you.',
  },
};
