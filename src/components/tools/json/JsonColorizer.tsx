// src/components/tools/json/JsonColorizer.tsx
import { useState } from 'react';
import { validateJSON } from '@/lib/json-utils';
import CopyButton from '@/components/ui/CopyButton';
import { useToolI18n } from '@/lib/react-i18n';

const EXAMPLE = '{"colors": {"primary": "#58A6FF", "success": "#3FB950", "warning": "#D29922"}, "enabled": true, "count": 42}';

function colorizeJSON(json: string): string {
  return json.replace(
    /("(?:\\.|[^"\\])*")\s*:/g,
    '<span style="color: var(--accent-blue)">$1</span>:'
  ).replace(
    /:\s*("(?:\\.|[^"\\])*")/g,
    ': <span style="color: var(--accent-green)">$1</span>'
  ).replace(
    /:\s*(\d+\.?\d*)/g,
    ': <span style="color: var(--accent-orange)">$1</span>'
  ).replace(
    /:\s*(true|false)/g,
    ': <span style="color: var(--accent-purple)">$1</span>'
  ).replace(
    /:\s*(null)/g,
    ': <span style="color: var(--text-tertiary)">$1</span>'
  );
}

export default function JsonColorizer({ title: toolTitle, description: toolDesc, lang }: { title?: string; description?: string; lang?: string } = {}) {
  const t = useToolI18n(lang);
  const [input, setInput] = useState('');
  const [colored, setColored] = useState('');
  const [error, setError] = useState('');

  function handleColorize() {
    setError('');
    if (!input.trim()) { setError(t.pleaseEnterJson); return; }
    const validation = validateJSON(input);
    if (!validation.valid) { setError(validation.error || 'Invalid JSON'); return; }
    try {
      const formatted = JSON.stringify(JSON.parse(input), null, 2);
      setColored(colorizeJSON(formatted));
    } catch (e) {
      setError((e as Error).message);
    }
  }

  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-2xl font-bold text-[var(--text-primary)]">{toolTitle ?? 'JSON Colorizer'}</h1>
        <p className="mt-1 text-sm text-[var(--text-secondary)]">{toolDesc ?? 'JSON syntax coloring with hierarchy preview.'}</p>
      </div>

      <textarea
        value={input}
        onChange={(e) => setInput(e.target.value)}
        placeholder={t.phPasteJson}
        className="w-full rounded-lg border border-[var(--border-primary)] bg-[var(--bg-secondary)] p-3 font-mono text-sm text-[var(--text-primary)] outline-none focus:border-[var(--accent-blue)] h-[200px] resize-none"
      />

      <div className="flex gap-2">
        <button onClick={handleColorize} className="rounded-lg bg-[var(--accent-blue)] px-6 py-2 text-sm font-medium text-white hover:opacity-90">{t.colorize}</button>
        <button onClick={() => setInput(EXAMPLE)} className="rounded-lg border border-[var(--border-primary)] px-4 py-2 text-sm text-[var(--text-secondary)] hover:bg-[var(--bg-tertiary)]">{t.example}</button>
        <button onClick={() => { setInput(''); setColored(''); setError(''); }} className="rounded-lg border border-[var(--border-primary)] px-4 py-2 text-sm text-[var(--text-secondary)] hover:bg-[var(--bg-tertiary)]">{t.clear}</button>
      </div>

      {error && <div className="rounded-lg border border-[var(--accent-red)]/30 bg-[var(--accent-red)]/10 px-4 py-3 text-sm text-[var(--accent-red)]">{error}</div>}

      {colored && (
        <div className="rounded-lg border border-[var(--border-primary)] bg-[var(--bg-secondary)] p-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-[var(--text-secondary)]">{t.colorizedOutput}</span>
            <CopyButton text={JSON.stringify(JSON.parse(input), null, 2)} lang={lang} />
          </div>
          <pre className="font-mono text-sm leading-relaxed overflow-x-auto" dangerouslySetInnerHTML={{ __html: colored }} />
        </div>
      )}
    </div>
  );
}
