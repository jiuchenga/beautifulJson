// src/i18n/utils.ts
import { defaultLang, type Lang } from './ui';

export function getLangFromUrl(url: URL): Lang {
  const [, lang] = url.pathname.split('/');
  if (['en', 'zh', 'ja', 'ko', 'fr', 'de', 'es', 'pt', 'ru', 'ar', 'hi', 'zh-tw'].includes(lang)) {
    return lang as Lang;
  }
  return defaultLang;
}

export function useTranslatedPath(lang: Lang) {
  return function translatePath(path: string, l: string = lang) {
    return l === defaultLang ? path : `/${l}${path}`;
  };
}

export function getRouteFromUrl(url: URL): string {
  const pathname = new URL(url).pathname;
  const parts = pathname.split('/').filter(Boolean);
  // Remove language prefix
  const langPart = parts[0];
  if (['en', 'zh', 'ja', 'ko', 'fr', 'de', 'es', 'pt', 'ru', 'ar', 'hi', 'zh-tw'].includes(langPart)) {
    parts.shift();
  }
  return '/' + parts.join('/');
}

export function buildHreflangLinks(path: string, siteUrl: string): Record<string, string> {
  const langs: Lang[] = ['en', 'zh', 'ja', 'ko', 'fr', 'de', 'es', 'pt', 'ru', 'ar', 'hi', 'zh-tw'];
  const links: Record<string, string> = {};
  for (const lang of langs) {
    links[lang] = `${siteUrl}/${lang}${path}`;
  }
  links['x-default'] = `${siteUrl}/en${path}`;
  return links;
}
