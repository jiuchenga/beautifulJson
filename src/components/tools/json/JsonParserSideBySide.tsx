// src/components/tools/json/JsonParserSideBySide.tsx
import { useState } from 'react';
import { formatJSON, validateJSON, analyzeJSONTypes } from '@/lib/json-utils';

const EXAMPLE = '{"status": "ok", "data": {"users": [{"id": 1, "name": "Alice"}, {"id": 2, "name": "Bob"}]}, "meta": {"page": 1, "total": 2}}';

export default function JsonParserSideBySide() {
  const [input, setInput] = useState('');
  const [formatted, setFormatted] = useState('');
  const [types, setTypes] = useState('');
  const [error, setError] = useState('');

  function handleExecute() {
    setError('');
    if (!input.trim()) { setError('Please enter JSON'); return; }
    const validation = validateJSON(input);
    if (!validation.valid) { setError(validation.error || 'Invalid JSON'); return; }
    try {
      setFormatted(formatJSON(input, 2, false));
      setTypes(analyzeJSONTypes(input));
    } catch (e) {
      setError((e as Error).message);
    }
  }

  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-2xl font-bold text-[var(--text-primary)]">JSON Parser (Side by Side)</h1>
        <p className="mt-1 text-sm text-[var(--text-secondary)]">Parse JSON with left-right split view.</p>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="mb-1 block text-sm font-medium text-[var(--text-secondary)]">Raw JSON</label>
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Paste raw JSON..."
            className="w-full rounded-lg border border-[var(--border-primary)] bg-[var(--bg-secondary)] p-3 font-mono text-sm text-[var(--text-primary)] outline-none focus:border-[var(--accent-blue)] h-[350px] resize-none"
          />
        </div>
        <div>
          <label className="mb-1 block text-sm font-medium text-[var(--text-secondary)]">Parsed Output</label>
          <pre className="w-full rounded-lg border border-[var(--border-primary)] bg-[var(--bg-secondary)] p-3 font-mono text-sm text-[var(--text-primary)] h-[350px] overflow-auto">
            {formatted}
          </pre>
        </div>
      </div>

      <div className="flex gap-2">
        <button onClick={handleExecute} className="rounded-lg bg-[var(--accent-blue)] px-6 py-2 text-sm font-medium text-white hover:opacity-90">Parse</button>
        <button onClick={() => setInput(EXAMPLE)} className="rounded-lg border border-[var(--border-primary)] px-4 py-2 text-sm text-[var(--text-secondary)] hover:bg-[var(--bg-tertiary)]">Example</button>
        <button onClick={() => { setInput(''); setFormatted(''); setTypes(''); setError(''); }} className="rounded-lg border border-[var(--border-primary)] px-4 py-2 text-sm text-[var(--text-secondary)] hover:bg-[var(--bg-tertiary)]">Clear</button>
      </div>

      {error && <div className="rounded-lg border border-[var(--accent-red)]/30 bg-[var(--accent-red)]/10 px-4 py-3 text-sm text-[var(--accent-red)]">{error}</div>}

      {types && (
        <div className="rounded-lg border border-[var(--border-primary)] bg-[var(--bg-secondary)] p-4">
          <h3 className="mb-2 text-sm font-semibold text-[var(--accent-blue)]">Type Analysis</h3>
          <pre className="text-xs text-[var(--text-secondary)] whitespace-pre-wrap">{types}</pre>
        </div>
      )}
    </div>
  );
}
