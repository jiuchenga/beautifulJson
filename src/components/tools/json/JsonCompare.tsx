// src/components/tools/json/JsonCompare.tsx
import { useState } from 'react';
import { compareJSON, type DiffResult } from '@/lib/json-utils';

const EXAMPLE_LEFT = '{"name": "DevToolkit", "version": "1.0", "features": ["json", "encrypt"]}';
const EXAMPLE_RIGHT = '{"name": "DevToolkit", "version": "2.0", "features": ["json", "encrypt", "qr"], "author": "DevTeam"}';

export default function JsonCompare() {
  const [left, setLeft] = useState('');
  const [right, setRight] = useState('');
  const [diffs, setDiffs] = useState<DiffResult[]>([]);
  const [error, setError] = useState('');

  function handleCompare() {
    setError('');
    setDiffs([]);
    if (!left.trim() || !right.trim()) { setError('Please enter both JSON inputs'); return; }
    try {
      setDiffs(compareJSON(left, right));
    } catch (e) {
      setError((e as Error).message);
    }
  }

  const typeColors: Record<string, string> = {
    added: 'text-[var(--accent-green)]',
    removed: 'text-[var(--accent-red)]',
    changed: 'text-[var(--accent-orange)]',
  };

  const typeBgColors: Record<string, string> = {
    added: 'bg-[var(--accent-green)]/5 border-[var(--accent-green)]/20',
    removed: 'bg-[var(--accent-red)]/5 border-[var(--accent-red)]/20',
    changed: 'bg-[var(--accent-orange)]/5 border-[var(--accent-orange)]/20',
  };

  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-2xl font-bold text-[var(--text-primary)]">JSON Compare</h1>
        <p className="mt-1 text-sm text-[var(--text-secondary)]">Compare two JSON objects and highlight differences.</p>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="mb-1 block text-sm font-medium text-[var(--text-secondary)]">Original JSON</label>
          <textarea
            value={left}
            onChange={(e) => setLeft(e.target.value)}
            placeholder="Paste original JSON..."
            className="w-full rounded-lg border border-[var(--border-primary)] bg-[var(--bg-secondary)] p-3 font-mono text-sm text-[var(--text-primary)] outline-none focus:border-[var(--accent-blue)] h-[250px] resize-none"
          />
        </div>
        <div>
          <label className="mb-1 block text-sm font-medium text-[var(--text-secondary)]">Modified JSON</label>
          <textarea
            value={right}
            onChange={(e) => setRight(e.target.value)}
            placeholder="Paste modified JSON..."
            className="w-full rounded-lg border border-[var(--border-primary)] bg-[var(--bg-secondary)] p-3 font-mono text-sm text-[var(--text-primary)] outline-none focus:border-[var(--accent-blue)] h-[250px] resize-none"
          />
        </div>
      </div>

      <div className="flex gap-2">
        <button onClick={handleCompare} className="rounded-lg bg-[var(--accent-blue)] px-6 py-2 text-sm font-medium text-white hover:opacity-90">Compare</button>
        <button onClick={() => { setLeft(EXAMPLE_LEFT); setRight(EXAMPLE_RIGHT); }} className="rounded-lg border border-[var(--border-primary)] px-4 py-2 text-sm text-[var(--text-secondary)] hover:bg-[var(--bg-tertiary)]">Example</button>
        <button onClick={() => { setLeft(''); setRight(''); setDiffs([]); setError(''); }} className="rounded-lg border border-[var(--border-primary)] px-4 py-2 text-sm text-[var(--text-secondary)] hover:bg-[var(--bg-tertiary)]">Clear</button>
      </div>

      {error && <div className="rounded-lg border border-[var(--accent-red)]/30 bg-[var(--accent-red)]/10 px-4 py-3 text-sm text-[var(--accent-red)]">{error}</div>}

      {diffs.length > 0 && (
        <div className="rounded-lg border border-[var(--border-primary)] bg-[var(--bg-secondary)] p-4">
          <h3 className="mb-3 text-sm font-semibold text-[var(--text-primary)]">
            Differences Found ({diffs.length})
          </h3>
          <div className="space-y-2">
            {diffs.map((diff, i) => (
              <div key={i} className={`rounded border px-3 py-2 text-sm ${typeBgColors[diff.type]}`}>
                <span className={`font-medium ${typeColors[diff.type]}`}>
                  {diff.type.toUpperCase()}
                </span>
                <span className="ml-2 text-[var(--text-secondary)]">{diff.path}</span>
                {diff.left !== undefined && (
                  <span className="ml-2 text-[var(--accent-red)]">- {JSON.stringify(diff.left)}</span>
                )}
                {diff.right !== undefined && (
                  <span className="ml-2 text-[var(--accent-green)]">+ {JSON.stringify(diff.right)}</span>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {diffs.length === 0 && left && right && !error && (
        <div className="rounded-lg border border-[var(--accent-green)]/30 bg-[var(--accent-green)]/10 px-4 py-3 text-sm text-[var(--accent-green)]">
          JSON objects are identical!
        </div>
      )}
    </div>
  );
}
