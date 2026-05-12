// src/components/tools/json/JsonToExcel.tsx
import { useState } from 'react';
import { validateJSON } from '@/lib/json-utils';

const EXAMPLE = '[{"name": "Alice", "age": 30, "city": "NYC", "score": 95.5}, {"name": "Bob", "age": 25, "city": "LA", "score": 87.3}, {"name": "Charlie", "age": 35, "city": "Chicago", "score": 92.1}]';

export default function JsonToExcel() {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [error, setError] = useState('');
  const [preview, setPreview] = useState<string[][]>([]);

  function handleExecute() {
    setError('');
    setPreview([]);
    if (!input.trim()) { setError('Please enter JSON'); return; }
    const validation = validateJSON(input);
    if (!validation.valid) { setError(validation.error || 'Invalid JSON'); return; }
    try {
      const data = JSON.parse(input);
      const arr = Array.isArray(data) ? data : [data];
      if (arr.length === 0) { setError('Empty array'); return; }

      // Build table preview
      const headers = Object.keys(arr[0] as object);
      const rows = arr.map((item: Record<string, unknown>) =>
        headers.map((h) => String((item as Record<string, unknown>)[h] ?? ''))
      );
      setPreview([headers, ...rows]);
      setOutput(`${arr.length} rows ready for download`);
    } catch (e) {
      setError((e as Error).message);
    }
  }

  async function handleDownload() {
    try {
      const XLSX = await import('xlsx');
      const data = JSON.parse(input);
      const arr = Array.isArray(data) ? data : [data];
      const ws = XLSX.utils.json_to_sheet(arr);
      const wb = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');
      XLSX.writeFile(wb, 'data.xlsx');
    } catch (e) {
      setError('Failed to generate Excel: ' + (e as Error).message);
    }
  }

  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-2xl font-bold text-[var(--text-primary)]">JSON to Excel</h1>
        <p className="mt-1 text-sm text-[var(--text-secondary)]">Export JSON data to Excel (.xlsx) file.</p>
      </div>

      <textarea
        value={input}
        onChange={(e) => setInput(e.target.value)}
        placeholder="Paste JSON array here..."
        className="w-full rounded-lg border border-[var(--border-primary)] bg-[var(--bg-secondary)] p-3 font-mono text-sm text-[var(--text-primary)] outline-none focus:border-[var(--accent-blue)] h-[200px] resize-none"
      />

      <div className="flex gap-2">
        <button onClick={handleExecute} className="rounded-lg bg-[var(--accent-blue)] px-6 py-2 text-sm font-medium text-white hover:opacity-90">Preview</button>
        {preview.length > 0 && (
          <button onClick={handleDownload} className="rounded-lg bg-[var(--accent-green)] px-6 py-2 text-sm font-medium text-white hover:opacity-90">⬇ Download Excel</button>
        )}
        <button onClick={() => setInput(EXAMPLE)} className="rounded-lg border border-[var(--border-primary)] px-4 py-2 text-sm text-[var(--text-secondary)] hover:bg-[var(--bg-tertiary)]">Example</button>
        <button onClick={() => { setInput(''); setPreview([]); setOutput(''); setError(''); }} className="rounded-lg border border-[var(--border-primary)] px-4 py-2 text-sm text-[var(--text-secondary)] hover:bg-[var(--bg-tertiary)]">Clear</button>
      </div>

      {error && <div className="rounded-lg border border-[var(--accent-red)]/30 bg-[var(--accent-red)]/10 px-4 py-3 text-sm text-[var(--accent-red)]">{error}</div>}

      {preview.length > 0 && (
        <div className="overflow-x-auto rounded-lg border border-[var(--border-primary)]">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-[var(--bg-tertiary)]">
                {preview[0].map((h, i) => (
                  <th key={i} className="px-4 py-2 text-left font-medium text-[var(--accent-blue)]">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {preview.slice(1).map((row, ri) => (
                <tr key={ri} className="border-t border-[var(--border-secondary)]">
                  {row.map((cell, ci) => (
                    <td key={ci} className="px-4 py-2 text-[var(--text-secondary)]">{cell}</td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
