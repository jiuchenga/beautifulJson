// src/components/tools/qr/QrCodeApiTest.tsx
import { useState } from 'react';
import QRCode from 'qrcode';
import CopyButton from '@/components/ui/CopyButton';
import { useToolI18n } from '@/lib/react-i18n';

export default function QrCodeApiTest({ title: toolTitle, description: toolDesc, lang }: { title?: string; description?: string; lang?: string } = {}) {
  const t = useToolI18n(lang);
  const [text, setText] = useState('');
  const [size, setSize] = useState('200');
  const [format, setFormat] = useState<'svg' | 'dataurl'>('svg');
  const [result, setResult] = useState('');
  const [error, setError] = useState('');

  async function handleGenerate() {
    setError('');
    if (!text.trim()) { setError(t.pleaseEnter); return; }
    try {
      if (format === 'svg') {
        const svg = await QRCode.toString(text, { type: 'svg', width: Number(size) || 200 });
        setResult(svg);
      } else {
        const url = await QRCode.toDataURL(text, { width: Number(size) || 200 });
        setResult(url);
      }
    } catch (e) { setError((e as Error).message); }
  }

  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-2xl font-bold text-[var(--text-primary)]">{toolTitle ?? 'QR Code API Test'}</h1>
        <p className="mt-1 text-sm text-[var(--text-secondary)]">{toolDesc ?? 'Generate QR codes via API-style parameters and get SVG or data URL output.'}</p>
      </div>

      <div className="grid grid-cols-3 gap-3">
        <div>
          <label className="mb-1 block text-sm font-medium text-[var(--text-secondary)]">{t.content}</label>
          <input type="text" value={text} onChange={(e) => setText(e.target.value)} placeholder={t.phEnterText}
            className="w-full rounded-lg border border-[var(--border-primary)] bg-[var(--bg-secondary)] p-3 text-sm text-[var(--text-primary)] outline-none focus:border-[var(--accent-blue)]" />
        </div>
        <div>
          <label className="mb-1 block text-sm font-medium text-[var(--text-secondary)]">{t.size}</label>
          <input type="text" value={size} onChange={(e) => setSize(e.target.value)} placeholder="200"
            className="w-full rounded-lg border border-[var(--border-primary)] bg-[var(--bg-secondary)] p-3 text-sm text-[var(--text-primary)] outline-none focus:border-[var(--accent-blue)]" />
        </div>
        <div>
          <label className="mb-1 block text-sm font-medium text-[var(--text-secondary)]">{t.format}</label>
          <div className="flex gap-2">
            <button onClick={() => setFormat('svg')} className={`rounded-lg px-3 py-2 text-sm ${format === 'svg' ? 'bg-[var(--accent-blue)] text-white' : 'border border-[var(--border-primary)] text-[var(--text-secondary)]'}`}>SVG</button>
            <button onClick={() => setFormat('dataurl')} className={`rounded-lg px-3 py-2 text-sm ${format === 'dataurl' ? 'bg-[var(--accent-blue)] text-white' : 'border border-[var(--border-primary)] text-[var(--text-secondary)]'}`}>{t.dataUrlOutput}</button>
          </div>
        </div>
      </div>

      <div className="flex gap-2">
        <button onClick={handleGenerate} className="rounded-lg bg-[var(--accent-blue)] px-6 py-2 text-sm font-medium text-white hover:opacity-90">{t.generate}</button>
        <button onClick={() => { setText(''); setResult(''); setError(''); }}
          className="rounded-lg border border-[var(--border-primary)] px-4 py-2 text-sm text-[var(--text-secondary)] hover:bg-[var(--bg-tertiary)]">{t.clear}</button>
      </div>

      {error && <div className="rounded-lg border border-[var(--accent-red)]/30 bg-[var(--accent-red)]/10 px-4 py-3 text-sm text-[var(--accent-red)]">{error}</div>}

      {result && (
        <div className="rounded-lg border border-[var(--border-primary)] bg-[var(--bg-secondary)] p-4">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-sm font-medium text-[var(--text-secondary)]">{t.output}</h3>
            <CopyButton text={result} lang={lang} />
          </div>
          <textarea readOnly value={result} className="w-full h-32 rounded border border-[var(--border-primary)] bg-[var(--bg-tertiary)] p-2 font-mono text-xs text-[var(--text-secondary)]" />
        </div>
      )}
    </div>
  );
}
