// src/i18n/ui.ts
export const languages = {
  en: 'English',
  zh: '中文 (简体)',
  'zh-tw': '中文 (繁體)',
  ja: '日本語',
  ko: '한국어',
  fr: 'Français',
  de: 'Deutsch',
  es: 'Español',
  pt: 'Português',
  ru: 'Русский',
  ar: 'العربية',
  hi: 'हिन्दी',
};

export const defaultLang = 'en';

export type Lang = keyof typeof languages;

export const toolCategories = {
  json: { slug: 'json', label: 'JSON Tools', icon: '{ }' },
  encrypt: { slug: 'encrypt', label: 'Encryption / Decryption', icon: '🔐' },
  format: { slug: 'format', label: 'Compression / Formatting', icon: '📐' },
  encode: { slug: 'encode', label: 'Encoding Conversion', icon: '🔄' },
  qr: { slug: 'qr', label: 'QR Code Tools', icon: '📱' },
  webmaster: { slug: 'webmaster', label: 'Webmaster Tools', icon: '🌐' },
  frontend: { slug: 'frontend', label: 'Frontend / Design', icon: '🎨' },
  life: { slug: 'life', label: 'Life Tools', icon: '🕐' },
  culture: { slug: 'culture', label: 'Culture Resources', icon: '📚' },
  other: { slug: 'other', label: 'Other Tools', icon: '🛠️' },
  content: { slug: 'content', label: 'Blog & Tutorials', icon: '📝' },
} as const;

export type CategorySlug = keyof typeof toolCategories;
