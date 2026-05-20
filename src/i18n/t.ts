// src/i18n/t.ts
import type { Lang } from './ui';
import { translations } from './translations';

export function t(lang: Lang, key: string): string {
  const dict = translations[lang] ?? translations.en;
  const parts = key.split('.');
  let result: any = dict;
  for (const part of parts) {
    result = result?.[part];
    if (result === undefined) break;
  }
  if (typeof result === 'string') return result;
  // Fallback to English
  let enResult: any = translations.en;
  for (const part of parts) {
    enResult = enResult?.[part];
    if (enResult === undefined) break;
  }
  return typeof enResult === 'string' ? enResult : key;
}

export function getCommon(lang: Lang) {
  return translations[lang]?.common ?? translations.en.common;
}

export function getCategories(lang: Lang) {
  return translations[lang]?.categories ?? translations.en.categories;
}

export function getTools(lang: Lang) {
  return translations[lang]?.tools ?? translations.en.tools;
}

export function getIndexPage(lang: Lang) {
  return translations[lang]?.index ?? translations.en.index;
}

export function getToolContent(lang: Lang, category: string, slug: string) {
  const toolKey = `${category}/${slug}`;
  const dict = translations[lang]?.toolContent ?? {};
  return dict[toolKey] ?? translations.en.toolContent?.[toolKey] ?? null;
}
