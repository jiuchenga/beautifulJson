// src/components/tools/life/DateCalculator.tsx
import { useState } from 'react';
import CopyButton from '@/components/ui/CopyButton';

export default function DateCalculator() {
  const [date1, setDate1] = useState('');
  const [date2, setDate2] = useState(new Date().toISOString().split('T')[0]);
  const [result, setResult] = useState('');
  const [error, setError] = useState('');

  function handleCalculate() {
    setError('');
    if (!date1 || !date2) { setError('Please select both dates'); return; }
    const d1 = new Date(date1);
    const d2 = new Date(date2);
    if (isNaN(d1.getTime()) || isNaN(d2.getTime())) { setError('Invalid dates'); return; }

    const diffMs = Math.abs(d2.getTime() - d1.getTime());
    const days = Math.floor(diffMs / 86400000);
    const weeks = Math.floor(days / 7);
    const months = Math.abs((d2.getFullYear() - d1.getFullYear()) * 12 + d2.getMonth() - d1.getMonth());
    const years = Math.abs(d2.getFullYear() - d1.getFullYear());

    setResult(`${days} days (${weeks} weeks and ${days % 7} days) | ${months} months | ${years} years`);
  }

  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-2xl font-bold text-[var(--text-primary)]">Date Calculator</h1>
        <p className="mt-1 text-sm text-[var(--text-secondary)]">Calculate the interval between two dates.</p>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div>
          <label className="mb-1 block text-sm font-medium text-[var(--text-secondary)]">Start Date</label>
          <input type="date" value={date1} onChange={(e) => setDate1(e.target.value)}
            className="w-full rounded-lg border border-[var(--border-primary)] bg-[var(--bg-secondary)] p-3 text-sm text-[var(--text-primary)] outline-none focus:border-[var(--accent-blue)]" />
        </div>
        <div>
          <label className="mb-1 block text-sm font-medium text-[var(--text-secondary)]">End Date</label>
          <input type="date" value={date2} onChange={(e) => setDate2(e.target.value)}
            className="w-full rounded-lg border border-[var(--border-primary)] bg-[var(--bg-secondary)] p-3 text-sm text-[var(--text-primary)] outline-none focus:border-[var(--accent-blue)]" />
        </div>
      </div>

      <button onClick={handleCalculate} className="rounded-lg bg-[var(--accent-blue)] px-6 py-2 text-sm font-medium text-white hover:opacity-90">Calculate</button>

      {error && <div className="rounded-lg border border-[var(--accent-red)]/30 bg-[var(--accent-red)]/10 px-4 py-3 text-sm text-[var(--accent-red)]">{error}</div>}

      {result && (
        <div className="rounded-lg border border-[var(--border-primary)] bg-[var(--bg-secondary)] p-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-medium text-[var(--text-secondary)]">Result</h3>
            <CopyButton text={result} />
          </div>
          <p className="mt-2 text-lg font-bold text-[var(--accent-blue)]">{result}</p>
        </div>
      )}
    </div>
  );
}
