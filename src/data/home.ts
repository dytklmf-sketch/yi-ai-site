import type { Lang, Service } from './yi-ai';

type Layer = { name: string; tag: string };
/** `proof` labels the link to where the reason can be checked; the targets live in WhyChapter. */
type Reason = { title: string; text: string; proof: string };

type HomeCopy = {
  heroEyebrow: string;
  /** The positioning slogan, kept apart from the eyebrow: the about hero highlights 易 in it. */
  heroSlogan: string;
  /** Two lines; the second is set in the accent gradient. */
  heroTitle: [string, string];
  stackCaption: string;
  layers: Record<Service, Layer>;
  stackTitle: string;
  scenariosLabel: string;
  faqAll: string;
  whyTitle: string;
  /**
   * What sets Easy AI apart, each with a link to its evidence (certificate, service page, contact), rather than a
   * restatement of the three services. Facts only: no ratings, client counts or guarantees.
   */
  why: [Reason, Reason, Reason, Reason];
  partnersKicker: string;
  partnersTitle: string;
  partnersLead: string;
};

export const home: Record<Lang, HomeCopy> = {
  zh: {
    heroEyebrow: '企业 AI 应用与算力供应服务商',
    heroSlogan: '让 AI 易懂、易用、易落地',
    heroTitle: ['为企业提供 AI 应用、模型与算力', '选型 · 接入 · 交付'],
    stackCaption: '应用 · 模型 · 算力',
    layers: {
      workbuddy: { name: '应用层', tag: 'WorkBuddy 代理采购' },
      'model-services': { name: '模型层', tag: '模型 API 与供应合作' },
      infrastructure: { name: '算力层', tag: '自建机房资源' },
    },
    stackTitle: '主营业务',
    scenariosLabel: '常见场景',
    faqAll: '全部',
    whyTitle: '为什么选择易AI',
    why: [
      {
        title: '官方授权',
        text: '腾讯云 WorkBuddy / CodeBuddy 官方授权合作伙伴，团队采购按人数和期限报价。',
        proof: '查看授权证书',
      },
      {
        title: '统一接口与计费',
        text: '多家模型供应渠道收拢到一个接口和一套计费口径，可用模型与结算按需确认。',
        proof: '了解模型服务',
      },
      { title: '自建机房', text: '计算、存储和网络资源来自自建机房，按工作负载匹配。', proof: '了解基础设施' },
      {
        title: '一个团队对接',
        text: '应用、模型与算力需求由同一团队受理，确认后逐项跟进至交付。',
        proof: '联系我们',
      },
    ],
    partnersKicker: '合作伙伴',
    partnersTitle: '合作伙伴',
    partnersLead: '覆盖应用、模型与算力，与易AI 保持合作。',
  },
  en: {
    heroEyebrow: 'Your enterprise AI applications and compute provider',
    heroSlogan: 'Understand AI. Use it. Put it to work.',
    heroTitle: ['AI applications and compute,', 'delivered end to end'],
    stackCaption: 'Application · Model · Compute',
    layers: {
      workbuddy: { name: 'Application', tag: 'WorkBuddy procurement' },
      'model-services': { name: 'Model', tag: 'Model APIs & supply' },
      infrastructure: { name: 'Compute', tag: 'Self-built data center' },
    },
    stackTitle: 'Core services',
    scenariosLabel: 'Common cases',
    faqAll: 'All',
    whyTitle: 'Why Easy AI',
    why: [
      {
        title: 'Authorized partner',
        text: 'A Tencent Cloud WorkBuddy / CodeBuddy authorized partner; team purchases are quoted by seats and term.',
        proof: 'View the certificate',
      },
      {
        title: 'One interface, one billing basis',
        text: 'Multiple model supply channels behind one interface and one billing basis; available models and settlement are confirmed per case.',
        proof: 'Model services',
      },
      {
        title: 'Self-built data center',
        text: 'Compute, storage and networking come from our own data center, matched to the workload.',
        proof: 'Infrastructure',
      },
      {
        title: 'One team',
        text: 'Requests across applications, models and compute are received by one team and followed through to delivery.',
        proof: 'Contact us',
      },
    ],
    partnersKicker: 'Partners',
    partnersTitle: 'Partners',
    partnersLead: 'Across applications, models and compute, in cooperation with Easy AI.',
  },
};

/**
 * Partners named by the owner (2026-10-02), shown as a logo wall. `logo` is a file in `public/partners/`
 * (Wikimedia Commons / Wikipedia files for the four large companies, the official sites for Kuaizi, geolix and
 * NeoGate); `size` is its height in px on desktop, tuned so the marks look equally heavy. `wordmark` sets the name
 * beside an icon-only logo, the way the partner's own site header does. An empty list hides the chapter.
 */
export const partners: { zh: string; en: string; logo: string; size: number; wordmark?: [string, string] }[] = [
  { zh: '腾讯', en: 'Tencent', logo: '/partners/tencent.png', size: 21 },
  { zh: '蚂蚁集团', en: 'Ant Group', logo: '/partners/ant-group.png', size: 34 },
  { zh: '中国移动', en: 'China Mobile', logo: '/partners/china-mobile.svg', size: 32 },
  { zh: '中国电信', en: 'China Telecom', logo: '/partners/china-telecom.svg', size: 34 },
  { zh: '筷子科技', en: 'Kuaizi Technology', logo: '/partners/kuaizi.svg', size: 26 },
  { zh: 'geolix.ai', en: 'geolix.ai', logo: '/partners/geolix.png', size: 36 },
  { zh: '广大通', en: 'NeoGate', logo: '/partners/neogate.png', size: 32, wordmark: ['Neo', 'Gate'] },
  { zh: '大鱼出海', en: 'DAYUSEA', logo: '/partners/dayusea.png', size: 26 },
];
