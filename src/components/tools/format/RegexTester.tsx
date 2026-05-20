// src/components/tools/format/RegexTester.tsx
import { useState, useMemo } from 'react';
import { regexTest } from '@/lib/format-utils';
import CopyButton from '@/components/ui/CopyButton';
import { useToolI18n } from '@/lib/react-i18n';

const EXAMPLE_TEXT = 'Hello World 123\nfoo@bar.com\n2024-01-15\nhttps://example.com';
const EXAMPLE_PATTERN = '\\d+';
const EXAMPLE_FLAGS = 'g';

export default function RegexTester({ title: toolTitle, description: toolDesc, lang }: { title?: string; description?: string; lang?: string } = {}) {
  const t = useToolI18n(lang);
  const [pattern, setPattern] = useState('');
  const [flags, setFlags] = useState('g');
  const [text, setText] = useState('');

  const matches = useMemo(() => {
    if (!pattern || !text) return [];
    try {
      return regexTest(pattern, flags, text);
    } catch (e) {
      return [];
    }
  }, [pattern, flags, text]);

  // Derive error from pattern/flags/text outside of useMemo
  const regexError = useMemo(() => {
    if (!pattern || !text) return '';
    try { regexTest(pattern, flags, text); return ''; }
    catch (e) { return (e as Error).message; }
  }, [pattern, flags, text]);

  // Highlight matches in the text (XSS-safe: escape HTML before wrapping)
  const highlighted = useMemo(() => {
    if (!matches.length || !text) return text;
    const esc = (s: string) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
    let result = '';
    let lastIdx = 0;
    for (const m of matches) {
      result += esc(text.slice(lastIdx, m.index));
      result += `<mark>${esc(m.match)}</mark>`;
      lastIdx = m.index + m.match.length;
    }
    result += esc(text.slice(lastIdx));
    return result;
  }, [text, matches]);

  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-2xl font-bold text-[var(--text-primary)]">{toolTitle ?? 'Regex Tester'}</h1>
        <p className="mt-1 text-sm text-[var(--text-secondary)]">{toolDesc ?? 'Test regular expressions with real-time matching and highlighting.'}</p>
      </div>

      {/* Pattern & Flags */}
      <div className="flex gap-3">
        <div className="flex-1">
          <label className="mb-1 block text-sm font-medium text-[var(--text-secondary)]">{t.pattern}</label>
          <input type="text" value={pattern} onChange={(e) => setPattern(e.target.value)}
            placeholder={t.phRegexPattern}
            className="w-full rounded-lg border border-[var(--border-primary)] bg-[var(--bg-secondary)] p-3 font-mono text-sm text-[var(--text-primary)] outline-none focus:border-[var(--accent-blue)]" />
        </div>
        <div className="w-32">
          <label className="mb-1 block text-sm font-medium text-[var(--text-secondary)]">{t.flags}</label>
          <input type="text" value={flags} onChange={(e) => setFlags(e.target.value)}
            placeholder="gimsuy"
            className="w-full rounded-lg border border-[var(--border-primary)] bg-[var(--bg-secondary)] p-3 font-mono text-sm text-[var(--text-primary)] outline-none focus:border-[var(--accent-blue)]" />
        </div>
      </div>

      {/* Test String */}
      <div>
        <div className="flex items-center justify-between mb-1">
          <label className="text-sm font-medium text-[var(--text-secondary)]">{t.testString}</label>
          <div className="flex gap-2">
            <button onClick={() => { setPattern(EXAMPLE_PATTERN); setFlags(EXAMPLE_FLAGS); setText(EXAMPLE_TEXT); }}
              className="rounded border border-[var(--border-primary)] px-2 py-1 text-xs text-[var(--text-secondary)] hover:bg-[var(--bg-tertiary)]">{t.example}</button>
            <button onClick={() => { setPattern(''); setFlags('g'); setText(''); }}
              className="rounded border border-[var(--border-primary)] px-2 py-1 text-xs text-[var(--text-secondary)] hover:bg-[var(--bg-tertiary)]">{t.clear}</button>
          </div>
        </div>
        <textarea value={text} onChange={(e) => setText(e.target.value)}
          placeholder={t.phTestText}
          className="w-full h-40 rounded-lg border border-[var(--border-primary)] bg-[var(--bg-secondary)] p-3 font-mono text-sm text-[var(--text-primary)] outline-none focus:border-[var(--accent-blue)]" />
      </div>

      {regexError && <div className="rounded-lg border border-[var(--accent-red)]/30 bg-[var(--accent-red)]/10 px-4 py-3 text-sm text-[var(--accent-red)]">{regexError}</div>}

      {/* Highlighted Result */}
      {text && pattern && (
        <div className="rounded-lg border border-[var(--border-primary)] bg-[var(--bg-secondary)] p-4">
          <h3 className="mb-2 text-sm font-medium text-[var(--text-secondary)]">{t.matchHighlight}</h3>
          <pre className="whitespace-pre-wrap font-mono text-sm text-[var(--text-primary)]" dangerouslySetInnerHTML={{ __html: highlighted }} />
        </div>
      )}

      {/* Match Results */}
      {matches.length > 0 && (
        <div className="rounded-lg border border-[var(--border-primary)] bg-[var(--bg-secondary)] p-4">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-sm font-medium text-[var(--text-secondary)]">
              {t.matchResults} ({matches.length} {matches.length === 1 ? t.match : t.matches})
            </h3>
            <CopyButton text={JSON.stringify(matches, null, 2)} lang={lang} />
          </div>
          <div className="space-y-2">
            {matches.map((m, i) => (
              <div key={i} className="flex items-center gap-3 rounded border border-[var(--border-primary)] bg-[var(--bg-tertiary)] px-3 py-2 text-sm">
                <span className="text-xs text-[var(--text-tertiary)]">#{i + 1}</span>
                <span className="font-mono text-[var(--accent-blue)]">"{m.match}"</span>
                <span className="text-xs text-[var(--text-tertiary)]">{t.indexLabel}: {m.index}</span>
                {m.groups.length > 0 && <span className="text-xs text-[var(--text-tertiary)]">{t.groups}: [{m.groups.map(g => `"${g}"`).join(', ')}]</span>}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
