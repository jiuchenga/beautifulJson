// src/components/tools/format/RegexTester.tsx
import { useState, useMemo } from 'react';
import ToolShell from '../ToolShell';
import { regexTest, type RegexMatch } from '@/lib/format-utils';
import CopyButton from '@/components/ui/CopyButton';

const EXAMPLE_TEXT = 'Hello World 123\nfoo@bar.com\n2024-01-15\nhttps://example.com';
const EXAMPLE_PATTERN = '\\d+';
const EXAMPLE_FLAGS = 'g';

export default function RegexTester() {
  const [pattern, setPattern] = useState('');
  const [flags, setFlags] = useState('g');
  const [text, setText] = useState('');
  const [error, setError] = useState('');

  const matches = useMemo(() => {
    if (!pattern || !text) return [];
    setError('');
    try {
      return regexTest(pattern, flags, text);
    } catch (e) {
      setError((e as Error).message);
      return [];
    }
  }, [pattern, flags, text]);

  // Highlight matches in the text
  const highlighted = useMemo(() => {
    if (!matches.length || !text) return text;
    let result = '';
    let lastIdx = 0;
    for (const m of matches) {
      result += text.slice(lastIdx, m.index);
      result += `<mark>${m.match}</mark>`;
      lastIdx = m.index + m.match.length;
    }
    result += text.slice(lastIdx);
    return result;
  }, [text, matches]);

  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-2xl font-bold text-[var(--text-primary)]">Regex Tester</h1>
        <p className="mt-1 text-sm text-[var(--text-secondary)]">Test regular expressions with real-time matching and highlighting.</p>
      </div>

      {/* Pattern & Flags */}
      <div className="flex gap-3">
        <div className="flex-1">
          <label className="mb-1 block text-sm font-medium text-[var(--text-secondary)]">Pattern</label>
          <input type="text" value={pattern} onChange={(e) => setPattern(e.target.value)}
            placeholder="Enter regex pattern..."
            className="w-full rounded-lg border border-[var(--border-primary)] bg-[var(--bg-secondary)] p-3 font-mono text-sm text-[var(--text-primary)] outline-none focus:border-[var(--accent-blue)]" />
        </div>
        <div className="w-32">
          <label className="mb-1 block text-sm font-medium text-[var(--text-secondary)]">Flags</label>
          <input type="text" value={flags} onChange={(e) => setFlags(e.target.value)}
            placeholder="gimsuy"
            className="w-full rounded-lg border border-[var(--border-primary)] bg-[var(--bg-secondary)] p-3 font-mono text-sm text-[var(--text-primary)] outline-none focus:border-[var(--accent-blue)]" />
        </div>
      </div>

      {/* Test String */}
      <div>
        <div className="flex items-center justify-between mb-1">
          <label className="text-sm font-medium text-[var(--text-secondary)]">Test String</label>
          <div className="flex gap-2">
            <button onClick={() => { setPattern(EXAMPLE_PATTERN); setFlags(EXAMPLE_FLAGS); setText(EXAMPLE_TEXT); }}
              className="rounded border border-[var(--border-primary)] px-2 py-1 text-xs text-[var(--text-secondary)] hover:bg-[var(--bg-tertiary)]">Example</button>
            <button onClick={() => { setPattern(''); setFlags('g'); setText(''); setError(''); }}
              className="rounded border border-[var(--border-primary)] px-2 py-1 text-xs text-[var(--text-secondary)] hover:bg-[var(--bg-tertiary)]">Clear</button>
          </div>
        </div>
        <textarea value={text} onChange={(e) => setText(e.target.value)}
          placeholder="Enter text to test against..."
          className="w-full h-40 rounded-lg border border-[var(--border-primary)] bg-[var(--bg-secondary)] p-3 font-mono text-sm text-[var(--text-primary)] outline-none focus:border-[var(--accent-blue)]" />
      </div>

      {error && <div className="rounded-lg border border-[var(--accent-red)]/30 bg-[var(--accent-red)]/10 px-4 py-3 text-sm text-[var(--accent-red)]">{error}</div>}

      {/* Highlighted Result */}
      {text && pattern && (
        <div className="rounded-lg border border-[var(--border-primary)] bg-[var(--bg-secondary)] p-4">
          <h3 className="mb-2 text-sm font-medium text-[var(--text-secondary)]">Match Highlight</h3>
          <pre className="whitespace-pre-wrap font-mono text-sm text-[var(--text-primary)]" dangerouslySetInnerHTML={{ __html: highlighted }} />
        </div>
      )}

      {/* Match Results */}
      {matches.length > 0 && (
        <div className="rounded-lg border border-[var(--border-primary)] bg-[var(--bg-secondary)] p-4">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-sm font-medium text-[var(--text-secondary)]">
              Match Results ({matches.length} {matches.length === 1 ? 'match' : 'matches'})
            </h3>
            <CopyButton text={JSON.stringify(matches, null, 2)} />
          </div>
          <div className="space-y-2">
            {matches.map((m, i) => (
              <div key={i} className="flex items-center gap-3 rounded border border-[var(--border-primary)] bg-[var(--bg-tertiary)] px-3 py-2 text-sm">
                <span className="text-xs text-[var(--text-tertiary)]">#{i + 1}</span>
                <span className="font-mono text-[var(--accent-blue)]">"{m.match}"</span>
                <span className="text-xs text-[var(--text-tertiary)]">index: {m.index}</span>
                {m.groups.length > 0 && <span className="text-xs text-[var(--text-tertiary)]">groups: [{m.groups.map(g => `"${g}"`).join(', ')}]</span>}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
