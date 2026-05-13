// src/components/tools/encode/UnitConverter.tsx
import { useState, useMemo, useEffect } from 'react';
import { convertUnit, unitTables, type UnitCategory } from '@/lib/convert-utils';

const CATEGORY_LABELS: Record<UnitCategory, string> = {
  length: 'Length', area: 'Area', volume: 'Volume', temperature: 'Temperature',
  weight: 'Weight', speed: 'Speed', time: 'Time', data: 'Data Storage',
  angle: 'Angle', energy: 'Energy', power: 'Power', pressure: 'Pressure',
  density: 'Density', force: 'Force',
};

export default function UnitConverter() {
  const [category, setCategory] = useState<UnitCategory>('length');
  const [fromUnit, setFromUnit] = useState('');
  const [toUnit, setToUnit] = useState('');
  const [value, setValue] = useState('');

  const units = useMemo(() => {
    const table = unitTables[category];
    const keys = Object.keys(table);
    return keys.map((k) => ({ key: k, ...table[k] }));
  }, [category]);

  // Reset unit selection when category changes
  useEffect(() => {
    const keys = Object.keys(unitTables[category]);
    setFromUnit(keys[0]);
    setToUnit(keys.length > 1 ? keys[1] : keys[0]);
  }, [category]);

  const result = useMemo(() => {
    if (!value || !fromUnit || !toUnit) return null;
    const num = parseFloat(value);
    if (isNaN(num)) return null;
    try {
      const raw = convertUnit(num, category, fromUnit, toUnit);
      // Format: remove trailing zeros after decimal point, but keep integer part intact
      const formatted = parseFloat(raw.toPrecision(10));
      return String(formatted);
    } catch { return null; }
  }, [value, category, fromUnit, toUnit]);

  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-2xl font-bold text-[var(--text-primary)]">Unit Converter</h1>
        <p className="mt-1 text-sm text-[var(--text-secondary)]">Convert between 14 categories of units: length, area, volume, temperature, and more.</p>
      </div>

      {/* Category selector */}
      <div className="flex flex-wrap gap-2">
        {(Object.entries(CATEGORY_LABELS) as [UnitCategory, string][]).map(([key, label]) => (
          <button key={key} onClick={() => { setCategory(key); }}
            className={`rounded-lg px-3 py-1.5 text-sm ${category === key ? 'bg-[var(--accent-blue)] text-white' : 'border border-[var(--border-primary)] text-[var(--text-secondary)] hover:bg-[var(--bg-tertiary)]'}`}>
            {label}
          </button>
        ))}
      </div>

      {/* Converter */}
      <div className="rounded-lg border border-[var(--border-primary)] bg-[var(--bg-secondary)] p-4 space-y-4">
        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
          <div>
            <label className="mb-1 block text-sm font-medium text-[var(--text-secondary)]">From</label>
            <select value={fromUnit} onChange={(e) => setFromUnit(e.target.value)}
              className="w-full rounded-md border border-[var(--border-primary)] bg-[var(--bg-tertiary)] px-3 py-2 text-sm text-[var(--text-primary)] outline-none focus:border-[var(--accent-blue)]">
              {units.map((u) => <option key={u.key} value={u.key}>{u.label}</option>)}
            </select>
          </div>
          <div className="flex items-end justify-center">
            <span className="text-2xl text-[var(--text-tertiary)]">→</span>
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-[var(--text-secondary)]">To</label>
            <select value={toUnit} onChange={(e) => setToUnit(e.target.value)}
              className="w-full rounded-md border border-[var(--border-primary)] bg-[var(--bg-tertiary)] px-3 py-2 text-sm text-[var(--text-primary)] outline-none focus:border-[var(--accent-blue)]">
              {units.map((u) => <option key={u.key} value={u.key}>{u.label}</option>)}
            </select>
          </div>
        </div>

        <div>
          <label className="mb-1 block text-sm font-medium text-[var(--text-secondary)]">Value</label>
          <input type="text" value={value} onChange={(e) => setValue(e.target.value)}
            placeholder="Enter value..."
            className="w-full rounded-lg border border-[var(--border-primary)] bg-[var(--bg-tertiary)] p-3 font-mono text-sm text-[var(--text-primary)] outline-none focus:border-[var(--accent-blue)]" />
        </div>

        {result && (
          <div className="rounded-lg bg-[var(--bg-tertiary)] p-4 text-center">
            <span className="text-3xl font-bold text-[var(--accent-blue)]">{result}</span>
            <span className="ml-2 text-sm text-[var(--text-tertiary)]">{units.find(u => u.key === toUnit)?.label}</span>
          </div>
        )}
      </div>

      <button onClick={() => { const tmp = fromUnit; setFromUnit(toUnit); setToUnit(tmp); }}
        className="rounded-lg border border-[var(--border-primary)] px-4 py-2 text-sm text-[var(--text-secondary)] hover:bg-[var(--bg-tertiary)]">Swap Units</button>
    </div>
  );
}
