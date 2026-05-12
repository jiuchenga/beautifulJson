// src/components/layout/MegaMenu.tsx
import { useState, useRef, useEffect } from 'react';

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

function getCategories(lang: string): CategoryGroup[] {
  return [
    {
      label: 'JSON Tools',
      icon: '{ }',
      href: `/${lang}/category/json`,
      tools: [
        { name: 'JSON Formatter', href: `/${lang}/json/formatter` },
        { name: 'JSON Viewer', href: `/${lang}/json/viewer` },
        { name: 'JSON Compare', href: `/${lang}/json/compare` },
        { name: 'JSON Minifier', href: `/${lang}/json/minifier` },
        { name: 'JSON ↔ XML', href: `/${lang}/json/xml-converter` },
        { name: 'JSON Tree View', href: `/${lang}/json/tree-view` },
        { name: 'JSON to Go', href: `/${lang}/json/to-go` },
        { name: 'JSON to C#', href: `/${lang}/json/to-csharp` },
        { name: 'JSON to Excel', href: `/${lang}/json/to-excel` },
        { name: 'JSON to Entity', href: `/${lang}/json/to-entity` },
        { name: 'JSON Colorizer', href: `/${lang}/json/colorizer` },
        { name: 'JSON Parser', href: `/${lang}/json/parser-side-by-side` },
        { name: 'JSON Format Online', href: `/${lang}/json/format-online` },
        { name: 'JSON Formatter (New)', href: `/${lang}/json/formatter-new` },
        { name: 'JSON Compress/Escape', href: `/${lang}/json/compress-escape` },
      ],
    },
    // Remaining 10 categories will be populated in later phases
  ];
}

export default function MegaMenu({ lang = 'en' }: MegaMenuProps) {
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const categories = getCategories(lang);

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
        Online Tools
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
                  className="flex items-center gap-2 rounded-md px-2 py-1.5 text-sm font-semibold text-[var(--accent-blue)] hover:bg-[var(--bg-tertiary)]"
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
