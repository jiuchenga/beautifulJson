// src/components/layout/MegaMenu.tsx
import { useState, useRef, useEffect } from 'react';
import { getCategories as getCatTranslations, getCommon, getTools } from '@/i18n/t';
import type { Lang } from '@/i18n/ui';

interface ToolItem {
  name: string;
  href: string;
}

interface CategoryGroup {
  label: string;
  icon: string;
  href: string;
  tools: ToolItem[];
}

interface MegaMenuProps {
  lang?: string;
}

const toolSlugs: Record<string, string[]> = {
  json: ['json/formatter', 'json/viewer', 'json/compare', 'json/minifier', 'json/xml-converter', 'json/tree-view', 'json/to-go', 'json/to-csharp', 'json/to-excel', 'json/to-entity', 'json/colorizer', 'json/parser-side-by-side', 'json/format-online', 'json/formatter-new', 'json/compress-escape'],
  encrypt: ['encrypt/aes', 'encrypt/hash-digest', 'encrypt/base64', 'encrypt/image-base64', 'encrypt/number-base', 'encrypt/hex-text', 'encrypt/url-codec', 'encrypt/md5', 'encrypt/js-obfuscation', 'encrypt/js-online-decrypt', 'encrypt/jsfuck', 'encrypt/aaencode', 'encrypt/jjencode'],
  format: ['format/js-html-format', 'format/js-format', 'format/css-format', 'format/xml-format', 'format/sql-format', 'format/js-obfuscate-encrypt', 'format/js-obfuscate-compress', 'format/regex-tester', 'format/regex-code-generator'],
  encode: ['encode/timestamp', 'encode/html-escape', 'encode/word-counter', 'encode/unit-converter', 'encode/subnet-calculator'],
  qr: ['qr/generate', 'qr/beautifier', 'qr/decoder', 'qr/api-test', 'qr/knowledge'],
  webmaster: ['webmaster/http-status', 'webmaster/robots-txt', 'webmaster/meta-tag-generator', 'webmaster/http-headers', 'webmaster/user-agent-parser'],
  frontend: ['frontend/color-picker', 'frontend/image-info', 'frontend/favicon-generator'],
  life: ['life/date-calculator', 'life/stopwatch', 'life/world-time', 'life/morse-code'],
  other: ['other/password-generator', 'other/cron-generator'],
};

const catIcons: Record<string, string> = {
  json: '{ }', encrypt: '🔐', format: '📐', encode: '🔄',
  qr: '📱', webmaster: '🌐', frontend: '🎨', life: '🕐', other: '🛠️',
};

function buildMenuCategories(lang: string): CategoryGroup[] {
  const langTyped = lang as Lang;
  const categories = getCatTranslations(langTyped);
  const tools = getTools(langTyped);

  return Object.entries(toolSlugs).map(([catSlug, slugs]) => {
    const catData = categories[catSlug];
    return {
      label: catData?.name ?? catSlug,
      icon: catIcons[catSlug] ?? '',
      href: `/beautifulJson/${lang}/category/${catSlug}`,
      tools: slugs.map(slug => ({
        name: tools[slug]?.name ?? slug,
        href: `/beautifulJson/${lang}/${slug}`,
      })),
    };
  });
}

export default function MegaMenu({ lang = 'en' }: MegaMenuProps) {
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const categories = buildMenuCategories(lang);
  const common = getCommon(lang as Lang);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div ref={menuRef} className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-1 rounded-md px-3 py-2 text-sm text-[var(--text-secondary)] hover:bg-[var(--bg-tertiary)] hover:text-[var(--text-primary)] transition-colors"
        aria-expanded={isOpen}
        aria-haspopup="true"
      >
        {common.onlineTools}
        <svg
          className={`h-3 w-3 transition-transform ${isOpen ? 'rotate-180' : ''}`}
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {isOpen && (
        <div className="absolute left-0 top-full z-50 mt-1 w-[720px] rounded-lg border border-[var(--border-primary)] bg-[var(--bg-secondary)] p-4 shadow-2xl">
          <div className="grid grid-cols-3 gap-4">
            {categories.map((cat) => (
              <div key={cat.label}>
                <a
                  href={cat.href}
                  className="flex items-center gap-2 rounded-md px-2 py-1.5 text-sm font-semibold text-accent-blue hover:bg-[var(--bg-tertiary)]"
                >
                  <span className="font-mono text-xs">{cat.icon}</span>
                  {cat.label}
                </a>
                <ul className="mt-1 space-y-0.5">
                  {cat.tools.map((tool) => (
                    <li key={tool.href}>
                      <a
                        href={tool.href}
                        className="block rounded px-2 py-1 text-xs text-[var(--text-secondary)] hover:bg-[var(--bg-tertiary)] hover:text-[var(--text-primary)] transition-colors"
                      >
                        {tool.name}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
