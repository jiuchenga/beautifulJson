// src/components/tools/encode/TimestampConverter.tsx
import { useState, useEffect } from 'react';
import { timestampToDate, dateToTimestamp, getCurrentTimestamp } from '@/lib/convert-utils';
import CopyButton from '@/components/ui/CopyButton';
import { useToolI18n } from '@/lib/react-i18n';

export default function TimestampConverter({ title: toolTitle, description: toolDesc, lang }: { title?: string; description?: string; lang?: string } = {}) {
  const t = useToolI18n(lang);
  const [timestamp, setTimestamp] = useState('');
  const [dateStr, setDateStr] = useState('');
  const [error, setError] = useState('');
  const [now, setNow] = useState(getCurrentTimestamp());

  useEffect(() => {
    const timer = setInterval(() => setNow(getCurrentTimestamp()), 1000);
    return () => clearInterval(timer);
  }, []);

  function handleTsToDate() {
    setError('');
    if (!timestamp.trim()) { setError(t.pleaseEnterTimestamp); return; }
    try {
      setDateStr(timestampToDate(timestamp));
    } catch (e) { setError((e as Error).message); }
  }

  function handleDateToTs() {
    setError('');
    if (!dateStr.trim()) { setError(t.pleaseEnterDate); return; }
    try {
      setTimestamp(dateToTimestamp(dateStr));
    } catch (e) { setError((e as Error).message); }
  }

  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-2xl font-bold text-[var(--text-primary)]">{toolTitle ?? 'Unix Timestamp Converter'}</h1>
        <p className="mt-1 text-sm text-[var(--text-secondary)]">{toolDesc ?? 'Convert between Unix timestamps and human-readable dates.'}</p>
      </div>

      {/* Current timestamp */}
      <div className="rounded-lg border border-[var(--border-primary)] bg-[var(--bg-secondary)] p-4">
        <h3 className="mb-2 text-sm font-medium text-[var(--text-secondary)]">{t.currentDate}</h3>
        <div className="grid grid-cols-3 gap-4 text-sm">
          <div>
            <span className="text-[var(--text-tertiary)]">{t.seconds}:</span>
            <span className="ml-2 font-mono text-[var(--accent-blue)]">{now.seconds}</span>
            <CopyButton text={String(now.seconds)} lang={lang} />
          </div>
          <div>
            <span className="text-[var(--text-tertiary)]">{t.milliseconds}:</span>
            <span className="ml-2 font-mono text-[var(--accent-blue)]">{now.milliseconds}</span>
            <CopyButton text={String(now.milliseconds)} lang={lang} />
          </div>
          <div>
            <span className="text-[var(--text-tertiary)]">{t.iso}:</span>
            <span className="ml-2 font-mono text-[var(--accent-blue)]">{now.iso}</span>
            <CopyButton text={now.iso} lang={lang} />
          </div>
        </div>
      </div>

      {/* Timestamp → Date */}
      <div className="rounded-lg border border-[var(--border-primary)] bg-[var(--bg-secondary)] p-4 space-y-3">
        <h3 className="text-sm font-medium text-[var(--text-secondary)]">{t.timestampToDate}</h3>
        <div className="flex gap-3">
          <input type="text" value={timestamp} onChange={(e) => setTimestamp(e.target.value)}
            placeholder={t.enterTimestamp}
            className="flex-1 rounded-lg border border-[var(--border-primary)] bg-[var(--bg-tertiary)] p-3 font-mono text-sm text-[var(--text-primary)] outline-none focus:border-[var(--accent-blue)]" />
          <button onClick={handleTsToDate} className="rounded-lg bg-[var(--accent-blue)] px-6 py-2 text-sm font-medium text-white hover:opacity-90">{t.convert}</button>
        </div>
      </div>

      {/* Date → Timestamp */}
      <div className="rounded-lg border border-[var(--border-primary)] bg-[var(--bg-secondary)] p-4 space-y-3">
        <h3 className="text-sm font-medium text-[var(--text-secondary)]">{t.dateToTimestamp}</h3>
        <div className="flex gap-3">
          <input type="text" value={dateStr} onChange={(e) => setDateStr(e.target.value)}
            placeholder={t.enterDate}
            className="flex-1 rounded-lg border border-[var(--border-primary)] bg-[var(--bg-tertiary)] p-3 font-mono text-sm text-[var(--text-primary)] outline-none focus:border-[var(--accent-blue)]" />
          <button onClick={handleDateToTs} className="rounded-lg bg-[var(--accent-blue)] px-6 py-2 text-sm font-medium text-white hover:opacity-90">{t.convert}</button>
        </div>
      </div>

      {error && <div className="rounded-lg border border-[var(--accent-red)]/30 bg-[var(--accent-red)]/10 px-4 py-3 text-sm text-[var(--accent-red)]">{error}</div>}

      {/* Quick fill */}
      <div className="flex gap-2">
        <button onClick={() => { setTimestamp(String(now.seconds)); setDateStr(''); setError(''); }}
          className="rounded-lg border border-[var(--border-primary)] px-4 py-2 text-sm text-[var(--text-secondary)] hover:bg-[var(--bg-tertiary)]">{t.useCurrent} (s)</button>
        <button onClick={() => { setTimestamp(String(now.milliseconds)); setDateStr(''); setError(''); }}
          className="rounded-lg border border-[var(--border-primary)] px-4 py-2 text-sm text-[var(--text-secondary)] hover:bg-[var(--bg-tertiary)]">{t.useCurrent} (ms)</button>
        <button onClick={() => { setTimestamp(''); setDateStr(''); setError(''); }}
          className="rounded-lg border border-[var(--border-primary)] px-4 py-2 text-sm text-[var(--text-secondary)] hover:bg-[var(--bg-tertiary)]">{t.clear}</button>
      </div>
    </div>
  );
}
