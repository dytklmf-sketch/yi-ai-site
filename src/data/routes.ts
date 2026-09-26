import { getCollection } from 'astro:content';
import { zh } from './zh';
import { en } from './en';
import { editorial } from './editorial';
import { articlePath, pathFor, shareImage, pageSlugs, type Lang, type SitePage, type Service } from './yi-ai';

export const languages: Lang[] = ['zh', 'en'];
export async function getGuides(lang?: Lang) {
  const entries = await getCollection('guides');
  const keys = new Set<string>();
  for (const { data } of entries) {
    const key = `${data.lang}/${data.pairKey}`;
    if (keys.has(key)) throw new Error(`Duplicate guide: ${key}`);
    keys.add(key);
    if (!entries.some((entry) => entry.data.lang !== data.lang && entry.data.pairKey === data.pairKey))
      throw new Error(`Missing language counterpart: ${key}`);
  }
  return entries.filter((entry) => !lang || entry.data.lang === lang).sort((a, b) => a.data.order - b.data.order);
}

export type RouteEntry = {
  lang: Lang;
  kind: 'page' | 'article';
  slug?: SitePage;
  article?: string;
  service?: Service;
  path: string;
  counterpart: string;
  title: string;
  description: string;
  image: string;
};
export async function getRoutes(): Promise<RouteEntry[]> {
  const routes: RouteEntry[] = [];
  for (const lang of languages) {
    const t = lang === 'zh' ? zh : en;
    const e = editorial[lang];
    const other = lang === 'zh' ? 'en' : 'zh';
    const pages: (SitePage | undefined)[] = [undefined, ...pageSlugs, 'about', 'resources'];
    for (const slug of pages) {
      const title = !slug
        ? t.heroHeadline.join(' ')
        : slug === 'contact'
          ? t.contact.seoTitle
          : slug === 'about'
            ? e.aboutTitle.replace('\n', ' ')
            : slug === 'resources'
              ? e.resources
              : t.services[slug].seoTitle;
      const description = !slug
        ? t.heroIntro
        : slug === 'contact'
          ? t.contact.intro
          : slug === 'about'
            ? e.aboutIntro
            : slug === 'resources'
              ? e.guidesIntro
              : t.services[slug].intro;
      routes.push({
        lang,
        kind: 'page',
        slug,
        service:
          slug && ['workbuddy', 'model-services', 'infrastructure'].includes(slug) ? (slug as Service) : undefined,
        path: pathFor(lang, slug),
        counterpart: pathFor(other, slug),
        title,
        description: description.replaceAll('\n', ' '),
        image: shareImage(lang, slug),
      });
    }
    for (const { data } of await getGuides(lang)) {
      routes.push({
        lang,
        kind: 'article',
        slug: 'resources',
        article: data.pairKey,
        service: data.service,
        path: articlePath(lang, data.pairKey),
        counterpart: articlePath(other, data.pairKey),
        title: data.title,
        description: data.description,
        image: shareImage(lang, 'resources', data.pairKey),
      });
    }
  }
  return routes;
}
