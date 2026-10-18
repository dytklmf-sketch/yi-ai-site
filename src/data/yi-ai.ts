export type Lang = 'zh' | 'en';
export const brandName = (lang: Lang) => (lang === 'zh' ? '易AI' : 'Easy AI');
export const services = ['workbuddy', 'model-services', 'infrastructure'] as const;
export type Service = (typeof services)[number];
export type PageSlug = Service | 'contact';
export const pageSlugs: PageSlug[] = [...services, 'contact'];
export type SitePage = PageSlug | 'about' | 'resources' | 'faq';
export const contact: { wechat: string; email: string; wechatQr?: string } = {
  wechat: 'Li___CaB6',
  email: 'yi__ai@126.com',
};
// The WorkBuddy authorization, worded as on the certificate itself (the official designation). Shown on the WorkBuddy
// page and as the home hero badge; the certificate is valid until 2026-12-31 (see plan.md).
export const workbuddyCredential = {
  certificate: '/credentials/tencent-cloud-workbuddy-authorization.jpg',
  partner: {
    zh: '腾讯云 WorkBuddy / CodeBuddy 官方授权合作伙伴',
    en: 'Tencent Cloud WorkBuddy / CodeBuddy authorized partner',
  } satisfies Record<Lang, string>,
};
// Round 103: where Easy AI is and whom it serves (owner, 2026-10-17), and who issued the WorkBuddy certificate, in text
// that search engines and AI assistants can read (the certificate is an image). Round 104: the owner made the company
// public (2026-10-18): Easy AI is a subsidiary of DAYUSEA, the certificate holder, and handles project delivery.
export const companyLocation = {
  zh: '浙江宁波',
  en: 'Ningbo, Zhejiang',
  served: { zh: '服务全国企业', en: 'Serving companies across China' } satisfies Record<Lang, string>,
};
export const companyAddress = {
  zh: '浙江省宁波市镇海区中官西路777号',
  en: 'No. 777 Zhongguan West Road, Zhenhai District, Ningbo, Zhejiang',
} satisfies Record<Lang, string>;
export const parentCompany = {
  short: { zh: '大鱼出海', en: 'DAYUSEA' } satisfies Record<Lang, string>,
  name: { zh: '浙江大鱼出海科技有限公司', en: 'Zhejiang Dayu Chuhai Technology Co., Ltd.' } satisfies Record<
    Lang,
    string
  >,
};
// The owner's wording for the relationship; it names the authorization, so the model services pages never show it.
export const companyRelation = {
  zh: '易AI 是大鱼出海（腾讯 WorkBuddy 官方授权合作伙伴）旗下子公司，专注项目落地实施，面向企业提供 WorkBuddy 行业方案、AI 场景部署与数字化配套交付服务。',
  en: 'Easy AI is a subsidiary of DAYUSEA (a Tencent WorkBuddy authorized partner) focused on project delivery, providing companies with WorkBuddy industry solutions, AI scenario deployment and supporting digital delivery.',
} satisfies Record<Lang, string>;
export const certificateIssuer = {
  zh: '腾讯云计算（北京）有限责任公司',
  en: 'Tencent Cloud Computing (Beijing) Co., Ltd.',
} satisfies Record<Lang, string>;
// Round 94: "Open CCG API" goes to the product's home page; the catalog links (model-catalog.ts) keep /models/.
export const modelProduct = {
  name: 'CCG API',
  url: 'https://ccg-cli.online/',
};
// Every site URL goes through `withBase` so the build can live under a subpath (SITE_BASE).
const basePath = import.meta.env.BASE_URL.replace(/\/$/, '');
export const withBase = (path: string) => `${basePath}${path}`;
export const pathFor = (lang: Lang, slug?: SitePage) => withBase(slug ? `/${lang}/${slug}/` : `/${lang}/`);
export const articlePath = (lang: Lang, slug: string) => withBase(`/${lang}/resources/${slug}/`);
export const shareImage = (lang: Lang, slug?: SitePage, article?: string) =>
  withBase(`/brand/share-${lang}${slug ? `-${slug}` : ''}${article ? `-${article}` : ''}.png`);
export const navigationPages: (SitePage | undefined)[] = [undefined, ...services, 'resources', 'about'];
export const inquiryPath = (lang: Lang, service?: Service) =>
  `${pathFor(lang, 'contact')}${service ? `?topic=${service}` : ''}`;

export type ServiceCopy = {
  label: string;
  seoTitle: string;
  short: string;
  title: string;
  intro: string;
  audience: string;
  /** One line for service cards. */
  summary: string;
  /** Typical situations, as a short label plus one line. Hypothetical, not case studies. */
  scenarios: { title: string; text: string }[];
  preparation: string[];
  // Round 51: optional; the model page carries no statement about vendor authorization (owner's call).
  boundary?: string;
};

export type SiteCopy = {
  nav: { home: string; workbuddy: string; models: string; infrastructure: string; contact: string };
  otherLanguage: string;
  heroHeadline: string;
  heroIntro: string;
  primary: string;
  secondary: string;
  explore: string;
  steps: { title: string; text: string }[];
  faqTitle: string;
  faq: { service: Service; question: string; answer: string }[];
  ctaTitle: string;
  ctaBody: string;
  services: Record<Service, ServiceCopy>;
  contact: {
    seoTitle: string;
    /** Meta description only; the page shows the shorter intro. */
    seoDescription: string;
    title: string;
    intro: string;
    topic: string;
    wechatTitle: string;
    wechatText: string;
    emailTitle: string;
    emailText: string;
    emailAction: string;
    copy: string;
    copied: string;
    fallback: string;
    note: string;
    prepare: string;
    subject: string;
    emailBody: string;
  };
};
