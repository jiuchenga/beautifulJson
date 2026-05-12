// src/components/tools/json/JsonMinifier.tsx
import { useState } from 'react';
import ToolShell from '../ToolShell';
import { minifyJSON, validateJSON } from '@/lib/json-utils';

const EXAMPLE = '{\n  "name": "DevToolkit",\n  "description": "Free online developer tools",\n  "version": "1.0.0",\n  "tools": [\n    {"name": "JSON Formatter", "category": "json"},\n    {"name": "AES Encrypt", "category": "encrypt"}\n  ]\n}';

export default function JsonMinifier() {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [error, setError] = useState('');
  const [stats, setStats] = useState<{ original: number; minified: number; saved: string } | null>(null);

  function handleExecute() {
    setError('');
    setStats(null);
    if (!input.trim()) { setError('Please enter JSON'); return; }
    const validation = validateJSON(input);
    if (!validation.valid) { setError(validation.error || 'Invalid JSON'); return; }
    try {
      const result = minifyJSON(input);
      setOutput(result);
      const saved = ((1 - result.length / input.length) * 100).toFixed(1);
      setStats({ original: input.length, minified: result.length, saved: `${saved}%` });
    } catch (e) {
      setError((e as Error).message);
    }
  }

  return (
    <ToolShell
      title="JSON Minifier"
      description="Compress JSON to a single line by removing whitespace."
      inputValue={input}
      onInputChange={setInput}
      outputValue={output}
      onExecute={handleExecute}
      onClear={() => { setInput(''); setOutput(''); setError(''); setStats(null); }}
      onExample={() => setInput(EXAMPLE)}
      onDownload={() => {
        const blob = new Blob([output], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'minified.json';
        a.click();
        URL.revokeObjectURL(url);
      }}
      error={error}
    >
      {stats && (
        <div className="mt-4 flex gap-4 rounded-lg border border-[var(--border-primary)] bg-[var(--bg-secondary)] p-4">
          <div className="text-center">
            <div className="text-lg font-bold text-[var(--text-primary)]">{stats.original}</div>
            <div className="text-xs text-[var(--text-tertiary)]">Original</div>
          </div>
          <div className="text-center">
            <div className="text-lg font-bold text-[var(--accent-green)]">{stats.minified}</div>
            <div className="text-xs text-[var(--text-tertiary)]">Minified</div>
          </div>
          <div className="text-center">
            <div className="text-lg font-bold text-[var(--accent-blue)]">{stats.saved}</div>
            <div className="text-xs text-[var(--text-tertiary)]">Saved</div>
          </div>
        </div>
      )}
    </ToolShell>
  );
}
