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
export const modelProduct = {
  name: 'CCG API',
  url: 'https://ccg-cli.online/models/',
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
  boundary: string;
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
