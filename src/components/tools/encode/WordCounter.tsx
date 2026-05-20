// src/components/tools/encode/WordCounter.tsx
import { useState, useMemo } from 'react';
import { countWords, type WordCount } from '@/lib/convert-utils';
import { useToolI18n } from '@/lib/react-i18n';

export default function WordCounter({ title: toolTitle, description: toolDesc, lang }: { title?: string; description?: string; lang?: string } = {}) {
  const t = useToolI18n(lang);
  const [input, setInput] = useState('');

  const stats: WordCount = useMemo(() => countWords(input), [input]);

  const statItems = [
    { label: t.characterCount, value: stats.characters },
    { label: t.charactersNoSpaces, value: stats.charactersNoSpaces },
    { label: t.wordCount, value: stats.words },
    { label: t.lineCount, value: stats.lines },
    { label: t.paragraphCount, value: stats.paragraphs },
    { label: t.byteCount + ' (UTF-8)', value: stats.bytes },
  ];

  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-2xl font-bold text-[var(--text-primary)]">{toolTitle ?? 'Online Word Counter'}</h1>
        <p className="mt-1 text-sm text-[var(--text-secondary)]">{toolDesc ?? 'Count characters, words, lines, paragraphs, and bytes in real-time.'}</p>
      </div>

      <div className="grid grid-cols-3 gap-3 sm:grid-cols-6">
        {statItems.map((s) => (
          <div key={s.label} className="rounded-lg border border-[var(--border-primary)] bg-[var(--bg-secondary)] p-3 text-center">
            <div className="text-2xl font-bold text-[var(--accent-blue)]">{s.value}</div>
            <div className="text-xs text-[var(--text-tertiary)]">{s.label}</div>
          </div>
        ))}
      </div>

      <textarea value={input} onChange={(e) => setInput(e.target.value)}
        placeholder={t.placeholderText}
        className="w-full h-64 rounded-lg border border-[var(--border-primary)] bg-[var(--bg-secondary)] p-4 font-mono text-sm text-[var(--text-primary)] outline-none focus:border-[var(--accent-blue)]" />

      <button onClick={() => setInput('')}
        className="rounded-lg border border-[var(--border-primary)] px-4 py-2 text-sm text-[var(--text-secondary)] hover:bg-[var(--bg-tertiary)]">{t.clear}</button>
    </div>
  );
}
