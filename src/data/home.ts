import type { Lang, Service } from './yi-ai';

type Layer = { name: string; tag: string };
type Reason = { title: string; text: string };

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
  /** One reason per service, then the shared contact. Facts only: no ratings, client counts or guarantees. */
  why: [Reason, Reason, Reason, Reason];
  partnersKicker: string;
  partnersTitle: string;
  partnersLead: string;
  /** Accessible names for the marquee pause toggle (icon only, so no glyphs reach the font subset). */
  partnersPause: [pause: string, resume: string];
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
      { title: 'WorkBuddy 代理商', text: '团队统一采购，按人数和期限报价。' },
      { title: '模型 API 聚合接入', text: '聚合多家供应渠道，统一接口与计费口径，可用模型与结算按需确认。' },
      { title: '自建机房', text: '计算、存储和网络资源按工作负载匹配。' },
      { title: '需求集中受理', text: '应用、模型与算力需求由统一团队受理，确认后逐项跟进至交付。' },
    ],
    partnersKicker: '合作伙伴',
    partnersTitle: '合作伙伴',
    partnersLead: '覆盖应用、模型与算力，与易AI 保持合作。',
    partnersPause: ['暂停滚动', '继续滚动'],
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
      { title: 'WorkBuddy reseller', text: 'Team purchases quoted by seats and term.' },
      {
        title: 'Aggregated model API access',
        text: 'Multiple supply channels behind one interface and one billing basis; available models and settlement are confirmed per case.',
      },
      { title: 'Self-built data center', text: 'Compute, storage and networking matched to the workload.' },
      {
        title: 'Single point of intake',
        text: 'Requests across applications, models and compute are received by one team and followed through item by item to delivery.',
      },
    ],
    partnersKicker: 'Partners',
    partnersTitle: 'Partners',
    partnersLead: 'Across applications, models and compute, in cooperation with Easy AI.',
    partnersPause: ['Pause scrolling', 'Resume scrolling'],
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
