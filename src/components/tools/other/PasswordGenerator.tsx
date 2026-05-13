// src/components/tools/other/PasswordGenerator.tsx
import { useState } from 'react';
import CopyButton from '@/components/ui/CopyButton';

export default function PasswordGenerator() {
  const [length, setLength] = useState(16);
  const [count, setCount] = useState(5);
  const [useUpper, setUseUpper] = useState(true);
  const [useLower, setUseLower] = useState(true);
  const [useDigits, setUseDigits] = useState(true);
  const [useSymbols, setUseSymbols] = useState(true);
  const [passwords, setPasswords] = useState<string[]>([]);

  function generate() {
    let chars = '';
    if (useUpper) chars += 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    if (useLower) chars += 'abcdefghijklmnopqrstuvwxyz';
    if (useDigits) chars += '0123456789';
    if (useSymbols) chars += '!@#$%^&*()_+-=[]{}|;:,.<>?';
    if (!chars) return;

    const result: string[] = [];
    for (let i = 0; i < count; i++) {
      const arr = new Uint32Array(length);
      crypto.getRandomValues(arr);
      result.push(Array.from(arr, v => chars[v % chars.length]).join(''));
    }
    setPasswords(result);
  }

  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-2xl font-bold text-[var(--text-primary)]">Password Generator</h1>
        <p className="mt-1 text-sm text-[var(--text-secondary)]">Generate secure random passwords.</p>
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <div className="space-y-3">
          <div>
            <label className="mb-1 block text-sm font-medium text-[var(--text-secondary)]">Length: {length}</label>
            <input type="range" min={4} max={128} value={length} onChange={(e) => setLength(Number(e.target.value))} className="w-full" />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-[var(--text-secondary)]">Count: {count}</label>
            <input type="range" min={1} max={20} value={count} onChange={(e) => setCount(Number(e.target.value))} className="w-full" />
          </div>
          <div className="space-y-2">
            {[
              { label: 'Uppercase (A-Z)', checked: useUpper, set: setUseUpper },
              { label: 'Lowercase (a-z)', checked: useLower, set: setUseLower },
              { label: 'Digits (0-9)', checked: useDigits, set: setUseDigits },
              { label: 'Symbols (!@#$...)', checked: useSymbols, set: setUseSymbols },
            ].map((opt) => (
              <label key={opt.label} className="flex items-center gap-2 text-sm text-[var(--text-secondary)]">
                <input type="checkbox" checked={opt.checked} onChange={(e) => opt.set(e.target.checked)}
                  className="rounded border-[var(--border-primary)] text-[var(--accent-blue)]" />
                {opt.label}
              </label>
            ))}
          </div>
          <button onClick={generate} className="w-full rounded-lg bg-[var(--accent-blue)] py-2 text-sm font-medium text-white hover:opacity-90">Generate Passwords</button>
        </div>

        <div className="space-y-2">
          {passwords.map((pw, i) => (
            <div key={i} className="flex items-center justify-between rounded-lg border border-[var(--border-primary)] bg-[var(--bg-secondary)] px-3 py-2">
              <code className="text-sm text-[var(--text-primary)] break-all">{pw}</code>
              <CopyButton text={pw} />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
