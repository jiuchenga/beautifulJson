// src/components/tools/other/PasswordGenerator.tsx
import { useState } from 'react';
import CopyButton from '@/components/ui/CopyButton';
import { useToolI18n } from '@/lib/react-i18n';

export default function PasswordGenerator({ title: toolTitle, description: toolDesc, lang }: { title?: string; description?: string; lang?: string } = {}) {
  const t = useToolI18n(lang);
  const [length, setLength] = useState(16);
  const [count, setCount] = useState(5);
  const [useUpper, setUseUpper] = useState(true);
  const [useLower, setUseLower] = useState(true);
  const [useDigits, setUseDigits] = useState(true);
  const [useSymbols, setUseSymbols] = useState(true);
  const [passwords, setPasswords] = useState<string[]>([]);
  const [error, setError] = useState('');

  function generate() {
    let chars = '';
    if (useUpper) chars += 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    if (useLower) chars += 'abcdefghijklmnopqrstuvwxyz';
    if (useDigits) chars += '0123456789';
    if (useSymbols) chars += '!@#$%^&*()_+-=[]{}|;:,.<>?';
    if (!chars) { setError(t.pleaseSelectType); return; }
    setError('');

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
        <h1 className="text-2xl font-bold text-[var(--text-primary)]">{toolTitle ?? 'Password Generator'}</h1>
        <p className="mt-1 text-sm text-[var(--text-secondary)]">{toolDesc ?? 'Generate secure random passwords.'}</p>
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <div className="space-y-3">
          <div>
            <label className="mb-1 block text-sm font-medium text-[var(--text-secondary)]">{t.passwordLength}: {length}</label>
            <input type="range" min={4} max={128} value={length} onChange={(e) => setLength(Number(e.target.value))} className="w-full" />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-[var(--text-secondary)]">{t.generate}: {count}</label>
            <input type="range" min={1} max={20} value={count} onChange={(e) => setCount(Number(e.target.value))} className="w-full" />
          </div>
          <div className="space-y-2">
            {[
              { label: t.uppercase, checked: useUpper, set: setUseUpper },
              { label: t.lowercase, checked: useLower, set: setUseLower },
              { label: t.digitsLabel, checked: useDigits, set: setUseDigits },
              { label: t.symbolsExtended, checked: useSymbols, set: setUseSymbols },
            ].map((opt) => (
              <label key={opt.label} className="flex items-center gap-2 text-sm text-[var(--text-secondary)]">
                <input type="checkbox" checked={opt.checked} onChange={(e) => opt.set(e.target.checked)}
                  className="rounded border-[var(--border-primary)] text-[var(--accent-blue)]" />
                {opt.label}
              </label>
            ))}
          </div>
          <button onClick={generate} className="w-full rounded-lg bg-[var(--accent-blue)] py-2 text-sm font-medium text-white hover:opacity-90">{t.generatePassword}</button>
        </div>

        <div className="space-y-2">
          {error && <div className="rounded-lg border border-[var(--accent-red)]/30 bg-[var(--accent-red)]/10 px-4 py-3 text-sm text-[var(--accent-red)]">{error}</div>}
          {passwords.map((pw, i) => (
            <div key={i} className="flex items-center justify-between rounded-lg border border-[var(--border-primary)] bg-[var(--bg-secondary)] px-3 py-2">
              <code className="text-sm text-[var(--text-primary)] break-all">{pw}</code>
              <CopyButton text={pw} lang={lang} />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
