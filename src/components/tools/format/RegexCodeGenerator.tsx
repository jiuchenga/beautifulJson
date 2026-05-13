// src/components/tools/format/RegexCodeGenerator.tsx
import { useState } from 'react';
import ToolShell from '../ToolShell';
import OptionBar, { SelectOption } from '../shared/OptionBar';
import { generateRegexCode } from '@/lib/format-utils';
import CopyButton from '@/components/ui/CopyButton';

const EXAMPLE_PATTERN = '\\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\\.[A-Z|a-z]{2,}\\b';
const LANGUAGES = [
  { label: 'JavaScript', value: 'javascript' },
  { label: 'Python', value: 'python' },
  { label: 'Java', value: 'java' },
  { label: 'Go', value: 'go' },
  { label: 'PHP', value: 'php' },
  { label: 'Ruby', value: 'ruby' },
];

export default function RegexCodeGenerator() {
  const [pattern, setPattern] = useState('');
  const [flags, setFlags] = useState('g');
  const [language, setLanguage] = useState('javascript');
  const [error, setError] = useState('');

  const code = (() => {
    if (!pattern.trim()) return '';
    setError('');
    try {
      return generateRegexCode(pattern, flags, language);
    } catch (e) {
      setError((e as Error).message);
      return '';
    }
  })();

  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-2xl font-bold text-[var(--text-primary)]">Regex Code Generator</h1>
        <p className="mt-1 text-sm text-[var(--text-secondary)]">Generate regex code for JavaScript, Python, Java, Go, PHP, Ruby.</p>
      </div>

      <OptionBar label="Language">
        <SelectOption label="Language" value={language} options={LANGUAGES} onChange={setLanguage} />
      </OptionBar>

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

      <div className="flex gap-2">
        <button onClick={() => setPattern(EXAMPLE_PATTERN)}
          className="rounded-lg border border-[var(--border-primary)] px-4 py-2 text-sm text-[var(--text-secondary)] hover:bg-[var(--bg-tertiary)]">Example: Email</button>
        <button onClick={() => { setPattern(''); setFlags('g'); setError(''); }}
          className="rounded-lg border border-[var(--border-primary)] px-4 py-2 text-sm text-[var(--text-secondary)] hover:bg-[var(--bg-tertiary)]">Clear</button>
      </div>

      {error && <div className="rounded-lg border border-[var(--accent-red)]/30 bg-[var(--accent-red)]/10 px-4 py-3 text-sm text-[var(--accent-red)]">{error}</div>}

      {code && (
        <div className="rounded-lg border border-[var(--border-primary)] bg-[var(--bg-secondary)] p-4">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-sm font-medium text-[var(--text-secondary)]">{language.charAt(0).toUpperCase() + language.slice(1)} Code</h3>
            <CopyButton text={code} />
          </div>
          <pre className="whitespace-pre-wrap rounded bg-[var(--bg-tertiary)] p-3 font-mono text-sm text-[var(--text-primary)]">{code}</pre>
        </div>
      )}
    </div>
  );
}
