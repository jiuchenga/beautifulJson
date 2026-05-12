// src/components/layout/MegaMenu.tsx
// Placeholder - full implementation in Task 5
import { useState } from 'react';

interface Props {
  lang: string;
}

export default function MegaMenu({ lang }: Props) {
  const [open, setOpen] = useState(false);

  return (
    <div className="relative">
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center gap-1 text-sm text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors"
      >
        Online Tools
        <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>
      {open && (
        <div className="absolute left-0 top-full mt-2 w-64 rounded-lg border border-[var(--border-primary)] bg-[var(--bg-secondary)] p-4 shadow-xl">
          <a href={`/${lang}/json/formatter`} className="block py-1 text-sm text-[var(--text-secondary)] hover:text-[var(--text-primary)]">
            JSON Formatter
          </a>
          <a href={`/${lang}/category/json`} className="block py-1 text-sm text-[var(--text-secondary)] hover:text-[var(--text-primary)]">
            All JSON Tools
          </a>
        </div>
      )}
    </div>
  );
}
